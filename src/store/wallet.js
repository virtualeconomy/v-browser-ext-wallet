export default {
    namespaced: true,

    state: {
        lastLogin: false,
        walletAmount: false,
        sessionTimeout: false,
        networkByte: false,
        password: false,
        info: false
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
        }
    }

}
