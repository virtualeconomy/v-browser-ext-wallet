<template>
    <b-container class="record-unit">
        <b-row>
            <b-col class="record-icon"
                   cols="auto">
                <img v-if="txIcon==='sent'"
                     src="../../static/icons/record/ic_sent.svg"
                     width="32px"
                     height="32px">
                <img v-else-if="txIcon==='received'"
                     src="../../static/icons/record/ic_received.svg"
                     width="32px"
                     height="32px">
                <img v-else-if="txIcon==='leased in'"
                     src="../../static/icons/record/ic_leasing_reverse.svg"
                     width="32px"
                     height="32px">
                <img v-else-if="txIcon==='leased out'"
                     src="../../static/icons/record/ic_leasing.svg"
                     width="32px"
                     height="32px">
                <img v-else-if="txIcon==='leased out canceled'"
                     src="../../static/icons/record/ic_leasing_cancel.svg"
                     width="32px"
                     height="32px">
                <img v-else-if="txIcon==='leased in canceled'"
                     src="../../static/icons/record/ic_leasing_cancel_in.svg"
                     width="32px"
                     height="32px">
                <img v-else-if="txIcon==='register contract' && txStatus === 'Success'"
                     src="../../static/icons/record/ic_contract_signup.svg"
                     width="32px"
                     height="32px">
                <img v-else-if="txIcon==='register contract' && txStatus !== 'Success'"
                     src="../../static/icons/record/ic_exec_fail.svg"
                     width="32px"
                     height="32px">
                <img v-else-if="txIcon==='execute contract function' && txStatus === 'Success'"
                     src="../../static/icons/record/ic_exec_success.svg"
                     width="32px"
                     height="32px">
                <img v-else-if="txIcon==='execute contract function' && txStatus !== 'Success'"
                     src="../../static/icons/record/ic_exec_fail.svg"
                     width="32px"
                     height="32px">
            </b-col>
            <b-col class="record-detail-1"
                   col="auto"
                   align-v="left">
                <b-row>
                    <b-col :class="{'record-type': true, 'short-name': true, 'long-name': isLongName }">{{ txTitle }}</b-col>
                </b-row>
                <b-row>
                    <b-col class="record-time">{{ txMonthStr }}/{{ txDayStr }}/{{ txYearStr }} at {{ txHourStr }}:{{ txMinuteStr }}</b-col>
                </b-row>
            </b-col>
            <b-col class="record-detail-2"
                   col="auto"
                   align-v="right">
                <b-row>
                    <b-col class="record-amount">{{ txAmount }}</b-col>
                </b-row>
                <b-row>
                    <b-col class="record-status">
                        <span :class="[ isConfirmed ? 'record-confirmed' : 'record-unconfirmed' ]">{{ isConfirmed ? 'CONFIRMED' : 'UNCONFIRMED'}}</span>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { PAYMENT_TX, VSYS_PRECISION, LEASE_TX, CANCEL_LEASE_TX, REGISTER_CONTRACT_TX, EXECUTE_CONTRACT_TX, CONTRACT_REGISTER_FEE, CONTRACT_EXEC_FEE } from '../js-v-sdk/src/constants'
