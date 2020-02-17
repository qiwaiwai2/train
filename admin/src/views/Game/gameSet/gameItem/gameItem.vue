<template>
    <div class="gameItem">
       <a-table :columns="columns" align='center'  :dataSource="gamedata" :pagination="{ pageSize: 10,hideOnSinglePage:true }" >
            <span slot="action" class="operate" slot-scope="text, record">
                <img @click="edit(record.key,record.name,record.starttime,record.endtime,record.address)" src="../../../../assets/image/edit.png" alt="">
                <img @click.stop="deleteItem(record.key)" src="../../../../assets/image/delete.png" alt="">
            </span>
        </a-table>
        <a-button @click="createGameItem" class="createBtn">+创建</a-button>
        <!-- 创建赛项 -->
        <a-modal
            title="创建赛项"
            v-model="visible"
            @ok="handleOk"
            >
            <div class="game_name">
                赛项名称：<a-input v-model="itemName" placeholder="请输入赛项名称"/>
            </div>
            <div class="game_time">
                开始时间：<a-date-picker
                            class="game_time_select"
                            format="YYYY-MM-DD HH:mm:ss"
                            :defaultValue="moment(startDate,'YYYY-MM-DD HH:mm:ss')"
                            :mode="mode"
                            showTime
                            @openChange="handleOpenChange1"
                            @panelChange="handlePanelChange1" 
                            @ok="changestartdate"
                        />
            </div>
            <div class="game_time">
                结束时间：<a-date-picker
                            class="game_time_select"
                            format="YYYY-MM-DD HH:mm:ss"
                            :defaultValue="moment(endDate,'YYYY-MM-DD HH:mm:ss')"
                            :mode="mode"
                            showTime
                            @openChange="handleOpenChange1"
                            @panelChange="handlePanelChange1" 
                            @ok="changeenddate"
                        />
            </div>
        </a-modal>
    </div>
</template>
<script>
import moment from "moment";
import {findAllList,gameitemsaveEntity,gameitemdelEntity} from '@/api'
export default {
    data(){
        return {
            columns:[{
                    title: '赛项名称',
                    dataIndex: 'name',
                    key: 'name',
                    align:'center'
                }, {
                    title: '开始时间',
                    dataIndex: 'starttime',
                    key: 'starttime',
                    align:'center'
                },{
                    title: '结束时间',
                    dataIndex: 'endtime',
                    key: 'endtime',
                    align:'center'
                }, {
                    title: '参赛形式',
                    dataIndex: 'address',
                    key: 'address',
                    align:'center'
                }, {
                    title: '操作',
                    key: 'action',
                    dataIndex:'action',
                    align:'center',
                    scopedSlots: { customRender: 'action' },
            }],
            gamedata:[],
            mode: 'time',
            visible:false,
            competitionId:'',//赛事id
            itemid:null,//赛项id
            itemName:'',//赛项名称
            startDate:'',//开始时间
            endDate:'',//结束时间
            type:1,//赛项类型
            selectValue:'1'
        }
    },
    mounted(){
        this.competitionId = this.$route.query.gameId
        this.getGameItem()
        this.startDate = new Date()
        this.endDate = new Date()
    },
    methods:{
        moment,
        edit(key,name,starttime,endtime,address){//编辑赛项
            console.log(this.competitionId,key,name,starttime,endtime,address)
            this.startDate = starttime
            this.endDate = endtime
            this.visible = true
            this.itemName = name
            this.itemid = key
            this.selectValue = address == '单人'? '单人' : '团体' 
            this.type = address == '单人' ? 1 : 2
            
        },
        handleChange(e){//选择参赛形式
            console.log(e)
            this.type = e
        },
        handleOk(e) {
            console.log(this.itemid,this.itemName,this.startDate,this.endDate,this.competitionId,this.type)
            gameitemsaveEntity(this.itemid,this.itemName,this.startDate,this.endDate,this.competitionId,this.type).then(res=>{
                console.log(res)
                if(res.status == 1){
                    let that = this
                    this.$message.success('创建成功！',1).then((res)=>{
                        this.getGameItem()
                        this.visible = false
                    })
                }else{
                    this.$message.error('创建失败！').then(()=>{
                        // this.visible = false
                    })
                }
            })
        },
        handleOpenChange1(open) {
            if (open) {
                this.mode = 'time'
            }
        },
        handlePanelChange1(value, mode) {
            this.mode = mode
        },
        createGameItem(){//创建赛项
            this.visible = true
            this.itemid = null
        },
        deleteItem(key){//删除
            this.$tips.confirm('是否确定要删除此条信息？').then((res)=>{
                gameitemdelEntity(key).then(res=>{
                    console.log(res)
                    if(res.status == 1){
                        this.$message.success('删除成功！',1).then(res=>{
                            this.gamedata.forEach((ele,index) => {
                                if(key == ele.key){
                                    this.gamedata.splice(index,1)
                                }
                            });
                        })
                    }
                })
                
            }).catch((err)=>{
            })
            
        },
        getGameItem(){
            this.gamedata = []
            findAllList(this.competitionId).then(res=>{
                console.log(res)
                if(res.status == 1){
                    let data = res.data
                    data.forEach((item,index)=>{
                        this.gamedata.push({
                            key: item.id,
                            name: item.itemName,
                            starttime: item.startDate?item.startDate:'',
                            endtime:item.endDate?item.endDate:'',
                            address: item.type==1?'单人':'接力',
                            align:'center'
                        })
                    })
                }
            })
        },
        changestartdate(date){//选择时间
            this.startDate = this.$formatDate(date)
        },
        changeenddate(date){
            this.endDate = this.$formatDate(date)
        }
    },

}
</script>
<style lang="scss" scoped>
    .createBtn{
        position: absolute;
        bottom: 40px;
        width: 100px;
        height: 40px;
        line-height: 40px;
        background-color: #387EE8;
        color: #fff;
        right: 100px;
        cursor: pointer
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
        .ant-select {
            width: 300px;
            margin-left: 10px
        }
        
    }
    .operate{
        img{
            margin: 0 5px;
            cursor: pointer;
        }
    }
</style>


