<template>
    <div class="records">
        <div class="his-pane">
            <span class="his-txt">History</span>
            <span class="exp-txt">View on Explorer</span>
            <img class="btn-exp" src="../../static/icons/ic_arrow_right@3x.png">
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

<style>
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
.exp-txt {
    display:inline-block;
    margin-left: 134px;
    margin-top: 17px;
    width:98px;
    height:14px;
    font-size:12px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(169,169,176,1);
    line-height:14px;
}
.btn-exp {
    display:inline-block;
    width:6px;
    height:10px;
}
.transaction-record {
    z-index:1000;
    width:328px;
    height:64px;
}
.btn {
    width:6px;
    height:10px;
}
</style>
