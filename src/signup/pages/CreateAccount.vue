<template>
    <div class="layout-main">
        <v-header></v-header>
        <div class="content">
            <div v-if="pageId==='create'"
                 class="create-account">
                <div class="back">
                    <img class = "back-icon" src="../../../static/icons/ic_back.png"/>
                    <b-btn class="back-link text-decoration-none" variant="link"
                           @click="back('/SignupEntry')">Back</b-btn>
                </div>
                <p class="create-password">Create Password</p>
                <ul class="form-group"
                    style="height: 48px !important; margin-bottom: 0px;">
                    <li style="margin-bottom: 5px;" v-for="error in validator.errors"
                        :key="error.name">
                        <small class="form-text text-danger">
                            {{ error.msgs[0] }}
                        </small>
                    </li>
                </ul>
                <div class="form-group password-form">
                    <label>New Password (minimum 8 characters)</label>
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
                      @keyup.enter="registerEnter"
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
                                                    @click="openTerms('/terms')">Terms of Service<br></a>
                    <b-button
                            class="input-height form-control"
                            style="margin-top: 30px"
                            :disabled="isSubmitDisabled"
                            :variant="'warning'"
                            :size="'lg'"
                            :block=true
                            @click="register">
                        Create
                    </b-button>
                </div>
            </div>
            <save-backup v-else-if="pageId==='saveBackup'"
                         @show-page="changePage"></save-backup>
            <confirm-backup v-else-if="pageId==='confirmBackup'"
                            @show-page="changePage"></confirm-backup>
            <success v-else-if="pageId==='success'"></success>
        </div>
    </div>
</template>

<script>
import seedLib from '../../utils/seed.js'
import VHeader from './VHeader.vue'
import validator from 'vue-m-validator'
import icon1 from '../../../static/icons/ic_select_solid.svg'
import icon2 from '../../../static/icons/ic_select_border.svg'
import SaveBackup from './SaveBackup.vue'
import ConfirmBackup from './ConfirmBackup.vue'
import Success from './Success.vue'
export default {
    name: "CreateAccount",
    data: function() {
        return {
            pageId: 'create',
            password: '',
            password2: '',
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
            seed: seedLib.create(15),
            validator: validator,
            registering: false
        }
    },
    created() {
        validator.reset()
    },
    components: {
        Success,
        VHeader,
        SaveBackup,
        ConfirmBackup
    },
    computed: {
        isSubmitDisabled() {
            return this.isFirstRun === true || this.validator.errors.length > 0 || this.read_agree === false
        },
        isPassErrors() {
            let errors = this.validator.getErrors('pass')
            return errors && errors.length > 0
        },
        isPassMatchErrors() {
            let errors = this.validator.getErrors('passmatch')
            return errors && errors.length > 0
        }
    },
    methods: {
        notFirst(field) {
            this.isFirst[field] = false
            this.isFirstRun = /true/i.test(Object.values(this.isFirst).join(''))
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
        },
        registerEnter() {
            this.register()
        },
        register() {
            this.check()
            if (this.isSubmitDisabled) {
                return
            }
            this.registering = true
            this.isFirstRun = true
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
            this.changePage('saveBackup')
        },
        changePage(newPageId) {
            this.registering = false
            this.isFirstRun = false
            this.read_agree = false
            this.pageId = newPageId
        },
        openTerms(route) {
            this.$router.push(route)
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
}
.create-account {
    width: 480px;
    position: relative;
    top: 24px;
}
.create-password {
    height:34px;
    font-size:28px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:34px;
    margin-bottom: 0px;
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
</style>
