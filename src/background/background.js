import store from '../store'
import Blockchain from "../js-v-sdk/src/blockchain.js"
import Account from '../js-v-sdk/src/account.js'
import common from "js-v-sdk/src/utils/common.js"
import seedLib from "src/utils/seed"
import { MAINNET_IP, TESTNET_IP } from "../store/network"
import BigNumber from "bignumber.js"
import { VSYS_PRECISION, WITHDRAW_FUNCIDX_SPLIT, WITHDRAW_FUNCIDX } from "js-v-sdk/src/constants"
import Transaction from "src/js-v-sdk/src/transaction"
import { TokenContractDataGenerator, LockContractDataGenerator, PaymentChannelContractDataGenerator} from "src/js-v-sdk/src/data"
import { constants } from "src/js-v-sdk/src";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action) {
        const action = request.action
        switch (action) {
            case "vsys-request":
                const data = request.force
                resolveRequset(data).then(sendResponse)
                return true
        }
    }
    if (request.method && request.method === 'showAlert') {
        chrome.tabs.create({ url: chrome.extension.getURL('signup.html')})
    }
    //console.log(request, sender, sendResponse)
})

function getData() {
    let storage = JSON.parse(window.localStorage.getItem("vuex"))
    let data = {
        wallet: storage.wallet,
        networkByte: storage.wallet.networkByte,
        selectedAccount: storage.account.selectedAccount,
        mainnetTokenRecords: storage.account.mainnetTokenRecords,
        testnetTokenRecords: storage.account.testnetTokenRecords
    }
    return data
}

function addToken(tokenId, tokenSymbol, networkByte) {
    let storage = JSON.parse(window.localStorage.getItem("vuex"))
    if (String.fromCharCode(networkByte) === 'T') {
        storage.account.testnetTokenRecords[tokenId] = tokenSymbol
    } else if (String.fromCharCode(networkByte) === 'M') {
        storage.account.mainnetTokenRecords[tokenId] = tokenSymbol
    }
    window.localStorage.setItem("vuex", JSON.stringify(storage))
}

function getSeed(wallet, selectedAccount) {
    let secretInfo = JSON.parse(
        seedLib.decryptSeedPhrase(wallet.info, wallet.password))
    let seedPhrase = seedLib.decryptSeedPhrase(secretInfo.encrSeed, wallet.password)
    return seedLib.fromExistingPhrasesWithIndex(seedPhrase, selectedAccount, wallet.networkByte)
}

