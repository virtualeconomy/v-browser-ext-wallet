<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        name: 'app',
        computed: mapState({
            loading: state => state.loading
        }),
    }
</script>
<style>
    @import url("/static/common.css");
</style>
