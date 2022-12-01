require("@nomicfoundation/hardhat-toolbox");
require("@shardlabs/starknet-hardhat-plugin");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    testnet2: {
        url: "https://alpha4-2.starknet.io"
    },
  },
  starknet: {
    dockerizedVersion: "0.10.1",
    network: "integrated-devnet",

    // network: "integrated-devnet"
  },
};
