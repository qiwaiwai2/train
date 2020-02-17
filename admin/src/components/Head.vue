<template>
    <div class="head">
        <div class="logo">
            <p>定向越野后台</p>
            <p>Orienteering system</p>
        </div>
        <div class="userInfo">
            <img src="" alt="">
            <p>
                <span>管理员</span>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Head',
}
</script>
<style lang="scss" scoped>
    .head{
        background-color: #fff;
        padding: 0 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100px;
        .logo{
            color: #387EE8;
            p:nth-child(1){
                font-size: 24px;
            }
            p:nth-child(2){
                font-size: 14px;
            }
        }
        .userInfo{
            display: flex;
            align-items: center;
            img{
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: red;
                margin-right: 20px
            }
            p{
                font-size: 18px;
                color: #333
            }
        }
    }
</style>


