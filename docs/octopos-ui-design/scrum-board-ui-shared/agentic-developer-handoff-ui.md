---
doc_type: developer-handoff
audience: agentic-developers
product: OctoPos UI & Shared API
last_updated: 2026-06-26
wireframe_version: v17 (artifact 300, md5 0f937afe1d9052ebe8dff7096008befe)
wireframe_path: ui-002-nansen-style-wireframe.html
scrum_board: ../scrum-board-ui-shared.md
status: ready-for-implementation
---

# OctoPos UI & Shared API — Agentic Developer Handoff

A single, self-contained brief for any agentic developer (or human) picking up work on the OctoPos multi-wallet portfolio UI. Combines the visual spec (v17 wireframe), component reference, state contract, privacy invariant, API surface, full scrum board tickets (UI-001 → UI-012), and the decisions log.

---

## 1. What this product is

**OctoPos** is a multi-chain DeFi position snapshot service that aggregates a user's wallet positions across Stellar Soroban and 17 EVM chains into one portfolio view. The UI is a Cloudflare Workers Static Assets SPA (TanStack Router + React + TypeScript) deployed at `octopos.untangled.finance` (also `octopos.crediolabs.ai`). Data comes from two parallel API workers (`apps/api` Stellar, `apps/evm-api` EVM) fronted by a portfolio fan-out (`apps/portfolio-api`).

**Target user:** a DeFi power user with 2–5 wallets across chains who wants a single aggregated snapshot, not per-chain hunting.

**Visual reference:** Nansen portfolio UX (`https://app.nansen.ai/portfolio`) — the wireframe in this folder mirrors Nansen's navy sidebar, 5-tile KPI strip, allocation switcher (Address / Protocol / Chain / Token), Gainers & Losers list, Overview/Holdings/Transactions sub-tabs, and per-row selection.

**Read first:** open `ui-002-nansen-style-wireframe.html` in a browser. It is fully interactive — all 6 pages, all sub-tabs, all forms work. No build step, no external assets, no network calls.

---

## 2. Tech stack (don't deviate)

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | React + TypeScript + TanStack Router | already in `apps/web` + `apps/evm-web`; do not introduce Next.js / Remix / Vue |
| Styling | `ui-kit` package tokens (Nansen-derived palette) | see §3 |
| State (client) | TanStack Query for server state; `localStorage` for persistence; React state for ephemeral UI | do not introduce Redux / Zustand |
| Charts | Recharts or Chart.js (whichever is in `ui-kit` already — check before adding) | tickets UI-004, UI-006, UI-007 |
| Table | TanStack Table headless (UI-005) | don't pull in MUI DataGrid or AG Grid |
| Build | Bun + Vite + Wrangler | already wired in `apps/web` |
| Deployment | Cloudflare Workers Static Assets | deploy via `bun run deploy:mainnet` (NOT `bunx wrangler deploy` directly — see CLAUDE.md) |
| API workers | Hono on Cloudflare Workers | `apps/api` + `apps/evm-api` + `apps/portfolio-api` |
| Cache | KV (per-chain protocol metadata) + 30s in-memory API cache | price cache per DefiLlama response |

**Forbidden:** Next.js, MUI DataGrid, AG Grid, Redux, Zustand, axios (use `fetch`), any charting library other than Recharts/Chart.js, any UI kit other than `ui-kit`.

---

## 3. Visual design tokens (Nansen-derived palette)

These are the exact tokens used in the wireframe. The `ui-kit` package must export these (or be extended to do so). Do not invent new colors.

```css
:root {
  --bg:           #020713;   /* page background */
  --bg-2:         #06101A;   /* sidebar + secondary surface */
  --surface:      #0a1623;   /* cards / panels */
  --surface-2:    #0f1c2c;   /* nested rows */
  --surface-hi:   #142536;   /* hover/active */
  --border:       rgba(255, 255, 255, 0.06);
  --border-hi:    rgba(255, 255, 255, 0.12);
  --text:         #e4ecf5;   /* primary */
  --text-dim:     #8b97a8;   /* secondary */
  --text-mute:    #5a6675;   /* tertiary / captions */
  --accent:       #4ec5ff;   /* Nansen cyan — interactive */
  --accent-2:     #8b5cf6;   /* Nansen purple — secondary */
  --positive:     #34d399;
  --negative:     #f87171;
  --warn:         #fbbf24;
  --gold:         #f5b942;   /* PRO badge */
  --pink:         #ec4899;
  --mono: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace;
  --sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}
```

Chain colors (used in protocol chips, donut slices, badges):

| Chain | Hex | Notes |
|---|---|---|
| Ethereum | `#627eea` | per-project convention |
| Base | `#0052ff` | |
| Arbitrum | `#28a0f0` | |
| Polygon | `#8247e5` | |
| BNB Chain | `#f0b90b` | |
| Gnosis | `#04795b` | |
| Avalanche | `#e84142` | |
| Optimism | `#ff0420` | |
| Scroll | `#ffeeda` | dark text on light background |
| Mantle | `#000000` | |
| HyperEVM | `#50e3c2` | |
| Solana | `#14f195` | |
| Stellar · Soroban | `#8b5cf6` | matches `--accent-2` |
| Stellar · Classic | `#a78bfa` | |

