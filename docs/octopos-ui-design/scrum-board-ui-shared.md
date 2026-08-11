---
board: OctoPos UI & Shared API
last_updated: 2026-06-23
status: active
owner: agent-team
---

# OctoPos UI & Shared API — Scrum Board

**Product:** OctoPos shared UI at octopos.untangled.finance (Stellar + EVM surfaces)
**Sprint cadence:** 2-week sprints
**Story point scale:** Fibonacci (1, 2, 3, 5, 8, 13)
**UI reference:** Nansen portfolio UX (https://app.nansen.ai/portfolio) + jam.dev recording https://jam.dev/c/e1c5dcd2-44f2-48a9-aa97-79f9c924242f

---

## Epic UI-E1: Multi-Wallet Portfolio Feature

**Goal:** Allow a user to add up to 5 wallets (any mix of Stellar G-addresses and EVM 0x-addresses), save them, and retrieve a unified aggregated portfolio in a single API call. Both the API and the UI must support this.

![[Pasted image 20260623222312.png]]

---

### UI-001 — Multi-Wallet Aggregation API Endpoint

**Type:** Feature (Backend)
**Priority:** P0
**Story Points:** 8
**Epic:** UI-E1
**Labels:** `api`, `portfolio`, `multi-wallet`, `backend`

#### User Story
As a developer or user, I want a single API call `POST /v1/portfolio` with up to 5 wallet addresses (Stellar or EVM) to return an aggregated portfolio response — total value, per-wallet breakdown, per-chain breakdown, and per-protocol breakdown — so that I do not need to make 5 separate calls and aggregate manually.

#### Acceptance Criteria

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
- [ ] Accepts 1 to 5 wallet entries; returns `400` with descriptive error if more than 5 are submitted
- [ ] `chain` field is `"stellar"` or `"evm"`; `chain_ids` is optional for EVM (defaults to 13-chain default set if omitted)
- [ ] Mixed Stellar + EVM wallets in the same request are supported

**Response:**
```json
{
  "total_usd": 125430.50,
  "wallets": [
    {
      "address": "GABC...",
      "chain": "stellar",
      "total_usd": 45200.00,
      "positions": [ ... ]
    }
  ],
  "by_chain": {
    "stellar": 45200.00,
    "ethereum": 60000.00,
    "arbitrum": 20230.50
  },
  "by_protocol": {
    "aave-v3": 30000.00,
    "blend": 15000.00,
    "uniswap-v3": 10000.00
  },
  "fetched_at": "2026-06-23T12:00:00.000Z"
}
```
- [ ] `total_usd` is the sum of all positions across all wallets and chains
- [ ] `by_chain` aggregates total USD value per chain across all wallets
- [ ] `by_protocol` aggregates total USD value per protocol across all wallets
- [ ] Individual wallet `positions` arrays follow the existing position schema (no new fields)
- [ ] Wallet sub-requests are fetched in parallel, not serially — P99 latency < 5s for 5 wallets on 3 chains each
- [ ] If one wallet's data fetch fails, the response still returns other wallets' data; the failed wallet entry includes `"error": "fetch_failed"` and `"total_usd": null`
- [ ] Response cached for 30 seconds (same TTL as single-wallet endpoints); `Cache-Control: max-age=30` header set

**Rate limiting:**
- [ ] Portfolio endpoint counts as 1 request unit per wallet address included (so 5 wallets = 5 rate limit units)
- [ ] Documented in API reference

#### Technical Notes
- Implement in both `apps/evm-api` (Hono) and `apps/stellar-api` workers; or introduce a new `apps/portfolio-api` Cloudflare Worker that calls both as sub-requests
- Recommended: single `apps/portfolio-api` worker that fans out to EVM and Stellar workers using `fetch()` — avoids coupling the two stacks
- Stellar sub-requests: call existing `/positions/:addr` endpoint
- EVM sub-requests: call existing `/v1/evm/defi/positions/:address?chain_ids=...`
- Wallet address type detection: Stellar addresses start with `G` (56 chars) or `C` (56 chars, Soroban); EVM addresses start with `0x` (42 chars) — auto-detect if `chain` field is omitted

#### Definition of Done
- Endpoint live at `https://api-octopos-mainnet.crediolabs.ai/v1/portfolio`
- Unit tests covering: 5-wallet request, mixed Stellar+EVM, one-wallet failure scenario, >5 wallet rejection
- API reference doc updated

---

### UI-002 — Multi-Wallet Save & Manage (UI)

**Type:** Feature (Frontend)
**Priority:** P0
**Story Points:** 5
**Epic:** UI-E1
**Labels:** `ui`, `multi-wallet`, `frontend`

#### User Story
As an OctoPos web user, I want to add up to 5 wallet addresses in the UI and have the app remember them across sessions (via localStorage) so that I can view my multi-wallet portfolio without re-entering addresses every time.

![[Pasted image 20260623222501.png]]

#### Acceptance Criteria
- [ ] A "My Wallets" panel in the sidebar or header lets the user add wallet addresses (up to 5)
- [ ] Address input field validates format on entry:
  - Stellar: starts with `G` or `C`, 56 characters
  - EVM: starts with `0x`, 42 hex characters
  - Invalid format shows inline error before adding
- [ ] Wallet can be given an optional label (e.g. "My Arbitrum hot wallet") displayed in the UI instead of the full address
- [ ] Wallets are persisted to `localStorage` under key `octopos_wallets` — they survive page refresh
- [ ] A wallet can be removed via an X button; removing updates localStorage immediately
- [ ] When 5 wallets are added, the "Add wallet" button is disabled with a tooltip "Maximum 5 wallets"
- [ ] Selecting "View Portfolio" calls `POST /v1/portfolio` with all saved wallets and renders the aggregated view
- [ ] An empty-state prompt guides first-time users: "Add your first wallet to get started"
- [ ] Addresses are truncated in the UI (first 6 + last 4 chars) with a copy-to-clipboard button for the full address

#### Technical Notes
- Use `ui-kit` package for consistent styling across Stellar and EVM surfaces
- `localStorage` key: `octopos_wallets` — array of `{ address, chain, label? }`
- Do not send wallet data to the server for persistence — client-side only (privacy-preserving)

---

### UI-003 — Portfolio Overview KPI Bar (Multi-Wallet)

**Type:** Feature (Frontend)
**Priority:** P0
**Story Points:** 3
**Epic:** UI-E1
**Labels:** `ui`, `portfolio`, `kpi`, `frontend`

#### User Story
As an OctoPos user viewing my multi-wallet portfolio, I want to see a top-level summary bar showing Total Portfolio Value, Total 24h Change, Number of Active Positions, and Top Protocol by value — so that I get an instant portfolio snapshot.

![[Pasted image 20260623223048.png]]
#### Acceptance Criteria
- [ ] KPI bar displays: `Total Value ($)`, `24h Change ($, %)`, `Active Positions (count)`, `Top Protocol (name + value)`
- [ ] 24h change calculated from `history` endpoint (current snapshot vs 24h ago snapshot); if no 24h historical data, display `N/A`
- [ ] All values update when the portfolio refresh cycle runs (every 30s, matching API cache)
- [ ] KPI bar is responsive — stacks vertically on mobile
- [ ] Loading skeleton shown while data is fetching (no empty/zero flash)

---

## Epic UI-E2: Nansen-Parity UI/UX Improvements

**Goal:** Bring OctoPos's web UI (octopos.untangled.finance) to feature and polish parity with Nansen's portfolio view as captured in the jam.dev recording. Core capabilities: clear chain/protocol breakdown, sortable position table, P&L chart, filter pills, and DeFi position cards.

---

### UI-004 — Chain & Protocol Breakdown Charts

**Type:** Feature (Frontend)
**Priority:** P0
**Story Points:** 5
**Epic:** UI-E2
**Labels:** `ui`, `charts`, `portfolio`, `frontend`

#### User Story
As an OctoPos user, I want to see a visual breakdown of my portfolio by chain and by protocol — similar to Nansen's donut chart and bar chart — so that I can understand my allocation at a glance.
![[Pasted image 20260623223149.png]]
#### Acceptance Criteria
- [ ] "By Chain" donut chart: each slice is a chain (Stellar, Ethereum, Arbitrum, etc.); slice size proportional to USD value; chain name + `%` shown in legend
- [ ] "By Protocol" bar chart (horizontal): top 8 protocols ranked by USD value; bars show protocol name, value, and percentage of portfolio
- [ ] Clicking a chain in the donut chart filters the position table to show only that chain's positions
- [ ] Clicking a protocol bar filters the position table to show only that protocol's positions
- [ ] Both charts update in real-time when the portfolio data refreshes (30s cycle)
- [ ] Charts are rendered using a lightweight library (Recharts or Chart.js — use whichever is already in the `ui-kit` bundle; do not add a new charting dependency)
- [ ] Chart empty state: if <2 chains or <2 protocols, show simple list instead of chart to avoid trivial visuals

#### Technical Notes
- Data source: `by_chain` and `by_protocol` from `POST /v1/portfolio` response
- Colors: use OctoPos brand palette from `ui-kit/tokens`; assign consistent chain colors (Ethereum = #627EEA, Arbitrum = #28A0F0, Stellar = #7B2D8B, etc.)

---

### UI-005 — Sortable & Filterable Position Table

**Type:** Feature (Frontend)
**Priority:** P0
**Story Points:** 8
**Epic:** UI-E2
**Labels:** `ui`, `table`, `positions`, `frontend`

#### User Story
As an OctoPos user, I want a position table that I can sort by value, filter by chain or protocol, and search by token name — matching Nansen's portfolio table UX — so that I can find and analyse specific positions quickly.
![[Pasted image 20260623223341.png]]

![[Pasted image 20260623223425.png]]
#### Acceptance Criteria

**Table columns:**
- [ ] Asset/Position (token icon + name + type badge e.g. `SUPPLY`, `LP`, `STAKE`)
- [ ] Protocol (protocol icon + name)
- [ ] Chain (chain icon + name)
- [ ] Balance (token amount, formatted with commas)
- [ ] Price (USD per token)
- [ ] Value (USD total)
- [ ] 24h Change (% and $, green/red colour coded)
- [ ] APY / Yield (if available from position data; `—` if not)

**Sorting:**
- [ ] Click any column header to sort ascending; click again to sort descending; third click resets
- [ ] Default sort: Value (descending) — highest value positions first
- [ ] Sort persists within the session (not across page reload)

**Filtering:**
- [ ] Filter pill row above the table: chain multi-select (All Chains, Stellar, Ethereum, Arbitrum, etc.) + protocol multi-select (All Protocols, Blend, Aave, Uniswap, etc.)
- [ ] Selecting a chain pill shows only positions on that chain; multi-select combines with OR
- [ ] Type filter: All / DeFi Positions / Wallet Balances / RWA
- [ ] Active filters shown as removable chips; "Clear all" resets to default

**Search:**
- [ ] Search box filters rows by token name or protocol name (case-insensitive, partial match)
- [ ] Search and filter work together (AND logic — search within filtered results)

**Pagination / virtualisation:**
- [ ] If >50 positions, use virtual scrolling (react-virtual or equivalent) — do not paginate; keep table responsive
- [ ] Row count shown: "Showing 47 of 47 positions" (updates with filters)

**Export:**
- [ ] "Export CSV" button downloads the current filtered table as a CSV file with columns: Date, Wallet, Chain, Protocol, Asset, Type, Balance, Price USD, Value USD

#### Technical Notes
- Build on top of TanStack Table (if already in `ui-kit`); if not, use a lightweight headless table — do not bring in MUI DataGrid or AG Grid
- Token/protocol icons: use existing icon assets or DeFiLlama's logo API (`https://icons.llama.fi/protocols/<protocol-name>.png`)
- Chain icons: same source as current chain selector component

---

### UI-006 — Portfolio History Chart (P&L Timeline)

**Type:** Feature (Frontend)
**Priority:** P1
**Story Points:** 8
**Epic:** UI-E2
**Labels:** `ui`, `chart`, `history`, `p&l`, `frontend`

#### User Story
As an OctoPos user, I want an interactive line chart showing my total portfolio value over time (1D, 7D, 30D, 90D) — similar to Nansen's portfolio history chart — so that I can track my P&L and understand trends.

![[Pasted image 20260623223707.png]]
![[Pasted image 20260623224324.png]]
#### Acceptance Criteria
- [ ] Line chart with time on X-axis, total USD value on Y-axis
- [ ] Time range selector: 1D / 7D / 30D / 90D tabs; default to 7D
- [ ] Data source: `GET /history` endpoint (Stellar) and equivalent EVM history endpoint; if multi-wallet, sum all wallets at each timestamp
- [ ] Tooltip on hover shows: date/time, total value, change from previous data point
- [ ] Chart shows a "P&L" annotation: starting value and ending value for the selected period, with colour-coded net change (green = gain, red = loss)
- [ ] If <2 data points exist for a time range, show empty state: "Not enough history for this period"
- [ ] Chart responds to the chain/protocol filters in UI-005 — filtered view shows value of only the filtered positions over time (approximation acceptable if exact per-position history is unavailable)
- [ ] Chart is touch-friendly on mobile

#### Technical Notes
- This feature requires the history endpoint to return multi-wallet aggregated snapshots. If the portfolio API (`UI-001`) does not support historical aggregation yet, the chart falls back to single-wallet history for the primary wallet only — document this limitation in the UI with a tooltip
- Use the same charting library as UI-004 (no new dependency)

---

### UI-007 — DeFi Position Cards (Lending, LP, Staking, RWA)

**Type:** Feature (Frontend)
**Priority:** P1
**Story Points:** 5
**Epic:** UI-E2
**Labels:** `ui`, `cards`, `defi-positions`, `frontend`

#### User Story
As an OctoPos user with DeFi positions, I want each position displayed as a rich card (similar to Nansen's protocol position cards) that shows key metrics at a glance — health factor for lending positions, pool composition for LP, rewards for staking — without having to open a detail view.
![[Pasted image 20260623223847.png]]
#### Acceptance Criteria

**Lending position card (Blend, Aave, Compound, Venus, etc.):**
- [ ] Header: protocol icon + name, "Lending" badge
- [ ] Supplied assets list: token icon, amount, value in USD
- [ ] Borrowed assets list: token icon, amount, value in USD
- [ ] Health factor bar: coloured progress bar (green ≥1.5, yellow 1.1–1.5, red <1.1); numeric value displayed
- [ ] Net supply APY and borrow APR displayed if available in position data

**LP position card (Uniswap, Curve, Aquarius, Balancer, etc.):**
- [ ] Header: protocol icon + pool name (token0/token1), "Liquidity Pool" badge
- [ ] Token pair breakdown: token icons, amounts, values in USD
- [ ] Pool share percentage (user's LP share of the total pool)
- [ ] Pending rewards (if any) with "Claim" deeplink to the protocol app
- [ ] Fee APY displayed if available

**Staking position card (Lido, Phoenix Staking, EigenLayer, etc.):**
- [ ] Header: protocol icon + "Staking" badge
- [ ] Staked amount + current value in USD
- [ ] Staking APY
- [ ] Rewards accrued (if readable from chain)
- [ ] Unlock date or lock period (if applicable)

**RWA position card (Ondo, Spiko, WisdomTree):**
- [ ] Header: issuer logo + "RWA" badge
- [ ] Token amount + current NAV per token + total value
- [ ] Asset type (money market / equity / commodity)
- [ ] Last NAV update timestamp

**Shared:**
- [ ] Each card has a "View on [Protocol]" link opening the protocol's app for the connected address
- [ ] Cards are collapsible if the user has >3 positions in the same protocol
- [ ] Card layout matches the existing `ui-kit` card component; extend, do not replace

#### Technical Notes
- Protocol deeplinks: maintain a `config/protocol-app-urls.ts` map (`aave-v3` → `https://app.aave.com/dashboard`, `blend` → `https://blend.on.fleek.co`, etc.)
- Health factor bar reuses the existing RMS health factor component if one exists

---

### UI-008 — Chain & Protocol Filter Pill Row

**Type:** Feature (Frontend)
**Priority:** P0
**Story Points:** 3
**Epic:** UI-E2
**Labels:** `ui`, `filters`, `navigation`, `frontend`

#### User Story
As an OctoPos user, I want a sticky filter pill row at the top of the portfolio view — with chain icons and protocol icons as selectable pills — so that I can instantly scope my view to a specific chain or protocol without using dropdowns.
![[Pasted image 20260623224039.png]]

#### Acceptance Criteria
- [ ] Pill row shows: chain pills (icon + name) for all chains in the current portfolio + protocol pills for top 8 protocols by value
- [ ] Inactive pill: light background, dark text; active pill: filled background with brand colour
- [ ] "All" pill resets filters; selected chain/protocol pills narrow the position table and charts
- [ ] Pills are horizontally scrollable on mobile without wrapping
- [ ] Chain pill count badge shows number of positions on that chain (e.g. "Ethereum (12)")
- [ ] Pill row is sticky — stays at top when scrolling through the position table

---

### UI-009 — Wallet Switcher and Per-Wallet View

**Type:** Feature (Frontend)
**Priority:** P1
**Story Points:** 3
**Epic:** UI-E2
**Labels:** `ui`, `multi-wallet`, `navigation`, `frontend`

#### User Story
As an OctoPos user with multiple wallets, I want to switch between an "All Wallets" aggregated view and a per-wallet detail view — so that I can drill into any individual wallet's positions without losing the multi-wallet context.
![[Pasted image 20260623224122.png]]

#### Acceptance Criteria
- [ ] Wallet selector in the header shows "All Wallets" by default with the count (e.g. "All Wallets (3)")
- [ ] Dropdown lists each saved wallet with its label (or truncated address) and individual total USD value
- [ ] Selecting a specific wallet switches the entire portfolio view (charts, table, cards) to show only that wallet's data
- [ ] A "← All Wallets" back link is visible when viewing a single wallet
- [ ] The currently selected wallet is highlighted in the dropdown
- [ ] URL reflects the selected wallet: `/portfolio` (all wallets), `/portfolio?wallet=0x1234...` (single wallet) — shareable links work

---

### UI-010 — Mobile-Responsive Layout Overhaul

**Type:** Enhancement (Frontend)
**Priority:** P2
**Story Points:** 5
**Epic:** UI-E2
**Labels:** `ui`, `mobile`, `responsive`, `frontend`

#### User Story
As an OctoPos user on mobile, I want the portfolio view to be usable on a phone screen — with readable values, touch-friendly controls, and no horizontal scroll — so that I can check my positions on the go.

#### Acceptance Criteria
- [ ] Portfolio KPI bar (UI-003): stacks 2x2 on mobile (≤768px screen width)
- [ ] Chain/protocol charts (UI-004): donut chart takes full width; protocol bar chart scrolls vertically
- [ ] Position table (UI-005): on mobile, shows only Asset, Protocol, and Value columns; remaining columns accessible via a "Details" expand row
- [ ] Filter pills (UI-008): horizontally scrollable, no wrapping
- [ ] DeFi position cards (UI-007): full width, stacked vertically
- [ ] Portfolio history chart (UI-006): full width, time range tabs above the chart
- [ ] All touch targets ≥44px height (WCAG AA)
- [ ] Tested on: iPhone 14 (390px), Samsung Galaxy S22 (360px), iPad (768px)

---

## Epic UI-E3: Shared API Improvements

---

### UI-011 — `GET /v1/protocols` Unified Endpoint (Stellar + EVM)

**Type:** Feature (Backend)
**Priority:** P1
**Story Points:** 3
**Epic:** UI-E3
**Labels:** `api`, `protocols`, `backend`

#### User Story
As a developer, I want a single `GET /v1/protocols` endpoint that returns all supported protocols across both Stellar and EVM with consistent metadata — so that the UI can populate filter pills and protocol cards from one source of truth.

#### Acceptance Criteria
- [ ] `GET /v1/protocols` returns an array of protocol objects with: `id`, `name`, `type` (`lending / lp / staking / vault / cdp / rwa / derivatives`), `chains` (array of chain IDs/names), `logoUrl`, `appUrl`
- [ ] Both Stellar protocols (Blend, Aquarius, etc.) and EVM protocols (Aave, Uniswap, etc.) are included
- [ ] Response is cached for 24 hours (protocol list changes infrequently)
- [ ] Endpoint documented in API reference

---

### UI-012 — Rate Limit Headers and Error Response Standardisation

**Type:** Enhancement (Backend)
**Priority:** P2
**Story Points:** 3
**Epic:** UI-E3
**Labels:** `api`, `rate-limiting`, `dx`, `backend`

#### User Story
As an API consumer, I want consistent rate limit headers and structured error responses across all OctoPos endpoints — so that I can handle limits and errors programmatically.

#### Acceptance Criteria
- [ ] All responses include: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers
- [ ] All error responses use consistent schema: `{ "error": { "code": "RATE_LIMITED", "message": "...", "retryAfter": 30 } }`
- [ ] `429 Too Many Requests` includes `Retry-After` header
- [ ] `400 Bad Request` includes the specific field validation error
- [ ] Applied to both Stellar API and EVM API workers
- [ ] Documented in API reference

---

## Acceptance Testing Checklist (All UI tickets)

Before any UI ticket is closed, the following cross-cutting checks must pass:

- [ ] **Cross-browser:** Chrome 120+, Firefox 120+, Safari 17+
- [ ] **Accessibility:** No critical axe-core violations; all interactive elements keyboard-navigable
- [ ] **Error states:** Network failure shows a user-friendly error toast, not a blank screen or console error
- [ ] **Loading states:** Skeleton or spinner shown while data fetches; no layout shift when data arrives
- [ ] **Empty states:** Graceful handling when wallet has no positions, no history, etc.
- [ ] **Price staleness:** If position data is >90 seconds old (EVM cache miss), a "Prices may be stale" warning is shown
- [ ] **Unit tests:** All new components have at least happy-path unit tests
- [ ] **Design review:** UI screenshots shared in the ticket before merge for design sign-off

---

## Sprint Backlog — Suggested Sprint 1 (2 weeks)

| Ticket | Team | Points | Dependency |
|--------|------|--------|------------|
| STL-007 | Stellar BE | 2 | — |
| STL-001 | Stellar BE | 8 | STL-007 |
| STL-004 | Stellar BE | 5 | STL-007 |
| EVM-001 | EVM BE | 8 | — |
| EVM-015 | EVM BE | 3 | — |
| UI-001 | Shared BE | 8 | — |
| UI-002 | Frontend | 5 | UI-001 |
| UI-008 | Frontend | 3 | — |
| **Total** | | **42** | |

## Sprint Backlog — Suggested Sprint 2

| Ticket | Team | Points | Dependency |
|--------|------|--------|------------|
| STL-002 | Stellar BE | 8 | — |
| STL-003-SPIKE | Stellar BE | 2 | — |
| STL-005 | Stellar BE | 5 | STL-007 |
| STL-006 | Stellar BE | 5 | STL-007 |
| EVM-003 | EVM BE | 8 | EVM-001 |
| EVM-004 | EVM BE | 8 | EVM-001 |
| UI-003 | Frontend | 3 | UI-001, UI-002 |
| UI-004 | Frontend | 5 | UI-001 |
| UI-005 | Frontend | 8 | UI-001 |
| **Total** | | **52** | |
