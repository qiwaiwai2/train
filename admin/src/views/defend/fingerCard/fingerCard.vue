<template>
    <div class="gps">
        <div class="gps_head">
            <a-input v-model="searchInfo" @pressEnter="searchBtn" placeholder="请输入指卡号"></a-input>
            <a-button @click="searchBtn" type="primary">搜索</a-button>
            <!-- <a-button type="primary">导入</a-button> -->
            <a-button @click="creategps" type="primary">+创建</a-button>
            
        </div>
        <div class="gps_list">
            <a-table style="width:600px" :columns="columns" align='center'  :dataSource="gamedata" :pagination="false" >
                <span slot="action" class="operate" slot-scope="text, record">
                    <img @click="editItem(record.key,record.state,record.no)" src="../../../assets/image/edit.png" alt="">
                    <img  @click.stop="deleteItem(record.key)" src="../../../assets/image/delete.png" alt="">
                </span>
            </a-table>
            <div class="fingerCar">
                <p>读取指卡ID：</p>
                <input v-model="currentCardId" type="text">
            </div>
            <a-pagination style="width:600px" @change="changePage" :pageSize="pageSize" v-model="current" :defaultCurrent="1" :total="totalPage" />
        </div>
        <!-- 创建赛事 -->
        <a-modal
            title="新增指卡"
            v-model="visible"
            @ok="handleOk"
            @cancel="canceledit"
            >
            <div class="game_name">
                编号：<a-input v-model="fingerno" placeholder="请输入"/>
            </div>
            <div class="game_local">
                状态：<a-select :defaultValue="fingerState" @change="handleChange">
                        <a-select-option value="0">未使用</a-select-option>
                        <a-select-option value="1">使用中</a-select-option>
                        <a-select-option value="2">已损坏</a-select-option>
                    </a-select>
            </div>
        </a-modal>
    </div>
</template>
<script>
import {fingerfindAllGetPage,fingersaveEntity,fingerdelEntity} from '@/api'
export default {
    data(){
        return {
            currentCardId:'',//当前指卡id
            columns:[{
                    title: '编号',
                    dataIndex: 'no',
                    key: 'no',
                    align:'center'
                },  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    align:'center'
                }, {
                    title: '操作',
                    key: 'action',
                    dataIndex:'action',
                    align:'center',
                    scopedSlots: { customRender: 'action' },
            }],
            gamedata:[],
            visible:false,
            fileList: [],
            uploading: false,
            current:1,//当前页数
            pageSize:5,//一页条数
            totalPage:1,//总条数
            fingerid:null,//指卡 id
            fingerno:'',//指卡编号
            fingerState:'0',//指卡状态--0未使用  1使用  2损坏
            searchInfo:'',//搜索信息
            thesocket:null,//socket
        }
    },
    mounted(){
        // console.log(this.$route.query)
        this.getData()
        // this.bindfinger()
        this.bindfinger();
    },
    methods:{
        getData(){//获取指卡列表
            this.gamedata = []
            fingerfindAllGetPage(this.current,this.pageSize,this.searchInfo).then(res=>{
               console.log(res)
               if(res.status == 1){
                    let data = res.data
                    let gamelist = data.data
                    this.totalPage = data.recordsTotal
                    gamelist.forEach((item,index)=>{
                        this.gamedata.push({
                            key:item.id,
                            no: item.cardNo,
                            state:item.state,
                            status:item.state==0?'未使用':(item.state==1?'使用中':'已损坏') ,
                        })
                    })
               }
            })
        },
        canceledit(e){//取消编辑
            // console.log(e)
            this.fingerid = null
        },
        handleOk(e) {//确认创建
            // console.log(e);
            this.editFinger()
        },
        searchBtn(){//搜索
            this.getData()
        },
        creategps(){//创建
            this.visible = true
            this.fingerid = null
            this.fingerState = '0'
        },
        editItem(key,state,no){//编辑
            this.visible = true
            this.fingerno = no
            this.fingerid = key
            this.fingerState = state
        },
        deleteItem(key){//删除
            // console.log(key)
            this.$tips.confirm('是否确定要删除此指卡？').then(res=>{
                // console.log(res)
                fingerdelEntity(key).then(res=>{
                    if(res.status == 1){
                        this.$message.success('删除成功！',1).then((res)=>{
                           this.gamedata.forEach((ele,index) => {
                                if(key == ele.key){
                                    this.gamedata.splice(index,1)
                                }
                            });
                        })
                    }
                })
            }).catch(err=>{
                // console.log(err)
            })
            
        },
        changePage(e){//改变页数
            this.current = e
            this.getData()
        },
        handleChange(e){//选择状态
            this.fingerState = e
        },
        editFinger(){//编辑创建指卡
            let params = {
                id:this.fingerid,
                cardNo:this.fingerno,
                state:this.fingerState
            }
            // console.log(params)
            fingersaveEntity(params).then(res=>{
                console.log(res)
                if(res.status == 1){
                    this.$message.success('创建成功！',1).then(res=>{
                        this.getData()
                        this.visible = false
                    })
                }
            })
        },
        bindfinger(){
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
                // console.log(event)
                let carId = event.data
                that.fingerno = carId
                that.currentCardId = carId
                that.editFinger()
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
        }
    },
    beforeDestroy(){
        this.thesocket.close();
    }
}
</script>
<style lang="scss" scoped>
    .gps_head{
       text-align: left;
       display: flex;
       input{
           width: 200px;
           height: 30px;
       }
       button{
           height: 30px;
           width: 70px;
           margin-left: 20px
       }
    }
    .gps_list{
        margin-top: 20px;
        position: relative;
        .operate1{
            input{
                width: 75px;
                height: 24px;
                text-align: center;
                border: 1px solid #999
            }
        }
        .ant-pagination{
            margin-top: 20px
        }
    }
    .ant-modal-body{
        padding-left: 50px
    }
    .game_name{
        padding-left: 50px;
        margin-top: 10px;
        input{
            width: 170px;
            margin-left: 10px
        }
    }
    .game_local{
        padding-left: 50px;
        margin-top: 10px;
        input{
            width: 170px;
            margin-left: 10px
        }
        .ant-select{
            width: 170px;
            margin-left: 10px
        }
    }
    .operate{
        img{
            margin: 0 5px;
            cursor: pointer;
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
</style>