// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";
import "./MyToken.sol";


interface Token {
    function mint( address receiver, uint256 amount) external;
}

contract Airdrop {
    bytes32 public root;
    Token public token;

    mapping(bytes32 => bool) public isLeafUsed;

    function setRoot(bytes32 _root) external {
        require(root == bytes32(0), "Airdrop: root already set");
        root = _root;
    }

    function setToken( Token _token ) external {
        require(address(token) == address(0), "Airdrop: token already set");
        token = _token;
    }

    function claim( address receiver, uint256 amount, bytes32[] memory proof) external {
        bytes32 leafHash = hashLeaf(receiver, amount);
        require(MerkleProofUpgradeable.processProof(proof, leafHash) == root, "You are not in the airdrop list");
        require(!isLeafUsed[leafHash], "You already claimed the tokens");
        isLeafUsed[leafHash] = true;
        token.mint(receiver, amount);
    } 

    function hashLeaf(address receiver, uint256 amount) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(receiver, amount));
    }

    uint256[50] private __gapAirdrop;
}