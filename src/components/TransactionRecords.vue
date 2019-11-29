<template>
    <div class="records">
        <div class="his-pane">
            <p class="his-txt">History</p>
            <div class="view"><p>View on Explorer</p><b-btn variant="link" @click="viewOnExplorer"><img width="6" height="10" src="../../static/icons/ic_arrow_right@2x.png"/></b-btn></div>
        </div>
        <transaction-record v-for="txRecord in txRecords"
                            :tx-record="txRecord"
                            :address="address"
                            class="transaction-record"></transaction-record>
    </div>
</template>

<script>
import TransactionRecord from './TransactionRecord.vue'
import { EXECUTE_CONTRACT_TX } from '../js-v-sdk/src/constants'
import common from '../js-v-sdk/src/utils/common'
import { mapState } from 'vuex'
import { ADDRESS_TEST_EXPLORER, ADDRESS_EXPLORER } from '../store/network.js'
import base58 from 'base-58'
import Vue from 'vue'
import convert from '../js-v-sdk/src/utils/convert'
export default {
    name: "TransactionRecords",
    components: {
        TransactionRecord
    },
    created() {
        this.getTxRecords()
    },
    data: function() {
        return {
            txRecords: {}
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
        }
    },
    computed: {
        ...mapState({
            chain: state => state.API.chain
        })
    },
    methods: {
        viewOnExplorer() {
            if (String.fromCharCode(this.networkByte) === 'T') {
                window.open(ADDRESS_TEST_EXPLORER + this.address)
            } else {
                window.open(ADDRESS_EXPLORER + this.address)
            }
        },
        getTxRecords() {
            const addr = this.address
            this.chain.getTxHistory(addr, 3).then(response => {
                this.response = response[0]
                let count = 0
                this.txRecords = this.response.reduce((recList, recItem) => {
                    let senderAddr = recItem['proofs'] ? recItem['proofs'][0]['address'] : 'no sender'
                    Vue.set(recList, count++, recItem)
                    if (recItem['type'] === EXECUTE_CONTRACT_TX) {
                        let tokenId = common.contractIDToTokenID(recItem['contractId'])
                        // if (certify.isCertified(tokenId) && (recItem['functionIndex'] === 4 || (recItem['functionIndex'] === 3 && base58.decode(recItem['functionData'])[1] === 2))) {
                        //     let functionData = convert.parseFunctionData(recItem['functionData'])
                        //     recItem['recipient'] = functionData[0]
                        //     recItem['amount'] = functionData[1]
                        //     recItem['sentToken'] = true
                        //     recItem['officialName'] = certify.officialName(tokenId)
                        // }
                    }
                    if (recItem['recipient'] === this.address && this.address === senderAddr) { // send to self
                        let recItemCopy = JSON.parse(JSON.stringify(recItem))
                        recItemCopy['SelfSend'] = true
                        recItemCopy['index'] = ++count
                        Vue.set(recList, count++, recItem)
                    }
                    return recList
                }, {})
            }, respErr => {
            })
        }
    }
}
</script>

<style scoped>
.records {
    background:rgba(255,255,255,1);
    border:1px solid rgba(240,240,245,1);
}
.his-pane {
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
    width:328px;
    height:64px;
}
</style>
