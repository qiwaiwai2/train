<template>
    <div class="gps">
        <div class="gps_head">
            <a-input v-model="searchInfo" @pressEnter="searchBtn" placeholder="请输入GPS编号"></a-input>
            <a-button @click="searchBtn" type="primary">搜索</a-button>
            <!-- <a-button type="primary">导入</a-button> -->
            <a-button @click="creategps" type="primary">+创建</a-button>
            <div class="operate_tip" v-show="daoru">
                <!-- <h4>路线信息导入</h4> -->
                <div class="fileBox">
                    <a-upload
                    :fileList="fileList"
                    :remove="handleRemove"
                    :beforeUpload="beforeUpload"
                    >
                        <a-button type="primary">
                            导入
                        </a-button>
                    </a-upload>
                    <a-button
                        type="primary"
                        @click="handleUpload"
                        :disabled="fileList.length === 0"
                        :loading="uploading"
                        >
                        {{uploading ? '上传中' : '确定' }}
                    </a-button>
                </div>
            </div>
        </div>
        <div class="gps_list">
            <a-table :columns="columns" align='center'  :dataSource="gamedata" :pagination="false" >
                
                <span slot="action" class="operate" slot-scope="text, record">
                    <img @click="editItem(record.key,record.state,record.shortno,record.name)" src="../../assets/image/edit.png" alt="">
                    <img  @click.stop="deleteItem(record.key)" src="../../assets/image/delete.png" alt="">
                </span>
            </a-table>
            <a-pagination @change="changePage" :pageSize="pageSize" v-model="current" :defaultCurrent="1" :total="totalPage" />
        </div>
        <!-- 创建赛事 -->
        <a-modal
            title="新增gps跟踪器"
            v-model="visible"
            @ok="handleOk"
            @cancel="canceledit"
            >
            <div class="game_name">
                编号：<a-input v-model="gpsno" placeholder="请输入"/>
            </div>
           <div class="game_name">
                短号：<a-input v-model="gpsshortNo" placeholder="请输入"/>
            </div>
            <div class="game_local">
                状态：<a-select :defaultValue="gpsState" @change="handleChange">
                        <a-select-option value="0">未使用</a-select-option>
                        <a-select-option value="1">使用中</a-select-option>
                        <a-select-option value="2">已损坏</a-select-option>
                    </a-select>
            </div>
        </a-modal>
    </div>
</template>
<script>
import {GPSfindAllGetPage,GPSsaveEntity,gpsdelEntity} from '@/api'
export default {
    data(){
        return {
            daoru:false,
            columns:[{
                    title: '编号',
                    dataIndex: 'name',
                    key: 'name',
                    align:'center'
                }, {
                    title: '短号',
                    dataIndex: 'cornet',
                    key: 'cornet',
                    align:'center',
                    // scopedSlots: { customRender: 'cornet' },
                }, {
                    title: '状态',
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
            visible:false,
            fileList: [],
            uploading: false,
            current:1,//当前页数
            pageSize:5,//一页条数
            totalPage:1,//总条数
            gpsid:null,//gps id
            gpsno:'',//gps编号
            gpsshortNo:'',//gps短号
            gpsState:'0',//gps状态--0未使用  1使用  2损坏
            searchInfo:'',//搜索信息
        }
    },
    mounted(){
        // console.log(this.$route.query)
        this.getGPSlist()
    },
    methods:{
        editItem(id,state,shortno,gpsno){//编辑
            this.visible = true
            // console.log(id,state)
            this.gpsid = id
            this.gpsno = gpsno
            this.gpsState = state
            this.gpsshortNo = shortno
        },
        canceledit(e){//取消编辑
            // console.log(e)
            this.gpsid = null
        },
        searchBtn(){//搜索
            this.current = 1
            this.getGPSlist()
        },
        handleChange(e){//选择状态
            this.gpsState = e
        },
        changePage(e){//改变页数
            this.current = e
            this.getGPSlist()
        },
        deleteItem(key){//删除
            this.$tips.confirm('是否确定要删除此条信息？').then((res)=>{
                this.gpsDelete(key)
            }).catch((err)=>{
            })
        },
        handleOk(e) {
            // console.log(e);
            this.gpsEdit()
        },
        creategps(){//创建gps
            this.visible = true
        },
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList
        },
        beforeUpload(file) {
            this.fileList = [file]
            return false;
        },
        handleUpload() {
            const { fileList } = this;
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('file', file);
            });
            formData.append('competitionId',this.currentGameId)
            formData.append('competitionItemId',this.currentGameItemId)
            //   console.log(this.currentGameId,this.currentGameItemId)
            this.uploading = true
            axios({
                url: 'along/CrossLineController/lineUpload',
                method: 'post',
                processData: false,
                data: formData,
            }).then(res=>{
                //   console.log(res)
                if(res.status==1){
                    this.uploading = false
                    this.fileList = []
                    alert('上传成功！')
                    this.getLineData(this.currentGameId,this.currentGameItemId)
                }
            }).catch(err=>{
                this.uploading = false
                //   console.log(err)
            })
        },
        getGPSlist(){//获取gps列表
            this.gamedata = []
            GPSfindAllGetPage(this.current,this.pageSize,this.searchInfo).then(res=>{
                // console.log(res)
                if(res.status == 1){
                    let data = res.data
                    let gamelist = data.data
                    this.totalPage = data.recordsTotal
                    gamelist.forEach((item,index)=>{
                        this.gamedata.push({
                            key:item.id,
                            cornet: item.gpsNo,
                            name: item.no,
                            state:item.state,
                            shortno:item.gpsNo,
                            address:item.state==0?'未使用':(item.state==1?'使用中':'已损坏') ,
                        })
                    })
                }
            })
        },
        gpsEdit(){//gps新增修改
            let params = {
                id:this.gpsid,//id
                no:this.gpsno,//gps编号
                state:this.gpsState,//默认为0未使用  1使用  2损坏
                gpsNo:this.gpsshortNo,//gps短号
            }
            console.log(params)
            GPSsaveEntity(params).then(res=>{
                console.log(res)
                if(res.status == 1){
                    this.$message.success('创建成功！',1).then(res=>{
                        this.getGPSlist()
                        this.visible = false
                        this.gpsid = null
                    })
                }else{
                    this.gpsid = null
                }
            })
        },
        gpsDelete(key){//gps删除
            gpsdelEntity(key).then(res=>{
                console.log(res)
                if(res.status == 1){
                    this.$message.success('删除成功！',1).then((res)=>{
                        this.gamedata.forEach((ele,index) => {
                            if(key == ele.key){
                                this.gamedata.splice(index,1)
                            }
                        })
                    })
                }else{
                    this.$message.success('删除失败！',1)
                }
            })
        }
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
</style>