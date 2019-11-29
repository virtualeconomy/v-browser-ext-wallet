import Blockchain from '../js-v-sdk/src/blockchain.js'
import { MAINNET_IP, TESTNET_IP } from "../store/network";

export default {
    namespaced: true,

    state: {
        chain: {},
    },
    mutations: {
        updateChain(state, networkByte) {
            console.log(networkByte)
            if (String.fromCharCode(networkByte) === 'M') {
                state.chain = new Blockchain(MAINNET_IP, networkByte)
            } else {
                state.chain = new Blockchain(TESTNET_IP, networkByte)
            }
        }
    }

}
