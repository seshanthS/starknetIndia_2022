const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProofInfo = new Schema({
    id: ObjectId,
    proofKey: String,
    min: Number,
    max: Number,
    inputValue: Number,
    starknetReceiver: String,
    uuid: String,
    date: { type: Date, default: Date.now },
    status: String,
    fact: String,
    jobKey: String
});

mongoose.model('ProofInfo', ProofInfo);