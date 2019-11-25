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
    width: 560px;
    position: relative;
    display: block;
    top: 28px;
}
.p1 {
    height:40px;
    font-size:32px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:red;
    line-height:40px;
}
.p2 {
    height:21px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:red;
    line-height:21px;
}
.tip-img {
    width: 80%;
    height: 500px;
    margin:40px auto;
}
.input-height {
    width: 50%;
    /*margin-top: 40px;*/
    height: 51px;
    position: relative;
    left: 80px;
}
</style>
