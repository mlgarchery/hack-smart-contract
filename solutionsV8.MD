## General recommendations

- from 0.8.0 compiler manages under/over-flow
- missing events in all contracts
- in current solidity version function's visibility is required
- avoid using msg.sender & msg.data => use `_msgSender()` & `_msgData()` from `openzeppelin-contracts/contracts/utils/Context.sol`
- always look at OpenZeppelin repo instead of re-inventing the wheel (ERCx, SafeMath, Context, TimeLock, Owner...)
  - e.g. sends verification on `address(0)`:
    - `require(_msgSender() != address(0), "ERC20: transfer from the zero address");`
    - `require(recipient != address(0), "ERC20: transfer to the zero address");`
  - enough balance: `require(balances[_msgSender()] >= _amount, "Insufficient balance");`
- add missing strings for ALL `require(...)`
- use 3-4 chars for `require(...)` or `revert(...)` error message to optimise contract size
- solidity doesn't support decimals: when diving numbers, expressed in Wei, multiple the multiplier by 10**18: `(msg.value \* 10**18) / 1 ether;`
- avoid using `transfer` and `send`. Use `call{value: amount}("")` and make functions payable
- to avoid reentrancy attacks: update balances var before transfer & use reentrancy guard (OpenZeppelin)
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
- 

<br><br>

## Exercise 15
- `createNewRounds`:
  - anyone can create new rounds: made on purpose or missing `require(msg.sender == owner, "Owner only")` => *owner considered as TRUSTED can set rounds with rewards* => owner only can create new rounds + set rewards? or anyone can create rounds but rewards are set up only by owner?
  - if 1rst option: use `Ownable` and `onlyOwner` modifier
  - limit loop size per transaction to avoid spending enormous amount of gas on "infinite" loops
- `setRewardsAtRoundFor`:
  - name isn't self explanatory, replace with: `allowAddressesToParticipateAt`
  - is it ok that owner can include themselves in round participation?
  - withdrawRewards: `call{value: amount}("")` + payable
  - withdrawETH: `call{value: amount}("")` + payable
- use Context (even Ownable here) to replace `msg.sender` with `_msgSender()`