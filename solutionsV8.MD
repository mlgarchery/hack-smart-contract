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
- `contrusctor`: missing string in `require`
- `guess(...)`:
  - there is no verification on `partyB` is not `partyA`
  - string in `require`
- `resolve(...)`:
  - `call{value: amount}("")` + payable
  - string in `require`
- `timeout(...)`: never called in `resolve(...)` so even after 1 day `partyA` can still call `resolve(...)` to get earned funds
<br><br>

## Exercise 6

<br><br>

## Exercise 7

<br><br>

## Exercise 8
- `deposit(...)`: missing string for `require` error
- `withdraw(...)`:
  - `call{value: amount}("")` + payable
  - missing string for `require` error
  - avoid reentrancy attack: `coffer.slots[slot] = 0` update before transfer + reentrancy guard
- `closeAccount(...)`
  - `call{value: amount}("")` + payable
  - might be better with a reentrancy guard
<br><br>

## Exercise 9
- The are too many errors of conception that doesn't make sense:
  - on `deposit(...)`:
    - if `scaleFactor` is not 0:
      - if `msg.value` > `address(this).balance` there will be an error thrown on `toAdd` instanciation as solidity doesn't support negative numbers
    - if `scaleFactor` is 0:
      - should it only set the scale to 100? Or should it also registered transfered ETH to the contract from `msg.sender`? Or should it set `scaleFactor` to 2 (as 100% = x2)?
  - on `withdraw(...)`:
      - `scaleFactor` is not representative of a specific slot as done in `Coffers`
- use `call{value: amount}("")` + payable
<br><br>

## Exercise 10
- better to use Ownable to manage ownership and be sure to initialise owner in the constructor
- `deposit(...)`: no comments saying deposit must be greater than `baseDeposit` so we can add `>=` for lower or equal
- `declareWinner(...)`:
  - missing `require(...)` on sides A & B funds deposit (seems like wanted as if the winner side hasn't deposited money the reward will be burnt)
- `payReward(...)`:
  - avoid reentrancy attack: `reward = 0` before transfer + reentrancy guard
  - `call{value: amount}("")` + payable
<br><br>

## Exercise 11
- `calldata` can only be used with external functions => either change visibility or use `memory` instead
- `abi.encode` pads the encoding in a standard way which is a requirement when using external calls (like call method encoding) + it uses more space than `abi.encodePacked`. In our case it might be better to use `abi.encode` as it is a standard packed mode and the ID can be created seamlessly on other systems.
<br><br>

## Exercise 12
- `buyToken(...)`:
  - `_newBalance` issue as solidity doesn't support decimals, replace with `balances[msg.sender] += (msg.value * 10**18) / 1 ether`
- `transfer(...)`:
  - missing `require` to check:
    - sender *(msg.sender)* has enough balance
    - sender & recipient aren't `address(0)`
  - balances update:
    - missing `uchecked on balances`: `unchecked{ blances[msg.sender] = balancesFrom - value }`
    - `balances[to] += _value` 
<br><br>

## Exercise 13
- `guess(...)`: not detailed if player must strictly send 1 ETH or minimum 1 ETH. If minimum update `require`.
- `reveal(...)`: require of reveal period is strictly lower `<` but can be made `<=` as commitment period in `guess(...)`
- `findWinner()`: 
  - missing `require()` erro string
  - anyone can call the function: made on purpose?
  - after `if (i == guesses.length)` an else can be added so we only update `cursorWinner` when we have not passed through the whole array
  - comment `// If we have passed through the entire array, update currentStage.` is 1 line too high: confusing
- `distribute(...)`:
  - avoid reentrancy attacks: reentrancy guard + move `if (i == winners.length - 1) currentStage = Stage.Distributed;` before transfer
  - `call{value: amount}("")` + payable
  - after the `for` loop, `if(i < winners.length)` should be added to update `cursorDistribute` only when we haven't finished going through the list
- players can monitor how many addresses there are left (`indexToPlayer` & `players` public) and use it to reveal there other account at the last moment
<br><br>

## Exercise 14
- `deposit(...)`: not mentionned we can only deposit ETH as long as the contract holds <= 10 ETH
- `withdrawAll(...)`:
  - `call{value: amount}("")` + payable
  - update `require` if we can deposit when there are more than 10 ETH in the contract

<br><br>

## Exercise 15
- `createNewRounds(...)`:
  - anyone can create new rounds: made on purpose or missing `require(msg.sender == owner, "Owner only")` => *owner considered as TRUSTED can set rounds with rewards* => owner only can create new rounds + set rewards? or anyone can create rounds but rewards are set up only by owner?
  - if 1rst option: use `Ownable` and `onlyOwner` modifier
  - limit loop size per transaction to avoid spending enormous amount of gas on "infinite" loops
- `setRewardsAtRoundFor(...)`:
  - name isn't self explanatory, replace with: `allowAddressesToParticipateAt`
  - is it ok that owner can include themselves in round participation?
  - withdrawRewards: `call{value: amount}("")` + payable
  - withdrawETH: `call{value: amount}("")` + payable
- use Context (even Ownable here) to replace `msg.sender` with `_msgSender()`