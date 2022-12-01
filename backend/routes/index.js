require('dotenv').config()
var express = require('express');
var router = express.Router();
const { writeFile, existsSync, mkdirSync, writeFileSync } = require('fs')
const {
  exec
} = require('child_process');
const crypto = require('crypto');
const { utils } = require('ethers');
const ProofInfoModel = require('../models/proofInfo');
const privateKey = "63054644616643010525550083960471207580205191405713439021959523110256087973"
const accountAddress = "0x02bd4201Dd1D89a42258B6e491760B031daD2D53cEE3D75D03b69d830C2Eeb7e";
const registryAddr = "0x02224fbbc5fbcc5489f8e1d492bf734c8d79c50d7a295bee5049c9d7259de5be"
// const privateKey = "0xdb85306f008d1af0cdee0a7294c4d8fd"
// const accountAddress = "0x733655c0dbe509fd10d7ff8dd260eb209d163c97509f9bc14d924cf038dd222";
// const registryAddr = "0x02224fbbc5fbcc5489f8e1d492bf734c8d79c50d7a295bee5049c9d7259de5be"
const {
  Account,
  Contract,
  Provider,
  ec,
} = require("starknet");
const ABI = require('../static/registry_abi.json');


router.post('/conditions', async (req, res, next) => {
  let { min, max } = req.body;
  let id = utils.solidityKeccak256(['uint256', 'uint256'], [max, min]);
  id = id.substring(0, 20);
  const starkKeyPair = ec.getKeyPair(privateKey);

  const provider = new Provider({
    sequencer: {
      baseUrl: process.env.nodeUrl,
      feederGatewayUrl: 'feeder_gateway',
      gatewayUrl: 'gateway',
    }
  })

  const account = new Account(provider, accountAddress, starkKeyPair);

  const registry = new Contract(ABI, registryAddr, provider)
  registry.connect(account);

  let { transaction_hash } = await registry.setInfo(id, [max, min]);

  res.send({
    id,
    transaction_hash
  })

})

router.post('/comparator/postProof', async (req, res, next) => {
  let { id, inputValue, starknetReceiver } = req.body

  const provider = new Provider({
    sequencer: {
      baseUrl: process.env.nodeUrl,
      feederGatewayUrl: 'feeder_gateway',
      gatewayUrl: 'gateway',
    }
  })
  const registry = new Contract(ABI, registryAddr, provider)
  const [params] = await registry.getInfo(id);
  const { max, min } = params;
  let uuid = crypto.randomUUID()
  console.log(min.toNumber(), max.toNumber(), uuid)

  if (!existsSync('../cairoInputs')) {
    mkdirSync('../cairoInputs')
  }

  writeFileSync(`../cairoInputs/${uuid}.json`, JSON.stringify({
    max: max.toNumber(),
    min: min.toNumber(),
    inputValue
  }))
  const pathToInput = `../cairoInputs/${uuid}.json`

  const command = `cairo-sharp submit --source /home/seshanth/code/hackathons/starknetcc_2022/proj/cairo/comparator.cairo --program_input ${pathToInput}`

  exec(command, async (error, stdout, stderr) => {
    console.log(error, stdout, stderr)
    if (stderr) {
      res.status(500).send({
        error: extractSHARPErrors(stderr)
      })
    } else {
      console.log(stdout)
      const { fact, jobKey } = extractFactAndJobKey(stdout)
      await ProofInfoModel.create({
        proofKey: id,
        min,
        max,
        inputValue,
        starknetReceiver,
        uuid,
        status: 'pending',
        fact: fact,
        jobKey: jobKey
      })


      res.send({
        message: 'ok',
        uuid,
        jobKey
      })
    }
  })
})


router.get('/status', async (req, res, next) => {
  let { jobKey } = req.query

  if (!jobKey) {
    res.status(400).send({
      error: 'jobKey is required'
    })
  }

  const command = `cairo-sharp status ${jobKey}`
  exec(command, (error, stdout, stderr) => {
    if (stderr) {
      res.status(500).send({
        error: stderr
      })
    } else {
      console.log(stdout)
      res.send({
        message: 'ok',
        stdout
      })
    }
  })
})

const extractFactAndJobKey = (stdout) => {
  const arr = stdout.split('\n')
  const fact = (arr[5].split(' ')[1]).trim()
  const jobKey = (arr[4].split(' ')[2]).trim()

  return { fact, jobKey }
}

const extractSHARPErrors = (stderr) => {
  const arr = stderr.split('\n')
  console.log(arr)
  const errors = arr.filter((item) => item.includes('Error'))
  return errors
}

module.exports = router;