const hre = require("hardhat");

async function main() {
  const AccessControlLite = await hre.ethers.getContractFactory("AccessControlLite");
  const contract = await AccessControlLite.deploy();
  await contract.waitForDeployment();

  console.log("Deployed to:", await contract.getAddress());
  console.log("Owner:", await contract.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
