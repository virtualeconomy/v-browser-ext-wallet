import { MAINNET_IP, TESTNET_IP } from '../store/network'

export default {
    namespaced: true,

    state: {
        lastLogin: false,
        walletAmount: false,
        sessionTimeout: false,
        networkByte: false,
        password: false,
        info: false,
        nodeUrl: '',
        testNodeUrl: '',
        webList:[]
    },
    mutations: {
        updateWallet(state, object) {
            state.networkByte = object.networkByte
            state.lastLogin = object.lastLogin
            state.walletAmount = object.walletAmount
            state.sessionTimeout = object.sessionTimeout
            state.info = object.info
            state.password = object.password
        },
        updatePassword(state, password) {
            state.password = password
        },
        updateWalletAmount(state) {
            state.walletAmount += 1
        },
        updateSettings(state, object) {
            state.networkByte = object.networkByte
            state.sessionTimeout = object.sessionTimeout
            if (String.fromCharCode(object.networkByte) === 'M') {
                state.nodeUrl = object.nodeUrl
            } else {
                state.testNodeUrl = object.nodeUrl
            }
        },
        initializeNode(state) {
            state.nodeUrl = state.nodeUrl ? state.nodeUrl : MAINNET_IP
            state.testNodeUrl = state.testNodeUrl ? state.testNodeUrl : TESTNET_IP
        },
        updateWebList(state, object) {
            state.webList.push(object)
        }
    }

}
