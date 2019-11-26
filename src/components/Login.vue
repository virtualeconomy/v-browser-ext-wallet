<template>
    <div class="login">
        <div class="content">
            <div>
                <img src="../../static/icons/V_Wallet_Logo_big.png">
            </div>
            <div>
                <p class="p1">Welcome Back!</p>
                <p class="p2">The decentralized web awaits</p>
            </div>
            <div class="form-group"
                 style="margin-top: 48px; margin-bottom: 32px;">
                <input type="password"
                       name="password"
                       class="form-control input-height"
                       @input="hideErrMsg"
                       v-model="password">
                <div class="msg-err text-danger"><small v-if="isPwdError">Password is wrong.</small>
                </div>
            </div>
            <b-button
                    class="input-height form-control"
                    :disabled="isSubmitDisabled"
                    :variant="'warning'"
                    :block=true
                    @click="login">
                LOG IN
            </b-button>
            <div class="restore">
                <p class="p3">Restore account?</p>
                <b-btn class="vsys-color text-decoration-none restore-link" variant="link"
                       @click="restore">Import using account seed phrase</b-btn>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import seedLib from '../libs/seed.js'
export default {
    name: "Login",
    data: function() {
        return {
            isPwdError: false,
            password: void 0
        }
    },
    created() {
        Vue.ls.clear()
    },
    methods: {
        checkPassword() {
            try {
                seedLib.decryptSeedPhrase(
                    JSON.parse(
                        seedLib.decryptSeedPhrase(
                            JSON.parse(
                                window.localStorage.getItem(
                                    'vuex')).wallet.localWallet.info,
                            this.password)).encrSeed,
                    this.password)
                this.isPwdError = false
            } catch (err) {
                this.isPwdError = true
            }
        },
        hideErrMsg() {
            this.isPwdError = false
        },
        login() {
            this.checkPassword()
            if (this.isPwdError) {
                return
            }
            Vue.ls.set('pwd', this.password)
            this.$router.push('/home')
        },
        restore() {
            chrome.runtime.sendMessage({
                method: 'showAlert'
            }, function(response) {});
        }
    }
}
</script>

<style scoped>
.login {
    width:360px;
    height:560px;
    background:rgba(247,247,252,1);
}
.content {
    margin: 0 auto;
    position: relative;
    top: 112px;
    width: 312px;
    text-align: center;
}
.input-height {
    font-size: 18px;
    height:48px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
}
.p1 {
    height:29px;
    font-size:24px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:29px;
    margin-top: 24px;
    margin-bottom: 0px;
}
.p2 {
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:16px;
    margin-top: 8px;
    margin-bottom: 0px;
}
.p3 {
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:16px;
    margin-bottom: 0px;
}
.restore {
    margin-top: 80px;
    text-align: left;
}
.restore-link {
    text-align: left;
    padding: 0px;
    width: 100%;
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(255,136,55,1);
    line-height:16px;
}
.msg-err {
    margin-top: 5px;
    height: 10px;
}
</style>
