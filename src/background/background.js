import store from '../store'
import Blockchain from "../js-v-sdk/src/blockchain.js"
import Account from '../js-v-sdk/src/account.js'
import common from "js-v-sdk/src/utils/common.js"
import seedLib from "src/utils/seed"
import { MAINNET_IP, TESTNET_IP } from "../store/network"
import BigNumber from "bignumber.js"
import { VSYS_PRECISION, WITHDRAW_FUNCIDX_SPLIT, WITHDRAW_FUNCIDX, LOCK_CONTRACT_LOCK_FUNCIDX, DEPOSIT_FUNCIDX_SPLIT, DEPOSIT_FUNCIDX } from "js-v-sdk/src/constants"
import Transaction from "src/js-v-sdk/src/transaction"
import { TokenContractDataGenerator, LockContractDataGenerator, getContractFunctionIndex, NonFungibleTokenContractDataGenerator } from "src/js-v-sdk/src/data"
import * as ContractType from "src/js-v-sdk/src/contract_type"


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    let interactData = JSON.parse(window.localStorage.getItem('interactData'))
    if (!interactData) {
        resetInteractData()
    }
    if (request.action) {
        const action = request.action
        switch (action) {
            case "vsys-request":
                const data = request.force
                const webListData = {
                    siteName: request.origin,
                    siteIcon: request.siteImage,
                }
                resolveRequset(data, webListData).then(sendResponse)
                return true
        }
    }
    if (request.method && request.method === 'showAlert') {
        chrome.tabs.create({ url: chrome.extension.getURL('signup.html') })
    }

    //console.log(request, sender, sendResponse)
})

chrome.windows.onRemoved.addListener((windowId) => {
    let interactData = JSON.parse(window.localStorage.getItem('interactData'))
    if (windowId == interactData.windowId) {
        resetInteractData()
    }
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

function addWebList(siteData) {
    let storage = JSON.parse(window.localStorage.getItem("vuex"))
    if (siteData) {
        storage.wallet.webList.push(siteData)
        window.localStorage.setItem("vuex", JSON.stringify(storage))
    }
}

function resetInteractData() {
    let interactData = {
        isPopupOpened: false
    }
    window.localStorage.setItem('interactData', JSON.stringify(interactData))
}

function triggerUi(data) {
    let args = {
        "type": "popup",
        'url': 'confirmPopup.html'
    }
    let interactData = data
    interactData.type = 'confirm'
    interactData.isPopupOpened = true
    window.localStorage.setItem('interactData', JSON.stringify(interactData))
    chrome.windows.create(args)
}

function getConfirmResult() {
    return new Promise((resolve, reject) => {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.method && request.method === 'confirm') {
                resetInteractData()
                resolve(request.isConfirmed)
            }
        })
    })
}

