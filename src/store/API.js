import Blockchain from '../js-v-sdk/src/blockchain.js'
import Account from '../js-v-sdk/src/account.js'
import { MAINNET_IP, TESTNET_IP } from "../store/network";

export default {
    namespaced: true,

    state: {
        chain: {},
        account: {}
    },
    mutations: {
        updateAPI(state, networkByte) {
            if (String.fromCharCode(networkByte) === 'M') {
                state.chain = new Blockchain(MAINNET_IP, networkByte)
            } else {
                state.chain = new Blockchain(TESTNET_IP, networkByte)
            }
            state.account = new Account(networkByte)
        }
    }

}
