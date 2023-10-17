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






async function  main() {
    let resp1 = await axios.post(
        rpcUrl,
        {"jsonrpc":"2.0","id":"2","method":"sui_getObject","params":[address,{"showType":true,"showContent":true,"showOwner":true,"showPreviousTransaction":true,"showStorageRebate":true,"showDisplay":true}]}
    )

    let mainData = resp1.data

    // console.log(JSON.stringify(mainData.result.data.content.disassembled))
    for (const key in mainData.result.data.content.disassembled) {
        const methodAbi = await axios.post(
            rpcUrl,
            {"jsonrpc":"2.0","id":"4","method":"sui_getNormalizedMoveModule","params":[address,key]}
        )
        mainData.result.data.content.disassembled[key] = methodAbi.data.result.exposedFunctions
    }

    console.log(JSON.stringify(mainData))


}

main().then()
