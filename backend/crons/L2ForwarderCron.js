const cron = require('node-cron');
const ProofInfoModel = require('../models/proofInfo');
const ethers = require('ethers');
const forwarderAddr = "";

module.exports = executeCron = () => {
    let isRunning = false;

    const provider = new ethers.Providers.JsonRpcProvider(process.env.goerliProvider);
    const registry = new ethers.Contract(forwarderAddr, [
        "function forward(bytes32 id, uint256 starknetReceiver) public",
    ], provider);
    registry.connect(account);

    cron.schedule('*/5 * * * *', async () => { //every 5 minutes
        if (isRunning) {
            return;
        }

        isRunning = true;
        let proofInfo = await ProofInfoModel.find({ status: 'pending' });
        

        for (let i = 0; i < proofInfo.length; i++) {
            proofInfo[i].status = 'processing';
            await registry.forward(proofInfo[i].fact, proofInfo[i].starknetReceiver);
        }
    });
}

