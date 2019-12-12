<template>
    <b-modal id="addAccount"
             lazy
             centered
             ref="addAccountModal"
             hide-footer
             @hidden="reset"
             hide-header>
        <button class="add-close btn-close close"
                @click="close">
            <img width="12" height="12" src="../../static/icons/ic_close.png">
        </button>
        <div class="add-account">
            <p class="p1">New Account</p>
            <div class="form-group"
                 style="margin-top: 20px;">
                <label class="add-label">Account Name</label>
                <input class="form-control input-height"
                       @keyup.enter="createAccount"
                       :placeholder="accountNumber"
                       v-model="inputName">
            </div>
            <b-row style="margin-top: 20px;margin-bottom: 15px;">
                <b-col class="col-lef">
                    <b-button
                            class="btn-cancel"
                            block
                            variant="light"
                            size="lg"
                            @click="close">Cancel
                    </b-button>
                </b-col>
                <b-col class="col-rit">
                    <b-button
                            block
                            class="btn-create"
                            variant="warning"
                            size="lg"
                            :disabled="isSubmitDisabled"
                            @click="createAccount">Create
                    </b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: "AddAccount",
    data: function () {
        return {
            inputName: ''
        }
    },
    methods: {
        createAccount() {
            this.$store.commit('account/addAccount', this.inputName)
            this.$store.commit('wallet/updateWalletAmount')
            this.$refs.addAccountModal.hide()
        },
        close() {
            this.$refs.addAccountModal.hide()
        },
        reset() {
            this.inputName = ''
        }
    },
    computed: {
        ...mapState({
            wallet: state => state.wallet
        }),
        accountNumber() {
            let num = this.wallet.walletAmount + 1
            if (num > 10) return 'Up to 10 accounts'
            return 'Account ' + num
        },
        isSubmitDisabled() {
            let name = this.inputName.trim()
            if (name.length >= 12) return true
            return name === ''
        }
    }
}
</script>

<style scoped>
.p1 {
    margin-top: 5px;
    height:29px;
    font-size:24px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:29px;
}
.input-height {
    height:48px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:16px;
}
.add-account {
    padding-top: 10px !important;
}
.add-close {
    margin-top: -6px !important;
}
.add-label {
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
}
.btn-cancel {
    height: 44px;
    background: rgba(255,255,255,1);
    border-radius: 4px;
    border: 1px solid rgba(242,242,247,1);
    font-size: 16px;
    font-family: SFProText-Regular,SFProText;
    font-weight: 400;
    color: rgba(50,50,51,1);
    line-height: 19px;
}
.btn-create {
    border-radius: 4px;
    height: 44px;
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:19px;
}
</style>
