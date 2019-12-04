<template>
    <div class="add-token">
        <div class="add-word">
            <span class="add">Add Tokens</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AddToken",
        methods: {
        }
    }
</script>

<style scoped>
.add-token {
    width:360px;
    background:rgba(247,247,252,1);
    text-align: center;
}

.add-word {
    position: relative;
    top: 24px;
    left: 24px;
}
.add {
    font-size:24px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:29px;
}
</style>
