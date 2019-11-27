<template>
    <div>
        <b-navbar class="nav-item">
            <b-navbar-brand>
              <img class="v-logo" src="../../static/icons/ic_v_logo@3x(1).png">
            </b-navbar-brand>
            <b-navbar-nav class="account">
              <p class="account-name">{{ accountNames[selectedAccount] }}</p>
              <p class="account-address">{{ addressShow }}</p>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown right
                                   class="pr-0"
                                   no-caret>
                <template slot="button-content">
                  <canvas class="avatar col pr-0 canvas"
                          width="36"
                          height="36"
                          :data-jdenticon-hash="avatarDataHex(addresses[selectedAccount])"></canvas>
                </template>
              <b-dropdown-item-button class="button"
                                      :class="{'selected-account': index === selectedAccount}"
                                      @click="select(index)"
                                      v-for="(address, index) in addresses">
                      <canvas class="canvas-item"
                              width="32"
                              height="32"
                              :data-jdenticon-hash="avatarDataHex(address)"></canvas>
                      <div style="display: inline-block; margin-left: 10px; height: 35px;">
                          <p class="address-item">{{ accountNames[index] }}</p>
                          <p class="amount-item">88999.2 VSYS</p>
                      </div>
                      <img v-if="index === selectedAccount"
                           class="select"
                           width="10px"
                           height="8px" src="../../static/icons/ic_selected@2x.png">
              </b-dropdown-item-button>
              <b-dropdown-item v-b-modal.addAccount href="#" class="drop-down"> <img class="icon" src="../../static/icons/ic_add_account@2x.png"><span class="text">Add Account</span></b-dropdown-item>
              <b-dropdown-item v-b-modal.details href="#" class="drop-down"><img class="icon" src="../../static/icons/ic_about@2x.png"><span class="text">About</span></b-dropdown-item>
              <b-dropdown-item v-b-modal.settings href="#" class="drop-down"><img class="icon" src="../../static/icons/ic_setting@2x.png"><span class="text">Settings</span></b-dropdown-item>
              <b-dropdown-item @click="logout" class="drop-down"><img class="icon" src="../../static/icons/ic_logout@2x.png"><span class="text">Log Out</span></b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-navbar>
      <AddAccount></AddAccount>
      <Details></Details>
      <Settings></Settings>
    </div>
</template>

<script>
import jdenticon from 'jdenticon'
import converters from '../js-v-sdk/src/utils/converters.js'
import Details from './Details.vue'
import AddAccount from './AddAccount.vue'
import Settings from './Settings.vue'
export default {
    name: "NavBar",
    mounted() {
      jdenticon()
    },
    props: {
        addresses: {
            type: Object,
            require: true,
            default: function() {}
        },
        accountNames: {
            type: Array,
            require: true,
            default: function() {
            }
        },
        balances: {
            type: Object,
            require: true,
            default: function() {}
        },
        selectedAccount: {
            type: Number,
            require: true,
            default: 0
        }
    },
    components: {
        Details,
        AddAccount,
        Settings
    },
    methods: {
        logout() {
            this.$store.commit('wallet/updatePassword', false)
            this.$router.push('/login')
        },
        avatarDataHex(address) {
            return converters.stringToHexString(address).split('').reverse().slice(1, 21).join('')
        },
        select(index) {
            this.$store.commit('account/updateSelectedAccount', index)
        }
    },
    computed: {
        addressShow() {
            const addrChars = this.addresses[this.selectedAccount].split('')
            addrChars.splice(6, 23, '...')
            return addrChars.join('')

        }
    }
}
</script>

<style scoped>
.v-logo {
    width: 28px;
    height: 28px;
}
.icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
}
.canvas-item {
    display: inline-block;
    margin-left: -10px;
    margin-top: 8px;
}
.text {
    width:86px;
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
}
.drop-down {
    margin-top: 10px;
    height: 40px;
}
.button {
    margin-top: 8px;
    margin-right: 16px;
    margin-left: 16px;
    display: inline-block;
    width:198px;
    height:56px;
    background:rgba(247,247,252,1);
    border-radius:4px;
}
.canvas {
    padding-right: 0px !important;
    margin-top: 6px;
}
.nav-item {
    height: 60px;
    padding-right: 6px;
    background:#FFFFFF;
}
.account {
    flex-direction: column !important;
    margin-left: 75px;
}
.account-name {
    width:110px;
    height:19px;
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:19px;
    text-align: center;
    margin-top: 20px;
}
.account-address {
    width:110px;
    height:14px;
    font-size:12px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:14px;
    margin-top: -15px;
}
.address-item {
    width:67px;
    height:16px;
    font-size:14px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:16px;
    margin-bottom: 4px;
}
.amount-item {
    width:83px;
    height:13px;
    font-size:11px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:13px;
    margin-bottom: 4px;
}
.selected-account {
    border:1px solid rgba(255,136,55,1);
}
.select {
    margin-top: -25px;
    margin-left: 25px;
    display: inline-block;
}

</style>
