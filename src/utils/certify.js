"use strict";
// make sure to add official token svg in src/assets/imgs/icons/token with 'tokenName.svg' format
import store from '../store'
var certifiedTokensList = {
    Mainnet: {
        'TWZZfKFqcaNVe5TrphLRNEm5DQFnBRJMjDDByqv84': {'name' : 'IPX', 'support_split': false, 'unity': 1000000000 }
    },
    Testnet: {
        'TWscu6rbRF2PEsnY1bRky4aKxxKTzn69WMFLFdLxK': {'name' : 'DM', 'support_split': true, 'unity': 1000 },
        'TWuyTczrVc4KeDUBpksxY8bpcogKfKqoVGE7cwcs3': {'name': 'VTEST', 'support_split': true, 'unity': 100000 },
        'TWtSxBEx7rmsQ34MyWzwBCYYwRJh4K9xsL9zPkMK8': {'name': 'DLL', 'support_split': false, 'unity': 100000000 }
    },
}
export default{
    certifiedTokensList
}
