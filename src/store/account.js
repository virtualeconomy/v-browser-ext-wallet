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
        updateSelectedAccount(state, newAccountInfo) {
            state.selectedAccount = newAccountInfo.index
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    notification: "accountsChanged",
                    data: [newAccountInfo.address]
                });
            });
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
        updateAccountName(state, accountNames) {
            let temp = state.accountNames
            temp[accountNames.index] = accountNames.name
            state.accountNames = null
            state.accountNames = temp
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
