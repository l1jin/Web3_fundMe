const { ethers } = require("hardhat")
require("@chainlink/env-enc").config();
/**
 * 已将这些逻辑封装成了task
 * 1. 部署合约  验证合约
 * 2. 合约交互
 */
async function main() {
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


  // init 2 accounts
  const [firstAccount, secondAccount] = await ethers.getSigners() // 获取两个账户
  // fund contract with first account 第一个账号调用fund函数
  const fundTx = await fundMe.fund({ value: ethers.parseEther("0.5") }) // 转0.5个ETH
  await fundTx.wait() // 等待交易确认

  // check balance of contract 查询合约余额
  const contractBalance = await ethers.provider.getBalance(fundMe.target) // 获取合约余额
  console.log("Contract Balance is:", contractBalance.toString())

  // fund contract with second account 第二个账号调用fund函数
  const fundTx2 = await fundMe.connect(secondAccount).fund({ value: ethers.parseEther("0.05") }) // 转0.05个ETH
  await fundTx2.wait() // 等待交易确认

  // check balance of contract 查询合约余额
  const contractBalance2 = await ethers.provider.getBalance(fundMe.target) // 获取合约余额
  console.log("Contract Balance is:", contractBalance2.toString())

  // check mapping 查看mapping里的数据是否有变化
  const firstAccountBalance = await fundMe.fundersToAmount(firstAccount.address) // 获取mapping中第一个账号的众筹余额
  const secondAccountBalance = await fundMe.fundersToAmount(secondAccount.address) // 获取mapping中第二个账号的众筹余额
  console.log(` Balance of First Account ${firstAccount.address} is: ${firstAccountBalance.toString()}`)
  console.log(` Balance of Second Account ${secondAccount.address} is: ${secondAccountBalance.toString()}`)
}
async function verifyContract(address, args) {
  // 脚本验证合约
  await hre.run("verify:verify", {
    address: address,
    constructorArguments: args,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })