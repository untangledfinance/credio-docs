---
board: OctoPos Stellar
last_updated: 2026-06-23
status: active
owner: agent-team
---

# OctoPos Stellar — Scrum Board

**Product:** OctoPos Stellar (octopos.untangled.finance)
**Current version:** V1 — 7 protocol adapters live (Blend, Aquarius, SoroSwap, Phoenix, FxDAO, Native Wallet, Untangled Vaults)
**Sprint cadence:** 2-week sprints
**Story point scale:** Fibonacci (1, 2, 3, 5, 8, 13)

---

## Epic STL-E1: Stellar DeFi Protocol Expansion

**Goal:** Extend OctoPos Stellar position tracking to three new DeFi protocols — Upshift, Sushi Stellar, and Templar Protocol — using the existing adapter pattern in `packages/stellar-adapters/`.

---

### STL-001 — Upshift Protocol Adapter

**Type:** Feature
**Priority:** P0
**Story Points:** 8
**Epic:** STL-E1
**Labels:** `adapter`, `defi`, `stellar`, `yield`

#### User Story
As an OctoPos API consumer, I want to query my Upshift positions (deposited assets and accrued yield) via `GET /positions/:addr` so that I can see my full Stellar DeFi portfolio in one call.

#### Background
Upshift is a yield optimisation protocol on Stellar Soroban. Users deposit assets into yield vaults that auto-compound. Positions manifest as vault share tokens (similar pattern to `untangled-vault` adapter). Contract addresses and ABI are on the Stellar mainnet; Soroban RPC is the primary data source.

#### Acceptance Criteria
- [ ] A new adapter `upshift` is registered in the adapter registry alongside existing adapters
- [ ] `GET /positions/:addr` returns `SUPPLY` positions for any wallet holding Upshift vault shares
- [ ] Each position object includes: `protocol: "upshift"`, `type: "SUPPLY"`, `asset`, `shares`, `underlyingAmount`, `valueUsd`, `apy` (or `null` if unavailable)
- [ ] Pricing falls through to the standard 6-feed priority chain; the adapter does not implement its own price logic
- [ ] `GET /protocols` lists Upshift with correct metadata (`name`, `type: "yield-vault"`, `tvl` if accessible, `contractAddress`)
- [ ] `GET /protocols/upshift/stats` returns pool-level stats (TVL, APY, total shares)
- [ ] Adapter handles the case where a wallet has no Upshift positions (returns empty array, not an error)
- [ ] Integration test against a known Upshift depositor address passes
- [ ] No regression on existing adapters — existing adapter suite integration tests all green

#### Technical Notes
- Use existing `untangled-vault` adapter as the reference implementation; the vault-share pattern is identical
- Soroban RPC call: read `balance` (shares held) and `get_price` (or `nav_per_share`) from Upshift contract
- If Upshift exposes an on-chain APY or rate, surface it; otherwise omit and document why
- Contract addresses must be stored in `config/stellar-protocols.ts`, not hardcoded in the adapter
- Add Upshift to `supported-sources.md` documentation with status ✅

#### Definition of Done
- Adapter code merged to main, all unit tests pass
- Integration test covers at least one real mainnet depositor address
- Docs updated in `outputs/docs/OctoPos/DeFi Positions API/3. supported-sources.md`
- No P0/P1 bugs open against this ticket

---

### STL-002 — Sushi Stellar Adapter

**Type:** Feature
**Priority:** P0
**Story Points:** 8
**Epic:** STL-E1
**Labels:** `adapter`, `defi`, `stellar`, `amm`, `lp`

#### User Story
As an OctoPos API consumer, I want to see my SushiSwap Stellar liquidity pool positions so that my DEX LP exposure is fully reflected in my portfolio.

#### Background
SushiSwap has deployed on Stellar Soroban. It follows an AMM LP model similar to SoroSwap: users hold LP tokens representing a share of a token pair pool. The adapter should auto-discover pair addresses from the SushiSwap factory contract, mirror the `soroswap` adapter pattern.

