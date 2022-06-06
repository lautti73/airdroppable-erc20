import { deployments } from "hardhat";
import { Airdrop, MyToken } from "../typechain";
import { defaultMerkleTree } from "./airdropMerkleTree";

type BytesLike = ArrayLike<number> | string;


export function createFixtureDeployContract(
    root: BytesLike,
): () => Promise<{
    airdrop: Airdrop;
    token: MyToken;
}> {
    return deployments.createFixture(async function (hre) {
        const { Airdrop: airdropDeploy, MyToken: tokenDeploy } = await deployments.fixture();
        const airdropFactory = await hre.ethers.getContractFactory('Airdrop');
        const tokenFactory = await hre.ethers.getContractFactory('MyToken');
        const airdrop = airdropFactory.attach(airdropDeploy.address);
        const token = tokenFactory.attach(tokenDeploy.address);
        await airdrop.setRoot(root);
        return {
            airdrop,
            token
        }
  });
}

export const defaultDeploy = createFixtureDeployContract(defaultMerkleTree.getRoot());