<template>
    <div class="fingerCard">
        <div class="fingerCard_head">
            赛事：
            <a-select :defaultValue="game[0]" style="width: 250px" @change="handlegameceChange">
                <a-select-option v-for="province in game" :key="province">{{province}}</a-select-option>
            </a-select>
        </div>
        <div class="fingerCard_cont_box">
            <div class="fingerCard_cont" :style="{'height':contHeight-240+'px'}">
                <div class="manTable"  :style="{'height':contHeight-240+'px'}">
                    <table v-show="sportsManList.length>0">
                        <tr class="thead">
                            <th>ID</th>
                            <th>姓名</th>
                            <th>单位</th>
                            <th>指卡ID</th>
                        </tr>
                        <tr class="tbody" v-for="(item,index) in sportsManList" :key="index">
                            <td>123</td>
                            <td>{{item.name}}</td>
                            <!-- <td>{{item.nationality}}</td> -->
                            <td>{{item.nationality}}</td>
                            <td>
                                <input v-model="item.fingerCardNo"  @focus="clickInput(item.id)" type="text">
                            </td>
                        </tr>
                    </table>
                    <div style="margin-top:150px" v-show="sportsManList.length==0" >请先选择赛事！</div>
                </div>
                <div class="fingerCar" v-show="sportsManList.length>0">
                    <p>读取指卡ID：</p>
                    <input readonly v-model="currentCardId" type="text">
                </div>
                
            </div>
        </div>
        <div class="operate_btn">
            <a-button type="primary" @click="operateBth(selectNavigation)">打印</a-button>
        </div>
    </div>
</template>
<script>
    import {findAllCompetition,findListJoinCardByCompetition,updateEntityAndCard} from '@/api'
    export default{
        data(){
            return {
                gameList:{},//赛事对应id
                game:['请选择'],//赛事列表
                sportsManList:[],//运动员列表
                cardArr:[],//指卡号
                currentCardId:'',//当前感应的指卡id
                currentcompetitionid:'',
                currentsportid:'',//当前选中的人员id
                thesocket:null,
            }
        },
        props:['contHeight'],
        mounted(){
            this.getGameList()
            this.cardArr = []
            this.getCard();
        },
        methods:{
            getGameList(){//获取赛事列表
                findAllCompetition().then(res=>{
                    // console.log(res)
                    let data = res;
                    if(data.status==1){
                        let gameList = data.data;
                        gameList.forEach(ele => {
                            this.game.push(ele.name)
                            this.gameList[ele.name] = ele.id
                            this.cardArr = []
                        });
                        // console.log(this.gameList)
                    }
                }).catch(err=>{

                })
            },
            handlegameceChange(value){//赛事选择
                if(value != '请选择'){
                    this.getMan(this.gameList[value])
                    this.currentcompetitionid = this.gameList[value]
                }
            },
            getMan(id){//获取所有人员信息，以及绑定的指卡
                this.sportsManList = []
                findListJoinCardByCompetition(id).then(res=>{
                    console.log(res)
                    if(res.status == 1){
                        let data = res.data
                        this.sportsManList = data;
                        this.sportsManList.reverse()
                        data.forEach(item => {//保存已经有的指卡id
                            if(item.fingerCardNo){
                                // this.cardArr.push(item.fingerCardNo)
                            }
                        })
                    }else{

                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            getCard(){
                let that = this;
                that.thesocket = null;
                //判断当前浏览器是否支持WebSocket
                if('WebSocket' in window){
                    var url=process.env.BASE_URL.replace("http","ws")+"websocket/comCard";//20为客户端窗口标识
                    that.thesocket = new WebSocket(url);
                }
                else{
                    alert('Not support websocket')
                }
                //连接发生错误的回调方法
                that.thesocket.onerror = function(){
                    console.log("webSocket_Err")
                };

                //连接成功建立的回调方法
                that.thesocket.onopen = function(event){
                    console.log("open")
                }
                that.thesocket.onmessage = function(event){
                    console.log(event)
                    let carId = event.data
                    that.currentCardId = carId
                    // if(that.cardArr.indexOf(that.currentCardId)<0){
                        that.cardArr.push(that.currentCardId)
                        if(that.currentsportid){//选中人员
                            for(let i=0;i<that.sportsManList.length;i++){
                                let item = that.sportsManList[i]
                                if(item.id == that.currentsportid){
                                    that.currentsportid = ''
                                    updateEntityAndCard(item.sportsmanFingerCardId,item.id,carId,that.currentcompetitionid).then(res=>{
                                        // console.log(res)
                                        if(res.status==1){
                                            that.$set(that.sportsManList[i], 'fingerCardNo', carId)
                                        }else{
                                            alert(res.msg)
                                        }
                                    })
                                }
                            }
                        }else{
                            for(let i=0;i<that.sportsManList.length;i++){
                                let item = that.sportsManList[i]
                                if(!item.fingerCardNo){
                                    updateEntityAndCard(item.sportsmanFingerCardId,item.id,carId,that.currentcompetitionid).then(res=>{
                                        // console.log(res)
                                        if(res.status==1){
                                            that.$set(that.sportsManList[i], 'fingerCardNo', carId)
                                        }else{
                                            alert(res.msg)
                                        }
                                    })
                                    break
                                }
                            }
                        }
                    // }else{
                        // alert('该指卡已经绑定！')
                    // }
                }
                //连接关闭的回调方法
                that.thesocket.onclose = function(){
                //    console.log("close")
                }
                //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                window.onbeforeunload = function(){
                    that.thesocket.close();
                }
                //关闭连接
                function closeWebSocket(){
                    that.thesocket.close();
                }
            },
            clickInput(e){
                this.currentsportid = e
            }
        },
        beforeDestroy(){
          this.thesocket.close();
        }
    }
</script>
<style lang="scss" scoped>
.fingerCard_head{
    padding-left: 60px;
    background-color: #E2F2FF;
    height: 40px;
    display: flex;
    align-items: center;
}
.operate_btn{
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #E2F2FF;
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0
}
.fingerCard_cont{
    width: 100%;
    margin-top: 20px;
    position: relative;
    .manTable{
        overflow-y: auto;
        padding-bottom: 5px;
        table{
            border: 1px solid #DDDDDD;
            border-bottom: none;
            width: 650px;
            .thead{
                background-color: #F7FBFF;
                border-bottom: 1px solid #DDDDDD;
                height: 35px;
            }
            .tbody{
                background-color: #fff;
                border-bottom: 1px solid #DDDDDD;
                height: 35px;
                color: #666;
                input{
                    width: 100px;
                    height: 26px;
                    color: #387EE8;
                    text-align: center;
                    border: 1px solid #999
                }
            }
        }
    }
    .fingerCar{
        position: absolute;
        top: 60px;
        left: 700px;
        background-color: #387EE8;
        width: 220px;
        height: 120px;
        text-align: left;
        padding-left: 22px;
        border-radius: 5px;
        p{
            color: #fff;
            margin-top: 28px;
            margin-bottom: 5px;
        }
        input{
            width: 150px;
            height: 30px;
            border-radius: 3px;
            background-color: #fff;
            color: #387EE8;
            text-align: center;
        }
    }
}
</style>
