import Blockchain from '../js-v-sdk/src/blockchain.js'
const NETWORK_BYTE = 'T'.charCodeAt(0);
const NODE_IP = 'http://test.v.systems:9922';
export default {
    namespaced: true,

    state: {
        chain: new Blockchain(NODE_IP, NETWORK_BYTE)
    }

}
