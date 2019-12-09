<template>
    <div class="records">
        <div class="his-pane">
            <p class="his-txt">History</p>
            <div class="view"><p>View on Explorer</p><b-btn variant="link" @click="viewOnExplorer"><img width="6" height="10" src="../../static/icons/ic_arrow_right@2x.png"/></b-btn></div>
        </div>
        <transaction-record v-for="txRecord in txRecords"
                            :tx-record="txRecord"
                            :address="address"
                            :current-height="currentHeight"
                            class="transaction-record"></transaction-record>
        <img height="50"
             width="50"
             class="wait-icon"
             v-if="showDisable"
             src="../../static/icons/ic_wait.svg">
        <div v-if="Object.keys(txRecords).length === 0 && !showDisable"
             class="empty">
          There is no transaction record.
        </div>
    </div>
</template>

<script>
import TransactionRecord from './TransactionRecord.vue'
import { EXECUTE_CONTRACT_TX, PAYMENT_TX } from '../js-v-sdk/src/constants'
import common from '../js-v-sdk/src/utils/common'
import { mapState } from 'vuex'
import { ADDRESS_TEST_EXPLORER, ADDRESS_EXPLORER } from '../store/network.js'
import Vue from 'vue'
import base58 from 'base-58'
import BigNumber from 'bignumber.js'
import convert from '../js-v-sdk/src/utils/convert'
export default {
    name: "TransactionRecords",
    components: {
        TransactionRecord
    },
    created() {
        this.getTxRecords()
        this.getCurrentHeight()
    },
    data: function() {
        return {
            txRecords: {},
            currentHeight: 0,
            showDisable: false
        }
    },
    props: {
        address: {
            type: String,
            require: true,
            default: ''
        },
        networkByte: {
            type: Number,
            require: true,
            default: 84
        },
        tokenName: {
            type: String,
            require: true,
            default: 'VSYS'
        },
        tokenBalances: {
            type: Object,
            require: true,
            default: function() {}
        },
        tokenRecords: {
            type: Object,
            require: true,
            default: function() {}
        }
    },
    computed: {
        ...mapState({
            chain: state => state.API.chain
        })
    },
    methods: {
        getCurrentHeight() {
            this.chain.getHeight().then(response => {
                this.currentHeight = response.height
            }, respErr => {
                this.currentHeight = 0
            })
        },
        viewOnExplorer() {
            if (String.fromCharCode(this.networkByte) === 'T') {
                window.open(ADDRESS_TEST_EXPLORER + this.address)
            } else {
                window.open(ADDRESS_EXPLORER + this.address)
            }
        },
        getTxRecords() {
            this.showDisable = true
            const addr = this.address
            this.chain.getTxHistory(addr, 3).then(response => {
                this.response = response[0]
                let count = 0
                this.txRecords = this.response.reduce((recList, recItem) => {
                    let senderAddr = recItem['proofs'] ? recItem['proofs'][0]['address'] : 'no sender'
                    Vue.set(recList, count++, recItem)
                    if (recItem['type'] === EXECUTE_CONTRACT_TX) {
                        let tokenId = common.contractIDToTokenID(recItem['contractId'])
                        if (this.tokenRecords.hasOwnProperty(tokenId) && (recItem['functionIndex'] === 4 || (recItem['functionIndex'] === 3 && base58.decode(recItem['functionData'])[1] === 2))) {
                            let functionData = convert.parseFunctionData(recItem['functionData'])
                            recItem['recipient'] = functionData[0]
                            recItem['amount'] = BigNumber(functionData[1]).dividedBy(this.tokenBalances[tokenId].unity)
                            recItem['sentToken'] = true
                            recItem['officialName'] = this.tokenRecords[tokenId]
                        }
                    }
                    if (recItem['type'] === PAYMENT_TX) {
                        recItem['officialName'] = 'VSYS'
                    }
                    if (recItem['recipient'] === this.address && this.address === senderAddr) {
                        recItem['SelfSend'] = true
                    }
                    return recList
                }, {})
                this.showDisable = false
            }, respErr => {
                this.showDisable = false
            })
        }
    }
}
</script>

<style scoped>
.records {
    text-align: center;
    background:rgba(255,255,255,1);
    border:1px solid rgba(240,240,245,1);
}
.his-pane {
    text-align: left;
    width:328px;
    height:48px;
    border-bottom:1px solid rgba(240,240,245,1);
}
.his-txt {
    display:inline-block;
    margin-left: 12px;
    margin-top: 14px;
    width:58px;
    height:19px;
    font-size:16px;
    font-family:SFProText-Semibold,SFProText;
    font-weight:600;
    color:rgba(50,50,51,1);
    line-height:19px;
}
.view {
    float: right;
    margin-top: 5px;
}
.view p {
    position: relative;
    left: 6px;
    height: 14px;
    font-size:12px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(169,169,176,1);
    line-height:14px;
    display: inline-block;
}
.transaction-record {
    z-index:1000;
    width:327px;
    height:64px;
    padding-left: 12px;
    padding-right: 12px;
    border-right:1px solid rgba(240,240,245,1);
}
.empty {
    padding: 80px 0;
    color: rgba(169,169,176,1);
}
.wait-icon {
    margin-top: 80px;
}
</style>
