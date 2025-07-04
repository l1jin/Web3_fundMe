const { task } = require("hardhat/config");

task('interact-fundme', 'interact with FundMe contract')
  .addParam("addr", "fundme contract address")  // 添加参数，指定合约地址 addr是参数名
  .setAction(async (taskArgs, hre) => {
    const contract = await ethers.getContractFactory("FundMe");
    const fundMe = await contract.attach(taskArgs.addr);
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
  })