import BigNumber from 'bignumber.js'
export default {
    name: "TransactionRecord",
    props: {
        txRecord: {
            type: Object,
            default: function() {
                return {
                    txType: '',
                    txAddress: '',
                    txTime: '',
                    txAmount: 0,
                    txAttachment: ''
                }
            }
        },
        address: {
            type: String,
            default: ''
        },
        currentHeight: {
            type: Number,
            default: 0
        }
    },
    computed: {
        txType() {
            if (this.txRecord['type'] === PAYMENT_TX) {
                if (this.txRecord.recipient === this.address && this.txRecord.SelfSend === undefined) {
                    return 'Received'
                } else {
                    return 'Sent'
                }
            } else if (this.txRecord['type'] === LEASE_TX) {
                if (this.txRecord.recipient === this.address) {
                    return 'Leased In'
                } else {
                    return 'Leased Out'
                }
            } else if (this.txRecord['type'] === CANCEL_LEASE_TX) {
                if (this.txRecord.lease.recipient === this.address) {
                    return 'Leased In Canceled'
                } else {
                    return 'Leased Out Canceled'
                }
            } else if (this.txRecord['type'] === REGISTER_CONTRACT_TX) {
                return 'Register Contract'
            } else if (this.txRecord['type'] === EXECUTE_CONTRACT_TX) {
                if (this.isSentToken) {
                    if (this.txRecord.recipient === this.address && this.txRecord.SelfSend === undefined && this.txStatus === 'Success') {
                        return 'Received'
                    } else return 'Sent'
                } else return 'Execute Contract Function'
            } else {
                return 'Received'
            }
        },
        isLongName() {
            return this.txType === 'Leased Out Canceled' || this.txType === 'Leased In Canceled' || this.txType === 'Execute Contract Function'
        },
        isConfirmed() {
            return this.currentHeight - this.txRecord.height > 30
        },
        txIcon() {
            return this.txType.toString().toLowerCase()
        },
        txTitle() {
            if (this.txType === 'Leased Out') {
                return 'Start Leasing'
            } else if (this.txType === 'Leased In') {
                return 'Incoming Leasing'
            } else if (this.txType === 'Leased Out Canceled') {
                return 'Canceled Out Leasing'
            } else if (this.txType === 'Leased In Canceled') {
                return 'Canceled Incoming Leasing'
            } else if (this.txType === 'Sent') {
                return 'Sent ' + this.txRecord.officialName
            } else if (this.txType === 'Received') {
                return 'Received ' + this.txRecord.officialName
            } else if (this.txType === 'Execute Contract Function') {
                return 'Execute Contract Function'
            } else if (this.txType === 'Register Contract') {
                return 'Register Contract'
            }
        },
        isSentToken() {
            return this.txRecord.sentToken === true
        },
        txStatus() {
            return this.txRecord.status
        },
        txHourStr() {
            const hour = new Date(this.txRecord.timestamp / 1e6).getHours()
            if (hour < 10) {
                return '0' + hour
            }
            return hour.toString()
        },
        txMinuteStr() {
            const minute = new Date(this.txRecord.timestamp / 1e6).getMinutes()
            if (minute < 10) {
                return '0' + minute
            }
            return minute.toString()
        },
        txDayStr() {
            const date = new Date(this.txRecord.timestamp / 1e6).getDate()
            if (date < 10) {
                return '0' + date
            }
            return date.toString()
        },
        txMonthStr() {
            const month = new Date(this.txRecord.timestamp / 1e6).getMonth()
            if (month < 10) {
                return '0' + month
            }
            return month.toString()
        },
        txYearStr() {
            const year = new Date(this.txRecord.timestamp / 1e6).getFullYear()
            return year.toString()
        },
        txAmount() {
            if (this.isSentToken) {
                if (this.txType === 'Sent') {
                    return '-' + BigNumber(this.txRecord.amount) + ' ' + this.txRecord.officialName
                } else {
                    return '+' + BigNumber(this.txRecord.amount) + ' ' + this.txRecord.officialName
                }
            }
            if (this.txRecord.lease) {
                return BigNumber(this.txRecord.lease.amount).dividedBy(VSYS_PRECISION) + 'VSYS'
            }
            if (this.txRecord['type'] === PAYMENT_TX || this.txRecord['type'] === LEASE_TX) {
                if (this.txType === 'Sent') {
                    return '-' + BigNumber(this.txRecord.amount).dividedBy(VSYS_PRECISION) + ' VSYS'
                } else {
                    return '+' + BigNumber(this.txRecord.amount).dividedBy(VSYS_PRECISION) + ' VSYS'
                }
            }
            if (this.txType === 'Register Contract') {
                return '-' + CONTRACT_REGISTER_FEE + ' VSYS'
            }
            if (this.txType === 'Execute Contract Function') {
                return '-' + CONTRACT_EXEC_FEE + ' VSYS'
            }
        },
    }
}
</script>

<style>
.record-unit {
    background:rgba(255,255,255,1);
}
.record-icon {
    padding: 16px 12px;
    display:inline-block;
}
.record-detail-1 {
    width: 120px;
    height: 64px;
    padding-left: 0px !important;
    padding-right: 0px !important;
    display:inline-block;
    text-align:left;
    border-bottom:1px solid rgba(240,240,245,1);
}
.record-type {
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
}
.long-name {
    margin-top: 8px !important;
}
.short-name {
    margin-top: 16px;
}
.record-time {
    margin-top: 3px;
    font-size:11px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:13px;
}
.record-detail-2 {
    padding-left: 0px !important;
    padding-right: 0px !important;
    height: 64px;
    text-align:right;
    border-bottom:1px solid rgba(240,240,245,1);
}
.record-amount {
    margin-right: 30px;
    padding: 0px !important;
    margin-top: 16px;
    font-size:14px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
}
.record-confirmed {
    color:rgba(113,145,0,1);
    line-height:12px;
    background:rgba(235,250,215,1);
    border-radius:2px;
    padding: 1px 4px 3px 4px;
}
.record-status {
    margin-right: 30px;
    padding: 0px !important;
    margin-top: 3px;
    font-size:10px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
}
.record-unconfirmed {
    color:#F5354B;
    line-height:12px;
    background: #FFE6E8;
    border-radius:2px;
    padding: 1px 4px 3px 4px;
}
</style>
