require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();
require("./tasks");
require("hardhat-deploy")
require("hardhat-deploy-ethers");
require("@nomicfoundation/hardhat-ethers");
const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  mocha: {
    timeout: 300000
  },
  networks: {
    // hardhat: {
    //   chainId: 1337,
    // },
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    }
  },
  namedAccounts: {
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    },
  },
  gasReporter: {
    enabled: true
  }
};
