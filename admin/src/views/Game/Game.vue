<template>
    <div class="game">
        <div class="game_head">
            <a-input v-model="searchInfo" @pressEnter = "search" placeholder="请输入赛事名称"/>
            <a-button type="primary" @click="search" icon="search">搜索</a-button>
            <a-button type="primary" icon="plus" @click.stop="showModal">创建</a-button>
        </div>
        <div class="game_list">
            <a-table :columns="columns" :customRow = 'gameSet' :dataSource="gamedata" :pagination="false" >
                <!-- <span slot="customTitle"> Name</span> -->
                <!-- <span slot="tags" slot-scope="tags">
                    <span v-for="tag in tags" :key="tag">{{tag}}</span>
                </span> -->
                <span slot="action" class="operate" slot-scope="text, record">
                    <!-- <a href="javascript:;">Invite 一 {{record.name}}</a> -->
                    <!-- <a href="javascript:;">{{text}}</a> -->
                    <!-- <span style="margin-right:10px">编辑</span> -->
                    <img @click.stop="edit(record.key,record.name,record.age,record.address,record.isPublish)" src="../../assets/image/edit.png" alt="">
                    <!-- <span @click.stop="deleteItem(record.key)">删除</span> -->
                    <img  @click.stop="deleteItem(record.key)" src="../../assets/image/delete.png" alt="">
                    <!-- <span>发布</span> -->
                </span>
            </a-table>
            <a-pagination @change="changePage" :pageSize="pageSize" v-model="current" :defaultCurrent="1" :total="totalPage" />
        </div>

        <!-- 创建赛事 -->
        <a-modal
            title="创建赛事"
            v-model="visible"
            @ok="handleOk"
            >
            <div class="game_name">
                赛事名称：<a-input v-model="gamename" placeholder="请输入赛事名称"/>
            </div>
            <div class="game_time">
                举办时间：<a-date-picker
                            class="game_time_select"
                            :defaultValue="moment(currentdate,'YYYY-MM-DD')"
                            format="YYYY-MM-DD"
                            :mode="mode"
                            @change="changedate"
                        />
            </div>
            <div class="game_local">
                举办地点：<a-input v-model="gamelocation" placeholder="请输入赛事地点"/>
            </div>
            <div class="game_local">
                是否发布：<a-select :defaultValue="isfb" @change="handleChange">
                            <a-select-option value="1">发布</a-select-option>
                            <a-select-option value="0">不发布</a-select-option>
                        </a-select>
            </div>
        </a-modal>
    </div>
</template>
<script>
import moment from "moment";
import {findAllGetPage,saveEntity,delEntity} from '@/api'
export default {
    data(){
        return {
            currentdate:'',
            gamename:'',//赛事名称
            gamelocation:'',//举办地点
            isfb:'1',//是否发布
            gamestarttime:'',//赛事开始时间
            gameid:null,
            current:1,//当前页数
            pageSize:5,//一页条数
            totalPage:1,//总页数
            searchInfo:'',//搜索信息
            visible: false,
            columns:[{
                    title: '赛事名称',
                    dataIndex: 'name',
                    key: 'name',
                    align:'center'
                }, {
                    title: '举办时间',
                    dataIndex: 'age',
                    key: 'age',
                    align:'center'
                }, {
                    title: '举办地点',
                    dataIndex: 'address',
                    key: 'address',
                    align:'center'
                },{
                    title: '是否发布',
                    dataIndex: 'publish',
                    key: 'publish',
                    align:'center'
                }, {
                    title: '操作',
                    key: 'action',
                    dataIndex:'action',
                    align:'center',
                    scopedSlots: { customRender: 'action' },
            }],
            gamedata:[],
            mode: 'date',

        }
    },
    mounted(){
        this.getGameList()
        this.currentdate = this.$formatDate(new Date())
        this.gamestarttime = this.$formatDate(new Date())
    },
    methods:{
        moment,
        edit(id,name,date,location,isfb){//编辑赛事
            this.gameid = id
            this.gamename = name
            this.currentdate = date
            this.gamelocation = location
            this.isfb = String(isfb)
            this.visible = true
            
        },
        changePage(e){//改变页数
            this.current = e
            this.getGameList()
        },
        deleteItem(key){//删除
            this.$tips.confirm('是否确定要删除此条信息？').then((res)=>{
                delEntity(key).then(res=>{
                    if(res.status == 1){
                        this.$message.success('删除成功！',1).then((res)=>{
                           this.gamedata.forEach((ele,index) => {
                                if(key == ele.key){
                                    this.gamedata.splice(index,1)
                                }
                            });
                        })
                    }else{
                        this.$message.success('删除失败！',1)
                    }
                })
            })
        },
        showModal(){//展示创建框
            this.gameid = null
            this.gamename = ''
            this.currentdate = this.$formatDate(new Date())
            this.gamelocation = ''
            this.visible = true
        },
        handleOk() {//创建赛事
            saveEntity(this.gameid,this.gamename,this.gamestarttime,this.gamelocation,this.isfb).then(res=>{
                console.log(res)
                if(res.status == 1){
                    let that = this
                    this.$message.success('创建成功！',1).then((res)=>{
                        this.getGameList()
                        this.visible = false
                    })
                }else{
                    this.$message.error('创建失败！').then(()=>{
                        this.visible = false
                    })
                }
            })
        },
        changedate(date,dateString){//选择时间
            this.gamestarttime = dateString
        },
        getGameList(){//获取赛事列表
            this.gamedata = []
            findAllGetPage(this.searchInfo,this.current,this.pageSize).then(res=>{
                console.log(res)
                if(res.status==1){
                    let data = res.data
                    let gamelist = data.data
                    this.totalPage = data.totalPage*5
                    gamelist.forEach((item,index)=>{
                        this.gamedata.push({
                            key: item.id,
                            name: item.name,
                            age: item.startDate?this.$formatDate(item.startDate).substring(0,10):'',
                            address: item.location,
                            publish:item.isPublish==1?'已发布':'未发布',
                            isPublish:item.isPublish,
                        })
                    })
                }
            })
        },
        gameSet(record, index){//点击表格行
            let that = this
            return {
                on: {
                    click: () => {
                        // console.log(record,index)
                        that.$router.push({path:'/game/gameSet',query:{gameId:record.key,gameName:record.name}})
                    }
                }
            }
        },
        search(){//搜索
            this.current = 1
            this.getGameList()

        },
        handleChange(e){//是否发布
            this.isfb = e
        },

    },
    beforeRouteLeave (to, from, next) {//导航守卫
        // console.log(to)
        if(to.query){
            to.meta.splice(0)
            to.meta.push(to.query.gameName)
            next()
            // 离开当前路由页面时调用
        }
        
    }
}
</script>
<style lang="scss" scoped>
    .game_head{
        display: flex;
        input{
            width: 230px;
            margin-right: 10px
        }
        button{
            margin-right:40px 
        }
    }
    .game_list{
        margin-top: 20px;
        .operate{
            img{
                margin: 0 5px;
                cursor: pointer;
            }
        }
        .ant-pagination{
            margin-top: 20px
        }
    }
    .game_name{
        input{
            width: 300px;
            margin-left: 10px
        }
    }
    .game_time{
        margin-top: 10px;
        .game_time_select{
            width: 300px !important;
            margin-left: 10px
        }
    }
    .game_local{
        margin-top: 10px;
        input{
            width: 300px;
            margin-left: 10px
        }
        .ant-select{
            width: 300px;
            margin-left: 10px
        }
    }
</style>


