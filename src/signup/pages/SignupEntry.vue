<template>
    <div class="select">
        <div class="v-header">
            <img class="v-logo"
                 src="../../../static/icons/V_Wallet_Logo@2x.png"></div>
        <div class="select-body">
            <div class="new-part">
                <div class="new-txt">New to V Wallet?</div>
            </div>
            <div class="import-part">
                <div><img class="import-icon"
                          src="../../../static/icons/ic_import_big@2x.png"></div>
                <div><span class="txt-1">No, I already have a seed phrase</span></div>
                <div><span class="txt-2">Import your existing wallet using a 12 word seed phrase</span></div>
                <div>
                    <b-button type="button" class="btn-import btn-warning"
                              @click="changePage('/signup')">
                        <b class="import-txt">Import Wallet</b></b-button>
                </div>
            </div>
            <div class="create-part">
                <div><img class="create-icon"
                          src="../../../static/icons/ic_add_account@2x.png"></div>
                <div><span class="txt-1">Yes, let's get set up!</span></div>
                <div><span class="txt-2">This will create a new wallet and seed phrase</span></div>
                <div>
                    <b-button type="button" class="btn-create btn-warning"
                              @click="changePage('/create')">
                        <b class="create-txt">Create a Wallet</b></b-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SignupEntry',
    methods: {
        changePage(route) {
            console.log(this.$route)
            this.$router.push(route)
        }
    }
}
</script>
<style>
.select {
    width:1680px;
    height:863px;
    background:rgba(247,247,252,1);
    margin: 0 auto;
}
.v-header {
    width:1680px;
    height:70px;
    background:rgba(255,255,255,1);
}
.v-logo {
    margin-left:420px;
    margin-top:19px;
    width:146px;
    height:33px;
}
.select-body {
    width:1680px;
    height:793px;
    background:rgba(247,247,252,1);
}
.new-part {
    width:1680px;
    height:226px;
}
.new-txt {
    margin-left:720px;
    margin-top:112px;
    font-size:33px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:40px;
}
.import-part {
    width:397px;
    height:288px;
    background:rgba(255,255,255,1);
    border-radius:7px;
    border:1px solid rgba(230,230,237,1);
    display:inline-block;
    margin-left:420px;
    text-align: center;
}
.import-icon {
    width:33px;
    height:33px;
    margin-top:47px;
}
.txt-1 {
    font-size:19px;
    font-family:SFProText-Semibold,SFProText;
    font-weight:600;
    color:rgba(50,50,51,1);
    line-height:22px;
    margin-top: 23px;
}
.txt-2 {
    font-size:15px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:19px;
    margin-top: 9px;
    text-align: center;
}
.btn-import {
    width:187px;
    height:47px;
    background:rgba(255,136,55,1);
    border-radius:5px;
    margin-top: 42px;
    border-color: #FF8737
}
.btn-warning {
    color: darkorange;
}
.import-txt {
    font-size:19px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:22px;
    text-align: center;
}
.create-part {
    width:397px;
    height:288px;
    background:rgba(255,255,255,1);
    border-radius:7px;
    border:1px solid rgba(230,230,237,1);
    display:inline-block;
    margin-left:47px;
    text-align: center;
}
.create-icon {
    width:33px;
    height:33px;
    margin-top:47px;
}
.btn-create {
    width:187px;
    height:47px;
    background:rgba(255,136,55,1);
    border-radius:5px;
    margin-top: 42px;
    border-color: #FF8737
}
.create-txt {
    font-size:19px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:22px;
    text-align: center;
}
</style>
