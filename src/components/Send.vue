<template>
    <div v-if="pageId === 0"
         class="send-content">
        <div>
            <p class="p1">Send {{ tokenName }}</p>
            <b-button class="text-decoration-none cancel-link"
                      @click="cancel"
                      variant="link">Cancel</b-button>
        </div>
        <b-form-group class="send-form">
            <label>Address</label>
            <b-form-input size="sm"
                          type="text"
                          :state="isValidRecipient"
                          aria-describedby="inputLiveFeedback"
                          class="form-item"
                          v-model="recipient">
            </b-form-input>
            <label>Assets</label>
            <div class="assets-item">
                <img class="token-icon"
                     :src="tokenSvg"/>
                <div>
                    <p class="p2"> {{ tokenName }}</p>
                    <p class="p3">Available: <span class="amount">{{ assetBalance }} {{ tokenName }}</span></p>
                </div>
            </div>
            <label>Amount</label>
            <b-form-input id="amount-input"
                          class="form-item"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
                          :state="isValidAmount">
            </b-form-input>
            <label>Description</label>
            <b-form-textarea id="descriptionInput"
                             class="description-item"
                             v-model="description"
                             :rows="3"
                             :no-resize="true"
                             aria-describedby="inputDescriptionLiveFeedback"
                             :state="isValidDescription">
            </b-form-textarea>
            <b-row>
                <b-col class="col-lef">
                    <b-button
                            class="btn-cancel"
                            block
                            variant="light"
                            size="lg"
                            @click="cancel">Cancel
                    </b-button>
                </b-col>
                <b-col class="col-rit">
                    <b-button
                            block
                            class="btn-next"
                            variant="warning"
                            size="lg"
                            :disabled="isSubmitDisabled"
                            @click="next">Next
                    </b-button>
                </b-col>
            </b-row>
        </b-form-group>
    </div>
    <div v-else-if="pageId === 1">
        <div class="edit">
            <img class = "edit-icon" src="../../static/icons/ic_back.png"/>
            <b-btn class="edit-link text-decoration-none" variant="link"
                   @click="edit">Edit</b-btn>
        </div>
        <div class="edit-address">
            <canvas class="avatar1"
                    width="24"
                    height="24"
                    :data-jdenticon-hash="avatarDataHex(address)"></canvas>
            <p class="account-name">{{ accountName }}</p>
            <img style="display: inline-block; float: left; margin: 12px 0px 12px 26px;" width="32" height="32" src="../../static/icons/ic_arrow_line.png"/>
            <canvas class="avatar2"
                    width="24"
                    height="24"
                    :data-jdenticon-hash="avatarDataHex(address)"></canvas>
            <p class="account-name">{{ recipient }}</p>
        </div>
        <div style="background: rgba(247,247,252,1);">
            <div style="margin: 16px 0px 24px 16px">
                <div style="height: 20px; margin-bottom: 12px;">
                    <p class="p4">SEND {{ tokenName }}</p>
                </div>
                <div style="height: 40px;">
                    <img style="display: inline-block; position: fixed; left: 16px;" width="40" height="40" :src="tokenSvg"/>
                    <p class="p5">{{ amount }}</p>
                </div>
            </div>
        </div>
        <div class="details">
            <label>Fee</label>
            <p>{{ txFee }}</p>
        </div>
        <div class="details">
            <label>Total</label>
            <p> {{ selectedToken === 'VSYS' ? totalVSYS : amount + ' ' + tokenName + ' + ' + txFee }}<span> VSYS</span></p>
        </div>
        <div class="details" style="height: 72px;">
            <label style="margin-top: 28px;">Description</label>
            <p style="margin-top: 24px; color:rgba(50,50,51,1); font-size: 14px;">{{ description }}</p>
        </div>
        <b-row class="button-row">
            <b-col class="col-lef">
                <b-button
                        class="btn-cancel"
                        block
                        variant="light"
                        size="lg"
                        @click="edit">Cancel
                </b-button>
            </b-col>
            <b-col class="col-rit">
                <b-button
                        block
                        class="btn-next"
                        variant="warning"
                        size="lg"
                        @click="confirm">Confirm
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import seedLib from '../utils/seed.js'
import Transaction from '../js-v-sdk/src/transaction'
import BigNumber from 'bignumber.js'
import jdenticon from 'jdenticon'
import converters from '../js-v-sdk/src/utils/converters.js'
import common from '../js-v-sdk/src/utils/common.js'
import { CONTRACT_EXEC_FEE, TX_FEE, VSYS_PRECISION } from '../js-v-sdk/src/constants'
const TRANSFER_ATTACHMENT_BYTE_LIMIT = 140
export default {
    name: "Send",
    data: function() {
      return {
          recipient: '',
          amount: 0,
          unity: VSYS_PRECISION,
          isSplit: false,
          description: '',
          pageId: 0,
          txFee: this.selectedToken === 'VSYS' ? TX_FEE : CONTRACT_EXEC_FEE
      }
    },
    props: {
        address: {
            type: String,
            require: true,
            default: ''
        },
        accountName: {
            type: String,
            require: true,
            default: 'Failed'
        },
        vsysBalance: {
            type: String,
            require: true,
            default: '0'
        },
        tokenBalances: {
            type: Object,
            require: true,
            default: function() {}
        },
        tokenName: {
            type: String,
            require: true,
            default: 'VSYS'
        },
        networkByte: {
            type: Number,
            require: true,
            default: 84
        },
        selectedAccount: {
            type: Number,
            require: true,
            default: 0
        },
        selectedToken: {
            type: String,
            require: true,
            default: ''
        }
    },
    mounted() {
        jdenticon()
        if (this.selectedToken !== 'VSYS') {
            this.getTokenInfo()
        }
    },
    computed: {
        ...mapState({
            account: state => state.API.account,
            chain: state => state.API.chain,
            wallet: state => state.wallet
        }),
        tokenSvg() {
            const name = this.tokenName
            if (name === 'VSYS'){
                return "../../static/icons/token/" + name + ".png"
            } else if (name === 'DLL' || name === 'DM' || name === 'IPX' || name === 'VTEST') {
                return "../../static/icons/token/" + name + ".svg"
            } else {
                return "../../static/icons/token/other.svg"
            }
        },
        totalVSYS() {
            return BigNumber(this.amount).plus(this.txFee)
        },
        assetBalance() {
            let amount = 0
            if (this.selectedToken === 'VSYS') {
                amount = this.vsysBalance
            } else {
                amount = String(this.tokenBalances[this.selectedToken].value)
            }
            if (amount.length >= 16) {
                let index = amount.indexOf('.')
                amount = amount.slice(0, index + 3) + '...'
            }
            return amount
        },
        isValidRecipient() {
            let recipient = this.recipient
            if (!recipient) {
                return void 0
            }
            let isValid = false
            try {
                isValid = this.account.checkAddress(recipient)
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        isNegative() {
            return BigNumber(this.amount).isLessThan(0)
        },
        isValidNumFormat() {
            let amount = this.amount
            return !(/[eE]/.test(amount.toString()) || /^[0+]/.test(amount.toString()) && !/^0\./.test(amount.toString()) || BigNumber(amount).isNaN());
        },
        checkPrecision() {
            let amount = BigNumber(amount)
            if(BigNumber(amount).isNaN()){
                return true;
            }
            let m = amount.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
            amount = amount.toFixed(Math.max(0, (m[1] || '').length - m[2]))
            return !(amount.toString().split('.')[1] && amount.toString().split('.')[1].length > this.unity)
        },
        isSufficient() {
            if (this.selectedToken === 'VSYS') {
                return BigNumber(this.amount).isLessThanOrEqualTo(BigNumber(this.vsysBalance).minus(TX_FEE))
            } else {
                return BigNumber(this.amount).isLessThanOrEqualTo(BigNumber(this.tokenBalances[this.selectedToken].value)) && BigNumber(CONTRACT_EXEC_FEE).isLessThanOrEqualTo(BigNumber(this.vsysBalance))
            }
        },
        isValidDescription() {
            if (!this.description) {
                return void 0
            }
            let len = encodeURIComponent(this.description).replace(/%[A-F\d]{2}/g, 'U').length;
            return len <= TRANSFER_ATTACHMENT_BYTE_LIMIT
        },
        isValidAmount() {
            if (BigNumber(this.amount).isEqualTo(0)) {
                return void 0
            }
            return this.checkPrecision && this.isValidNumFormat && this.isSufficient && !this.isNegative
        },
        isSubmitDisabled() {
            return !(this.recipient && BigNumber(this.amount).isGreaterThan(0) && this.isValidRecipient && (this.isValidDescription || this.description === '') && this.isValidAmount && this.address !== '')
        },
        secretInfo() {
            return JSON.parse(
                seedLib.decryptSeedPhrase(this.wallet.info, this.wallet.password))
        },
        getKeypair() {
            return seedLib.fromExistingPhrasesWithIndex(this.getSeedPhrase, this.selectedAccount, this.networkByte).keyPair
        },
        getSeedPhrase() {
            if (this.secretInfo) {
                return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, this.wallet.password)
            }
        }
    },
    methods: {
        getTokenInfo() {
            let contractId = common.tokenIDToContractID(this.selectedToken)
            this.chain.getContractInfo(contractId).then(response => {
                this.isSplit = response.type === 'TokenContractWithSplit'
            }, respError => {
            })
            this.chain.getTokenInfo(this.selectedToken).then(response => {
                if (!response.hasOwnProperty('error')) {
                    this.unity = BigNumber(response.unity)
                }
            }, respError => {
            })
        },
        avatarDataHex(address) {
            return converters.stringToHexString(address).split('').reverse().slice(1, 21).join('')
        },
        cancel() {
            this.$emit('changePage', 'home')
        },
        next() {
            this.$emit('showNavBar', false)
            this.pageId = 1
        },
        edit() {
            this.$emit('showNavBar', true)
            this.pageId = 0
        },
        confirm() {
            let tra = new Transaction(this.networkByte)
            if (this.selectedToken === 'VSYS') {
                tra.buildPaymentTx(this.getKeypair.publicKey, this.recipient, this.amount, this.description, Date.now() * 1e6)
            } else {
                tra.buildSendTokenTx(this.getKeypair.publicKey, this.selectedToken, this.recipient, this.amount, this.unity, this.isSplit, this.description)
            }
            this.account.buildFromPrivateKey(this.getKeypair.privateKey)
            let signature = this.account.getSignature(tra.toBytes())
            let sendTx = tra.toJsonForSendingTx(signature)
            if (this.selectedToken === 'VSYS') {
                this.chain.sendPaymentTx(sendTx).then(response => {
                    this.$emit('showNavBar', true)
                    this.$emit('changePage', 'home')
                }, respErr => {
                })
            } else {
                this.chain.sendExecuteContractTx(sendTx).then(response => {
                    this.$emit('showNavBar', true)
                    this.$emit('changePage', 'home')
                }, respErr => {
                })
            }
            }
        }
}
</script>

<style scoped>
.send-content {
    margin: 24px;
}
.p1 {
    display: inline-block;
    height:24px;
    font-size:20px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:24px;
    margin-bottom: 32px;
}
.p2 {
    margin-top: 13px;
    margin-bottom: 1px;
    height:21px;
    font-size:18px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:21px;
}
.p3 {
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:16px;
}
.p4 {
    float: left;
    padding: 3px 6px;
    height:20px;
    background:rgba(247,247,252,1);
    border-radius:2px;
    border:1px solid rgba(230,230,237,1);
    font-size:12px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:14px;
}
.p5 {
    margin-top: 4px;
    margin-bottom: 3px;
    position: fixed;
    left: 68px;
    font-size:28px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:33px;
}
.amount {
    height:16px;
    font-size:14px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
}
.cancel-link {
    float: right;
    padding: 4px 0px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(255,136,55,1);
    line-height:16px;
}
.send-form label {
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
    margin-bottom: 12px;
}
.form-item {
    margin-bottom: 24px;
    height:56px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
}
.assets-item {
    margin-bottom: 24px;
    height:64px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
}
.description-item {
    margin-bottom: 24px;
    height:80px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
}
.token-icon {
    float: left;
    width: 40px;
    height: 40px;
    margin: 12px;
    margin-left: 16px !important;
    display: inline-block;
}
.btn-cancel {
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:19px;
    height:44px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(242,242,247,1);
}
.btn-next {
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:19px;
    height:44px;
    background:rgba(255,136,55,1);
    border-radius:4px;
}
.edit {
    height: 48px;
    background:rgba(255,255,255,1);
}
.edit-icon {
    width: 12px;
    height: 12px;
    margin-left: 16px;
    margin-bottom: 18px;
    margin-top: 18px;
}
.edit-link {
    padding-left: 5px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(255,136,55,1);
    line-height:16px;
}
.edit-address {
    border-top: 1px solid rgba(240,240,245,1);
    height: 56px;
    background:rgba(255,255,255,1);
}
.avatar1 {
    display: inline-block;
    float: left;
    margin: 16px;
    margin-right: 12px !important;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(180, 180, 180);
    border-radius: 5px;
    padding: 0px;
}
.avatar2 {
    display: inline-block;
    float: left;
    margin: 16px;
    margin-right: 12px !important;
    margin-left: 20px !important;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(180, 180, 180);
    border-radius: 5px;
    padding: 0px;
}
.account-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    width: 86px;
    float: left;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
    margin: 20px 0px;
}
.details {
    height: 98px;
    background:rgba(255,255,255,1);
    border-bottom: 1px solid rgba(240,240,245,1);
}
.details label {
    margin-top: 42px;
    margin-left: 16px;
    display: inline-block;
    float: left;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:16px;
}
.details p {
    margin-right: 16px;
    float: right;
    font-size:20px;
    margin-top: 42px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:red;
    line-height:24px;
}
.button-row {
    padding: 16px 24px;
    height:76px;
    background:rgba(255,255,255,1);
}
</style>
