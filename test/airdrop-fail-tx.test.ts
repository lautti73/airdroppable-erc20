import { expect } from "chai";
import { randomBytes } from "crypto";

import { Airdrop, MyToken } from "../typechain";
import { defaultDeploy } from "./common-fixtures";
import { defaultMerkleTree, Leaf } from "./airdropMerkleTree";

declare module "mocha" {
  export interface Context {
    airdrop: Airdrop;
    token: MyToken;
    leaf: Leaf;
  }
}

describe("Airdrop: failing transactions", function () {
    describe("GIVEN an airdroppable contract was deployed and set up", function () {
        before(async function () {
        const { token, airdrop } = await defaultDeploy();
        this.token = token;
        this.airdrop = airdrop;
        this.leaf = defaultMerkleTree.getLeaf(0);
        });
        describe("WHEN a user presents a proof for a leaf, but changes the amount", function () {
            it("THEN the tx fails", async function () {
                return await expect(this.airdrop.claim(this.leaf.receiver, this.leaf.receiver + 1 , defaultMerkleTree.getProof(0)))
                    .to.be.revertedWith("You are not in the airdrop list")
            });
        });

        describe("WHEN a user presents a proof for a leaf, but changes the receiver", function () {
            it("THEN the tx fails", async function () {
               return await expect(
                   this.airdrop.claim(defaultMerkleTree.getLeaf(1).receiver, this.leaf.amount, defaultMerkleTree.getProof(0))
               ).to.be.revertedWith('You are not in the airdrop list');
            });
        });

        describe("WHEN a user presents a proof for another leaf", function () {
            it("THEN the tx fails", async function () {
                return await expect(
                    this.airdrop.claim(this.leaf.receiver, this.leaf.amount, defaultMerkleTree.getProof(1))
                ).to.be.revertedWith('You are not in the airdrop list');
            });
        });

        describe("WHEN a user presents a random proof for a valid leaf", function () {
            it("THEN the tx fails", async function () {
                return await expect(
                    this.airdrop.claim(this.leaf.receiver, this.leaf.amount, [randomBytes(32), randomBytes(32)])
                ).to.be.revertedWith('You are not in the airdrop list');
            });
        });

        describe("WHEN a user presents an empty proof for a valid leaf", function () {
            it("THEN the tx fails", async function () {
                return await expect(
                    this.airdrop.claim(this.leaf.receiver, this.leaf.amount, [])
                ).to.be.revertedWith('You are not in the airdrop list');
            });
        });

        describe("WHEN a user presents an invalid proof with the root hash for a valid leaf", function () {
            it("THEN the tx fails", async function () {
                return await expect(
                    this.airdrop.claim(this.leaf.receiver, this.leaf.amount, [defaultMerkleTree.getRoot()])
                ).to.be.revertedWith('You are not in the airdrop list');
            });
        });

        describe("WHEN a user presents an random proof with the root hash for an invalid leaf", function () {
            it("THEN the tx fails", async function () {
                return await expect(
                    this.airdrop.claim(this.airdrop.address, this.leaf.amount, [randomBytes(32), randomBytes(32)])
                ).to.be.revertedWith('You are not in the airdrop list');
            });
        });

        describe("WHEN a user presents an valid proof with the root hash for an invalid leaf", function () {
            it("THEN the tx fails", async function () {
                return await expect(
                    this.airdrop.claim(this.airdrop.address, 20, [randomBytes(32), randomBytes(32)])
                ).to.be.revertedWith('You are not in the airdrop list');
            });
        });

        describe("WHEN a user presents a valid proof for the same leaf twice", function () {
            it("THEN the second tx fails", async function () {
                await this.airdrop.claim(this.leaf.receiver, this.leaf.amount, defaultMerkleTree.getProof(0));
                return await expect(
                    this.airdrop.claim(this.leaf.receiver, this.leaf.amount, defaultMerkleTree.getProof(0))
                ).to.be.revertedWith("You already claimed the tokens")
            });
        });

        describe("WHEN a user wants to mint directly through the token", function () {
            it("THEN the tx fails", async function () {
                return await expect(
                    this.token.mint(this.leaf.receiver, this.leaf.amount)
                ).to.be.revertedWith('Only airdrop address can perform this action')
            });
        });

        describe("WHEN a user wants to reinitialize the token, to set the airdrop", function () {
            it("THEN the tx fails", async function () {
                return await expect(
                    this.token.initialize('MyToken', 'MTK', await this.token.signer.getAddress())
                ).to.be.reverted
            });
        });

        describe("WHEN a user wants to reinitialize unchained the token, to set the airdrop", function () {
            it("THEN the tx fails", async function () {
                return expect(
                    this.token.__AirdroppableToken_init_unchained(await this.token.signer.getAddress()),
                  ).to.revertedWith("Initializable: contract is already initialized");
            });
        });

        describe("WHEN a user wants to change the token", function () {
            it("THEN the tx fails", async function () {
                return await expect(
                    this.airdrop.setToken(this.airdrop.address)
                ).to.be.reverted
            });
        });

        describe("WHEN a user wants to change the root", function () {
            it("THEN the tx fails", async function () {
                return await expect(
                    this.airdrop.setRoot(await this.airdrop.signer.getAddress())
                ).to.be.reverted
            });
        });
    });
});
