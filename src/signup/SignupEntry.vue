<template>
    <div class="select">
        <div class="v-header">
            <img class="v-logo"
                 src="../../static/icons/ic_add_account@2x.png">
        </div>
        <div class="select-body">
            <div class="new-part">
                <div class="new-txt">New to V Wallet?</div>
            </div>
            <div class="import-part">
                <div><img class="import-icon"
                          src="../../static/icons/ic_add_account@2x.png"></div>
                <div class="txt-1"><span>No, I already have a seed phrase</span></div>
                <div class="txt-2"><span>Import your existing wallet using a 12 word seed phrase</span></div>
                <div>
                    <b-button class="btn-import">
                        <b class="import-txt">Import Wallet</b></b-button>
                </div>
            </div>
            <div class="create-part">
                <img class="create-icon"
                     src="../../static/icons/ic_add_account@2x.png">
                <span class="txt-1">Yes, let's get set up!</span>
                <span class="txt-2">This will create a new wallet and seed phrase</span>
                <b-button class="btn-create">
                    <b class="create-txt">Create a Wallet</b></b-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'SignupEntry'
    }
</script>
<style scoped>
    .select {
        width:1440px;
        height:740px;
        background:rgba(247,247,252,1);
        margin: 0 auto;
    }
    .v-header {
        width:1440px;
        height:60px;
        background:rgba(255,255,255,1);
    }
    .v-logo {
        margin-left:360px;
        margin-top:16px;
        width:125px;
        height:28px;
    }
    .select-body {
        width:1440px;
        height:680px;
        background:rgba(247,247,252,1);
    }
    .new-part {
        width:1440px;
        height:194px;
    }
    .new-txt {
        margin-left:617px;
        margin-top:96px;
        font-size:28px;
        font-family:SFProDisplay-Medium,SFProDisplay;
        font-weight:500;
        color:rgba(50,50,51,1);
        line-height:34px;
    }
    .import-part {
        width:340px;
        height:247px;
        background:rgba(255,255,255,1);
        border-radius:6px;
        border:1px solid rgba(230,230,237,1);
        display:inline-block;
        margin-left:360px;
    }
    .import-icon {
        width:28px;
        height:28px;
        margin-left:160px;
        margin-top:40px;
    }
    .txt-1 {
        font-size:16px;
        font-family:SFProText-Semibold,SFProText;
        font-weight:600;
        color:rgba(50,50,51,1);
        line-height:19px;
        margin-left: 40px;
        margin-top: 20px;
    }
    .txt-2 {
        font-size:13px;
        font-family:SFProText-Regular,SFProText;
        font-weight:400;
        color:rgba(169,169,176,1);
        line-height:16px;
        margin-left: 30px;
        margin-top: 8px;
    }
    .btn-import {
        width:160px;
        height:40px;
        background:rgba(255,136,55,1);
        border-radius:4px;
    }
    .import-txt {
        font-size:16px;
        font-family:SFProText-Medium,SFProText;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:19px;
        margin-left: 28px;
        margin-top: 10px;
    }
    .create-icon {
        width:28px;
        height:28px;
        margin-left:160px;
        margin-top:40px;
    }
    .create-part {
        width:340px;
        height:247px;
        background:rgba(255,255,255,1);
        border-radius:6px;
        border:1px solid rgba(230,230,237,1);
        display:inline-block;
        margin-left:40px;
    }
    .btn-create {
        width:160px;
        height:40px;
        background:rgba(255,136,55,1);
        border-radius:4px;
    }
    .import-txt {
        font-size:16px;
        font-family:SFProText-Medium,SFProText;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:19px;
        margin-left: 21px;
        margin-top: 10px;
    }
</style>