async function resolveRequset(request, webListData) {
    const { wallet, networkByte, selectedAccount, mainnetTokenRecords, testnetTokenRecords } = getData()
    let interactData = JSON.parse(window.localStorage.getItem('interactData'))

    let res = {
        result: true,
        message: "OK"
    }
    if (!networkByte) {
        res.result = false
        res.message = "account is not created"
        return res
    }
    let apiAccount = new Account(networkByte)
    let chain
    if (String.fromCharCode(networkByte) === 'M') {
        chain = new Blockchain(MAINNET_IP, networkByte)
    } else {
        chain = new Blockchain(TESTNET_IP, networkByte)
    }
    const method = request.method

    if (method === "info") {
        res.name = "V Systems Browser Extension Wallet"
        res.version = chrome.app.getDetails().version
        res.network = String.fromCharCode(networkByte) === 'M' ? "Mainnet" : "Testnet"
        return res
    }
    if (!wallet.password) {
        res = {
            result: false,
            message: "account is locked"
        }
        return res
    }

    if (wallet.webList.findIndex(item => item.siteName == webListData.siteName) == -1 || wallet.webList == []) {
        if (confirm("Trust this site '" + webListData.siteName + "'?")) {
            addWebList(webListData)
        } else {
            res.message = 'User denied the website access extension wallet'
            res.result = false
            return res
        }
    }

    if (interactData.isPopupOpened) {
        chrome.windows.remove(Number(interactData.windowId));
        resetInteractData()
        res.message = 'Popup Closed'
        res.result = false
        return res
    }
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
            } catch (respError) {
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
            } catch (respError) {
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
                } catch (respError) {
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
            let contractId = common.tokenIDToContractID(tokenId)
            try {
                let response = await chain.getContractInfo(contractId)
                if (response.hasOwnProperty('error')) {
                    res.result = false
                    res.message = 'Invalid token!'
                } else {
                    if (response.type !== 'NonFungibleContract' && response.type !== 'TokenContract' && response.type !== 'TokenContractWithSplit') {
                        res.result = false
                        res.message = 'Invalid token!'
                    } else {
                        let tokenType = 'Token '
                        if (response.type === 'NonFungibleContract') {
                            tokenType = 'NFT '
                        } else if (response.type === 'TokenContractWithSplit') {
                            tokenType = 'Splittable Token '
                        }
                        if (confirm("Add " + tokenType + tokenId + " to your extension wallet?")) {
                            addToken(tokenId, tokenSymbol, networkByte)
                        } else {
                            res.message = 'User denied to add token'
                            res.result =  false
                        }
                    }
                }
            } catch (respError) {
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
            triggerUi(request)
            let confirmResult = await getConfirmResult()
            let params = request.params
            if (confirmResult) {
                let tra = new Transaction(networkByte)
                if (!request.params.tokenId) {
                    tra.buildPaymentTx(params.publicKey, params.recipient, params.amount, params.description, Date.now() * 1e6)
                } else {
                    let contractId = common.tokenIDToContractID(params.tokenId)
                    let isSplit, unity
                    try {
                        let response = await chain.getContractInfo(contractId)
                        isSplit = response.type === 'TokenContractWithSplit'
                    } catch (respError) {
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
                    } catch (respError) {
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
                    } catch (respError) {
                        res.result = false
                        res.message = "Failed to send VSYS"
                        console.log(respError)
                    }
                } else {
                    try {
                        let response = await chain.sendExecuteContractTx(sendTx)
                        res.transactionId = response.id
                    } catch (respError) {
                        res.result = false
                        res.message = "Failed to send Token"
                        console.log(respError)
                    }
                }
            } else {
                res.result = false
                res.message = 'User denied the action'
                return res
            }
            break
        case "sendNFT":
            if (!request.params || !request.params.publicKey || !request.params.recipient || !request.params.tokenId || !request.params.description) {
                res.result = false
                res.message = "Invalid params!"
                break
            }
            if (request.params.publicKey !== seed.keyPair.publicKey) {
                res.result = false
                res.message = "Inconsistent publicKey!"
                break
            }
            triggerUi(request)
            confirmResult = await getConfirmResult()
            if (confirmResult) {
                params = request.params
                contractId = common.tokenIDToContractID(params.tokenId)
                try {
                    let response = await chain.getContractInfo(contractId)
                    if (response.type !== 'NonFungibleContract') {
                        res.result = false
                        res.message = 'Not NFT token'
                        return res
                    }
                    console.log(response)
                } catch (respError) {
                    res.result = false
                    res.message = "Invalid params!"
                    break
                }
                try {
                    let response = await chain.getTokenInfo(params.tokenId)
                    if (response.hasOwnProperty('error')) {
                        res.result = false
                        res.message = response.message
                        console.log(response)
                        return res
                    }
                } catch (respError) {
                    res.result = false
                    res.message = "Failed to get Token Info"
                    console.log(respError)
                    return res
                }
                let tra = new Transaction(networkByte)
                let data_generator = new NonFungibleTokenContractDataGenerator()
                let timestamp = Date.now() * 1e6
                let attachment = params.description
                let function_index = getContractFunctionIndex(ContractType.NFT, 'SEND')
                let token_index = common.getTokenIndex(params.tokenId)
                let function_data = data_generator.createSendData(params.recipient, token_index)
                tra.buildExecuteContractTx(params.publicKey, contractId, function_index, function_data, timestamp, attachment)
                apiAccount.buildFromPrivateKey(seed.keyPair.privateKey)
                let signature = apiAccount.getSignature(tra.toBytes())
                let contract_tx = tra.toJsonForSendingTx(signature)
                try {
                    let response = await chain.sendExecuteContractTx(contract_tx)
                    res.transactionId = response.id
                } catch (respError) {
                    res.result = false
                    res.message = "Failed to send NFT Token"
                    console.log(respError)
                }

            } else {
                res.result = false
                res.message = 'User denied the action'
                return res
            }
            break
        case "lockToken":
            if (!request.params || !request.params.contractId || !request.params.publicKey || !request.params.lockTime) {
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
            let data_generator = new LockContractDataGenerator()
            let function_data = data_generator.createLockData(params.lockTime)
            let attachment = request.params.description ? request.params.description : ""
            let timestamp = Date.now() * 1e6
            let function_index = LOCK_CONTRACT_LOCK_FUNCIDX
            let tra = new Transaction(networkByte)
            tra.buildExecuteContractTx(params.publicKey, params.contractId, function_index, function_data, timestamp, attachment)
            apiAccount.buildFromPrivateKey(seed.keyPair.privateKey)
            let signature = apiAccount.getSignature(tra.toBytes())
            let sendTx = tra.toJsonForSendingTx(signature)
            try {
                let response = await chain.sendExecuteContractTx(sendTx)
                res.transactionId = response.id
            } catch (respError) {
                res.result = false
                res.message = "Failed to lock token"
                console.log(respError)
            }
            break
        case "withdrawToken":
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
            triggerUi(request)
            confirmResult = await getConfirmResult()
            if (confirmResult) {
                params = request.params
                let isSplit, unity, isNFT, tokenIndex
                let tokenContract
                try {
                    let response = await chain.getContractInfo(params.contractId)
                    let contractInfo = response.info
                    tokenId = false
                    for (let i = 0; i < contractInfo.length; i++) {
                        if (contractInfo[i]["name"] === 'tokenId' && contractInfo[i]["type"] === 'TokenId') {
                            tokenId = contractInfo[i]["data"]
                        }
                    }
                    if (!tokenId) {
                        res.result = false
                        res.message = "Could not find token info in this Contract"
                        break
                    }
                    tokenContract = common.tokenIDToContractID(tokenId)
                    response = await chain.getContractInfo(tokenContract)
                    isSplit = response.type === 'TokenContractWithSplit'
                    isNFT = response.type === 'NonFungibleContract'
                } catch (respError) {
                    res.result = false
                    res.message = "Failed to get Contract Info"
                    console.log(respError)
                    break
                }
                try {
                    let response = await chain.getTokenInfo(tokenId)
                    if (isNFT) {
                        if (response.hasOwnProperty('error')) {
                            res.result = false
                            res.message = response.message
                            console.log(response)
                            return res
                        }
                        tokenIndex = common.getTokenIndex(tokenId)
                    } else {
                        if (!response.hasOwnProperty('error') && response.unity) {
                            unity = BigNumber(response.unity)
                        } else {
                            res.result = false
                            res.message = "Failed to get Token Unit"
                            break
                        }
                    }
                } catch (respError) {
                    res.result = false
                    res.message = "Failed to get Token Info"
                    console.log(respError)
                    break
                }
                tra = new Transaction(networkByte)
                data_generator = isNFT ? new NonFungibleTokenContractDataGenerator() : new TokenContractDataGenerator()
                timestamp = Date.now() * 1e6
                attachment = request.params.description ? request.params.description : ""
                if (method === "withdrawToken") {
                    if (isNFT) {
                        function_index = getContractFunctionIndex(ContractType.NFT, 'WITHDRAW')
                        function_data = data_generator.createWithdrawData(params.contractId, seed.address, tokenIndex)
                    } else {
                        function_index = isSplit ? WITHDRAW_FUNCIDX_SPLIT : WITHDRAW_FUNCIDX
                        function_data = data_generator.createWithdrawData(params.contractId, seed.address, params.amount, unity)
                    }
                } else if (method === "depositToken") {
                    if (isNFT) {
                        function_index = getContractFunctionIndex(ContractType.NFT, 'DEPOSIT')
                        function_data = data_generator.createDepositData(seed.address, params.contractId, tokenIndex)
                    } else {
                        function_index = isSplit ? DEPOSIT_FUNCIDX_SPLIT : DEPOSIT_FUNCIDX
                        function_data = data_generator.createDepositData(seed.address, params.contractId, params.amount, unity)
                    }
                } else {
                    res.result = false
                    res.message = "Invalid method"
                    break
                }
                tra.buildExecuteContractTx(params.publicKey, tokenContract, function_index, function_data, timestamp, attachment);
                apiAccount.buildFromPrivateKey(seed.keyPair.privateKey)
                signature = apiAccount.getSignature(tra.toBytes())
                sendTx = tra.toJsonForSendingTx(signature)
                try {
                    let response = await chain.sendExecuteContractTx(sendTx)
                    res.transactionId = response.id
                } catch (respError) {
                    res.result = false
                    res.message = "Failed to " + method
                    console.log(respError)
                }
            } else {
                res.result = false
                res.message = 'User denied the action'
                return res
            }
            break
    }
    return res
}

