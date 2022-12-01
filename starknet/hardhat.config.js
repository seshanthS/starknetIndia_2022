require('dotnet').config();
require("@nomicfoundation/hardhat-toolbox");
require("@shardlabs/starknet-hardhat-plugin");
require('hardhat-deploy');


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.13",
  networks: {
    testnet2: {
        url: "https://alpha4-2.starknet.io"
    },

    goerli: {
        url: process.env.goerliRPC,
        accounts: [`0x${process.env.privateKey}`]
    }
  },
  starknet: {
    dockerizedVersion: "0.10.1",
    network: "integrated-devnet",

    // network: "integrated-devnet"
  },
};