async function resolveRequset(request) {
    const { wallet, networkByte, selectedAccount, mainnetTokenRecords, testnetTokenRecords } = getData()
    let apiAccount = new Account(networkByte)
    let chain
    if (String.fromCharCode(networkByte) === 'M') {
        chain = new Blockchain(MAINNET_IP, networkByte)
    } else {
        chain = new Blockchain(TESTNET_IP, networkByte)
    }
    let res = {
        result: true,
        message: "OK"
    }
    if (!wallet.password) {
        res = {
            result: false,
            message: "account is locked"
        }
        return res
    }

    const method = request.method
    let seed = getSeed(wallet, selectedAccount)
    switch (method) {
        case "address":
            res.address = seed.address
            break
        case "publicKey":
            res.address = seed.address
            res.publicKey = seed.keyPair.publicKey
            break
        case "amount":
            res.address = seed.address
            try {
                let response = await chain.getBalanceDetail(res.address)
                res.amount = BigNumber(response.available).dividedBy(VSYS_PRECISION).toString()
                // console.log(res.amount)
            } catch(respError) {
                res.result = false
                res.message = "Failed to get amount from chain"
                console.log(respError)
            }
            break
        case "tokenAmount":
            if (!request.params || !request.params.tokenId) {
                res.result = false
                res.message = "Invalid params!"
                break
            }
            res.address = seed.address
            res.tokenId = request.params.tokenId
            try {
                let response = await chain.getTokenBalance(res.address, res.tokenId)
                res.amount = BigNumber(response.balance).dividedBy(response.unity).toString()
            } catch(respError) {
                res.result = false
                res.message = "Failed to get tokenAmount from chain"
                console.log(respError)
            }
            break
        case "watchedTokens":
            let tokenRecords
            if (String.fromCharCode(networkByte) === 'T') {
                tokenRecords = testnetTokenRecords
            } else if (String.fromCharCode(networkByte) === 'M') {
                tokenRecords = mainnetTokenRecords
            } else {
                res.result = false
                res.message = "No tokens found"
                break
            }
            let tokens = []
            for (let tokenId in tokenRecords) {
                let token = {
                    tokenId: tokenId,
                    contractId: common.tokenIDToContractID(tokenId)
                }
                try {
                    //TODO: save ContractInfo in local storage when add token in watch list
                    let response = await chain.getContractInfo(token.contractId)
                    token.contractType = response.type
                } catch(respError) {
                    token.contractType = "Unknown"
                    console.log(respError)
                }
                tokens.push(token)
            }
            res.token = tokens
            break
        case "addToken":
            if (!request.params || !request.params.tokenId || !request.params.tokenSymbol) {
                res.result = false
                res.message = "Invalid params!"
                break
            }
            let tokenId = request.params.tokenId
            const tokenSymbol = request.params.tokenSymbol
            try {
                let response = await chain.getTokenInfo(tokenId)
                if (response.hasOwnProperty('error')) {
                    res.result = false
                    res.message = "Invalid token!"
                } else {
                    addToken(tokenId, tokenSymbol, networkByte)
                }
            } catch(respError) {
                res.result = false
                res.message = "Invalid token!"
            }
            break
        case "send":
            if (!request.params || !request.params.publicKey || !request.params.amount || !request.params.description || !request.params.recipient) {
                res.result = false
                res.message = "Invalid params!"
                break
            }
            if (request.params.publicKey !== seed.keyPair.publicKey) {
                res.result = false
                res.message = "Inconsistent publicKey!"
                break
            }
            let params = request.params
            let tra = new Transaction(networkByte)
            if (!request.params.tokenId) {
                tra.buildPaymentTx(params.publicKey, params.recipient, params.amount, params.description, Date.now() * 1e6)
            } else {
                let contractId = common.tokenIDToContractID(params.tokenId)
                let isSplit, unity
                try {
                    let response = await chain.getContractInfo(contractId)
                    isSplit = response.type === 'TokenContractWithSplit'
                } catch(respError) {
                    res.result = false
                    res.message = "Failed to get Contract Info"
                    console.log(respError)
                }
                try {
                    let response = await chain.getTokenInfo(params.tokenId)
                    if (!response.hasOwnProperty('error') && response.unity) {
                        unity = BigNumber(response.unity)
                    } else {
                        res.result = false
                        res.message = "Failed to get Token Unit"
                    }
                } catch(respError) {
                    res.result = false
                    res.message = "Failed to get Token Info"
                    console.log(respError)
                }
                tra.buildSendTokenTx(params.publicKey, params.tokenId, params.recipient, params.amount, unity, isSplit, params.description)
            }
            apiAccount.buildFromPrivateKey(seed.keyPair.privateKey)
            let signature = apiAccount.getSignature(tra.toBytes())
            let sendTx = tra.toJsonForSendingTx(signature)
            if (!request.params.tokenId) {
                try {
                    let response = await chain.sendPaymentTx(sendTx)
                    res.transactionId = response.id
                } catch(respError) {
                    res.result = false
                    res.message =  "Failed to send VSYS"
                    console.log(respError)
                }
            } else {
                try {
                    let response = await chain.sendExecuteContractTx(sendTx)
                    res.transactionId = response.id
                } catch(respError) {
                    res.result = false
                    res.message =  "Failed to send Token"
                    console.log(respError)
                }
            }
            break
        case "lockToken":
            if (!request.params || !request.params.contractId || !request.params.publicKey) {
                res.result = false
                res.message = "Invalid params!"
                break
            }
            //TODO
            res.transactionId = "2dSYyPQuh44J6ExxxxxxxNcEU4q4iLiVcahVc4n"
            break
        case "withdrawToken":
            if (!request.params || !request.params.contractId || !request.params.publicKey || !request.params.amount) {
                res.result = false
                res.message = "Invalid params!"
                break
            }
            if (request.params.publicKey !== seed.keyPair.publicKey) {
                res.result = false
                res.message = "Inconsistent publicKey!"
                break
            }
            params = request.params
            let isSplit, unity
            tokenId = common.contractIDToTokenID(params.contractId)
            try {
                let response = await chain.getContractInfo(params.contractId)
                isSplit = response.type === 'TokenContractWithSplit'
            } catch(respError) {
                res.result = false
                res.message = "Failed to get Contract Info"
                console.log(respError)
            }
            try {
                let response = await chain.getTokenInfo(tokenId)
                if (!response.hasOwnProperty('error') && response.unity) {
                    unity = BigNumber(response.unity)
                } else {
                    res.result = false
                    res.message = "Failed to get Token Unit"
                }
            } catch(respError) {
                res.result = false
                res.message = "Failed to get Token Info"
                console.log(respError)
            }
            tra = new Transaction(networkByte)
            let data_generator = new TokenContractDataGenerator()
            let timestamp = Date.now() * 1e6
            let attachment = ""
            let function_index = isSplit ? WITHDRAW_FUNCIDX_SPLIT : WITHDRAW_FUNCIDX
            let function_data = data_generator.createWithdrawData(params.contractId, seed.address, params.amount, unity)
            tra.buildExecuteContractTx(params.publicKey, params.contractId, function_index, function_data, timestamp, attachment);
            apiAccount.buildFromPrivateKey(seed.keyPair.privateKey)
            signature = apiAccount.getSignature(tra.toBytes())
            sendTx = tra.toJsonForSendingTx(signature)
            try {
                let response = await chain.sendExecuteContractTx(sendTx)
                res.transactionId = response.id
            } catch(respError) {
                res.result = false
                res.message =  "Failed to withdraw token"
                console.log(respError)
            }
            break
        case "depositToken":
            if (!request.params || !request.params.contractId || !request.params.publicKey || !request.params.amount) {
                res.result = false
                res.message = "Invalid params!"
                break
            }
            if (request.params.publicKey !== seed.keyPair.publicKey) {
                res.result = false
                res.message = "Inconsistent publicKey!"
                break
            }
            params = request.params
            tokenId = common.contractIDToTokenID(params.contractId)
            try {
                let response = await chain.getContractInfo(params.contractId)
                isSplit = response.type === 'TokenContractWithSplit'
            } catch(respError) {
                res.result = false
                res.message = "Failed to get Contract Info"
                console.log(respError)
            }
            try {
                let response = await chain.getTokenInfo(tokenId)
                if (!response.hasOwnProperty('error') && response.unity) {
                    unity = BigNumber(response.unity)
                } else {
                    res.result = false
                    res.message = "Failed to get Token Unit"
                }
            } catch(respError) {
                res.result = false
                res.message = "Failed to get Token Info"
                console.log(respError)
            }
            tra = new Transaction(networkByte)
            data_generator = new TokenContractDataGenerator()
            timestamp = Date.now() * 1e6
            attachment = ""
            function_index = isSplit ? DEPOSIT_FUNCIDX_SPLIT : DEPOSIT_FUNCIDX
            function_data = data_generator.createDepositData(seed.address, params.contractId, params.amount, unity)
            tra.buildExecuteContractTx(params.publicKey, params.contractId, function_index, function_data, timestamp, attachment);
            apiAccount.buildFromPrivateKey(seed.keyPair.privateKey)
            signature = apiAccount.getSignature(tra.toBytes())
            sendTx = tra.toJsonForSendingTx(signature)
            try {
                let response = await chain.sendExecuteContractTx(sendTx)
                res.transactionId = response.id
            } catch(respError) {
                res.result = false
                res.message =  "Failed to deposit token"
                console.log(respError)
            }
            break
    }
    return res
}
