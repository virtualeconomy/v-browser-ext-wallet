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
            let isChanged = JSON.stringify(state.chain) !== "{}" && state.chain.host_ip !== object.nodeUrl
            state.chain = new Blockchain(object.nodeUrl, object.networkByte)
            state.account = new Account(object.networkByte)
            if (isChanged) {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        notification: "chainChanged",
                        data: {
                            nodeUrl: object.nodeUrl,
                            networkType: String.fromCharCode(object.networkByte)
                        }
                    });
                });
            }
        }
    }
}
