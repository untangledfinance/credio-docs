---
board: OctoPos EVM
last_updated: 2026-06-23
status: active
owner: agent-team
---

# OctoPos EVM — Scrum Board

**Product:** OctoPos EVM (octopos.untangled.finance / app-evm-octopos-mainnet.crediolabs.ai)
**Current version:** V8.3 — 16 protocol adapters on Ethereum mainnet only; 15 other chains limited to wallet balances
**Sprint cadence:** 2-week sprints
**Story point scale:** Fibonacci (1, 2, 3, 5, 8, 13)
**Reference target:** Nansen portfolio protocols coverage (https://app.nansen.ai/portfolio/protocols)

---

## Epic EVM-E1: Multi-Chain Infrastructure Hardening

**Goal:** Fix data quality gaps on Base, Optimism, Avalanche, and Blast (known Blockscout fallback bug causing 2-4x ETH over-counting) and extend reliable token discovery to all 16 supported chains. This is a prerequisite for multi-chain protocol adapters (EVM-E2).

---

### EVM-001 — Fix Per-Chain Blockscout Token Discovery (Base, Optimism, Avalanche, Blast)

**Type:** Bug / Infrastructure
**Priority:** P0
**Story Points:** 8
**Epic:** EVM-E1
**Labels:** `infrastructure`, `blockscout`, `data-quality`, `evm`

#### User Story
As an OctoPos user checking my Base or Optimism wallet, I want to see only the tokens I actually hold on that chain — not my Ethereum holdings incorrectly mirrored across chains — so that my portfolio total is accurate.

#### Background
V8.3 docs note: "Base, Optimism, Avalanche, Blast do not have reliable per-chain Blockscout instances. The route falls back to `eth.blockscout.com`, which returns Ethereum token holdings and reports them under the queried chain. This causes 2–4× over-counting of ETH holdings." This ticket resolves this by switching to chain-native token discovery alternatives.

#### Acceptance Criteria
- [ ] Base: Token discovery migrated from `eth.blockscout.com` fallback to [Base's native Blockscout instance](https://base.blockscout.com) or Alchemy Token API (if Alchemy key is available) or Coinbase's Base indexer
- [ ] Optimism: Token discovery uses OP-native Blockscout (`optimism.blockscout.com`) or Alchemy Token API
- [ ] Avalanche: Token discovery uses Snowtrace / Avalanche-specific indexer or Covalent GoldRush
- [ ] Blast: Token discovery uses Blast-native Blockscout instance (`blast.blockscout.com`) if available, otherwise use Alchemy/Blast's RPC `eth_getTokenBalances`
- [ ] After fix, a test wallet known to hold both ETH and Base-native tokens shows: correct Base token list (no Ethereum ERC-20s in Base results), correct ETH balance on Base, total value without duplication
- [ ] Cross-check: run the Binance 8 canonical wallet against the fixed endpoint; Ethereum total unchanged, per-chain totals no longer sum to >100% of total
- [ ] `GET /v1/evm/supported-chains` response updated: remove `known_issue` flags for Base/Optimism/Avalanche/Blast once fixed
- [ ] Unit tests added for each chain's token discovery path

#### Technical Notes
- Check if Alchemy's `alchemy_getTokenBalances` endpoint is available for these chains — it solves the Blockscout gap without self-hosting. Requires an Alchemy API key (check if one exists in project secrets)
- Alternative: Covalent GoldRush has per-chain APIs for Avalanche and Optimism; free tier is sufficient for test
- If a clean per-chain solution is not available for a specific chain, explicitly mark that chain as `"token_discovery_limited": true` in `/v1/evm/supported-chains` and document the limitation

---

### EVM-002 — Add Dedicated Blockscout Instances for Deferred Chains

**Type:** Infrastructure
**Priority:** P2
**Story Points:** 5
**Epic:** EVM-E1
**Labels:** `infrastructure`, `chains`, `evm`

#### User Story
As an OctoPos user, I want to see my token balances on additional EVM chains (Cronos, Metis, Mode, Scroll, Linea improvements) so that my full cross-chain wallet is reflected.

#### Acceptance Criteria
- [ ] Engineering spike (max 3h) per deferred chain to assess whether a public or affordable Blockscout / RPC / DefiLlama instance now exists (chains: Cronos, Metis, Mode, Taiko, Sonic, Core, Kaia)
- [ ] Any chain where infrastructure now exists is unblocked and added to the supported chain list
- [ ] Chains still blocked are documented with updated reason and next review date
- [ ] `/v1/evm/supported-chains` updated to reflect any new additions

#### Technical Notes
- This is a quarterly review ticket — create a recurring reminder to re-run this spike every 90 days
- Priority for unblocking: Cronos (large CEX user base), Metis (DeFi TVL), Mode (Base ecosystem participant)

---

## Epic EVM-E2: Multi-Chain DeFi Protocol Adapters

**Goal:** Extend the 16 existing Ethereum-only DeFi adapters to cover the same protocols on the chains where they are live and where Nansen tracks them. Priority order follows TVL and user volume.

**Design principle:** Each multi-chain adapter extension reuses the existing Ethereum adapter's ABI and data model; only the `chainId` guard is removed and chain-specific contract addresses are added. Do not re-architect — extend.

---

### EVM-003 — Aave V3 Multi-Chain Adapter Extension

**Type:** Feature
**Priority:** P0
**Story Points:** 8
**Epic:** EVM-E2
**Labels:** `adapter`, `aave`, `multi-chain`, `lending`, `evm`

#### User Story
As an OctoPos user with Aave V3 positions on Polygon, Arbitrum, Optimism, Base, or Avalanche, I want `GET /v1/evm/defi/positions/:address` to return those positions — not just my Ethereum Aave positions — so that I can see all my lending exposure in one call.

#### Background
OctoPos has Aave V2 and Aave V3 adapters for Ethereum. Aave V3 is deployed on Polygon, Arbitrum One, Optimism, Base, Avalanche C-Chain, BNB Chain, and Scroll. Nansen tracks all of these. This ticket extends the existing `aave-v3` adapter to support these chains by adding per-chain Pool contract addresses and removing the `chainId === 1` guard.

#### Acceptance Criteria
- [ ] Aave V3 Pool contract addresses for all target chains added to `config/evm-protocol-addresses.ts`:
  - Polygon (137)
  - Arbitrum One (42161)
  - Optimism (10)
  - Base (8453)
  - Avalanche C-Chain (43114)
  - BNB Smart Chain (56)
- [ ] `aave-v3` adapter's `chainId === 1` guard replaced with a supported-chains check against the above list
- [ ] `GET /v1/evm/defi/positions/:address?chain_ids=137` returns Aave V3 supply/borrow positions on Polygon for a known depositor
- [ ] Position schema unchanged — no new fields required; `chainId` already present in the position object
- [ ] Integration test: known Aave V3 Polygon depositor address returns positions with correct `valueUsd`
- [ ] Total across all Aave V3 chains matches Nansen reference within 5% (price cache window tolerance)
- [ ] `GET /v1/evm/supported-chains` updated: Aave V3 listed as supported for each newly added chain

#### Technical Notes
- Aave V3 Pool addresses are publicly documented at docs.aave.com; use official registry, not community lists
- The adapter already reads health factor, supply, and borrow via Aave's `getUserAccountData` and `getUserReservesData` — these calls work identically on all chains
- Per-call multicall retry (already in place) handles RPC flakiness; no new retry logic needed
- Aave V3 on BNB and Scroll: confirm TVL threshold justifies inclusion (only add if >$10M TVL)

#### Definition of Done
- Multi-chain Aave V3 adapter merged; tests pass on all target chains
- Docs updated: `3. capabilities.md` adapter table updated for Aave V3

---

### EVM-004 — Uniswap V3 Multi-Chain Adapter Extension

**Type:** Feature
**Priority:** P0
**Story Points:** 8
**Epic:** EVM-E2
**Labels:** `adapter`, `uniswap`, `multi-chain`, `lp`, `evm`

#### User Story
As an OctoPos user with Uniswap V3 LP positions on Arbitrum, Polygon, Optimism, or Base, I want those NFT positions returned in `GET /v1/evm/defi/positions/:address` so that I see all my LP exposure across chains.

#### Background
Uniswap V3 uses NFT positions (ERC-721) managed by `NonfungiblePositionManager`. OctoPos has a Uniswap V3 Ethereum adapter using `tokenOfOwnerByIndex`. The NonfungiblePositionManager is deployed at the same address on Arbitrum, Polygon, Optimism, and Base. This ticket extends coverage to those chains.

#### Acceptance Criteria
- [ ] `uniswap-v3` adapter chain guard removed; `NonfungiblePositionManager` address confirmed for:
  - Arbitrum One (42161)
  - Polygon (137)
  - Optimism (10)
  - Base (8453)
- [ ] `GET /v1/evm/defi/positions/:address?chain_ids=42161` returns Uniswap V3 LP NFT positions for a known Arbitrum LP
- [ ] Each position includes: `chainId`, `protocol: "uniswap-v3"`, `positionId` (NFT token ID), `token0`, `token1`, `fee`, `liquidity`, `token0Amount`, `token1Amount`, `valueUsd`, `inRange` (bool)
- [ ] Integration test: known Uniswap V3 Arbitrum LP returns correct position data
- [ ] `GET /v1/evm/defi/positions/:address?chain_ids=1,42161,137` aggregates positions across all three chains in one response
- [ ] Docs updated: capabilities table

#### Technical Notes
- `NonfungiblePositionManager` is at `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` on Ethereum, Arbitrum, Polygon, Optimism — verify Base address separately
- Pool address derivation from fee + token pair is deterministic — the `PoolAddress.computeAddress` logic works cross-chain with the correct factory address
- For price of token0/token1 in an out-of-range position, use DefiLlama oracle (already in scope)

---

### EVM-005 — Compound V3 Multi-Chain Adapter Extension

**Type:** Feature
**Priority:** P1
**Story Points:** 5
**Epic:** EVM-E2
**Labels:** `adapter`, `compound`, `multi-chain`, `lending`, `evm`

#### User Story
As an OctoPos user with Compound V3 (Comet) positions on Base, Polygon, or Arbitrum, I want those positions returned alongside my Ethereum Compound positions.

#### Acceptance Criteria
- [ ] Compound V3 Comet contract addresses for Base, Polygon, Arbitrum added to `config/evm-protocol-addresses.ts`
- [ ] `compound-v3` adapter extended to support these chains (same `userBasic` + `userCollateral` read pattern)
- [ ] Integration test: known Compound V3 Base depositor returns positions
- [ ] Docs updated

#### Technical Notes
- Compound V3 deploys separate `Comet` contracts per market (e.g. cUSDCv3, cUSDTv3) — enumerate all live markets per chain from Compound's official deployment registry
- Base and Arbitrum are Compound's highest-growth markets after Ethereum

---

### EVM-006 — Curve Multi-Chain Adapter Extension

**Type:** Feature
**Priority:** P1
**Story Points:** 8
**Epic:** EVM-E2
**Labels:** `adapter`, `curve`, `multi-chain`, `lp`, `evm`

#### User Story
As an OctoPos user with Curve LP positions on Arbitrum, Polygon, or Optimism, I want those positions returned so that my stablecoin LP exposure is fully tracked.

#### Acceptance Criteria
- [ ] Curve AddressProvider / MetaRegistry deployed on Arbitrum, Polygon, Optimism — used to enumerate pools (same registry-based approach as Ethereum adapter)
- [ ] `curve` adapter extended to query registry on each supported chain
- [ ] Integration test: known Curve Arbitrum LP holder (e.g. 2pool or tricrypto) returns positions
- [ ] Position schema unchanged: `protocol: "curve"`, pool address, LP shares, underlying token amounts, `valueUsd`
- [ ] Docs updated

#### Technical Notes
- Curve's AddressProvider is at the same address on all EVM chains where Curve is deployed
- `get_pool_list` from MetaRegistry enumerates pools without hardcoding — use this rather than a static pool list

---

### EVM-007 — GMX V2 Adapter (Arbitrum + Avalanche)

**Type:** Feature
**Priority:** P1
**Story Points:** 8
**Epic:** EVM-E2
**Labels:** `adapter`, `gmx`, `derivatives`, `perps`, `evm`

#### User Story
As an OctoPos user with GMX V2 positions (GM tokens, GLV tokens, or open perp positions) on Arbitrum or Avalanche, I want my GM liquidity positions and open perpetual positions tracked so that I can monitor my exposure.

#### Background
GMX V2 is the leading on-chain perpetuals protocol on Arbitrum. Users can: (a) provide liquidity via GM tokens (market-specific LP tokens), (b) hold GLV tokens (diversified GM basket), (c) have open perp positions. This is a new adapter — GMX does not exist in the current adapter set.

#### Acceptance Criteria
- [ ] New `gmx-v2` adapter created in `packages/evm-adapters/src/adapters/`
- [ ] Supported position types:
  - `GM_LP` — GM token liquidity positions: token balance × current GM token price (from GMX's DataStore)
  - `GLV_LP` — GLV basket token positions
  - `PERP_LONG` / `PERP_SHORT` — open perpetual positions with `size`, `collateral`, `pnl`, `liquidationPrice`
- [ ] `GET /v1/evm/defi/positions/:address?chain_ids=42161` returns all GMX V2 position types for a known GMX user
- [ ] `valueUsd` for perp positions reflects mark price PnL (not notional); negative PnL positions display negative `pnlUsd`
- [ ] Integration test: known GMX V2 LP and/or perp trader address on Arbitrum
- [ ] Unit tests for GM token price calculation and position parsing
- [ ] Docs: add GMX V2 to capabilities adapter table

#### Technical Notes
- GMX V2 position data: use GMX's `Reader` contract (`getAccountPositions`, `getAccountGmTokensInfoList`) — these are purpose-built for off-chain position reads
- GMX DataStore: GM token prices are computed from pool composition (not from a price oracle) — read the pool's `getMarketInfo` for accurate pricing
- Avalanche: GMX V2 is deployed on Avalanche with same contract addresses (confirm with GMX docs)
- Do not use the GMX V1 subgraph — it is deprecated

---

### EVM-008 — Venus Protocol Adapter (BNB Chain)

**Type:** Feature
**Priority:** P1
**Story Points:** 5
**Epic:** EVM-E2
**Labels:** `adapter`, `venus`, `bnb`, `lending`, `evm`

#### User Story
As an OctoPos user with Venus Protocol positions on BNB Chain, I want my supply and borrow positions returned so that my BNB DeFi exposure is visible.

#### Background
Venus is the dominant lending protocol on BNB Chain, similar to Compound V2 in architecture. Users hold vTokens representing supplied assets; borrows are tracked via vToken borrow balances.

#### Acceptance Criteria
- [ ] New `venus` adapter created
- [ ] Position types: `SUPPLY` (vToken balance × exchange rate) and `BORROW`
- [ ] Venus Comptroller used to enumerate all markets a wallet is in (`getAssetsIn`)
- [ ] Integration test: known Venus BNB Chain depositor address returns positions
- [ ] `valueUsd` derived from Venus's on-chain oracle prices
- [ ] Docs updated

#### Technical Notes
- Venus V4 uses isolated lending pools in addition to the core pool — enumerate both
- Venus's `ComptrollerLens` provides `getAccountLiquidity` and `vTokenBalancesAll` — prefer these over per-market calls

---

### EVM-009 — BENQI Adapter (Avalanche)

**Type:** Feature
**Priority:** P2
**Story Points:** 5
**Epic:** EVM-E2
**Labels:** `adapter`, `benqi`, `avalanche`, `lending`, `evm`

#### User Story
As an OctoPos user with BENQI positions on Avalanche, I want supply and borrow positions returned.

#### Acceptance Criteria
- [ ] New `benqi` adapter (Compound V2 fork pattern — reuse Venus adapter structure)
- [ ] Comptroller-based market enumeration
- [ ] Integration test: known BENQI Avalanche depositor
- [ ] Docs updated

---

### EVM-010 — Pendle Multi-Chain Adapter Extension (Arbitrum, BNB)

**Type:** Feature
**Priority:** P1
**Story Points:** 5
**Epic:** EVM-E2
**Labels:** `adapter`, `pendle`, `multi-chain`, `yield`, `evm`

#### User Story
As an OctoPos user with Pendle PT or LP positions on Arbitrum or BNB Chain, I want those positions returned alongside my Ethereum Pendle positions.

#### Background
The current Pendle adapter on Ethereum is limited to 4 hardcoded market addresses and uses a manual PT coverage workaround (V3 MarketFactory reverted). This ticket: (a) extends to Arbitrum and BNB, (b) fixes the Ethereum MarketFactory issue if possible.

#### Acceptance Criteria
- [ ] Pendle V3 MarketFactory address confirmed for Arbitrum and BNB Chain
- [ ] `pendle` adapter extended to query `getMarkets` from MarketFactory on each chain
- [ ] Position types: PT positions (principal token balance × implied price), LP positions (SY + PT in pool)
- [ ] Ethereum adapter migrated away from hardcoded 4-address list to MarketFactory enumeration (if MarketFactory is now functional)
- [ ] Integration test: known Pendle Arbitrum user returns positions
- [ ] Docs updated: note on PT pricing methodology (discount to face value)

#### Technical Notes
- If Pendle's V3 MarketFactory is still unreliable on Ethereum, keep the 4-address list but document the fix as a known gap
- Pendle's off-chain API (`api.pendle.finance`) exposes market data — use as supplementary source for APY, but position data must come from on-chain reads

---

### EVM-011 — Balancer Multi-Chain Adapter Extension (Arbitrum, Polygon, Optimism)

**Type:** Feature
**Priority:** P2
**Story Points:** 5
**Epic:** EVM-E2
**Labels:** `adapter`, `balancer`, `multi-chain`, `lp`, `evm`

#### User Story
As an OctoPos user with Balancer LP positions on Arbitrum, Polygon, or Optimism, I want those positions returned.

#### Acceptance Criteria
- [ ] Balancer Vault address confirmed for each target chain (same address on all EVM chains: `0xBA12222222228d8Ba445958a75a0704d566BF2C8`)
- [ ] `balancer` adapter's `chainId === 1` guard removed; replace with supported-chain list
- [ ] Integration test: known Balancer Arbitrum LP holder returns pool token positions
- [ ] Docs updated

---

### EVM-012 — Morpho Multi-Chain Adapter Extension (Base)

**Type:** Feature
**Priority:** P1
**Story Points:** 3
**Epic:** EVM-E2
**Labels:** `adapter`, `morpho`, `base`, `lending`, `evm`

#### User Story
As an OctoPos user with Morpho Blue positions on Base, I want those positions returned alongside my Ethereum Morpho positions.

#### Acceptance Criteria
- [ ] Morpho Blue contract address on Base added to adapter config
- [ ] `morpho` adapter extended to support Base (chainId: 8453)
- [ ] Integration test: known Morpho Base user returns positions
- [ ] Docs updated

#### Technical Notes
- Morpho Blue uses the same contract interface on Base as Ethereum — minimal code change required

---

### EVM-013 — Radiant Capital Adapter (Arbitrum + BNB)

**Type:** Feature
**Priority:** P2
**Story Points:** 5
**Epic:** EVM-E2
**Labels:** `adapter`, `radiant`, `arbitrum`, `bnb`, `lending`, `evm`

#### User Story
As an OctoPos user with Radiant Capital lending positions on Arbitrum or BNB, I want supply and borrow positions returned.

#### Acceptance Criteria
- [ ] New `radiant` adapter (Aave V2 fork — reuse aave-v2 adapter as reference)
- [ ] Radiant LendingPool addresses for Arbitrum and BNB added to config
- [ ] Integration test: known Radiant Arbitrum depositor returns positions
- [ ] Docs updated

---

### EVM-014 — EigenLayer Restaking Adapter (Ethereum)

**Type:** Feature
**Priority:** P2
**Story Points:** 8
**Epic:** EVM-E2
**Labels:** `adapter`, `eigenlayer`, `restaking`, `ethereum`, `evm`

#### User Story
As an OctoPos user with staked ETH in EigenLayer, I want my restaked positions (LST deposits in strategies, queued withdrawals) returned so that I can monitor my restaking exposure.

#### Acceptance Criteria
- [ ] New `eigenlayer` adapter created for Ethereum mainnet
- [ ] Position types:
  - `RESTAKE` — LST deposited into an EigenLayer strategy: staker shares × strategy exchange rate
  - `WITHDRAWAL_QUEUED` — pending withdrawal with `withdrawableAt` timestamp
- [ ] EigenLayer `StrategyManager.stakerStrategyShares` used to enumerate a staker's positions across all strategies
- [ ] Position metadata: `strategy`, `underlyingToken`, `shares`, `underlyingAmount`, `valueUsd`
- [ ] Integration test: known EigenLayer restaker address (e.g., a Lido or RocketPool heavy wallet that also restakes)
- [ ] Docs updated

#### Technical Notes
- EigenLayer `StrategyManager` at `0x858646372CC42E1A627fcE94aa7A7033e7CF075A`
- `DelegationManager.getWithdrawals` for queued withdrawals
- Strategy addresses: stETH strategy, rETH strategy, cbETH strategy, and native ETH strategy (EigenPod) — the EigenPod is a separate contract per staker; read from `EigenPodManager.hasPod`

---

## Epic EVM-E3: Chain Coverage Expansion (Nansen-Parity)

**Goal:** Bring OctoPos's active chain count from 16 to match Nansen's tracked chain set by resolving deferred chains and adding newly viable ones.

---

### EVM-015 — Nansen Chain Coverage Audit and Prioritisation

**Type:** Research / Spike
**Priority:** P0
**Story Points:** 3
**Epic:** EVM-E3
**Labels:** `spike`, `research`, `chains`, `evm`

#### Objective
Produce a definitive gap analysis: which chains does Nansen track (via https://app.nansen.ai/portfolio/protocols) that OctoPos does not, and what is the infrastructure readiness for each?

#### Deliverable
A Markdown table (filed as `outputs/OctoPos/spikes/evm-nansen-chain-gap.md`) with columns:
- Chain name + Chain ID
- Nansen status (tracked / not tracked)
- OctoPos status (supported / deferred / not assessed)
- Blockscout instance available? (Y/N, URL)
- DefiLlama coverage? (Y/N)
- Public RPC available? (Y/N)
- Recommended action (add now / defer / skip)
- Estimated story points to add

#### Timebox
6 engineering hours. Output feeds into EVM-016 and beyond.

---

### EVM-016 — Sonic Chain Integration

**Type:** Feature
**Priority:** P2
**Story Points:** 5
**Epic:** EVM-E3
**Labels:** `chain`, `sonic`, `evm`

#### User Story
As an OctoPos user with assets on Sonic (formerly Fantom's EVM upgrade), I want native token balances and ERC-20 balances returned.

#### Acceptance Criteria
- [ ] Sonic Chain ID and RPC endpoints added to chain config
- [ ] Blockscout instance confirmed and wired into token discovery
- [ ] DefiLlama price feed supports Sonic tokens
- [ ] `GET /v1/evm/balances/:address?chain_ids=<sonic_chain_id>` returns correct balances
- [ ] `/v1/evm/supported-chains` updated
- [ ] Docs updated

---

### EVM-017 — Mode Network Integration

**Type:** Feature
**Priority:** P2
**Story Points:** 5
**Epic:** EVM-E3
**Labels:** `chain`, `mode`, `evm`

#### User Story
As an OctoPos user with assets on Mode Network (OP Stack L2), I want token balances returned.

#### Acceptance Criteria
- [ ] Mode Chain ID and RPC endpoints added
- [ ] Token discovery wired (Mode has a Blockscout instance — confirm endpoint)
- [ ] `GET /v1/evm/balances/:address?chain_ids=<mode_chain_id>` returns correct balances
- [ ] Docs updated

---

## Backlog (EVM)

| ID | Title | Points | Priority | Notes |
|----|-------|--------|----------|-------|
| EVM-018 | Lido Multi-Chain (Polygon — stMATIC) | 3 | P2 | |
| EVM-019 | Rocket Pool Adapter (Ethereum — rETH) | 3 | P2 | Currently Lido-only for ETH staking |
| EVM-020 | Sky/MakerDAO Multi-Chain extension (Spark on Base) | 3 | P2 | |
| EVM-021 | Yearn V3 Multi-Chain (Arbitrum, Polygon) | 5 | P2 | |
| EVM-022 | NFT position support (ERC-721/1155) | 13 | P3 | Tier 4 deferral, revisit Q4 |
| EVM-023 | Euler V2 Multi-Chain extension | 3 | P2 | Euler is expanding to Arbitrum |
| EVM-024 | Zora chain full ERC-20 discovery | 3 | P2 | Currently native-only |
| EVM-025 | CEX wallet detection warning | 2 | P2 | Flag known hot wallets (Binance, Coinbase) to avoid the 39% under-report confusion |
