<template>
    <div class="layout-main">
        <v-header></v-header>
        <div class="content">
            <div v-if="pageId==='create'"
                 class="create-account">
                <div class="back">
                    <img class = "back-icon" src="../../../static/icons/ic_back@2x.png"/>
                    <b-btn class="back-link text-decoration-none" variant="link"
                           @click="back('/SignupEntry')">Back</b-btn>
                </div>
                <p class="create-password">Create Password</p>
                <ul class="form-group"
                    :class="{'error-messages':!this.validator.errors.length > 0}">
                    <li style="margin-bottom: 5px;" v-for="error in validator.errors"
                        :key="error.name">
                        <small class="form-text text-danger">
                            {{ error.msgs[0] }}
                        </small>
                    </li>
                </ul>
                <div class="form-group first-group">
                    <label>New Password (min 8chars)</label>
                    <input
                      type="password"
                      name="password"
                      class="form-control input-height"
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
                      class="form-control input-height"
                      :class="{'text-danger':isPassMatchErrors,'is-invalid':isPassMatchErrors}"
                      :readonly="registering"
                      @input="checkPasswordMatch(password, password2)"
                      @keyup.enter="registerEnter"
                      v-model="password2">
                </div>
                <div class="form-group password-form">
                    <label>Choose Network</label>
                    <select class="form-control input-height select"
                            v-model="network">
                        <option>Mainnet</option>
                        <option>Testnet</option>
                    </select>
                </div>
                <div class="terms">
                    <img id="img_read"
                         style="margin-top: -3px;"
                         @click="changeIcon"
                         src="../../../static/icons/ic_select_border.svg">
                      &nbsp;I have read and agree to the <a class='vsys-color'
                                                    href="#"
                                                    target="_blank"
                                                    @click="openTerms()">Terms of Service<br></a>
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
        </div>
    </div>
</template>

<script>
import VHeader from './VHeader.vue'
import validator from 'vue-m-validator'
import icon1 from '../../../static/icons/ic_select_solid.svg'
import icon2 from '../../../static/icons/ic_select_border.svg'
import SaveBackup from './SaveBackup.vue'
export default {
    name: "CreateAccount",
    data: function() {
        return {
            pageId: 'create',
            password: '',
            password2: '',
            isFirstRun: true,
            network: 'Mainnet',
            read_agree: false,
            isFirst: {
                'pwd1': true,
                'pwd2': true
            },
            validator: validator,
            registering: false
        }
    },
    created() {
        validator.reset()
    },
    components: {
        VHeader,
        SaveBackup
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
            this.changePage('saveBackup')
        },
        changePage(newPageId) {
            this.pageId = newPageId
        },
        openTerms() {
            this.$router.push('/SignupEntry')
        }
    }
}
</script>

<style scoped>
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
    width: 560px;
    position: relative;
    top: 28px;
}
.create-password {
    height:40px;
    font-size:33px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:40px;
}
.password-form {
    margin-top: 37px;
}
.password-form label {
    height:19px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:19px;
}
.input-height {
    width: 100%;
    margin-top: 14px;
    height: 56px;
}
.back {
    height: 60px;
}
.back-icon {
    width: 14px;
    height: 14px;
}
.back-link {
    width:39px;
    height:19px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:19px;
    padding: 2px 0px;
    margin-bottom: 4px;
}
.terms {
    font-size:19px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:22px;
    margin-top: 37px;

}
.select {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background: url("../../../static/icons/ic_arrow_down_gray@2x.png") no-repeat scroll 530px center #fff;
    background-size: 12px;
    padding-left: 19px;
    font-size:19px;
    font-weight:400;
    line-height:22px;
}
.select option {
    width:71px;
    height:22px;
    font-size:19px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:22px;
}
.check-right {
    float: right;
    margin-top: -30px;
    margin-right: 16px;
}
.error-messages {
    /*margin-bottom: -30px;*/
    margin-top: 50px;
}
</style>