<template>
    <div v-if="pageId === 0"
         class="send-content">
        <div>
            <p class="p1">Send VSYS</p>
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
                     src="../../static/icons/ic_v_logo@3x.png"/>
                <div>
                    <p class="p2">VSYS</p>
                    <p class="p3">Available: <span class="amount">1000 VSYS</span></p>
                </div>
            </div>
            <label>Amount</label>
            <b-form-input id="amount-input"
                          class="form-item"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
                          :state="isValidAmount"
                          onfocus="this.select()">
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
            <img class = "edit-icon" src="../../static/icons/ic_back@2x.png"/>
            <b-btn class="edit-link text-decoration-none" variant="link"
                   @click="edit">Edit</b-btn>
        </div>
        <div class="edit-address">
            <canvas class="avatar1"
                    width="24"
                    height="24"
                    :data-jdenticon-hash="avatarDataHex(address)"></canvas>
            <p class="account-name">{{ accountName }}</p>
            <img style="display: inline-block; float: left; margin: 12px 0px 12px 26px;" width="32" height="32" src="../../static/icons/ic_arrow_line@2x.png"/>
            <canvas class="avatar2"
                    width="24"
                    height="24"
                    :data-jdenticon-hash="avatarDataHex(address)"></canvas>
            <p class="account-name">{{ recipient }}</p>
        </div>
        <div style="background: rgba(247,247,252,1); height: 112px"></div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import BigNumber from 'bignumber.js'
import jdenticon from 'jdenticon'
import converters from '../js-v-sdk/src/utils/converters.js'
const TRANSFER_ATTACHMENT_BYTE_LIMIT = 140
export default {
    name: "Send",
    data: function() {
      return {
          recipient: 'AUAztxsft2v6rmjRRb72nLea6BNyRHHWpUR',
          amount: 12,
          unity: 8,
          description: '',
          pageId: 0
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
        balances: {
            type: Object,
            require: true,
            default: function() {}
        },
        tokenName: {
            type: String,
            require: true,
            default: 'VSYS'
        }
    },
    mounted() {
        jdenticon()
    },
    computed: {
        ...mapState({
            account: state => state.API.account
        }),
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
            return true
            // let balance = this.balances[this.address] : this.balances[this.coldAddress]
            // return BigNumber(this.amount).isGreaterThan(BigNumber(balance).minus(TX_FEE))
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
    },
    methods: {
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
</style>
