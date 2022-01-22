pragma solidity ^0.8.0;

import "./SolidityHackingWorkshopV8.sol";

contract MockWinnerTakesAll is WinnerTakesAll {
  function getRoundLength() external view returns (uint256) {
    return rounds.length;
  }
}
