"use strict";
// make sure to add official token svg in src/static/token with 'tokenName.svg' format
const certifiedTokensList = {
    Mainnet: {
        'TWZZfKFqcaNVe5TrphLRNEm5DQFnBRJMjDDByqv84': { name: 'IPX', iconUrl: '../../static/icons/token/IPX.svg', contractType: 'TokenContract' },
        'TWaN4DqnRMdUS5d1ohCn9Vh9VdGWDLm9Um1jHbQiF': { name: 'BlockDesk', iconUrl: '../../static/icons/token/BlockDesk.png', contractType: 'TokenContract' },
        'TWZ3nPYyCJAJJmfJBzxcqe8ZfpYJMQK4dpiQ1m6v4': { name: 'GoldZip', iconUrl: '../../static/icons/token/GoldZip.jpg', contractType: 'TokenContractWithSplit' },
        'TWar6LKVSYRwxkEZ3Viqa1QAZeq25w93WmHAbppbf': { name: 'OCT', iconUrl: '../../static/icons/token/OCT.jpg', contractType: 'TokenContract' }
    },
    Testnet: {
        'TWscu6rbRF2PEsnY1bRky4aKxxKTzn69WMFLFdLxK': { name: 'DM', iconUrl: '../../static/icons/token/DM.svg', contractType: 'TokenContractWithSplit' },
        'TWuyTczrVc4KeDUBpksxY8bpcogKfKqoVGE7cwcs3': { name: 'VTest', iconUrl: '../../static/icons/token/VTest.svg', contractType: 'TokenContractWithSplit' },
        'TWtSxBEx7rmsQ34MyWzwBCYYwRJh4K9xsL9zPkMK8': { name: 'DLL', iconUrl: '../../static/icons/token/DLL.svg', contractType: 'TokenContract' }
    }
}
export default{
    certifiedTokensList
}
