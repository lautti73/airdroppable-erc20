import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const airdropDeploy = await hre.deployments.getOrNull("Airdrop");
  if (airdropDeploy === null) throw new Error("Airdrop not deployed");
  const tokenDeploy = await hre.deployments.getOrNull("MyToken");
  if (tokenDeploy === null) throw new Error("Token not deployed");
  const airdropFactory = await hre.ethers.getContractFactory('Airdrop');
  const airdrop = await airdropFactory.attach(airdropDeploy.address);
  await airdrop.setToken(tokenDeploy.address);
  console.log(`Token setted to: ${tokenDeploy.address}`)
};
export default deployFunc;

deployFunc.id = "setToken"; // id required to prevent reexecution