<template>
    <div class="head">
        <div class="logo">
            <img style="width:120px" src="../assets/image/logo.png" alt="">
            <p>秀跑训练管理系统</p>
        </div>
        <div class="userInfo">
            <div @click="home">
                <img src="../assets/image/zhuye.png" alt="">
                <!-- <span>主页</span> -->
            </div>
            <div @click="$router.go(-1)">
                <img src="../assets/image/fanhui.png" alt="">
                <!-- <span>返回</span> -->
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Head',
    methods:{
        home () {
            this.$router.push({path:'/home'})
        }
    }
}
</script>
<style lang="scss" scoped>
    .head{
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        line-height: normal;
        background-image: linear-gradient(to right, #384dc4  , #2b8ddc);
        padding: 0 50px;
        p{
            margin-bottom: 0
        }
        .logo{
            color: #fff;
            // display: flex;
            // align-items: center;
            p:nth-child(2){
                font-size: 14px;
                // margin-left: 5px;
            }
        }
        .userInfo{
            display: flex;
            align-items: center;
            div{
                display: flex;
                align-items: center;
                color: #fff;
                margin-left: 12px;
                cursor: pointer;
            }
            img{
                width: 18px;
                height: 18px;
                margin-right: 5px
            }
        }
    }
</style>


