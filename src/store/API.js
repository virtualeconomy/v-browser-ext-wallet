import Blockchain from '../js-v-sdk/src/blockchain.js'
import Account from '../js-v-sdk/src/account.js'
import { MAINNET_IP, TESTNET_IP } from '../store/network'

export default {
    namespaced: true,

    state: {
        chain: {},
        account: {}
    },
    mutations: {
        updateAPI(state, object) {
            state.chain = new Blockchain(object.nodeUrl, object.networkByte)
            state.account = new Account(object.networkByte)
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    notification: "chainChanged",
                    data: {
                        nodeUrl: apiData.nodeUrl,
                        networkType: String.fromCharCode(apiData.networkByte)
                    }
                });
            });
        }
    }
}
