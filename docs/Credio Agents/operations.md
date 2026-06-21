# Operations

## What You Need

To run a Credio Agent you'll want:

- A **Stellar wallet** (BIP39 mnemonic) — pays network fees and holds the positions being protected
- **Stellar USDC** in that wallet — funds the OctoPos X402 subscription
- A **Soroban RPC endpoint** — how the agent talks to Stellar
- **MongoDB** and **Redis** — state, audit, and cooldown cache
- **[Bun](https://bun.sh)** runtime (or Docker)

## Configuration

The agent is configured through environment variables. Only two are strictly required:

| Setting | What It Does |
|---------|--------------|
| `STELLAR_MNEMONIC` | Mnemonic for the agent's Stellar wallet |
| `SOROBAN_RPC_URL` | Soroban RPC endpoint |

Common tuning knobs:

| Setting | Purpose |
|---------|---------|
| `POLL_INTERVAL_MS` | How often the agent polls OctoPos for risk |
| `SLIPPAGE` | Slippage tolerance for unwind swaps |
| `CLOSE_COOLDOWN_TTL` | Cooldown window that blocks duplicate closes |
| `OCTOPOS_BASE_URL` | OctoPos API endpoint (defaults to production) |
| `OCTOPOS_EMAIL` / `OCTOPOS_PROJECT_NAME` | Metadata used when registering for an API key |
| `OCTOPOS_MOCK` | Run against mocked OctoPos responses for development |
| `DATABASE_*` / `REDIS_*` | MongoDB and Redis connection settings |
| `PORT` | HTTP server port |

## Running

```bash
bun install          # Install
bun run dev          # Hot-reload dev server
bun run start        # Production (build + run)
```

Docker is supported out of the box:

```bash
bun run docker:up    # Build & run
bun run docker:down  # Stop
```

## Observability

### Health & Status Endpoints

| Endpoint | What It Shows |
|----------|----------------|
| `GET /health` | Liveness probe — suitable for load balancers |
| `GET /status` | Wallet address, subscription state, current positions, recent close actions, presigned cache status |

### Logs
Every job, every API call, and every transaction submission is logged with structured context, making it straightforward to pipe into your log aggregator of choice.

### Audit Trail
The full history of close attempts lives in MongoDB. Each record captures the wallet, risk snapshot at decision time, transaction hash, and outcome — suitable for compliance reviews or post-incident analysis.

## Security Notes

- `STELLAR_MNEMONIC` is the most sensitive secret — store it in a vault, KMS, or sealed secret.
- The agent's wallet only needs funds for network fees and — optionally — the positions it manages.
- OctoPos API keys live in MongoDB; treat database access as sensitive.
- The `/status` endpoint reveals position and activity data — keep it on a trusted network.

## Deployment Tips

- Run a **single instance per managed wallet** to keep dedup logic simple.
- Keep Redis close to the agent — it's on the hot path for cooldown checks.
- Use a **high-availability Soroban RPC** (or multiple) — RPC outages are the most common reason the close path fails.
- Fund the wallet with **enough XLM for fees** under sustained activity; low balance warnings surface in `/status` and logs.
