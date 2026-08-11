---
last_updated: 2026-06-23
---

# OctoPos Scrum Boards

Three boards covering all active OctoPos work. Each file is a self-contained scrum board with epics, stories, acceptance criteria, and sprint suggestions.

## Boards

| Board | File | Focus |
|-------|------|-------|
| OctoPos Stellar | [scrum-board-stellar.md](scrum-board-stellar.md) | New protocol adapters (Upshift, Sushi Stellar, Templar) + RWA token price feeds (Ondo, Spiko, WisdomTree) |
| OctoPos EVM | [scrum-board-evm.md](scrum-board-evm.md) | Multi-chain DeFi adapter expansion + chain coverage to match Nansen |
| UI & Shared API | [scrum-board-ui-shared.md](scrum-board-ui-shared.md) | Multi-wallet portfolio feature (up to 5 wallets, 1 API call) + Nansen-parity UI/UX |

## Ticket Summary

### Stellar (6 tickets + 1 spike)
| ID | Title | Points | Priority |
|----|-------|--------|----------|
| STL-001 | Upshift Protocol Adapter | 8 | P0 |
| STL-002 | Sushi Stellar Adapter | 8 | P0 |
| STL-003-SPIKE | Templar Protocol Engineering Spike | 2 | P1 |
| STL-003 | Templar Protocol Adapter | 8 | P1 |
| STL-004 | Ondo Yield Assets Price Feed | 5 | P0 |
| STL-005 | Spiko Token Integration | 5 | P1 |
| STL-006 | WisdomTree Token Integration | 5 | P1 |
| STL-007 | RWA token registry module (prerequisite) | 2 | P0 |

### EVM (17 tickets)
| ID | Title | Points | Priority |
|----|-------|--------|----------|
| EVM-001 | Fix Per-Chain Blockscout Token Discovery | 8 | P0 |
| EVM-002 | Add Dedicated Blockscout Instances for Deferred Chains | 5 | P2 |
| EVM-003 | Aave V3 Multi-Chain Adapter Extension | 8 | P0 |
| EVM-004 | Uniswap V3 Multi-Chain Adapter Extension | 8 | P0 |
| EVM-005 | Compound V3 Multi-Chain Adapter Extension | 5 | P1 |
| EVM-006 | Curve Multi-Chain Adapter Extension | 8 | P1 |
| EVM-007 | GMX V2 Adapter (Arbitrum + Avalanche) | 8 | P1 |
| EVM-008 | Venus Protocol Adapter (BNB) | 5 | P1 |
| EVM-009 | BENQI Adapter (Avalanche) | 5 | P2 |
| EVM-010 | Pendle Multi-Chain Adapter Extension | 5 | P1 |
| EVM-011 | Balancer Multi-Chain Adapter Extension | 5 | P2 |
| EVM-012 | Morpho Multi-Chain Adapter Extension (Base) | 3 | P1 |
| EVM-013 | Radiant Capital Adapter | 5 | P2 |
| EVM-014 | EigenLayer Restaking Adapter | 8 | P2 |
| EVM-015 | Nansen Chain Coverage Audit (Spike) | 3 | P0 |
| EVM-016 | Sonic Chain Integration | 5 | P2 |
| EVM-017 | Mode Network Integration | 5 | P2 |

### UI & Shared API (12 tickets)
| ID | Title | Points | Priority |
|----|-------|--------|----------|
| UI-001 | Multi-Wallet Aggregation API Endpoint | 8 | P0 |
| UI-002 | Multi-Wallet Save & Manage (UI) | 5 | P0 |
| UI-003 | Portfolio Overview KPI Bar | 3 | P0 |
| UI-004 | Chain & Protocol Breakdown Charts | 5 | P0 |
| UI-005 | Sortable & Filterable Position Table | 8 | P0 |
| UI-006 | Portfolio History Chart (P&L Timeline) | 8 | P1 |
| UI-007 | DeFi Position Cards | 5 | P1 |
| UI-008 | Chain & Protocol Filter Pill Row | 3 | P0 |
| UI-009 | Wallet Switcher and Per-Wallet View | 3 | P1 |
| UI-010 | Mobile-Responsive Layout Overhaul | 5 | P2 |
| UI-011 | GET /v1/protocols Unified Endpoint | 3 | P1 |
| UI-012 | Rate Limit Headers and Error Response Standardisation | 3 | P2 |

## Priority Legend
- **P0** — Must ship in Sprint 1 or 2; blocks GTM or has a direct dependency chain
- **P1** — High value; target Sprint 2–3
- **P2** — Important but not blocking; schedule in Sprint 3+
- **P3** — Deferred; revisit quarterly

## Dependency Map

```
STL-007 (RWA registry) ──► STL-004, STL-005, STL-006
STL-003-SPIKE ──► STL-003
EVM-001 (Blockscout fix) ──► EVM-003, EVM-004, EVM-005, EVM-006 (quality dependency)
EVM-015 (Nansen audit) ──► EVM-016, EVM-017 and any new chain tickets
UI-001 (Portfolio API) ──► UI-002, UI-003, UI-004, UI-005, UI-006, UI-009
```
