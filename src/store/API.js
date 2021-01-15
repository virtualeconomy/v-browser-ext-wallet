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
        }
    }
}
