<template>
    <div class="success">
        <p class="p1">Congratulations!</p>
        <p class="p2">Your account has been created. Please click icon to use the wallet.</p>
        <img class = "tip-img" src="../../../static/icons/tip.png"/>
        <b-button
                class="input-height"
                :variant="'warning'"
                :size="'lg'"
                :block=true
                @click="closePage">
            Close
        </b-button>
    </div>
</template>

<script>
export default {
    name: "success",
    methods: {
        closePage() {
            window.close()
        }
    }
}
</script>

<style scoped>
.success {
    justify-content:center;
    align-items:center;
    width: 560px;
    text-align: center;
    position: relative;
    top: -70px;
}
.p1 {
    height:40px;
    font-size:32px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:40px;
}
.p2 {
    height:21px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:21px;
}
.tip-img {
    width: 80%;
    position: relative;
    top: 20px;
}
.input-height {
    width: 280px;
    margin-left: 140px;
    margin-top: 50px;
    height: 50px;
}
</style>
