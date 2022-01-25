## General recommendations

- compiler is lower than version 0.8.0 => **SafeMath** library required to avoid under/over-flow
- missing events
- in current solidity version function's visibility is required
- avoid using msg.sender & msg.data => use `_msgSender()` & `_msgData()` from `openzeppelin-contracts/contracts/utils/Context.sol`
- always look at OpenZeppelin repo instead of re-inventing the wheel (ERCx, SafeMath, Context, TimeLock, Owner...)
  - e.g. sends verification on `address(0)`:
    - `require(_msgSender() != address(0), "ERC20: transfer from the zero address");`
    - `require(recipient != address(0), "ERC20: transfer to the zero address");`
  - enough balance: `require(balances[_msgSender()] >= _amount, "Insufficient balance");`
- strings missing for ALL `require(...)`
- use 3-4 chars for `require(...)` or `revert(...)` error message to optimise contract size
- solidity doesn't support decimals so if msg.sender buys less than 1 ether it wont receive anything
- **fix:** `balances[_msgSender()] += (msg.value * 10**18) / 1 ether;`

## Exercise 1
<br><br>

## Exercise 2
<br><br>

## Exercise 3
<br><br>

## Exercise 4
<br><br>

## Exercise 5
<br><br>

## Exercise 6
<br><br>

## Exercise 7
<br><br>

## Exercise 8
<br><br>

## Exercise 9
<br><br>

## Exercise 10
<br><br>

## Exercise 11
<br><br>

## Exercise 12
<br><br>

## Exercise 13
<br><br>

## Exercise 14
<br><br>

## Exercise 15

