<template>
    <div class="game">
        <div class="game_head">
            <a-input v-model="searchInfo" @pressEnter="search" placeholder="请输入国家名称/国家代码"/>
            <a-button type="primary" @click="search" icon="search">搜索</a-button>
            <a-button type="primary" icon="plus" @click.stop="showModal">创建</a-button>
        </div>
        <div class="game_list">
            <a-table :columns="columns" :dataSource="gamedata" :pagination="false" >
                <span slot="nationalFlag" class="operate" slot-scope="text, record">
                    <img style="max-width:36px;" :src="record.url+record.nationalFlag" alt="">
                </span>
                <span slot="action" class="operate" slot-scope="text, record">
                    <img @click.stop="edit(record.key,record.chineseNation,record.englishNation,record.nationCode,record.nationalFlag)" src="../../assets/image/edit.png" alt="">
                    <img  @click.stop="deleteItem(record.key)" src="../../assets/image/delete.png" alt="">
                </span>
            </a-table>
            <a-pagination @change="changePage" :pageSize="pageSize" v-model="current" :defaultCurrent="1" :total="totalPage" />
        </div>

        <!-- 创建赛事 -->
        <a-modal
            title="新增单位信息"
            v-model="visible"
            @ok="handleOk"
            >
            <div class="game_name">
                <span style="display:inline-block;width:100px;text-align:right">国家（中文）：</span><a-input v-model="chineseNation" placeholder="请输入"/>
            </div>
            <div class="game_local">
                <span style="display:inline-block;width:100px;text-align:right">国家（英文）：</span><a-input v-model="EnglishNation" placeholder="请输入"/>
            </div>
            <div class="game_local">
                <span style="display:inline-block;width:100px;text-align:right">国家代码 ：</span><a-input v-model="nationCode" placeholder="请输入"/>
            </div>
            <div class="game_local">
                <span style="display:inline-block;width:100px;text-align:right">国旗 ：</span>
                <a-input style="width:220px;margin-right:15px" v-model="imgName" placeholder="请输入"/>
                <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
                    <a-button :loading="uploading"> 选择 </a-button>
                </a-upload>
            </div>
        </a-modal>
    </div>
</template>
<script>
import {findNationList,saveEntityNation,delData} from '@/api'
import axios from '@/utils/request.js'
export default {
    data(){
        return {
            fileList:[],
            chineseNation:'',//国家（中文）
            EnglishNation:'',//国家（英文）
            imgName:'',//图片名称
            nationCode:'',//国家代码
            nationid:null,
            current:1,//当前页数
            pageSize:5,//一页条数
            totalPage:1,//总页数
            searchInfo:'',//搜索信息
            visible: false,
            uploading: false,
            columns:[{
                    title: '国家（中文）',
                    dataIndex: 'chineseNation',
                    key: 'chineseNation',
                    align:'center'
                }, {
                    title: '国家（英文）',
                    dataIndex: 'englishNation',
                    key: 'englishNation',
                    align:'center'
                }, {
                    title: '国家代码',
                    dataIndex: 'nationCode',
                    key: 'nationCode',
                    align:'center'
                },{
                    title: '国旗',
                    dataIndex: 'nationalFlag',
                    key: 'nationalFlag',
                    align:'center',
                    scopedSlots: { customRender: 'nationalFlag' },
                }, {
                    title: '操作',
                    key: 'action',
                    dataIndex:'action',
                    align:'center',
                    scopedSlots: { customRender: 'action' },
            }],
            gamedata:[],
            imgUrl:'',//国旗路径
        }
    },
    mounted(){
        this.getGameList()
    },
    methods:{
        beforeUpload(file) {//上传国旗
            this.fileList = [...this.fileList, file];
            const { fileList } = this;
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('uploadfile', file);
            });
            this.imgName = file.name
            this.uploading = true
            axios({
                url: 'along/UploadImgController/uploadImg',
                method: 'post',
                processData: false,
                data: formData,
            }).then(res=>{
                console.log(res)
                if(res.status==1){
                    this.uploading = false
                    this.fileList = []
                    this.imgUrl = res.data.fileName
                }
            }).catch(err=>{
                alert('上传失败')
                this.fileList = []
                this.uploading = false
            })
        },
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList;
        },
        edit(id,chineseNation,englishNation,nationCode,nationalFlag){//编辑赛事
            this.nationid = id
            this.chineseNation = chineseNation
            this.EnglishNation = englishNation
            this.nationCode = nationCode
            this.imgUrl = nationalFlag
            this.visible = true
        },
        changePage(e){//改变页数
            this.current = e
            this.getGameList()
        },
        deleteItem(key){//删除
            this.$tips.confirm('是否确定要删除此条信息？').then((res)=>{
                delData(key).then(res=>{
                    console.log(res)
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
            this.nationid = null
            this.chineseNation = ''
            this.EnglishNation = ''
            this.nationCode = ''
            this.imgUrl = ''
            this.visible = true
        },
        handleOk() {//保存
            let params={
                code:this.nationCode,
                chinseName:this.chineseNation,
                englishName:this.EnglishNation,
                nationalFlagUrl:this.imgUrl,
                nationid:this.nationid,
            }
            // console.log(params)
            saveEntityNation(params).then(res=>{
                // console.log(res)
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
        getGameList(){//获取赛事列表
            this.gamedata = []
            findNationList(this.current,this.pageSize,this.searchInfo).then(res=>{
                // console.log(res)
                if(res.status==1){
                    let data = res.data
                    let gamelist = data.data
                    this.totalPage = data.totalPage*5
                    gamelist.forEach((item,index)=>{
                        this.gamedata.push({
                            key: item.id,
                            chineseNation: item.chinseName,
                            englishNation: item.englishName,
                            nationCode: item.code,
                            nationalFlag:  item.nationalFlagUrl,
                            url:'http://run.alongtech.com:82/'
                        })
                    })
                }
            })
        },
        search(){//搜索
            this.current = 1
            this.getGameList()
        },
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


