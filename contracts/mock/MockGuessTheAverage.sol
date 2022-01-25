pragma solidity ^0.8.0;

import "../SolidityHackingWorkshopV8.sol";
import "hardhat/console.sol";

contract MockGuessTheAverage is GuessTheAverage {
  constructor(uint32 _commitDuration, uint32 _revealDuration)
    GuessTheAverage(_commitDuration, _revealDuration)
  {}

  function chainVars() public {
    winners.push();
    cursorDistribute = numberOfLosers = winners.length;
  }

  function printFor() public view returns (uint256) {
    uint256 t;
    uint256 index;
    for (index = 0; index < 1; index++) {
      t = index;
      console.log("alright: ", index);
    }

    console.log("index after: ", index);

    return t;
  }
}
