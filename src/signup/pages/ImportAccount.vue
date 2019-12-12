<template>
    <div class="layout-main">
        <v-header></v-header>
        <div class="content">
            <div v-if="pageId==='import'"
                 class="import-account">
                <div class="back">
                    <img class = "back-icon" src="../../../static/icons/ic_back.png">
                    <b-btn class="back-link text-decoration-none" variant="link"
                           @click="back('/SignupEntry')">Back</b-btn>
                </div>
                <p class="import-intro-1">Import an Account with Seed Phase</p>
                <p class="import-intro-2">Enter your secret twelve word phrase here to restore your vault.</p>
                <ul class="form-group"
                    style="height: 48px !important; margin-bottom: 0px;">
                    <li style="margin-bottom: 5px;" v-for="error in validator.errors"
                        :key="error.name">
                        <small class="form-text text-danger">
                            {{ error.msgs[0] }}
                        </small>
                    </li>
                </ul>
                <div class="form-group seed-form">
                    <label>Wallet Seed</label>
                    <b-form-textarea
                            class="non-square seed"
                            v-model="seedInput"
                            maxlength="150"
                            @keydown.native.enter='preventDefault($event)'
                            :disabled="showSeedErr"
                            :placeholder="seedPlaceHolder"
                            :no-resize="true"
                            :rows="4"
                            :max-rows="6"
                            @input="hideErrMsg">
                    </b-form-textarea>
                </div>
                <div class="form-group password-form">
                    <label>New Password (min 8chars)</label>
                    <input
                            type="password"
                            name="password"
                            class="form-control"
                            :class="{'text-danger':isPassErrors,'is-invalid':isPassErrors}"
                            v-model="password"
                            :readonly="registering"
                            @input="checkPassword(password)">
                    <img v-if="password && !isPassErrors"
                         class="check-right"
                         src="../../../static/icons/ic_check_green.svg">
                </div>
                <div class="form-group password-form">
                    <label>Confirm Password</label>
                    <input
                            type="password"
                            name="password"
                            class="form-control"
                            :class="{'text-danger':isPassMatchErrors,'is-invalid':isPassMatchErrors}"
                            :readonly="registering"
                            @input="checkPasswordMatch(password, password2)"
                            @keyup.enter="importEnter"
                            v-model="password2">
                    <img v-if="password2 && !isPassMatchErrors"
                         class="check-right"
                         src="../../../static/icons/ic_check_green.svg">
                </div>
                <div class="form-group password-form">
                    <label>Choose Network</label>
                    <b-form-select class="form-control select"
                                   :options="networkOptions"
                                   v-model="networkByte">
                    </b-form-select>
                </div>
                <div class="terms">
                    <img id="img_read"
                         @click="changeIcon"
                         src="../../../static/icons/ic_select_border.svg">
                    &nbsp;I have read and agree to the <a class='vsys-color'
                                                          href="#"
                                                          @click="openTerms()">Terms of Service<br></a>
                    <b-button
                            class="form-control"
                            :disabled="isSubmitDisabled"
                            :variant="'warning'"
                            :size="'lg'"
                            :block=true
                            @click="confirm">
                        Import
                    </b-button>
                </div>
            </div>
            <success v-else-if="pageId==='success'"></success>
        </div>
    </div>
</template>

