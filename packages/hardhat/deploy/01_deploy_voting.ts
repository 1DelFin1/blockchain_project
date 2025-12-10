import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const proposalNames = ["Option A", "Option B", "Option C"];

  await deploy("Voting", {
    from: deployer,
    args: [proposalNames],
    log: true,
    autoMine: true,
  });
};

export default func;
func.tags = ["Voting"];
