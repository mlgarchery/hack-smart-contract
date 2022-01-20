## General recommendations

- compiler is lower than version 0.8.0 => **SafeMath** library required to avoid under/over-flow
- missing events
- in current solidity version function's visibility is required
- avoid using msg.sender & msg.data => use `_msgSender()` & `_msgData()` from `openzeppelin-contracts/contracts/utils/Context.sol`
- always look at OpenZeppelin repo instead of re-inventing the wheel (ERCx, SafeMath, Context, TimeLock, ...)

## Exercise 1

- `buyToken(...)`:
  - solidity doesn't support decimals so if msg.sender buys less than 1 ether it wont receive anything
  - **fix:** `balances[_msgSender()] += (msg.value * 10**18) / 1 ether;`
- `sendToken(...)`:
  - missing
    - `require(_msgSender() != address(0), "ERC20: transfer from the zero address");`
    - `require(recipient != address(0), "ERC20: transfer to the zero address");`
  - ~~require(balances[msg.sender] != 0);~~ => `require(balances[_msgSender()] >= _amount, "Insufficient balance");`
  - +***Genral recommendations*** above (compiler version & SafeMath, events, function visibility...)

## Exercise 2

- `buyVotingRights(..)`:
  - ~~`balances[msg.sender] += msg.value / 1 ether;`~~ => `balances[_msgSender()] += (msg.value * 10**18) / 1 ether;`
- votingRights[_msgSender()] **never decreased** => comments no detailed we dont know if this is made on purpose or if a variable update is missing
- +***Genral recommendations*** above (compiler version & SafeMath, events, function visibility...)
