<template>
    <div class="home">
        <nav-bar class="nav-bar"></nav-bar>
        <div class="account-content">
            <div>
                <img class="token-icon"
                     src="../../static/icons/ic_v_logo@3x.png">
            </div>
            <div class="balance">
                <span class="token-balance">3097.7997</span>
                <span class="unit">VSYS</span>
            </div>
            <div class="btn">
                <b-button class="btn-deposit">
                    <img class="icon-btn"
                         src="../../static/icons/ic_deposit@3x.png"><b class="deposit-txt">Deposit</b></b-button>
                <b-button class="btn-send">
                    <img class="icon-btn"
                         src="../../static/icons/ic_send@3x.png"><b class="send-txt">Send</b></b-button>
            </div>
        </div>
        <transaction-records class="transaction-records"></transaction-records>
    </div>
</template>

<script>
import NavBar from './NavBar.vue'
import Send from './Send.vue'
import Deposit from './Deposit.vue'
import TransactionRecords from './TransactionRecords.vue'
import { mapState } from 'vuex'
import Vue from 'vue'
export default {
    name: "Home",
    components: {
        NavBar,
        Send,
        Deposit,
        TransactionRecords
    },
    computed: {
        ...mapState({
            localWallet: state => state.wallet.localWallet,
        }),
    },
    created() {
        if (!Vue.ls.get('pwd')) {
            this.$router.push('/login')
        }
    }
}
</script>

<style scoped>
.home {
    width:360px;
    height:560px;
    background:rgba(247,247,252,1);
    color:#F7F7FC;
}
.nav-bar {
    height: 60px;
    width: 100%;
    z-index:1000;
}
.account-content {
    height: 237px;
    width: 100%;
}
.token-icon {
    width: 56px;
    height: 56px;
    margin-left:152px;
    margin-top:32px;
}
.balance {
    margin-top: 20px;
    width: 100%;
    height: 33px;
}
.token-balance {
    display:inline-block;
    font-size:28px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:33px;
    margin-left: 93px;
}
.unit {
    display:inline-block;
    font-size:16px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:19px;
    margin-left: 4px;
}
.btn {
    width:100%;
    height:96px;
}
.btn-deposit {
    margin-top: 24px;
    display:inline-block;
    width:128px;
    height:40px;
    background:rgba(0,188,37,1);
    border-radius:4px;
}
.btn-send {
    margin-top: 24px;
    margin-left: 20px;
    width:128px;
    height:40px;
    background:rgba(246,0,46,1);
    border-radius:4px;
}
.icon-btn {
    width:16px;
    height:16px;
}
.deposit-txt {
    width:59px;
    height:19px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:19px;
    margin-left:8px;
}
.send-txt {
    width:39px;
    height:19px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:19px;
    margin-left:8px;
}
.transaction-records {
    height: 263px;
    width: 328px;
    z-index:1000;
    margin-left:16px;
}
</style>