#### Acceptance Criteria
- [ ] A new adapter `sushi-stellar` is registered in the adapter registry
- [ ] `GET /positions/:addr` returns `LP` positions for wallets holding Sushi Stellar LP tokens
- [ ] Each LP position includes: `protocol: "sushi-stellar"`, `type: "LP"`, `poolAddress`, `token0`, `token1`, `lpShares`, `token0Amount`, `token1Amount`, `valueUsd`
- [ ] Pending reward positions (if Sushi Stellar has SUSHI or protocol reward distribution) are returned as a separate `REWARD` entry or included in the LP position as `pendingRewardsUsd`
- [ ] Factory contract is called to enumerate known pair addresses; the adapter does not use a static hardcoded pair list
- [ ] Adapter handles wallets with no Sushi Stellar LP positions (empty array)
- [ ] `GET /protocols` lists `sushi-stellar` with correct metadata
- [ ] Integration test against a known Sushi Stellar LP provider address passes
- [ ] All existing adapter tests remain green

#### Technical Notes
- Reference: `soroswap` adapter for factory-based pair discovery pattern
- Soroban RPC: call factory `get_pairs` or equivalent, then for each pair call `balance_of` and `get_reserves`
- If Sushi Stellar uses a MiniChef or reward distributor contract, add a second RPC read for pending rewards
- LP token value: `(lpShares / totalSupply) * (reserve0 * price0 + reserve1 * price1)`
- Store factory contract address in `config/stellar-protocols.ts`
- Add to `supported-sources.md` docs with status ✅

#### Definition of Done
- Adapter merged, unit + integration tests pass
- Docs updated
- No P0/P1 bugs open

---

### STL-003 — Templar Protocol Adapter

**Type:** Feature
**Priority:** P1
**Story Points:** 8
**Epic:** STL-E1
**Labels:** `adapter`, `defi`, `stellar`

#### User Story
As an OctoPos API consumer, I want Templar Protocol positions tracked so that I have complete visibility of my Stellar DeFi exposure including Templar's offerings.

#### Background
Templar Protocol is a DeFi protocol on Stellar Soroban. Prior to implementation, an engineering spike (see STL-003-SPIKE) is required to confirm Templar's position types (lending, LP, staking, or CDP) and on-chain data access patterns. This ticket covers the full adapter implementation following the spike.

#### Acceptance Criteria
- [ ] Spike completed first (STL-003-SPIKE, below) — position types and contract interface confirmed
- [ ] Adapter `templar` registered in adapter registry
- [ ] `GET /positions/:addr` returns correct position type(s) for Templar (exact types defined in spike)
- [ ] All position fields follow OctoPos standard position schema
- [ ] `GET /protocols` lists Templar with correct metadata
- [ ] Adapter handles empty wallet (no Templar positions) correctly
- [ ] Integration test against a known Templar user address passes
- [ ] Existing adapter tests remain green
- [ ] Docs updated in `supported-sources.md`

#### Technical Notes
- Complete STL-003-SPIKE before writing adapter code
- Follow the spike's output for contract addresses and data model
- Position types and field names must be consistent with OctoPos schema — do not introduce novel types without team review

---

### STL-003-SPIKE — Templar Protocol Engineering Spike

**Type:** Spike
**Priority:** P1
**Story Points:** 2
**Epic:** STL-E1
**Labels:** `spike`, `research`, `stellar`

#### Objective
Determine: (a) what position types Templar Protocol exposes (lending/LP/staking/CDP), (b) which Soroban contract addresses to read from on mainnet, (c) what RPC calls are needed to extract position data, (d) whether any SDK or indexer simplifies access.

#### Deliverable
A brief technical note (Markdown, filed in `outputs/OctoPos/spikes/`) covering:
- Confirmed position types and field definitions
- Contract addresses (mainnet)
- RPC call sequence for position extraction
- Pricing approach (does Templar have an oracle, or do we use standard 6-feed chain?)
- Estimated adapter complexity (use story points from the Fibonacci scale)
- Any blockers or unknowns

#### Timebox
Max 4 engineering hours.

---

## Epic STL-E2: Stellar RWA Token Coverage

