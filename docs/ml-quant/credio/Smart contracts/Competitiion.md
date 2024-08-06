# Contract competition (contract challenge)
Consumers can use template Competition. Eg, in competition contract store:
- Creation time: time stamp create contract competition
- Duration: time until the end of challenge (competition)
- Staking amounts: amount of token they stake to protocol
- Slash params (in case consumer cheat, and how can Validator detect consumer cheat?)
- Post competition params (beneficiary for modeler)
- Cancel params for challenge creator (phrase A, phrase B, phrase C)
- Return data to Credio (base on template rule, push or pull mechanism)

## Overview
The Competition contract is designed for handling competitions involving modelers and validators. It includes mechanisms for committing models, grading, and distributing rewards.

## Dependencies

### IVault
Interface for vault operations (balanceOf, deposit, withdraw).

### ICredio
Interface for validating addresses and closing competitions.

### TransferHelper
Library for safe transfer operations of tokens.

### BytesLib
Library for manipulating bytes.

## State Variables

### factory
Address of the factory contract.

### creator
Address of the competition creator.

### vault
Address of the vault contract.

### token
Address of the ERC20 token used for staking and rewards.

### totalStake
Total amount staked in the competition.

### totalClaimed
Total amount of rewards claimed.

### ipfsCompetitionDetail
IPFS hash containing competition details.

### payer
Address responsible for paying rewards.

### consumer
Address consuming the service or competition results.

### feePerRequest
Fee per request made during the competition.

### modelerFeePercent
Percentage of the total fee allocated to modelers.

### validatorFeePercent
Percentage of the total fee allocated to validators.

### minStakeAmount
Minimum stake amount required for modelers.

### batchSizes
Array of batch sizes for validation.

### ipfsGradingDetail
IPFS hash containing grading details.

### winner
Address of the competition winner.

### startCompetition
Timestamp of when the competition starts.

### submitDeadline
Timestamp of the submission deadline.

### isCompetitionEnd
Boolean indicating whether the competition has ended.

### balances
Mapping of address to balance (stake amount).

### modelers
Mapping of address to ModelerCommit struct (commit details and stake amount).

### verifiers
Mapping of modeler address to batch size and verifier address.

### claimed
Mapping of address to amount claimed.

## Structs

### ModelerCommit
Struct containing IPFS commit details and stake amount.

## Events

### ModelCommitted
Emitted when a modeler commits a model.

### Grading
Emitted when grading is completed.

### Withdrawal
Emitted when a stake is withdrawn.

### Collected
Emitted when rewards are collected.

## Errors

### Unauthorized
Thrown when an unauthorized action is attempted.

### AlreadyCommitted
Thrown when a modeler attempts to commit more than once.

### LengthMismatch
Thrown when the length of verifiers and batch sizes mismatch.

### WinnerCannotUnstake
Thrown when the winner attempts to unstake.

### LateSubmission
Thrown when a submission is made after the deadline.

### GradingUnavailable
Thrown when grading is attempted before the submission deadline.

### UnstakeUnavailable
Thrown when unstaking is attempted before the competition ends.

### InvalidFeeDistribution
Thrown when the sum of modeler and validator fees is not 100.

### InSufficientAmount
Thrown when the stake amount is below the minimum required.

## Modifiers

### onlyValidator
Restricts function access to validators only.

## Functions

### initialize
Initializes the contract with creator, vault, token, and competition details.

### _beforeCommit
Internal function to handle pre-commit checks and token transfers.

### commitModel
Allows a modeler to commit a model with a stake amount.

### grading
Allows a validator to grade the competition and declare a winner.

### endCompetition
Internal function to end the competition and close it in the factory contract.

### withdrawStake
Allows participants to withdraw their stake after the competition ends.

### collect
Allows validators and winners to collect their rewards.

### _decodeParams
Internal function to decode competition parameters from calldata.