---

## 4. Information architecture

```
┌─ Sidebar (220px, collapsible to 64px via ⌘B / Ctrl+B) ─┐
│  Brand: OctoPos                                          │
│                                                          │
│  PORTFOLIO                                               │
│    ▣ Portfolio (default)                                 │
│    ⚠ Risk Alerts                                         │
│    ◈ Agents                                              │
│                                                          │
│  DEVELOPER                                               │
│    { } OctoPos API                                       │
│                                                          │
│  ─────────────── footer ──────────────                  │
│    ⌃ Docs                                                │
│    ✎ Feedback                                            │
│    ⚙ Settings                                            │
│                                                          │
│  [‹ Collapse menu]  ⌘B                                   │
└──────────────────────────────────────────────────────────┘

Main column:
  Topbar: crumbs left · 24h change pill + PRO badge right

  Pages (sibling <section>, only one visible at a time):
    page-portfolio   (default)
    page-risk-alerts
    page-agents
    page-settings
    page-feedback
    page-docs
```

### Portfolio page sub-tabs (v17)

| Position | Label | Content |
|---|---|---|
| 1 (default) | **Protocols Tracked** | Nansen "Supported Protocols" pattern — 4-KPI summary + chain-grouped protocol chips. Shows every adapter OctoPos currently supports. |
| 2 | **My Portfolio** | The actual user dashboard: view-tabs (Overview/Holdings/Transactions) + KPI strip + My Addresses panel + Allocation + Gainers & Losers |

The Configure sub-tab (v16) was removed in v17.

---

## 5. Component reference

Each component below is a separate React component or hook in `apps/web` / `apps/evm-web`. Names in `snake-case` are CSS class names; `PascalCase` are React components.

### 5.1 Sidebar (`<Sidebar>`)

- **Files:** `apps/web/src/components/sidebar.tsx`, `apps/evm-web/src/components/sidebar.tsx`
- **Sections:** Portfolio / Developer / Footer
- **Items:** 6 nav items, each with `data-page` attribute for routing
- **Collapsible:** ⌘B / Ctrl+B / footer button; state persists to `localStorage['octopos_sidebar_collapsed']`
- **Icons:** Unicode glyphs (▣ ⚠ ◈ { } ⌃ ✎ ⚙ ‹) — NOT an icon font

### 5.2 My Addresses panel (`<MyAddresses>`)

