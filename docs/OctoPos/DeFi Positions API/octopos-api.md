# OctoPos API

## Interactive Documentation (Swagger UI)

**URL:** https://octopos.credio.network/docs/

Self-service, no login required. Provides interactive API exploration with request/response schemas, examples, and the ability to execute requests directly from the browser.

## OpenAPI Specification

**URL:** https://octopos.credio.network/docs/openapi.json

OpenAPI 3.0.3 specification covering all endpoints, schemas, and authentication requirements.

## Developer Quickstart Guide

Comprehensive guide covering:

- API key registration
- Five core read endpoints with curl examples
- JavaScript and Python code samples
- Rate limit headers and retry logic
- Postman collection setup
- Degradation behavior explanation

## Core Endpoints

### Position Summary

```
GET /api/v1/positions/{address}/summary
```

Returns aggregated lending/borrowing metrics including total deposits, borrowed amounts, net return, and weighted average health factor.

**Response:**
```json
{
  "address": "GAFBNJTWT6WX3A65IY62ZOUWPFC5VQAHC5PCB5SV23ZKOMHKEFJFQSGC",
  "totalDepositUsd": "146681.57",
  "totalBorrowedUsd": "16814.10",
  "totalReturnUsd": "129867.48",
  "totalAssetUsd": "168583.22",
  "netValueUsd": "151769.13",
  "overallHealthFactor": 8.7237,
  "timestamp": "2026-05-05T16:15:54.985Z"
}
```

### Supported Address Types

- **G-addresses** (Stellar keypairs): wallet balances, lending positions, liquidity positions
- **C-addresses** (Soroban contracts): pool reserves, vault shares

### Rate Limiting

| Tier     | RPM    | Bucket Key                    |
| -------- | ------ | ----------------------------- |
| Free     | 60     | `<endpoint>:<IP>`             |
| Standard | 600    | `<endpoint>:key:<API-key-ID>` |
| Partner  | Bypass | (No rate limiting)            |

Response headers include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`.
