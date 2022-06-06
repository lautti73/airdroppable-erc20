import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const airdropDeploy = await hre.deployments.getOrNull("Airdrop");
  if (airdropDeploy === null) throw new Error("Airdrop not deployed");
  await deploy("MyToken", {
    from: deployer,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        methodName: 'initialize',
        args: ['MTK', 'MyToken', airdropDeploy.address ],
      },
    },
  });
};
export default deployFunc;

deployFunc.id = "deployed_Token"; // id required to prevent reexecution
