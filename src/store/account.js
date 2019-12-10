export default {
    namespaced: true,

    state: {
        accountNames: ['Account 1'],
        selectedAccount: 0,
        selectedToken: 'VSYS',
        tokenRecords: {}
    },

    mutations: {
        addAccount(state, account) {
            state.accountNames.push(account)
        },
        updateSelectedAccount(state, index) {
            state.selectedAccount = index
        },
        updateToken(state, tokenRecordsInfo) {
            state.tokenRecords = tokenRecordsInfo
        },
        updateSelectedToken(state, tokenId) {
            state.selectedToken = tokenId
        }
    }

}
