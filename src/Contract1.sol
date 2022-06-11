// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


contract Contract1 {
     struct Safe {
        address owner;
        uint256 amount;
    }

    Safe[] public safes;

    /// @dev Stores some ETH.
    function store() public payable {
        safes.push(Safe({owner: msg.sender, amount: msg.value}));
    }

    /// @dev Takes back all the amount stored.
    function take() public {
        for (uint256 i; i < safes.length; ++i) {
            Safe storage safe = safes[i];
            if (safe.owner == msg.sender && safe.amount != 0) {
                payable(msg.sender).transfer(safe.amount);
                safe.amount = 0;
            }
        }
    }
}