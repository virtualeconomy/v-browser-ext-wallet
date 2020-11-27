<template>
    <div class="records">
        <div class="his-pane">
            <p class="his-txt">History</p>
            <b-btn class="refresh-icon"
                   variant="link"
                   @click="refresh"><img width="18" height="18" src="../../static/icons/refresh.svg"/></b-btn>
            <div class="view"><b-btn class="view-p" variant="white" @click="viewOnExplorer">View on Explorer</b-btn><b-btn variant="link" @click="viewOnExplorer"><img width="6" height="10" src="../../static/icons/ic_arrow_right.png"/></b-btn></div>
        </div>
        <div class="scroll"
             :style="{'max-height': '192px'}">
            <transaction-record v-for="(txRecord, idx) in txRecords"
                                :key="idx"
                                :tx-record="txRecord"
                                :address="address"
                                :current-height="currentHeight"
                                class="transaction-record"></transaction-record>
        </div>
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
import { EXECUTE_CONTRACT_TX, PAYMENT_TX, NFT_CONTRACT_SEND_FUNCIDX, ACCOUNT_ADDR_TYPE, INT32_TYPE, AMOUNT_TYPE, SEND_FUNCIDX, SEND_FUNCIDX_SPLIT } from '../js-v-sdk/src/constants'
import common from '../js-v-sdk/src/utils/common'
import { mapState } from 'vuex'
import { ADDRESS_TEST_EXPLORER, ADDRESS_EXPLORER } from '../store/network.js'
import Vue from 'vue'
import base58 from 'base-58'
import BigNumber from 'bignumber.js'
import convert from '../js-v-sdk/src/utils/convert'
import * as Constants from "src/js-v-sdk/src/constants";
export default {
    name: "TransactionRecords",
    components: {
        TransactionRecord
    },
    created() {
        this.getCurrentHeight()
        this.getTxRecords()
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
    watch: {
        address(now, old) {
            this.getCurrentHeight()
            this.getTxRecords()
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
        refresh() {
            this.getCurrentHeight()
            this.getTxRecords()
        },
        viewOnExplorer() {
            if (String.fromCharCode(this.networkByte) === 'T') {
                window.open(ADDRESS_TEST_EXPLORER + this.address)
            } else {
                window.open(ADDRESS_EXPLORER + this.address)
            }
        },
        isSendExecuteContractTx(functionIndex, Data) {
            let functionData = convert.parseFunctionData(Data)
            console.log(functionData)
            if (functionIndex === NFT_CONTRACT_SEND_FUNCIDX && functionData.length === 2 && functionData[0]['type'] === ACCOUNT_ADDR_TYPE && functionData[1]['type'] === INT32_TYPE) {
                return true
            }
            return (functionIndex === SEND_FUNCIDX || functionIndex === SEND_FUNCIDX_SPLIT) && functionData.length === 2 && functionData[0]['type'] === ACCOUNT_ADDR_TYPE && functionData[1]['type'] === AMOUNT_TYPE

        },
        getTxRecords() {
            this.txRecords = {}
            this.showDisable = true
            const addr = this.address
            let dataLength = 10
            this.chain.getTxHistory(addr, dataLength).then(response => {
                this.response = response[0]
                let count = 0
                this.txRecords = this.response.reduce((recList, recItem) => {
                    let senderAddr = recItem['proofs'] ? recItem['proofs'][0]['address'] : 'no sender'
                    Vue.set(recList, count++, recItem)
                    if (recItem['type'] === EXECUTE_CONTRACT_TX) {
                        let tokenId = common.contractIDToTokenID(recItem['contractId'])
                        if (this.tokenRecords.hasOwnProperty(tokenId) && this.isSendExecuteContractTx(recItem['functionIndex'], recItem['functionData'])) {
                            let functionData = convert.parseFunctionData(recItem['functionData'])
                            recItem['recipient'] = functionData[0]['data']
                            if (functionData[1]['type'] === INT32_TYPE) {
                                recItem['amount'] = 1
                            } else {
                                recItem['amount'] = BigNumber(functionData[1]['data']).dividedBy(this.tokenBalances[tokenId].unity)
                            }
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
.view-p {
    position: relative;
    left: 6px;
    padding: 0px;
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
.refresh-icon {
    padding: 0 0;
    display:inline-block;
}
.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 100;
}
</style>
