<template>
    <div class="v-header">
        <div style="width: 560px;">
            <img class="logo"
                 src="../../../static/icons/V_Wallet_Logo@2x.png"/>
        </div>
    </div>
</template>

<script>
export default {
    name: "VHeader"
}
</script>

<style scoped>
.v-header {
    display:flex;
    justify-content:center;
    align-items:center;
    height:70px;
    background:rgba(255,255,255,1);
}
.logo {
    width:146px;
    height:33px;
}
</style>
