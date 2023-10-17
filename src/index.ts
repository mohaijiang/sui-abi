#!/usr/bin/env node
const { program } = require('commander');
const axios = require('axios');

program
    .option('-n --network <value>',"网络: devnet,testnet");

program.parse();

const options = program.opts();
const network = options.network? options.network: "testnet";

const rpcUrl = `https://explorer-rpc.${network}.sui.io/`

console.log("network: ",network)
const address = program.args[0]
console.log("address: ", address)
console.log("")

let promise1 = axios.post(
    rpcUrl,
    {"jsonrpc":"2.0","id":"2","method":"sui_getObject","params":[address,{"showType":true,"showContent":true,"showOwner":true,"showPreviousTransaction":true,"showStorageRebate":true,"showDisplay":true}]}
)
let promise2 = axios.post(
    rpcUrl,
    {"jsonrpc":"2.0","id":"4","method":"sui_getNormalizedMoveModule","params":[address,"color_object"]}
)

Promise.all([promise1,promise2]).then(results => {
    const resp1 = results[0].data
    const resp2 = results[1].data

    resp1.result.data.content.disassembled = resp2.result.exposedFunctions

    console.log(JSON.stringify(resp1))
}).catch(err => {
    console.log("err:", err)
})
