<template>
    <div class="select">
        <div class="v-header-container">
            <div class="v-header">
                <img class="v-logo"
                    src="../../../static/icons/V_Wallet_Logo.png"></div>
        </div>
        <div class="select-body">
            <div class="new-part">
                <div class="new-txt">New to V Wallet?</div>
            </div>
            <div class="import-create-part">
                <div><img class="import-create-icon"
                          src="../../../static/icons/ic_import_big.png"></div>
                <div><span class="txt-1">No, I already have a seed phrase</span></div>
                <div><span class="txt-2">Import your existing wallet using a 12 word seed phrase</span></div>
                <div>
                    <b-button type="button" class="btn-import-create btn-warning"
                              @click="changePage('/import')">Import Wallet</b-button>
                </div>
            </div>
            <div class="import-create-part">
                <div><img class="import-create-icon"
                          src="../../../static/icons/ic_add_account.png"></div>
                <div><span class="txt-1">Yes, let's get set up!</span></div>
                <div><span class="txt-2">This will create a new wallet and seed phrase</span></div>
                <div>
                    <b-button type="button" class="btn-import-create btn-warning"
                              @click="changePage('/create')">Create a Wallet</b-button>
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
            this.$router.push(route)
        }
    }
}
</script>
<style scoped>
.select {
    background:rgba(247,247,252,1);
}
.v-header-container {
    height:70px;
    background:rgba(255,255,255,1);
    text-align: center;
}
.v-header {
    max-width: 700px;
    text-align: left;
    margin: 0 auto;
}
.v-logo {
    margin-top:19px;
    width:146px;
    height:33px;
}
.select-body {
    text-align: center;
    background:rgba(247,247,252,1);
}
.new-part {
    height:98px;
}
.new-txt {
    margin-top:112px;
    font-size:28px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:40px;
}
.import-create-part {
    width:340px;
    height:247px;
    background:rgba(255,255,255,1);
    border-radius:7px;
    border:1px solid rgba(230,230,237,1);
    display:inline-block;
    margin: 0px 20px;
    padding: 20px;
    text-align: center;
}
.import-create-icon {
    width:28px;
    height:28px;
    margin: 20px;
}
.txt-1 {
    font-size:16px;
    font-family:SFProText-Semibold,SFProText;
    font-weight:600;
    color:rgba(50,50,51,1);
    line-height:22px;
    margin-top: 23px;
}
.txt-2 {
    font-size:13px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:19px;
    margin-top: 9px;
    text-align: center;
    margin-top: 5px;
}
.btn-import-create {
    width:160px;
    height:40px;
    background:rgba(255,136,55,1);
    border-radius:5px;
    margin-top: 23px;
    border-color: #FF8737;
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:22px;
    text-align: center;
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
</style>
