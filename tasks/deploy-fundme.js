const { task } = require("hardhat/config");

task('deploy-fundme', 'deploy and verify FundMe contract')
  .setAction(async (taskArgs, hre) => {
    const contract = await ethers.getContractFactory("FundMe")
    const fundMe = await contract.deploy(300)
    await fundMe.waitForDeployment()
    console.log("FundMe deployed to:", fundMe.target)

    // verify the contract on Etherscan
    // 如果是Sepolia测试网络，并且设置了ETHERSCAN_API_KEY，则进行合约验证  11155111是Sepolia的chainId
    if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
      console.log('Waiting for 5 confirmations...');
      await fundMe.deploymentTransaction().wait(5) // Wait for 5 confirmations 等待5个区块
      await verifyContract(fundMe.target, [300])
    } else {
      console.log("verification skipped..");
    }
  })

async function verifyContract(address, args) {
  // 脚本验证合约
  await hre.run("verify:verify", {
    address: address,
    constructorArguments: args,
  });
}