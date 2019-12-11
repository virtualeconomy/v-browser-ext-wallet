export default {
    namespaced: true,

    state: {
        accountNames: ['Account 1'],
        selectedAccount: 0,
        selectedToken: 'VSYS',
        testnetTokenRecords: {},
        mainnetTokenRecords: {}
    },

    mutations: {
        addAccount(state, account) {
            state.accountNames.push(account)
        },
        updateSelectedAccount(state, index) {
            state.selectedAccount = index
        },
        updateToken(state, tokenRecordsInfo) {
            if (String.fromCharCode(tokenRecordsInfo.networkByte) === 'M') {
                state.mainnetTokenRecords = tokenRecordsInfo.tokens
            } else {
                state.testnetTokenRecords = tokenRecordsInfo.tokens
            }
        },
        updateSelectedToken(state, tokenId) {
            state.selectedToken = tokenId
        },
        initializeAccount(state) {
            state.accountNames = ['Account 1']
            state.selectedAccount = 0
            state.selectedToken = 'VSYS'
            state.testnetTokenRecords = {}
            state.mainnetTokenRecords = {}
        }
    }

}