<script>
import VHeader from './VHeader.vue'
import validator from 'vue-m-validator'
import icon1 from '../../../static/icons/ic_select_solid.svg'
import icon2 from '../../../static/icons/ic_select_border.svg'
import Success from './Success.vue'
import seedLib from '../../utils/seed.js'
export default {
    name: "ImportAccount",
    data: function() {
        return {
            pageId: 'import',
            password: '',
            password2: '',
            seedInput: '',
            showSeedErr: false,
            isFirstRun: true,
            networkByte: 'M'.charCodeAt(0),
            read_agree: false,
            isFirst: {
                'pwd1': true,
                'pwd2': true
            },
            networkOptions: [
                {
                    value: 'M'.charCodeAt(0),
                    text: 'Mainnet'
                },
                {
                    value: 'T'.charCodeAt(0),
                    text: 'Testnet'
                },
            ],
            validator: validator,
            seedPhrase: '',
            registering: false
        }
    },
    created() {
        validator.reset()
    },
    components: {
        VHeader,
        Success,
    },
    computed: {
        isSubmitDisabled() {
            return this.isFirstRun === true || this.validator.errors.length > 0 || this.read_agree === false || this.seedInput === ''
        },
        isPassErrors() {
            let errors = this.validator.getErrors('pass')
            return errors && errors.length > 0
        },
        isPassMatchErrors() {
            let errors = this.validator.getErrors('passmatch')
            return errors && errors.length > 0
        },
        seedPlaceHolder() {
            return this.showSeedErr ? '' : 'Separate each word with a single space'
        },
        isValidSeed() {
            const wordList = this.seedPhrase.split(' ')
            return (wordList.length === 15 || wordList.length === 18) && seedLib.isSystemPhrase(wordList)
        },
    },
    methods: {
        preventDefault(event) {
            if (event) {
                event.preventDefault()
            }
        },
        notFirst(field) {
            this.isFirst[field] = false
            this.isFirstRun = /true/i.test(Object.values(this.isFirst).join(''))
        },
        checkSeed() {
            this.seedPhrase = this.seedInput.trim()
            if (!this.isValidSeed) {
                let isConfirmed = confirm('Warning! The seed phrase above is from a user-supplied source. An insecure entropy source can lead to total loss of the wallet.')
                if (isConfirmed) {
                    this.showSeedErr = true
                }
            } else {
                this.showSeedErr = true
            }
        },
        checkPasswordMatch(pass, pass2) {
            const RULE_1 = {
                expression: pass !== pass2,
                name: 'passmatch',
                msg: 'Passwords are not the same'
            }
            validator
                .addRule(RULE_1)
            this.notFirst('pwd2')
        },
        checkPassword(pass) {
            const RULE_1 = {
                expression: !pass || pass === '',
                name: 'pass',
                msg: 'Password is required'
            }
            const RULE_2 = {
                expression: pass.length < 8,
                name: 'pass',
                msg: 'Your password should be of at least 8 characters'
            }
            const RULE_3 = {
                expression: !(/[a-zA-z]/.test(pass)),
                name: 'pass',
                msg: 'Your passowrd must contain alphabetical character'
            }
            validator
                .addRule(RULE_1)
                .addRule(RULE_2)
                .addRule(RULE_3)
            if (!this.isFirst['pwd2']) {
                this.checkPasswordMatch(this.password, this.password2)
            }
            this.notFirst('pwd1')
        },
        changeIcon() {
            if (this.read_agree === false) {
                document.getElementById('img_read').src = icon1
                this.read_agree = true
            } else {
                document.getElementById('img_read').src = icon2
                this.read_agree = false
            }
        },
        back(route) {
            this.$router.push(route)
        },
        check() {
            this.checkPassword(this.password)
            this.checkPasswordMatch(this.password, this.password2)
            this.checkSeed()
        },
        importEnter() {
            this.register()
        },
        confirm() {
            this.check()
            if (this.isSubmitDisabled || !this.showSeedErr) {
                return
            }
            this.registering = true
            this.isFirstRun = true
            this.seed = seedLib.fromExistingPhrase(this.seedPhrase)
            const userInfo = {
                encrSeed: seedLib.encryptSeedPhrase(this.seed.phrase, this.password)
            }
            const savedInfo = {
                lastLogin: new Date().getTime(),
                walletAmount: 1,
                sessionTimeout: 5,
                networkByte: this.networkByte,
                password: this.password,
                info: seedLib.encryptSeedPhrase(JSON.stringify(userInfo), this.password)
            }
            this.$store.commit('account/initializeAccount')
            this.$store.commit('wallet/updateWallet', savedInfo)
            this.pageId = 'success'
        },
        openTerms() {
            this.$router.push('/terms')
        },
        hideErrMsg() {
            this.showSeedErr = false
        }
    }
}
</script>

<style scoped lang="less">
.layout-main {
    width: 100%;
    height: 100%;
    min-width: 200px;
    position: absolute;
    background-color: rgba(247,247,252,1);
}
.content {
    display:flex;
    justify-content:center;
    align-items:center;
    background-color: rgba(247,247,252,1);
}
.import-intro-1 {
    height: 34px;
    font-size: 28px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:34px;
    position: relative;
    margin-bottom: 12px;
}
.import-intro-2 {
    height: 18px;
    font-size: 14px;
    font-family: SFProText-Regular,SFProText;
    font-weight: 400;
    color: rgba(50,50,51,1);
    line-height: 18px;
    position: relative;
    margin-bottom: 0px;
}
.import-account {
    width: 480px;
    position: relative;
    top: 24px;
}
.seed-form {
    label {
        height:16px;
        font-size:14px;
        font-family:SFProText-Regular,SFProText;
        font-weight:400;
        color:rgba(50,50,51,1);
        line-height:16px;
        margin-bottom: 12px;
    }
    margin-bottom: 32px;
}
.password-form {
    label {
        height:16px;
        font-size:14px;
        font-family:SFProText-Regular,SFProText;
        font-weight:400;
        color:rgba(50,50,51,1);
        line-height:16px;
        margin-bottom: 12px;
    }
    input {
        height:48px;
        background:rgba(255,255,255,1);
        border-radius:6px;
        border:1px solid rgba(230,230,237,1);
    }
    margin-bottom: 32px;
}
.back {
    height: 40px;
}
.back-icon {
    width: 12px;
    height: 12px;
}
.back-link {
    width:33px;
    height:16px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:19px;
    padding: 0px;
    margin-bottom: 4px;
}
.terms {
    height: 19px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:19px;
    img {
        height: 20px;
        width: 20px;
        margin-top: -2px;
    }
    button {
        height:44px;
        background:rgba(255,136,55,1);
        border-radius:4px;
        font-size:16px;
        padding-top: 12px !important;
        font-family:SFProText-Medium,SFProText;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:19px;
        margin-top: 41px;
    }
}
.select {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background: url("../../../static/icons/ic_arrow_down_gray.png") no-repeat scroll 454px center #fff;
    background-size: 10px;
    padding-left: 19px;
    font-size:16px;
    font-weight:400;
    line-height:19px;
}
.select option {
    width:61px;
    height:19px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:19px;
}
.check-right {
    float: right;
    margin-top: -30px;
    margin-right: 16px;
}
.form-control:disabled, .non-square{
    padding: 20px 15px;
}
.seed {
    height:19px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    line-height:19px;
    color:rgba(50,50,51,1);
}
</style>
