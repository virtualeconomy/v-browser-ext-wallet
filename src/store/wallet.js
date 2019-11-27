export default {
    namespaced: true,

    state: {
        lastLogin: false,
        walletAmount: false,
        sessionTimeout: false,
        password: false,
        info: false
    },
    mutations: {
        updateWallet(state, object) {
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
        }
    }

}