**Goal:** Add price feed support and position tracking for three institutional RWA token issuers live on Stellar — Ondo Yield Assets, Spiko, and WisdomTree — so that institutional wallets holding these tokens see correct USD valuations in OctoPos.

**Design constraint:** RWA tokens on Stellar are typically held as trustline balances in native wallets (tracked by `stellar-wallet` adapter) or as Soroban token balances. The primary work is NAV/price feed integration — positions are already captured by the wallet adapter, but value is shown as `$0` or uses a fallback price that may be inaccurate.

---

### STL-004 — Ondo Yield Assets Price Feed & RWA Metadata

**Type:** Feature
**Priority:** P0
**Story Points:** 5
**Epic:** STL-E2
**Labels:** `rwa`, `price-feed`, `ondo`, `stellar`

#### User Story
As an OctoPos user holding USDY or other Ondo Yield Assets on Stellar, I want my position to show the correct USD value (backed by Ondo's on-chain NAV) so that I can monitor my RWA portfolio accurately.

#### Background
Ondo Finance issues USDY (US Dollar Yield token) and potentially other yield assets on Stellar. These tokens represent claims on tokenised money market funds. Pricing must reflect the current NAV per token (not a DEX spot price, which may lag). Ondo publishes on-chain or API-accessible NAV data; this ticket wires that into OctoPos's price priority chain.

#### Acceptance Criteria
- [ ] Ondo token contract addresses (USDY and any other Ondo yield assets on Stellar mainnet) are registered in `config/stellar-rwa-tokens.ts`
- [ ] A new price feed `ondo-nav` is implemented that fetches current NAV per share from Ondo's on-chain oracle or public API
- [ ] The `ondo-nav` feed is inserted into the price priority chain at Priority 1 (Wrapped Asset tier — highest specificity for yield-bearing RWA tokens), above DeFiLlama fallback
- [ ] `GET /positions/:addr` for a wallet holding USDY returns the position with correct `valueUsd` based on Ondo NAV (not a DEX spot price)
- [ ] Position metadata includes `rwaIssuer: "Ondo Finance"`, `assetType: "tokenised-money-market"`, `navPerToken`, `navTimestamp`
- [ ] Price cross-validation: if Ondo NAV diverges from DeFiLlama price by >2%, log a warning (do not fail the request)
- [ ] Price cache TTL for Ondo NAV: 5 minutes (NAV updates infrequently; shorter TTL wastes API calls)
- [ ] Integration test: query a known Ondo USDY holder address and verify `valueUsd > 0` and `navPerToken` is populated

#### Technical Notes
- Ondo's NAV may be available via: (a) on-chain Soroban oracle contract, (b) Ondo's REST API, or (c) Stellar Classic issuer account data. Confirm which during implementation
- If Ondo publishes a Chainlink-compatible oracle on Stellar, hook into that; otherwise use REST API with a 5-minute server-side cache
- Token address format: Soroban C-address for USDY if minted as a Soroban token; Stellar Classic `ASSET:ISSUER` if a classic trustline
- RWA metadata fields must be flagged as optional in the position schema — non-RWA positions must not break

#### Definition of Done
- Price feed live, integration tests pass with real Ondo holder address
- Docs: add Ondo to `supported-sources.md` with pricing methodology note
- No P0/P1 bugs

---

### STL-005 — Spiko Token Integration

**Type:** Feature
**Priority:** P1
**Story Points:** 5
**Epic:** STL-E2
**Labels:** `rwa`, `price-feed`, `spiko`, `stellar`

#### User Story
As an OctoPos user holding Spiko money market fund tokens on Stellar, I want correct NAV-based pricing so that my portfolio total reflects the actual value of my Spiko position.

#### Background
Spiko issues tokenised money market funds (European T-Bills, EUR and USD denominated) on Stellar. Like Ondo, these are yield-bearing tokens where spot DEX price is not the correct pricing method — NAV per token is the authoritative value source. Spiko may publish NAV via REST API or on-chain oracle.

#### Acceptance Criteria
- [ ] Spiko token contract addresses (all Spiko instruments on Stellar mainnet) registered in `config/stellar-rwa-tokens.ts`
- [ ] A `spiko-nav` price feed (or extension of a unified `rwa-nav` feed module) fetches current NAV from Spiko's data source
- [ ] `spiko-nav` inserted at Priority 1 in the price chain for Spiko tokens
- [ ] `GET /positions/:addr` for a Spiko token holder returns correct `valueUsd`
- [ ] Position metadata includes `rwaIssuer: "Spiko"`, `assetType: "tokenised-money-market"`, `navPerToken`, `navCurrency` (EUR or USD), `navTimestamp`
- [ ] EUR-denominated Spiko tokens: NAV is converted to USD using a live EUR/USD rate (DeFiLlama FX or equivalent); the conversion rate is exposed in the response
- [ ] Price cache TTL: 5 minutes
- [ ] Integration test against a known Spiko token holder address

#### Technical Notes
- Confirm Spiko's data endpoint during implementation (REST API or on-chain)
- If Spiko and Ondo use the same NAV-fetch pattern, refactor into a shared `rwa-nav-feed` module rather than two separate implementations
- EUR/USD conversion: use DeFiLlama's forex endpoint or equivalent; do not hardcode rates

#### Definition of Done
- Feed live, integration tests pass
- Docs updated in `supported-sources.md`
- No P0/P1 bugs

---

### STL-006 — WisdomTree Token Integration

**Type:** Feature
**Priority:** P1
**Story Points:** 5
**Epic:** STL-E2
**Labels:** `rwa`, `price-feed`, `wisdomtree`, `stellar`

#### User Story
As an OctoPos user holding WisdomTree tokenised fund products on Stellar, I want my holdings displayed at correct NAV so that institutional portfolio monitoring is accurate.

#### Background
WisdomTree issues tokenised fund products (equities, commodities, fixed income) on Stellar. Unlike money market tokens (USDY, Spiko), WisdomTree tokens track underlying fund NAVs that can include equity or commodity exposure. Pricing requires WisdomTree's NAV feed. Tokens may be issued as Stellar Classic trustlines.

#### Acceptance Criteria
- [ ] All live WisdomTree token instruments on Stellar mainnet registered in `config/stellar-rwa-tokens.ts` with `instrument` metadata (e.g. `"US equity"`, `"gold"`)
- [ ] `wisdomtree-nav` price feed fetches current NAV per token for each instrument
- [ ] Feed inserted at Priority 1 for WisdomTree tokens
- [ ] `GET /positions/:addr` returns correct `valueUsd` for each WisdomTree instrument held
- [ ] Position metadata includes `rwaIssuer: "WisdomTree"`, `instrument`, `navPerToken`, `navTimestamp`, `assetType: "tokenised-fund"`
- [ ] Non-USD denominated instruments converted to USD; conversion rate exposed in response
- [ ] Price cache TTL: 15 minutes (WisdomTree NAV updates less frequently — end-of-day or hourly, not per-minute)
- [ ] Integration test against a known WisdomTree token holder address

#### Technical Notes
- WisdomTree may publish NAV via REST API; confirm endpoint during implementation
- If NAV is only available at end-of-day, document this explicitly in the position response (`navStaleWarning: true` if last update >4 hours ago)
- WisdomTree tokens may have transfer restrictions (whitelisted wallets only); the adapter does not enforce restrictions but should not fail when reading restricted token balances

#### Definition of Done
- Feed live, integration tests pass
- Docs updated in `supported-sources.md`
- No P0/P1 bugs

---

## Backlog (Stellar)

| ID | Title | Points | Priority |
|----|-------|--------|----------|
| STL-007 | RWA token registry: unified `config/stellar-rwa-tokens.ts` module | 2 | P0 — prerequisite for STL-004/005/006 |
| STL-008 | Shared `rwa-nav-feed` module (refactor after STL-004 and STL-005 are shipped) | 3 | P1 |
| STL-009 | Update `GET /protocols` to surface RWA issuers with metadata | 2 | P1 |
| STL-010 | `GET /positions/:addr?type=rwa` filter to return only RWA positions | 2 | P2 |
