// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "src/Contract1.sol";

contract ContractTest is Test {
    Contract1 s = new Contract1();

    function setUp() public {
    }

    function test_hack1() public {
        s.store();
        s.safes(0);
        // console.log(s.safes(0));
    }
}
