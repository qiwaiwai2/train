<template>
    <div class="gameSet">
        <div class="gameSetHead">
            <div class="drawLoats_cont_navigation">
                <a-menu
                    v-model="current"
                    mode="horizontal"
                    @click="click"
                >
                    <a-menu-item @click="gameItem" key="sx">赛项</a-menu-item>
                    <a-menu-item @click="group" key="zb" >组别</a-menu-item>
                    <a-menu-item @click="bind" key="bd" >绑定</a-menu-item>
                    <!-- <a-menu-item @click="collocation" key="pz" >配置</a-menu-item> -->
                </a-menu>
            </div>
        </div>
        <div class="gamesetCont">
            <router-view :contHeight="contHeight"></router-view>
        </div>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            current:['sx']
        }
    },
    props:['contHeight'],
    mounted(){
        // console.log(this.$route.query)
    },
    methods:{
        click(item){
            // console.log(item)
        },
        gameItem(){//赛项
            this.$router.push({path:'/game/gameSet/gameItem',query:{gameId:this.$route.query.gameId,gameName:this.$route.query.gameName}})
        },
        group(){//组别
            this.$router.push({path:'/game/gameSet/group',query:{gameId:this.$route.query.gameId,gameName:this.$route.query.gameName}})
        },
        bind(){//绑定
            this.$router.push({path:'/game/gameSet/bind',query:{gameId:this.$route.query.gameId,gameName:this.$route.query.gameName}})
        },
        collocation(){//配置
            this.$router.push({path:'/game/gameSet/collocation',query:{gameId:this.$route.query.gameId,gameName:this.$route.query.gameName}})
        }
    },
    beforeRouteUpdate(to,from,next){
        to.meta.splice(0)
        to.meta.push(from.meta[0])
        next()
    }
}
</script>
<style lang="scss" scoped>
    .gameSet{
        height: 100%;
        overflow-y: auto
    }
    .drawLoats_cont_navigation{
        ul{
            text-align: left;
            padding-left: 80px;
            li{
                margin-right: 30px
            }
        }
        
    }
    .gamesetCont{
        margin-top: 20px
    }
</style>


