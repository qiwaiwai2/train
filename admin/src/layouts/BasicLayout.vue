<template>
    <div class="dashout">
        <a-layout id="components-layout-demo-top-side-2">
            <a-layout-header style="padding:0" class="header">
                <Header />
            </a-layout-header>
            <a-layout>
            <!-- <a-layout-sider width="240" style="background: #2A3C57">
                <SliderMenu />
            </a-layout-sider> -->
            <a-layout style="padding: 0 24px 24px">
                <a-breadcrumb style="margin: 16px 0;text-align:left">
                    <!-- <a-breadcrumb-item class="slidergoBack" style="cursor:pointer" >
                        <a-icon type="left" @click="$router.go(-1)" style="color:#333" />
                    </a-breadcrumb-item>
                    
                    <a-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">
                        {{item}}
                    </a-breadcrumb-item> -->
                </a-breadcrumb>
                <a-layout-content :style="{ background: '#fff', padding: '15px', margin: 0, minHeight: '280px',position:'relative' }">
                    <router-view :contHeight="contHeight" />
                </a-layout-content>
            </a-layout>
            </a-layout>
        </a-layout>
    </div>
</template>
<script>
import Header from './Header'
import Footer from './Footer'
import SliderMenu from './SliderMenu'
export default {
    data () {
        return {
            collapsed: false,
            slideHeight:500,//侧边栏高度
            contHeight:400,//活动区域高度
        }
    },
    components:{
        Header,
        Footer,
        SliderMenu
    },
    mounted(){
        let windHeight = document.documentElement.clientHeight
        this.slideHeight = windHeight-80
        this.contHeight = windHeight-80
    },
    methods:{
        back(){
            this.$router.go(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
.dashout{
    height: 100%;
}
#components-layout-demo-top-side-2{
    height: 100%;
}
.ant-layout-header{
    background-color: #fff;
}
.header{
    height: 80px;
}

</style>


