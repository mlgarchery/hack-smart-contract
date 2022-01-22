pragma solidity ^0.8.0;

contract Test {
  struct Round {
    uint256 rewards;
    mapping(address => bool) isAllowed;
  }

  Round[] public rounds;

  function createNewRounds(uint256 _numberOfRounds) external {
    for (uint256 i = 0; i < _numberOfRounds; i++) {
      rounds.push();
    }
  }

  function getRoundLength() external view returns (uint256) {
    return rounds.length;
  }
}
