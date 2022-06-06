// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract MyTokenV2 is ERC20Upgradeable {

    address public __Deprecated_do_not_use_airdrop;


    function initialize(string calldata _name, string calldata _symbol) public initializer {
        __ERC20_init(_name, _symbol);
    }

    uint256[50] private __gapTokenV2;
}
