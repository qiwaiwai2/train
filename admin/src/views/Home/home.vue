<template>
  <div class="home">
      <div class="model">
          <div @click="signUp">
              <img src="../../assets/image/enter.png" alt="">
              <p>报名</p>
          </div>
          <div @click="gamemanage">
              <img src="../../assets/image/create.png" alt="">
              <p>创建训练科目</p>
          </div>
      </div>
      <div class="model">
          <div @click="equip" class="">
              <img src="../../assets/image/manage.png" alt="">
              <p>设备分配</p>
          </div>
          <div @click="gps">
              <img src="../../assets/image/gps.png" alt="">
              <p>轨迹追踪</p>
          </div>
      </div>
      <div class="btnBox" @click="beginPage">
          <!-- <a-button class="btn" type="primary">前往比赛开始界面</a-button> -->
          <p class="btn">前往比赛开始界面</p>
      </div>
  </div>
</template>

<script>
import Head from '@/components/Head.vue'
export default {
  name: 'home',
  components: {
    Head
  },
  mounted(){
    console.log(process.env)
  },
  methods:{
      signUp(){
        window.open("http://run.alongtech.com:82/cross_web_xl/down/index.html")
        // window.location.href = "http://120.79.142.200:82/cross_web_xl/down/index.html"
      },
      gps(){ //gps
        window.open("http://run.alongtech.com:82/cross_web_xl/trainMap/index.html")
        // window.location.href = "http://120.79.142.200:82/cross_web_xl/trainMap/index.html"
      },
      beginPage(){
        window.open("http://run.alongtech.com:82/cross_web_xl/trainMap/changeTime.html")
      },
      gamemanage(){ //赛事管理
        this.$router.push({path:'/game'})
      },
      equip(){//设备管理
        this.$router.push({path:'/equipDistribute'})
      }
  }
}
</script>
<style lang="scss" scoped>
    .home{
        background-image: linear-gradient(to right, #48C6EF , #6F86D6);
        width: 100%;
        height: 100%;
        padding-top: 60px;
        .model{
            display: flex;
            justify-content: center;
            div{
                background-color: #fff;
                width: 200px;
                height: 120px;
                margin: 20px;
                color: #4275DE;
                font-size: 16px;
                cursor: pointer;
                img{
                    width: 60px;
                    height: 60px;
                    margin-top: 20px;
                    margin-bottom: 5px
                }
            }
        }
        .btnBox{
          display: flex;
          cursor: pointer;
        }
        .btn{
            width: 440px;
            height: 60px;
            background-color: #fff;
            color: #4275DE;
            font-size: 16px;
            margin:0 auto;
            margin-top: 20px;
            border: 1px solid #48C6EF;
            line-height: 60px;
            border-radius: 5px;

        }
    }
</style>
