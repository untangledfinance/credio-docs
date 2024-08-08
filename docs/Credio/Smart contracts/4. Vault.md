# Vault contract

## Overview
The Vault contract stores all tokens and supports internal transfers to save gas. It allows deposits and withdrawals of ETH and ERC20 tokens, including WETH.

## Dependences

### IWETH
Interface for WETH operations (withdraw and deposit).

### IERC20
Interface for standard ERC20 operations (balanceOf, transferFrom).

### TransferHelper
Library for safe transfer operations of ETH and ERC20 tokens.

### ReentrancyGuard
Library to prevent reentrancy attacks.

## State Variables

### NATIVE_ETH
Address representing native ETH (constant set to zero address).

### wETH
Address of the WETH token contract.

### balances
Mapping to store balances of tokens for each account (token -> account -> balance).

### reserves
Mapping to store reserves of tokens (token -> reserve).

## Functions

### _wETH
Address of the WETH token contract.

### receive
This fallback function allows the contract to receive ETH directly. If the sender is not the WETH contract, it deposits the ETH as native ETH.

### balanceOf
Returns the balance of a specific token for a given account.

### deposit
Deposits a specified token into the contract.

### depositETH
Deposits ETH into the contract.

### transferAndDeposit
Transfers a specified token from the sender to the contract and deposits it.

### transfer
Transfers a specified amount of a token from the sender to a recipient.

### withdraw
Withdraws a specified token from the contract to a recipient.

### withdrawETH
Withdraws ETH from the contract to a recipient.

### _wrapAndTransferWETH
Wraps native ETH to WETH and transfers it to a recipient.

