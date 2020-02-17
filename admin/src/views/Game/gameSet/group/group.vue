<template>
    <div class="gameItem">
       <a-table :columns="columns" align='center'  :dataSource="gamedata" :pagination="{ pageSize: 10,hideOnSinglePage:true }" >
           
            <span slot="action" class="operate" slot-scope="text, record">
                <img @click="edit(record.key,record.name,record.order)" src="../../../../assets/image/edit.png" alt="">
                <img  @click.stop="deleteItem(record.key)" src="../../../../assets/image/delete.png" alt="">
            </span>
        </a-table>
        <a-button @click="createGameItem" class="createBtn">+创建</a-button>
        <!-- 创建组别 -->
        <a-modal
            title="创建组别"
            v-model="visible"
            @ok="handleOk"
            >
            <!-- <div class="game_local">
                父级组别：<a-select defaultValue="noOne" @change="handleChange">
                            <a-select-option value="noOne">无</a-select-option>
                            <a-select-option v-for="(item,index) in gamedata" :key="index" :value="item.key">{{item.name}}</a-select-option>
                        </a-select>
            </div> -->
            <div class="game_local">
                组别名称：<a-input v-model="groupName" placeholder="请输入组别名称" />
            </div>
            <!-- <div class="game_local">
                A/ B路线：<a-select :defaultValue="isAb" @change="handleChange1">
                            <a-select-option value="1">A路线</a-select-option>
                            <a-select-option value="2">B路线</a-select-option>
                        </a-select>
            </div> -->
            <div class="game_local">
                选择排序：<a-input v-model="sortNum" placeholder="请输入排序编号" />
            </div>
        </a-modal>
    </div>
</template>
<script>
import {groupfindAllList,groupsaveEntity,groupdelEntity} from '@/api'
export default {
    data(){
        return {
            columns:[{
                    title: '组别名称',
                    dataIndex: 'name',
                    key: 'name',
                    align:'center'
                }, {
                    title: '排序',
                    dataIndex: 'order',
                    key: 'order',
                    align:'center',
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
            groupid:null,//组别id，新增为null
            competitionId:'',//赛事id
            groupName:'',//组别名称
            parentId:'',//父级组别id
            isAb:'1',//ab路线
            sortNum:'',//排序编号
        }
    },
    mounted(){
        this.competitionId = this.$route.query.gameId
        this.getData()
    },
    methods:{
        edit(id,name,order){//编辑路线
            this.groupid = id
            this.groupName = name
            this.sortNum = order
            this.visible = true
        },
        handleChange(e){//选择父组别
            console.log(e)
            if(e=='noOne'){//没有父组别
                this.parentId = null
            }else{
                this.parentId = e
            }
            
        },
        handleChange1(e){//AB路线
            console.log(e)
            this.isAb = e
        },
        handleOk(e) {//创建组别
            //this.groupid = null
            console.log(this.groupid,this.groupName,this.competitionId,this.parentId,this.isAb,this.sortNum)
            let params = {
                id:this.groupid,
                groupName:this.groupName,
                competitionId:this.competitionId,
                // parentId:this.parentId,
                // isAb:this.isAb, //ab线，a为1，b为2
                sortNum:this.sortNum
            }
            groupsaveEntity(params).then(res=>{
                console.log(res)
                if(res.status == 1){
                    this.$message.success('创建成功！',1).then((res)=>{
                        this.getData()
                        this.visible = false
                    })
                }else{
                    this.$message.error('创建失败！').then(()=>{
                        this.visible = false
                    })
                }
            })
            // this.visible = false
        },
        createGameItem(){//创建赛项
            this.groupid = null
            this.visible = true
        },
        deleteItem(key){//删除
            this.$tips.confirm('是否确定要删除此条信息？').then((res)=>{
                groupdelEntity(key).then(res=>{
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
            }).catch((err)=>{
            })
        },
        getData(){//获取所有组别
            this.gamedata = []
            groupfindAllList(this.competitionId).then(res=>{
                console.log(res)
                if(res.status == 1){
                    let data = res.data
                    data.forEach((item,index) => {
                        this.gamedata.push({
                            key: item.id,
                            name: item.groupName,
                            // age: item.isAb?(item.isAb==1?'A路线':'B路线'):'',
                            order: item.sortNum,
                            align:'center'
                        })
                    })
                }
            })
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
        .ant-select,input {
            width: 300px;
            margin-left: 10px
        }
    }
    .operate1{
        input{
            width: 50px;
            height: 24px;
            text-align: center;
            border: 1px solid #999
        }
    }
    .operate{
        img{
            margin: 0 5px;
            cursor: pointer;
        }
    }
</style>


