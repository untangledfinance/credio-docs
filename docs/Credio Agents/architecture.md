# Architecture

## The Building Blocks

The Credio Agent is a small, focused service that stitches together a handful of specialized technologies. Each block has a clear job.

| Block | Role | Technology |
|-------|------|------------|
| Runtime | Runs the agent process | [Bun](https://bun.sh) |
| Framework | Dependency injection, scheduled jobs, caching, logging | [`untangled-web`](https://github.com/untangledfinance/untangled-web) |
| Risk feed | Source of risk levels and position data | [OctoPos RMS](https://docs.untangled.finance/docs/octopos/rms/rms) |
| Blockchain | Reads positions, submits transactions | Stellar / Soroban |
| Transactions | Builds unwind and swap routes | Blend Capital + Stellar Router SDK |
| Payments | Pays for OctoPos API access | [X402](https://docs.untangled.finance/docs/octopos/defi-positions-api/subscriptions) + Stellar USDC |
| State & audit | Persistent agent config and close history | MongoDB |
| Dedup cache | Short-lived cooldown guard | Redis |

## How the Pieces Fit

```
              ┌────────────────────────┐
              │       OctoPos RMS      │
              │   (risk assessments)   │
              └──────────┬─────────────┘
                         │  risk level
                         ▼
┌────────────────────────────────────────────┐
│              Credio Agent                  │
│                                            │
│  ┌──────────────┐      ┌──────────────┐    │
│  │Risk Monitor  │─────▶│  Decision    │    │
│  │   Job        │      │   Engine     │    │
│  └──────────────┘      └──────┬───────┘    │
│                               │            │
│                               ▼            │
│  ┌──────────────┐      ┌──────────────┐    │
│  │ Pre-Signed   │◀────▶│ Transaction  │    │
│  │   Cache      │      │   Builder    │    │
│  └──────────────┘      └──────┬───────┘    │
│                               │            │
│  ┌──────────────┐             │            │
│  │ Subscription │             │            │
│  │   Job (x402) │             │            │
│  └──────────────┘             │            │
│                               │            │
└───────────────────────────────┼────────────┘
          │                     │
          ▼                     ▼
   ┌────────────┐        ┌────────────┐
   │  MongoDB   │        │  Stellar   │
   │  (audit)   │        │  (Soroban) │
   └────────────┘        └────────────┘
          ▲
          │
   ┌────────────┐
   │   Redis    │
   │ (cooldown) │
   └────────────┘
```

## Responsibilities

### Risk Monitor
A scheduled job that runs every few seconds. Its only purpose is to ask OctoPos for the latest risk level and hand it to the decision engine.

### Decision Engine
Looks at the risk level and decides whether to act. On `emergency`, it checks the cooldown guard and triggers an on-chain close.

### Transaction Builder
Turns a set of positions into a signed Stellar transaction — combining Blend pool calls, asset swaps, and optional flash liquidity into a single multicall.

### Pre-Signed Cache
Keeps a ready-to-submit close transaction in memory for the current positions, refreshed on a short cadence. This is what makes the reaction path fast.

### Subscription Job
A daily job that keeps the agent's OctoPos API key valid — paying via X402 in Stellar USDC when needed.

### State & Audit (MongoDB)
Two core collections:
- **Agent config** — current API key and subscription timestamps
- **Close actions** — a full history of close attempts and outcomes

### Cooldown Cache (Redis)
Short-lived keys per wallet + position, preventing duplicate firings within a configurable window.

## Execution View

```
  poll RMS ──▶ evaluate ──▶ refresh presigned ──▶ (no-op while safe)
                  │
            emergency
                  ▼
        cooldown check ──▶ broadcast ──▶ audit ──▶ (notify, planned)
                              │
                           fallback
                              ▼
                         fresh build ──▶ sign ──▶ submit
```

## Failure Isolation

- One job tick can fail without blocking the next.
- A rejected presigned transaction falls back to a fresh build.
- A lapsed OctoPos subscription pauses polling until payment succeeds — no blind firing without a risk signal.
