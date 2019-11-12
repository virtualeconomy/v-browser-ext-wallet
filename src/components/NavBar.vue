<template>
<div class="nav-item">
    <div>
        <img class="v-logo"
             src="../../static/icons/ic_v_logo@3x(1).png">
    </div>
    <div>
        <p class="account-name">Account 1</p>
    </div>
    <div>
        <p class="account-address">AUAztx...HHWpUR</p>
    </div>
    <div>
        <img class="address-select"
             src="../../static/icons/ic_arrow_down_yellow@3x.png">
    </div>
    <div>
        <img class="account-logo"
             src="../../static/icons/ic_v_logo@3x(1).png">
    </div>
    <div>
    </div>
</div>
</template>

<script>
export default {
    name: "NavBar"
}
</script>

<style scoped>
.v-logo {
    position:fixed;
    left:16px;
    top:14px;
    width: 28px;
    height: 28px;
}
.account-logo {
    position:fixed;
    left:310px;
    top:12px;
    width:36px;
    height:36px;
    border:1px solid rgba(255,136,55,1);
}
.nav-item {
    width:360px;
    height:60px;
    background:#FFFFFF;
}
.account-name {
    position:fixed;
    left:142px;
    top:-4px;
    width:77px;
    height:19px;
    font-size:16px;
    /*font-family:SFProText-Medium,SFProText;*/
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:19px;
}
.account-address {
    position:fixed;
    left:127px;
    top:18px;
    width:107px;
    height:14px;
    font-size:12px;
    /*font-family:SFProText-Regular,SFProText;*/
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:14px;
}
.address-select {
    position:fixed;
    left:176px;
    top:48px;
    width: 10px;
    height: 6px;
    color:#FF8837;
}

</style>
