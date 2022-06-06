// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract MyToken is ERC20Upgradeable {
    address public airdrop;

    modifier onlyAirdrop() {
        require(msg.sender == airdrop, "Only airdrop address can perform this action");
        _;
    }

    function initialize(string calldata _name, string calldata _symbol, address _airdrop) public initializer {
        __ERC20_init(_name, _symbol);
        __AirdroppableToken_init_unchained(_airdrop);
    }

    function __AirdroppableToken_init_unchained(address _airdrop) public initializer {
        airdrop = _airdrop;
    }

    function mint( address receiver, uint256 amount) external onlyAirdrop {
        _mint(receiver, amount);
    }

    uint256[50] private __gapToken;
}
