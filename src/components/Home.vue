<template>
    <div class="home">
        <nav-bar></nav-bar>
    </div>
</template>

<script>
import NavBar from './NavBar.vue'
import Send from './Send.vue'
import Deposit from './Deposit.vue'
import TransactionRecords from './TransactionRecords.vue'
export default {
    name: "Home",
    components: {
        NavBar,
        Send,
        Deposit,
        TransactionRecords
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
</style>
