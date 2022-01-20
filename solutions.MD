## General recommendations

- compiler is lower than version 0.8.0 => **SafeMath** library required to avoid under/over-flow
- missing events
- in current solidity version function's visibility is required
- avoid using msg.sender & msg.data => use `_msgSender()` & `_msgData()` from `openzeppelin-contracts/contracts/utils/Context.sol`
- always look at OpenZeppelin repo instead of re-inventing the wheel (ERCx, SafeMath, Context, TimeLock, Owner...)
- strings missing for ALL `require(...)`
- use 3-4 chars for `require(...)` or `revert(...)` error message to optimise contract size

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
- Context from OpenZeppelin

## Exercise 2

- `buyVotingRights(..)`:
  - ~~`balances[msg.sender] += msg.value / 1 ether;`~~ => `balances[_msgSender()] += (msg.value * 10**18) / 1 ether;`
- `votingRights[_msgSender()]` **never decreased** => comments no detailed we dont know if this is made on purpose or if a variable update is missing
- +***Genral recommendations*** above (compiler version & SafeMath, events, function visibility...)
- Context from OpenZeppelin

## Exercise 3
- Set owner in constructor in order to use a function that will:
  - check new owner isnt `address(0)`: `require(newOwner != address(0), "Ownable: new owner is the zero address");``
  - emit ownership transfer event
- Token price is 1 Wei: is that made on purpose or power of ten missing? => comments not detailed enough
- `balances[...]` can be made private and use a `balanceOf(...)` method to optimise contract size
- `buyToken(...)`:
  - prevent `address(0)` from buying
  - `msg.sender` => `_msgSender()`
  - where does `_msgSender()` buys its token? There is no balance decreased from any address or contract. If it is from the current `BuyToken` contract add: `require(balances[address(this)] >= _amount, "Not enough tokens left")` + `balances[address(this)] -= _amount;`
  - in `require(_price * _amount * 1 ether <= msg.value)`, the `* 1 ether` shouldn't be there as both `_amount` & `_price` are expressed in Wei (uint256 otherwise another encoding number format would have been used). Plus if both `_amount` & `_price` are expressed in Wei we need to divide the result by `10**18` cause `price-10**18 * amount-10**18 = price-amount-10**36` which is not the right calculation (this is due to solidty not supporting decimals)
- `setPrice(...)`:
  - see ***General recommendations***
- Use Ownable contract from OpenZeppelin
- +***Genral recommendations*** above (compiler version & SafeMath, events, function visibility...)
