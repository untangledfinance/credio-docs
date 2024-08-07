# Credio contract (Oracle)

- Consumers can clone (using a non-upgradeable proxy) to create a competition contract. There are many contract templates available, as long as the templates inherit the ICompetition interface.
- Modeler, validators can interact with competition contracts through Credio contracts.
- Using an upgradable proxy (UUPS or Transparent) for dev.
 
## Overview
This contract manages instances, allows users to create competitions, owners to register validators, and more.
Credio lets creators set up different types of competitions. You can choose to have one model or many, use validators or not, and decide if you or the community picks the winner. Right now, our basic setup uses many models and lets validators choose the best one.

## Dependences


### OwnableUpgradeable
Provides access control with an upgradable owner.

### UUPS-Upgradeable
Enables contract upgrades through the owner.

### Clones
A minimal bytecode implementation that delegates all calls to a known, fixed address

### IHalo2Verifier
Interface for interacting with a verification contract.

### CredioConsumerBase
Interface for a user-defined contract used during proof fulfillment.

### IVault
Interface for interacting with the vault contract that holds deposited tokens.

### ICompetition
Interface for the competition contract (deployed through Credio.cloneCompetition).

### TransferHelper
Library for ERC20 token transfers.

## Structs

### ValidatorInfo
Stores information about a validator (currently only slash amount).

### CompetitionInfo
Stores details about a competition (token used, payer, consumer, fee per request).

## State Variables

### vault
Address of the vault contract.

### credioToken
Address of the Credio token used for staking and fees.

### validatorStakeAmount
Amount of Credio tokens required for validator registration.

### nonces
Mapping to track unique identifiers for competition contracts.

### verifiers
Nested mapping to store verifier addresses for competitions based on batch size.

### creators
Mapping to link competition contracts to their creators.

### competitionInfos
Mapping to store details about each competition.

### isValidators
Mapping to identify registered validators.

### validatorInfos
Mapping to store information about validators (currently only slash amount).

## Events

### CompetitionCreated
Emitted when a competition contract is cloned.

### ValidatorRegistered
Emitted when an address registers as a validator.

### CompetitionClosed
Emitted when a competition is closed, specifying payment details.

### FulfillProof
Emitted when a proof is successfully fulfilled for a competition.

## Errors
Conditions that cause transactions to revert.

### InvalidProof
Reverted when a verification proof fails.

### OnlyCompetition
Reverted when a function can only be called by a competition contract.

### LengthMismatch
Reverted when verifier and batch size arrays have different lengths.

### AlreadyRegistered
Reverted when an address tries to register as a validator again.

## Functions
Actions that can be performed on the contract.

### initialize
Initializes the contract with vault, Credio token, and validator stake amount.

### cloneCompetition
Creates a new competition contract instance.

### registerAsValidator
Allows an address to register as a validator by staking Credio tokens.

### closeCompetition
Closes a competition by specifying payment details.

### _beforeFulfillProof
Internal function for fee transfer before proof fulfillment.

### fulfillProof
Allows users to submit proofs for verification by a competition.

### _depositERC20ToVault
Internal function to transfer ERC20 tokens to the vault.

### _authorizeUpgrade
Restricted function for contract upgrades by the owner ( onlyOwner ).

## View Function
Allows retrieving data from the contract without modifying its state.

### predictCompetitionAddress
Predicts the address of a competition contract based on its creation details.
