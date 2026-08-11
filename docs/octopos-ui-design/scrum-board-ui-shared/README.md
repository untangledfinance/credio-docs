---
file: ui-002-nansen-style-wireframe.html
version: v17
last_updated: 2026-06-26
artifact_id: 300
status: active
iteration_owner: agent-team
related_ticket: UI-002 (Multi-Wallet Save & Manage, P0)
---

# UI-002 Nansen-style Wireframe — v17

Interactive single-file HTML wireframe for the **UI-002 Multi-Wallet Save & Manage** feature (the user-facing side of the OctoPos Portfolio product). Visual style modeled on the Nansen portfolio UX.

## What this artifact is

A self-contained `index.html` (no build step, no external assets) that renders the OctoPos multi-page SPA at full fidelity — sidebar, Portfolio, Risk Alerts, Agents, Settings, Feedback, Docs. **Same JS across every visual variant**; the only thing that changes between wireframes is CSS. Open in any browser to interact with it (⌘B / Ctrl+B collapses the sidebar; all state persists to `localStorage`).

## v17 changes (this iteration)

Five changes shipped together as one bundle, driven by user feedback from the previous session's review of v16:

| # | Change | What |
|---|--------|------|
| 1 | **Sidebar → Docs** | Replaced 6-card grid + Privacy & data footer with a single "Open Docs site →" link to `docs.octopos.crediolabs.ai` |
| 2 | **Sidebar → Settings** | Reduced 6 sections → 2 (a "minimal for now" notice + Connected wallets with wipe button). Dropped Profile / Current plan / x402 subscription / Security / Community & advanced |
| 3 | **Sidebar → Feedback** | Replaced Gmail-required banner + full form + advanced list with a single "Sign in or create an account to leave feedback" CTA. No Gmail wording. No Agent-20 mention. Advanced features list retained as a locked section |
| 4 | **Portfolio sub-tab → remove Configure** | Dropped the unused Configure sub-tab |
| 5 | **Portfolio sub-tab → add Protocols Tracked** | New default sub-tab (Nansen's "Supported Protocols" pattern). Chain-grouped chips for every protocol OctoPos currently tracks. 4-KPI summary header. Click "My Portfolio" to swap to the existing dashboard |

### Mock data populated (per UI-002 mock-data mandate)

**Protocols Tracked page (14 chains, 43 protocol chips):**

| EVM chains | Stellar |
|---|---|
| Ethereum (11): Aave V3, Lido, Uniswap V3, Maker, Sky, EigenLayer, Morpho, Pendle, Rocket Pool, Ethena, Curve | Stellar · Soroban (9): Blend, Soroswap, Phoenix, Aquarius, FXDAO, Untangled Vault, Stellar Wallet, Upshift, Sushi Stellar |
| Base, Arbitrum, Polygon, BNB Chain, Gnosis, Avalanche, Optimism, Scroll, Mantle, HyperEVM, Solana | Stellar · Classic (3): USDY (Ondo), USTBL, EUTBL |

Each chain has a colored dot (matches Nansen's chain-color convention) and per-protocol meta label (Lending / AMM LP / Perps / RWA / etc.).

## File details

- **Path (vault):** `Crediolabs.ai/outputs/OctoPos/scrum-board-ui-shared/ui-002-nansen-style-wireframe.html`
- **Source:** `outputs/OctoPos/scrum-board-ui-shared/ui-002-nansen-style-wireframe.html` in `untangledfinance/octopos`
- **Size:** 140,343 bytes (2686 lines)
- **MD5:** `0f937afe1d9052ebe8dff7096008befe`
- **Quality gates:** `<div>` 320/320, `<section>` 7/7, JS parses clean (716 lines), 12 UI-002 `data-ac` anchors preserved
- **No external dependencies:** single self-contained file; works offline

## Iteration history

| Version | Artifact | Session | Notable changes |
|---------|----------|---------|-----------------|
| v1 | initial OctoPos brand variant | — | Original wireframe (OctoPos theme) |
| v2–v6 | 282–285 | `e726ff9d` + `22cfea4c` | Nansen-style variant initial + 5-capture enrichment + HEAT MAP removal |
| v7 | 288 | `c903cbf3` | Holdings + Transactions view panels |
| v9 | 290 | `8e38fd06` | Mock data populated + duplicate `const $viewTabs` bug fixed |
| v10 | 292 | `c62e8ca5` | Verified + re-presented |
| v11 | 294 | `c62e8ca5` | Sidebar restructure + Risk Alerts + Agents pages |
| v13 | 296 | `4ec07807` | Protocol selector on Risk Alerts |
| v14 | 297 | `a3654942` | Apps section removed + My Addresses + collapsible + per-row checkbox + MAX-notice |
| v15 | 298 | `53f95e61` | Re-presented after handoff recall |
| v16 | 299 | `53f95e61` | Full sidebar collapse (⌘B) + Settings + Feedback + Docs pages + remove View portfolio |
| **v17** | **300** | **(this commit)** | **Docs / Settings / Feedback simplification + Protocols Tracked page + remove Configure** |

## Related

- **Ticket:** UI-002 (Multi-Wallet Save & Manage, P0, 5 pts) — DONE 2026-06-24 19:55 UTC
- **Scrum board:** [`scrum-board-ui-shared.md`](scrum-board-ui-shared.md)
- **Sibling wireframe (OctoPos brand):** *not present in this iteration* — only the Nansen variant is actively maintained; brand variant was retired at v5
- **Production code:** `apps/web/src/components/my-wallets-panel.tsx` (port target, not yet shipped from this wireframe)
- **Memo:** `crediolabs-knowledge/.memo.jsonl` — search `tags=["ui-002"]` for full session history