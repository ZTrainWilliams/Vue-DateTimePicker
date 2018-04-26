<template>
    <div id="app">
        <router-view ></router-view>
    </div>
</template>
<style>
    #app{
        position: relative;
        width: 100%;
        height: 100%;
    }
    #app>div{
        height: 100%; 
        width:100%;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
    }
</style>
<script>
    import "./assets/css/base.css"
    import "./assets/font/iconfont.css"

    export default {
        name: 'app',
        methods:{},
        data(){
            return {}
        }
    }
</script>