- **Files:** `apps/web/src/components/my-addresses-panel.tsx` (UI-002 production port target)
- **Storage key:** `localStorage['octopos_wallets']` (do NOT rename — existing users' data is keyed here)
- **Schema:** `Array<{ id: string, chain: 'stellar'|'evm', address: string, label?: string, selected: boolean }>`
- **MAX:** 5 (UI-002 AC #6)
- **Validation regex:**
  - EVM: `/^0x[0-9a-fA-F]{40}$/`
  - Stellar: `/^[GC][A-Z2-7]{55}$/`
- **UX bundle** (ship as one — they share state via the `wallets[]` array):
  - **Collapsible panel body:** chevron ▾/▸ rotates -90°, smooth 0.28s `max-height` transition
  - **Per-row selection checkbox:** unchecking fades row to 45% opacity, removes its contribution from rollup KPIs / donut / breakdown table
  - **MAX=5 hides the add form** and shows amber notice "Maximum of 5 addresses reached. Remove one above to add a different address."

### 5.3 KPI strip (`<KpiStrip>`)

- **5 tiles:** Net Worth · Claimable · Total Assets · Total Liabilities · Addresses tracked
- **Data:** derived from `selectedWallets()` (only ticked addresses count)
- **Staleness:** 30s cache per API response; show "— (24H)" if historical data unavailable

### 5.4 Allocation view (`<AllocationView>`)

- **Tabs:** Address / Protocol / Chain / Token (Risk moved to dedicated Risk Alerts page in v11)
- **Donut:** 200px SVG, center shows total, legend shows top 8 + "Other"
- **Right panel:** context-sensitive table (4 tables, only one visible at a time, swapped via `hidden` attribute)
- **Colors:** chain colors from §3; protocol colors hashed deterministically from name

### 5.5 Gainers & Losers (`<GainersLosers>`)

- **List view only** (no treemap/heatmap — user removed that in v4)
- 10 rows max, color-coded pos/neg

### 5.6 View-tabs (Overview / Holdings / Transactions)

- **Overview:** KPI + allocation + gainers (above)
- **Holdings:** 3 wallet breakdown cards + master tokens table + 4 right-rail cards
- **Transactions:** filter bar + 13-row history table (no heatmap)

### 5.7 Risk Alerts page (`<RiskAlerts>`)

- 7 signal cards from `blend-risk-monitor` skill taxonomy (§3.1–§3.7): Health Factor, Oracle Staleness, Backstop, Interest Rate Model, Liquidity Stress, Governance, Cross-protocol Contagion
- Each with severity badge (critical / warning / info / silent) + util bars
- Filter row: protocol selector (Blend · Stellar), pool, watched, cycle, add pool

### 5.8 Agents page (`<Agents>`)

- Currently shows the Blend Risk Monitor agent card; future agents appended below

### 5.9 Settings page (`<Settings>`) — v17 minimal

- **Settings is intentionally minimal** — only the Connected wallets section remains
- Notification card at top: "Settings is intentionally minimal for now. Advanced configuration (subscription, security, account linking) lands in a follow-up release."
- Connected wallets: shows address count + wipe button
- Do NOT rebuild the 6-card version (v16); user explicitly rejected it

### 5.10 Feedback page (`<Feedback>`) — v17 simplified

- Single "Sign in or create an account" CTA card (NO Gmail wording; NO Agent-20 mention)
- Locked Advanced features list below (sign-in required to unlock)
- No full form, no screenshot upload — that lands when sign-in is wired up

### 5.11 Docs page (`<Docs>`) — v17 simplified

- Single "Open Docs site →" button linking to `https://docs.octopos.crediolabs.ai`
- All reference content lives on the docs site, not in-app

### 5.12 Protocols Tracked page (`<ProtocolsTracked>`) — NEW in v17

- **Default sub-tab of Portfolio** — replaces the v16 Configure sub-tab
- **Top:** 4-KPI summary (Protocols total / EVM chains / Stellar protocols / Last deploy)
- **Below:** chain-grouped protocol chips — 14 chains, 43 protocol entries
- **Data source:** live `/v1/protocols` (UI-011)
- **Update cadence:** on every portfolio refresh (30s) — chains/protocols ship via deploys, no app update needed

Chain groupings (the canonical list — extend by adding to `/v1/protocols`):

| Chain | Protocol count | Notable protocols |
|---|---|---|
| Ethereum | 11 | Aave V3, Lido, Uniswap V3, Maker, Sky, EigenLayer, Morpho, Pendle, Rocket Pool, Ethena, Curve |
| Base | 3 | Aerodrome, Morpho, Moonwell |
| Arbitrum | 3 | GMX V2, Uniswap V3, Pendle |
| Polygon | 2 | Aave V3, Uniswap V3 |
| BNB Chain | 3 | Venus, PancakeSwap, Lista DAO |
| Gnosis | 2 | Spark Lend, Maker |
| Avalanche | 1 | Aave V3 |
| Optimism | 2 | Velodrome, Aave V3 |
| Scroll | 1 | Aave V3 |
| Mantle | 1 | Mantle Lend |
| HyperEVM | 2 | Hyperliquid, Hyperswap |
| Solana | 4 | Kamino, Jupiter, Drift, Marinade |
| Stellar · Soroban | 9 | Blend, Soroswap, Phoenix, Aquarius, FXDAO, Untangled Vault, Stellar Wallet, Upshift, Sushi Stellar |
| Stellar · Classic | 3 | USDY (Ondo), USTBL, EUTBL |

---

## 6. State, storage, privacy

### 6.1 localStorage keys

| Key | Owner | Schema |
|---|---|---|
| `octopos_wallets` | My Addresses panel | `Array<{id, chain, address, label?, selected}>` |
| `octopos_sidebar_collapsed` | Sidebar | `'0'` or `'1'` |

**Do not add new keys without explicit user direction.** Every new key needs a privacy review.

### 6.2 Privacy invariant (NEVER regress)

The `/v1/positions/:address` GET handler **MUST NOT** call the OPPORTUNISTIC_WORK queue under any code path. Non-subscribers hit zero server-side storage paths. The test `apps/api/tests/positions-route.test.ts` enforces this (queue stub throws if `send()` is ever invoked on a passive GET). **Do not weaken or remove that test.**

Subscribers opt into tracking via the subscription flow (separate path). Pool-metadata warmers cache public protocol state (reserves, factory pool lists), not user data — those server writes are intentional.

### 6.3 Cache TTLs

| Layer | TTL | Why |
|---|---|---|
| EVM `/v1/positions/...` | 30s | price cache via DefiLlama |
| Stellar `/v1/positions/...` | 30s | mirror EVM |
| `/v1/protocols` | 24h | protocol list changes infrequently |
| `/v1/x402/status` | 60s | user-visible subscription status |
| KV (collector) | per-pool, varies by protocol | populated by cron warmers |

### 6.4 Validation contract

| Field | Validator | Error message |
|---|---|---|
| EVM address | `/^0x[0-9a-fA-F]{40}$/` | "EVM address must start with 0x followed by 40 hex characters" |
| Stellar address | `/^[GC][A-Z2-7]{55}$/` | "Stellar address must start with G or C and be 56 base32 characters" |
| Label | optional, max 48 chars | n/a (truncate on overflow) |
| Wallet count | ≤ 5 | "Maximum of 5 addresses reached. Remove one above to add a different address." |

### 6.5 Error handling

- Network failure: toast "Couldn't fetch positions — retrying" + auto-retry 3x with exponential backoff
- Validation error: inline amber message under the form field, never a modal
- 429 from API: toast "Rate limited — try again in N seconds" with countdown from `Retry-After` header
- Empty state (no wallets): "Add your first address to get started" (UI-002 AC #8)

---

## 7. API contract (what the UI calls)

### 7.1 Endpoints

| Endpoint | Method | Purpose | Cache |
|---|---|---|---|
| `/v1/portfolio` | POST | Aggregated portfolio (1–5 wallets, mixed Stellar+EVM) | 30s |
| `/v1/positions/:chain/:address` | GET | Single-wallet positions (legacy; `/v1/portfolio` is preferred) | 30s |
| `/v1/protocols` | GET | Unified Stellar + EVM protocol list (UI-011) | 24h |
| `/v1/x402/status` | GET | x402 subscription status (wallet, plan, renewal) | 60s |
| `/v1/health` | GET | Adapter health for all 23 EVM adapters + Stellar slices | no cache |

### 7.2 Headers (every response)

```
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
```

### 7.3 Error schema (UI-012)

```json
{ "error": { "code": "RATE_LIMITED", "message": "...", "retryAfter": 30 } }
```

`429` includes `Retry-After`. `400` includes specific field validation error.

### 7.4 Rate limiting (UI-001)

`/v1/portfolio` counts as 1 request unit per wallet included (5 wallets = 5 units). Documented in API reference.

---

## 8. Scrum board tickets — full ACs

Tickets below are in dependency order for Sprint 1+2. For point estimates and priority see `scrum-board-ui-shared.md`. **All ACs must pass before a ticket is closed.**

### UI-001 — Multi-Wallet Aggregation API Endpoint (Backend, 8 pts, P0)

**User story:** As a developer or user, I want a single API call `POST /v1/portfolio` with up to 5 wallet addresses (Stellar or EVM) to return an aggregated portfolio response — total value, per-wallet breakdown, per-chain breakdown, per-protocol breakdown.

**Request:**
```
POST /v1/portfolio
Content-Type: application/json
{
  "wallets": [
    { "address": "GABC...", "chain": "stellar" },
    { "address": "0x1234...", "chain": "evm", "chain_ids": [1, 42161] },
    { "address": "0x5678...", "chain": "evm" }
  ]
}
```

**Response shape:**
```json
{
  "total_usd": 125430.50,
  "wallets": [{ "address": "...", "chain": "stellar", "total_usd": 45200.00, "positions": [...] }],
  "by_chain":   { "stellar": 45200.00, "ethereum": 60000.00, "arbitrum": 20230.50 },
  "by_protocol":{ "aave-v3": 30000.00, "blend": 15000.00, "uniswap-v3": 10000.00 },
  "fetched_at": "2026-06-23T12:00:00.000Z"
}
```

**Acceptance criteria:**
- [ ] Accepts 1 to 5 wallet entries; returns `400` if more than 5
- [ ] `chain` is `"stellar"` or `"evm"`; `chain_ids` optional for EVM (defaults to 13-chain set)
- [ ] Mixed Stellar + EVM wallets in the same request are supported
- [ ] `total_usd` is sum across all wallets and chains
- [ ] `by_chain` aggregates per chain
- [ ] `by_protocol` aggregates per protocol
- [ ] `positions` arrays follow existing position schema (no new fields)
- [ ] Wallet sub-requests fetched in parallel, not serial; P99 < 5s for 5 wallets × 3 chains
- [ ] If one wallet fails, others return; failed entry has `"error": "fetch_failed"`, `"total_usd": null`
- [ ] Response cached 30s; `Cache-Control: max-age=30` header set
- [ ] Counts as 1 rate-limit unit per wallet included

**Implementation:** Recommend `apps/portfolio-api` worker that fans out to EVM and Stellar workers via `fetch()`.

**DoD:** Live at `https://api-octopos-mainnet.crediolabs.ai/v1/portfolio`. Unit tests cover 5-wallet request, mixed Stellar+EVM, one-wallet failure, >5 rejection. API reference updated.

---

### UI-002 — Multi-Wallet Save & Manage (UI) (Frontend, 5 pts, P0) ✅ WIREFRAME COMPLETE

**User story:** As an OctoPos web user, I want to add up to 5 wallet addresses in the UI and have the app remember them across sessions via localStorage so I can view my multi-wallet portfolio without re-entering addresses every time.

**9 acceptance criteria (locked from UI-002 implementation):**
1. [ ] Panel renders inside Portfolio (top of page, above KPI strip)
2. [ ] Live format validation on entry — EVM `/^0x[0-9a-fA-F]{40}$/`, Stellar `/^[GC][A-Z2-7]{55}$/`
3. [ ] Optional label as primary text (truncated address below)
4. [ ] Persists to `localStorage['octopos_wallets']`
5. [ ] X button removes + updates storage immediately
6. [ ] Add button disabled with "Maximum 5 wallets" tooltip at cap (also: hides form + shows amber notice)
7. [ ] View portfolio → fills Address Allocation + Breakdown table
8. [ ] Empty state: "Add your first address to get started"
9. [ ] Truncated address (first 6 + last 4) + copy-to-clipboard icon

**v14 UX bundle additions** (must ship together):
- [ ] Collapsible panel body (chevron ▾/▸, 0.28s transition)
- [ ] Per-row selection checkbox — only ticked addresses drive portfolio rollup; deselected rows fade to 45% opacity
- [ ] At MAX=5, the entire `#add-form-wrap` is hidden and `#max-notice` shown

**Wireframe:** `ui-002-nansen-style-wireframe.html` — full interactive implementation reference. **Port target:** `apps/web/src/components/my-addresses-panel.tsx` (the current 343-line implementation needs the v14 multi-select UX + v16 collapse wired in).

**DoD:** Wireframe AC parity verified via the 12-marker walk; JS parses clean; mock data populated.

---

### UI-003 — Portfolio Overview KPI Bar (Multi-Wallet) (Frontend, 3 pts, P0)

**User story:** As a multi-wallet user, I want a top-level summary bar showing Total Value, 24h Change, Active Positions, Top Protocol — so I get an instant portfolio snapshot.

**Acceptance criteria:**
- [ ] KPI bar: Total Value ($), 24h Change ($, %), Active Positions (count), Top Protocol (name + value)
- [ ] 24h change from `history` endpoint (current vs 24h ago); show `N/A` if no history
- [ ] Updates on every portfolio refresh (30s)
- [ ] Responsive — stacks vertically on mobile (2x2 on ≤768px)
- [ ] Loading skeleton (no empty/zero flash)

---

### UI-004 — Chain & Protocol Breakdown Charts (Frontend, 5 pts, P0)

**User story:** As a user, I want a visual breakdown of my portfolio by chain and by protocol (donut + bar) — so I understand my allocation at a glance.

**Acceptance criteria:**
- [ ] "By Chain" donut: slices proportional to USD; legend shows chain name + %
- [ ] "By Protocol" horizontal bar: top 8 protocols; bar shows name, value, %
- [ ] Click chain slice → filter position table to that chain
- [ ] Click protocol bar → filter position table to that protocol
- [ ] Both update on portfolio refresh (30s)
- [ ] Charts use Recharts or Chart.js (whichever is in `ui-kit` — check first; do NOT add new chart deps)
- [ ] Empty state: if <2 chains or <2 protocols, show simple list instead of chart

---

### UI-005 — Sortable & Filterable Position Table (Frontend, 8 pts, P0)

**User story:** As a user, I want a sortable, filterable, searchable position table — matching Nansen's portfolio table UX.

**Columns:** Asset (icon + name + type badge) · Protocol · Chain · Balance · Price · Value · 24h Change · APY/Yield

**Sorting:**
- [ ] Click header to sort asc; click again desc; third click resets
- [ ] Default sort: Value desc
- [ ] Sort persists within session, not across reload

**Filtering:**
- [ ] Pill row: chain multi-select + protocol multi-select + type (All / DeFi / Wallet / RWA)
- [ ] Multi-select chains combine with OR
- [ ] Active filters shown as removable chips; "Clear all" resets

**Search:**
- [ ] Filters by token name or protocol name (case-insensitive, partial)
- [ ] Search + filter combine with AND

**Performance:**
- [ ] >50 positions → virtual scrolling (react-virtual); no pagination
- [ ] Row count: "Showing 47 of 47 positions"

**Export:**
- [ ] "Export CSV" downloads current filtered table with columns: Date, Wallet, Chain, Protocol, Asset, Type, Balance, Price USD, Value USD

**Tech note:** TanStack Table headless; icons via DeFiLlama `https://icons.llama.fi/protocols/<name>.png`.

---

### UI-006 — Portfolio History Chart (P&L Timeline) (Frontend, 8 pts, P1)

**User story:** As a user, I want an interactive line chart of total portfolio value over 1D/7D/30D/90D — to track P&L.

**Acceptance criteria:**
- [ ] Line chart, X = time, Y = USD value
- [ ] Time range tabs: 1D / 7D / 30D / 90D; default 7D
- [ ] Data: `GET /history` (Stellar) + EVM equivalent; multi-wallet sum per timestamp
- [ ] Tooltip: date/time, total value, change from previous
- [ ] P&L annotation: starting + ending value, color-coded net change
- [ ] Empty state: "Not enough history for this period" if <2 points
- [ ] Responds to chain/protocol filters (UI-005)
- [ ] Touch-friendly on mobile

**Tech note:** If multi-wallet history not yet supported, fall back to primary wallet only + tooltip explaining limitation. Same chart library as UI-004.

---

### UI-007 — DeFi Position Cards (Lending, LP, Staking, RWA) (Frontend, 5 pts, P1)

**User story:** As a user with DeFi positions, I want each position as a rich card with key metrics (health factor, pool composition, rewards) — without opening detail view.

**Lending card:** protocol icon + name + "Lending" badge · supplied assets list · borrowed assets list · health factor bar (green ≥1.5 / yellow 1.1–1.5 / red <1.1) · net supply APY + borrow APR

**LP card:** protocol icon + pool name + "Liquidity Pool" badge · token pair breakdown · pool share % · pending rewards · fee APY

**Staking card:** protocol icon + "Staking" badge · staked amount + value · staking APY · rewards accrued · unlock date if applicable

**RWA card:** issuer logo + "RWA" badge · token amount + NAV + total value · asset type · last NAV update

**Shared:** "View on [Protocol]" deeplink · collapsible if >3 positions in same protocol · uses `ui-kit` card component (extend, don't replace)

**Tech note:** Protocol deeplinks via `config/protocol-app-urls.ts` map. Health factor bar reuses existing RMS component if present.

---

### UI-008 — Chain & Protocol Filter Pill Row (Frontend, 3 pts, P0)

**User story:** As a user, I want a sticky filter pill row with chain/protocol icons as selectable pills — to scope my view instantly without dropdowns.

**Acceptance criteria:**
- [ ] Pills: all chains in current portfolio + top 8 protocols by value
- [ ] Inactive: light bg + dark text; active: filled brand color
- [ ] "All" pill resets filters
- [ ] Horizontally scrollable on mobile (no wrap)
- [ ] Chain pill count badge: "Ethereum (12)"
- [ ] Sticky — stays at top during table scroll

---

### UI-009 — Wallet Switcher and Per-Wallet View (Frontend, 3 pts, P1)

**User story:** As a multi-wallet user, I want to switch between "All Wallets" aggregated view and per-wallet detail view.

**Acceptance criteria:**
- [ ] Wallet selector in header: "All Wallets (3)" default
- [ ] Dropdown: each wallet with label/truncated address + individual total USD
- [ ] Selecting a wallet switches entire view (charts, table, cards) to that wallet
- [ ] "← All Wallets" back link visible when on single wallet
- [ ] Currently selected wallet highlighted in dropdown
- [ ] URL reflects selection: `/portfolio` (all) vs `/portfolio?wallet=0x1234...` (single) — shareable

---

### UI-010 — Mobile-Responsive Layout Overhaul (Frontend, 5 pts, P2)

**User story:** As a mobile user, I want the portfolio view usable on a phone — readable, touch-friendly, no horizontal scroll.

**Acceptance criteria:**
- [ ] KPI bar (UI-003): stacks 2x2 on ≤768px
- [ ] Charts (UI-004): donut full width; protocol bar scrolls vertically
- [ ] Position table (UI-005): mobile shows Asset / Protocol / Value only; rest in "Details" expand
- [ ] Filter pills (UI-008): horizontal scroll, no wrap
- [ ] DeFi cards (UI-007): full width, stacked
- [ ] History chart (UI-006): full width, time range tabs above
- [ ] All touch targets ≥44px (WCAG AA)
- [ ] Tested: iPhone 14 (390px), Galaxy S22 (360px), iPad (768px)

---

### UI-011 — `GET /v1/protocols` Unified Endpoint (Backend, 3 pts, P1)

**User story:** As a developer, I want `GET /v1/protocols` returning all supported protocols across Stellar + EVM with consistent metadata — so the UI populates filter pills and protocol cards from one source of truth.

**Acceptance criteria:**
- [ ] Returns array of `{ id, name, type (lending|lp|staking|vault|cdp|rwa|derivatives), chains (array), logoUrl, appUrl }`
- [ ] Both Stellar (Blend, Aquarius, ...) and EVM (Aave, Uniswap, ...) protocols included
- [ ] Cached 24h
- [ ] Documented in API reference

**This endpoint powers the Protocols Tracked page (§5.12).** The v17 wireframe ships with 14 chains / 43 protocol entries matching the live `/v1/protocols` shape.

---

### UI-012 — Rate Limit Headers and Error Response Standardisation (Backend, 3 pts, P2)

**User story:** As an API consumer, I want consistent rate limit headers and structured error responses — to handle limits and errors programmatically.

**Acceptance criteria:**
- [ ] All responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- [ ] All errors use: `{ "error": { "code": "RATE_LIMITED", "message": "...", "retryAfter": 30 } }`
- [ ] `429` includes `Retry-After` header
- [ ] `400` includes specific field validation error
- [ ] Applied to both Stellar + EVM workers
- [ ] Documented in API reference

---

## 9. Acceptance Testing Checklist (cross-cutting)

Before ANY UI ticket closes, these must pass:

- [ ] **Cross-browser:** Chrome 120+, Firefox 120+, Safari 17+
- [ ] **Accessibility:** No critical axe-core violations; all interactive elements keyboard-navigable
- [ ] **Error states:** Network failure → user-friendly toast (not blank screen / console error)
- [ ] **Loading states:** Skeleton or spinner; no layout shift on data arrival
- [ ] **Empty states:** Graceful when wallet has no positions, no history, etc.
- [ ] **Price staleness:** If position data >90s old, show "Prices may be stale" warning
- [ ] **Unit tests:** All new components have happy-path unit tests
- [ ] **Design review:** Screenshots shared in ticket before merge for sign-off
- [ ] **Privacy invariant:** Test confirms `/v1/positions/:address` does NOT touch OPPORTUNISTIC_WORK queue (re-run `apps/api/tests/positions-route.test.ts`)

---

## 10. Suggested sprint plan

### Sprint 1 (2 weeks) — 42 pts

| Ticket | Team | Points | Dependency |
|---|---|---|---|
| STL-007 | Stellar BE | 2 | — |
| STL-001 | Stellar BE | 8 | STL-007 |
| STL-004 | Stellar BE | 5 | STL-007 |
| EVM-001 | EVM BE | 8 | — |
| EVM-015 | EVM BE | 3 | — |
| UI-001 | Shared BE | 8 | — |
| UI-002 | Frontend | 5 | UI-001 |
| UI-008 | Frontend | 3 | — |

### Sprint 2 (2 weeks) — 52 pts

| Ticket | Team | Points | Dependency |
|---|---|---|---|
| STL-002 | Stellar BE | 8 | — |
| STL-003-SPIKE | Stellar BE | 2 | — |
| STL-005 | Stellar BE | 5 | STL-007 |
| STL-006 | Stellar BE | 5 | STL-007 |
| EVM-003 | EVM BE | 8 | EVM-001 |
| EVM-004 | EVM BE | 8 | EVM-001 |
| UI-003 | Frontend | 3 | UI-001, UI-002 |
| UI-004 | Frontend | 5 | UI-001 |
| UI-005 | Frontend | 8 | UI-001 |

---

## 11. Mock data spec (for review)

Use these exact mock values when seeding wireframes / storybook / QA environments. Coherence: headline total = sum of component values; Price × Amount = Value per row; percentages sum to 100% within rounding.

### Holdings view — wallet `0xe2c…b0266`, total **$25,003.55**

| Token | Amount | Price | Value | Portfolio % | 24h |
|---|---|---|---|---|---|
| USDC | 14,143.21 | $1.00 | $14,143.21 | 56.57% | 0.00% |
| WETH | 1.6502 | $2,921.45 | $4,820.18 | 19.28% | +2.45% |
| PENDLE | 192.50 | $9.56 | $1,840.30 | 7.36% | +8.12% |
| ARB | 1,450.32 | $0.855 | $1,239.91 | 4.96% | -1.34% |
| WSTETH | 0.3180 | $2,799.00 | $890.08 | 3.56% | +1.87% |
| PEPE | 45,200,000 | $0.0000115 | $519.80 | 2.08% | -5.62% |
| UNI | 41.85 | $7.41 | $310.11 | 1.24% | +0.78% |
| LINK | 16.92 | $14.18 | $239.96 | 0.96% | +3.21% |

**Wallet breakdown cards** (3 protocols):
- **Lido** · `WSTETH` 0.3180 @ $2,799.00 = $890.08
- **Aave V3** · `USDC (supply)` 1,243.85 @ 3.42% APY = $1,243.85
- **Uniswap V3** · `WETH · USDC 0.05%` range $2.4K–$3.0K = $621.32

### Transactions view — 13 rows, last 60 days

`Chain · Action · From · Amount · Token · Value · Time · Details`
Example row: `Ethereum · Exectransaction · From [0xf083bb] · -100.00 · USDC · -$99.98 · 13d ago · View`

Action types: `Exectransaction`, `Transfer`, `Aggregate3value`, `Sent`, `Transferfrom`, `Execute`, `Fillrelay`, `Bridge`
From tags: `From [0x…]`, `From Token Millionaire [0x…]`, `From High Activity [0x…]`

### Protocols Tracked page — 14 chains / 43 entries

See §5.12 for the canonical chain × protocol table. Use chain colors from §3.

---

## 12. Implementation guidance (production port)

### 12.1 Where to start

1. **Open the wireframe.** Run `open ui-002-nansen-style-wireframe.html` (or just double-click). Click every nav item, every sub-tab, every form button. The wireframe is the spec.
2. **Diff `apps/web/src/components/my-addresses-panel.tsx`** (343 lines) against the v17 wireframe's My Addresses panel. The wireframe has the v14 multi-select UX + v16 collapse; production doesn't. **This is the single biggest gap.** Porting closes UI-002.
3. **Diff `apps/evm-web`** against the same wireframe. EVM is generally closer to the wireframe but lacks the v17 Protocols Tracked sub-tab.

### 12.2 Production file targets

| Wireframe section | Production file |
|---|---|
| Sidebar | `apps/web/src/components/sidebar.tsx` + `apps/evm-web/src/components/sidebar.tsx` |
| My Addresses panel | `apps/web/src/components/my-addresses-panel.tsx` |
| KPI strip | `apps/web/src/components/kpi-strip.tsx` |
| Allocation view | `apps/web/src/components/allocation-view.tsx` |
| Gainers & Losers | `apps/web/src/components/gainers-losers.tsx` |
| Holdings | `apps/web/src/views/holdings.tsx` |
| Transactions | `apps/web/src/views/transactions.tsx` |
| Risk Alerts | `apps/web/src/views/risk-alerts.tsx` (Blend · Stellar only initially) |
| Agents | `apps/web/src/views/agents.tsx` |
| Settings | `apps/web/src/views/settings.tsx` (minimal v17 version) |
| Feedback | `apps/web/src/views/feedback.tsx` (sign-in CTA v17) |
| Docs | `apps/web/src/views/docs.tsx` (link-out v17) |
| Protocols Tracked | `apps/web/src/views/protocols-tracked.tsx` (NEW — port from wireframe) |

### 12.3 Deploy command (after each ship)

```bash
cd /home/ubuntu/git/github.com/untangledfinance/octopos
set -a && source .env && set +a
cd apps/web && bun run deploy:mainnet   # NOT bunx wrangler deploy directly
```

`deploy:mainnet` script inlines `VITE_API_BASE` + `VITE_SUPPORT_EMAIL` + `VITE_SUBSCRIPTION_URL` into the bundle. Skipping this script → API fetch returns `index.html` → "Unexpected token '<'" error in the browser console.

### 12.4 Verification after deploy

```bash
# Web reachable?
curl -sS -o /dev/null -w "HTTP=%{http_code}\n" https://octopos.crediolabs.ai/

# Bundle md5 should match expected (check via browser devtools Network tab or Cloudflare dashboard)
```

### 12.5 Common pitfalls

| Pitfall | Fix |
|---|---|
| `wrangler deploy` instead of `bun run deploy:mainnet` | Use the package script — it bakes `VITE_API_BASE` in |
| Renaming `localStorage['octopos_wallets']` | Don't — existing users' data is keyed there |
| Adding chart libraries other than Recharts/Chart.js | Check `ui-kit` first; do not introduce new deps |
| Adding MUI DataGrid / AG Grid | Forbidden; use TanStack Table headless |
| Calling OPPORTUNISTIC_WORK queue from passive GET | Privacy regression — see §6.2 |
| Shipping empty wireframes | Mock data is mandatory for stakeholder review |

---

## 13. Decisions log (why things are this way)

| Decision | Rationale | Date |
|---|---|---|
| Nansen-derived palette + navy sidebar | User chose Nansen visual reference over OctoPos brand for the wireframe series | 2026-06-25 |
| `localStorage['octopos_wallets']` over server-side persistence | Privacy invariant: non-subscribers hit zero server-side storage | 2026-06-23 |
| v14 collapsible + checkbox + max-notice as one bundle | Share state via `wallets[]` + `.wallets-body` container; splitting caused drift | 2026-06-26 |
| Remove Configure sub-tab in v17 | Sub-tab was non-functional and unused | 2026-06-26 |
| Add Protocols Tracked in v17 | User wanted a Nansen-style "what we track" page; Configure slot was the natural home | 2026-06-26 |
| Simplify Settings to 2 sections | User: "keep minimal for now" — deferred subscription/security/community to follow-up release | 2026-06-26 |
| Replace Gmail-required Feedback banner with sign-in CTA | User: "not gmail specifically" — sign-in is provider-agnostic | 2026-06-26 |
| Replace Docs 6-card grid with link-out | User: "just simplify and link to docs site" | 2026-06-26 |
| Remove HEAT MAP (treemap) | User explicitly removed in v4; not in scope to re-add | 2026-06-26 |
| Full sidebar collapse (⌘B) | User requested; `localStorage['octopos_sidebar_collapsed']` persists | 2026-06-26 |

---

## 14. Open questions (resolved by user, pending implementation)

1. **Sign-in provider for Feedback / Settings** — User removed Gmail-specific wording; the actual auth provider is TBD. When wiring up sign-in, pick one (Google / GitHub / wallet-based) and surface consistently across Feedback + Settings.
2. **Settings expansion order** — User said "minimal for now" — when expanding, the order is: Profile → Plan → x402 subscription → Connected wallets (already in) → Security → Community.
3. **Portfolio history multi-wallet** — UI-006 falls back to primary-wallet-only if multi-wallet history isn't supported yet. Confirm which wallet is "primary" (first added? highest value?).
4. **RWA on Protocols Tracked** — Currently lists USDY/USTBL/EUTBL on Stellar Classic only. Should RWA protocols on Ethereum (Maker, Ondo wrapper) move here too?

## 15. Unresolved / risk items

- **Risk:** The Nansen wireframe series is in `outputs/.../scrum-board-ui-shared/` — not in the production repo. Confirm the wireframe belongs in `apps/web/public/` or `apps/web/docs/` for the team to discover.
- **Risk:** `apps/portfolio-api` worker (UI-001 target) doesn't exist yet. Decide: extend `apps/api` + `apps/evm-api` directly, or spin up a third worker?
- **Risk:** UI-005 (sortable table) and UI-007 (position cards) are the two largest tickets (8 + 5 pts). If a single dev picks up Sprint 1, consider pairing or splitting into 2 sprints.

---

## 16. Related artifacts (in this vault)

| File | Purpose |
|---|---|
| `ui-002-nansen-style-wireframe.html` | v17 wireframe (interactive, single file) |
| `README.md` | v17 wireframe index + iteration history |
| `../scrum-board-ui-shared.md` | Original scrum board (ticket table + summaries) |
| `../../my-wiki/products/octopos` | Product wiki page (separate vault) |
| `../../plans/` | Repo-level plans (monorepo agent team uses) |

---

## 17. When you start a ticket

1. Read the AC list for that ticket in §8
2. Open the wireframe section that matches the AC (use the file structure in §12.2)
3. Check the corresponding production file in `apps/web/src/` or `apps/evm-web/src/`
4. Port one AC at a time; verify in browser after each
5. Mock data first (per §11), then wire to live API
6. Deploy via `bun run deploy:mainnet` (NOT `bunx wrangler deploy`)
7. Verify with curl + browser devtools

If blocked: check the privacy invariant first (§6.2 — most likely regression point), then the localStorage schema (§6.1), then the wireframe for visual parity.