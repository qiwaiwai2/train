<template>
    <div class="drawLoats">
        <a-spin :spinning="spinning" :tip="loadingText">
            <div class="drawLoats_head">
                <div class="game_select">
                    赛事：
                    <a-select :defaultValue="game[0]" style="width: 250px" @change="handlegameceChange">
                        <a-select-option v-for="province in game" :key="province">{{province}}</a-select-option>
                    </a-select>
                </div>
                <div class="game_select">
                    赛项：
                    <a-select v-model="gameItemName" style="width: 250px" @change="handlegameItemceChange">
                        <a-select-option v-for="city in cities" :key="city">{{city}}</a-select-option>
                    </a-select>
                </div>
                <!-- <div class="game_select">
                    组别：
                    <a-select v-model="groupName" style="width: 250px" @change="handlegameItemgroupChange">
                        <a-select-option v-for="group in groupList" :key="group">{{group}}</a-select-option>
                    </a-select>
                </div> -->
            </div>
            <div class="drawLoats_cont">
                <div class="drawLoats_cont_navigation">
                    <a-menu
                        v-model="current"
                        mode="horizontal"
                        @click="click"
                    >
                        <a-menu-item key="yfp">已分配</a-menu-item>
                        <a-menu-item key="wfb" >未分配</a-menu-item>
                    </a-menu>
                </div>
                <div class="table">
                    <div class="yfp"  v-show="operate_type==1">
                        <div class="yfphead">
                            <a-input @pressEnter="search" v-model="searchInfo" placeholder="请输入GPS编号"/>
                            <a-button type="primary" @click="search" icon="search">搜索</a-button>
                            <a-button type="primary" @click="prtBtn">打印</a-button>
                        </div>
                        <div class="tablecont" :style="{'height':contHeight-250+'px'}">
                            <table>
                                <thead>
                                    <tr>
                                        <!-- <th>ID</th> -->
                                        <th>姓名</th>
                                        <th>单位</th>
                                        <th>GPS ID</th>
                                        <th>GPS 短号</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in distributed" :key="index">
                                        <!-- <td>号码布ID</td> -->
                                        <td>{{item.name}}</td>
                                        <td>{{item.nationality}}</td>
                                        <td>{{item.gNo}}</td>
                                        <td>{{item.gpsNo}}</td>
                                        <td><img @click="editGps(item)" src="../../../assets/image/edit.png" alt=""></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="wfp tablecont"   v-show="operate_type==2" :style="{'height':contHeight-320+'px'}">
                        <a-table v-show="operate_type==2" :columns="columns" :dataSource="tableData" :rowSelection="rowSelection" :pagination="false" />
                    </div>
                </div>
            </div>
            <div class="operate_btn"   v-show="operate_type==2">
                <a-button type="primary" @click="operate()">分配</a-button>
            </div>
            <!-- GPS修改 -->
            <a-modal
                title="GPS ID修改"
                v-model="visible"
                @ok="handleOk"
                class="gpsmodal"
                >
                <div>
                    <span class="modal_title">姓名：</span><span>{{sportName}}</span>
                </div>
                <div>
                    <span class="modal_title">单位：</span><span>{{sportNation}}</span>
                </div>
                <div class="game_name">
                    <span class="modal_title">GPS ID：</span><a-input v-model="gpsNO" placeholder="请输入GPS ID"/>
                </div>
            </a-modal>
        </a-spin>
    </div>
</template>
<script>
import {findAllCompetition,findEntity,findEntityByGps,findAllGpsList,updateEntityAndGps,findEntityByNoGps,replaceSportsmanGps} from '@/api'
export default {
    data(){
        return {
            spinning:false,
            loadingText:'分配中，请稍等',
            visible:false,
            gpsid:'',//gpsid
            searchInfo:'',//搜索内容
            current: ['yfp'],//当前选择的导航
            gameList:{},//赛事列表
            gameItemList:{
                请选择:{
                    请选择:['请选择']
                }
            },//组别
            gameItemListId:{},//赛项对应的id
            game:[
                '请选择', 
            ],
            gameItem:{
                请选择: ['请选择'],
            },
            cities:null,//赛项列表
            groupList:null,//组别列表
            gameItemName:null,//赛项名称
            groupName:null,//组别名称
            currentGame:'',//当前选择的赛事名称
            currentGameId:'',//当前选择的赛事Id
            currentGameItemId:'',//当前选择的赛项Id
            crrrentGroupId:'',//当前选择的组别id
            columns:[
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '单位',
                    dataIndex: 'address',
                    key: 'address',
                }
            ],
            tableData: [],
            rowSelection:{
                onChange:this.onTableChange,
                onSelect:this.onTableSelect,
                onSelectAll:this.onTableSelectAll
            },
            operate_type:1,//操作类型---1，分配2，打印
            selectedMan:[],//选中的人员
            distributed:[],//已经分配的人员
            gpsNum:0,
            sportName:'',//选手姓名
            sportNation:'',//选手单位
            sportId:'',//选手id
            gpsNO:'',//gps编号
        }
    },
    props:['contHeight'],
    mounted(){
        this.cities = this.gameItem[this.game[0]]//赛项列表
        this.gameItemName = this.gameItem[this.game[0]][0]//赛项名称
        this.groupList = this.gameItemList[this.cities[0]][this.gameItemName]//组别列表
        this.groupName = this.gameItemList[this.cities[0]][this.gameItemName][0]//组别名称
        this.getGameList()
        this.currentGameId=''
        this.currentGameItemId=''
        this.selectedMan = []
    },
    methods:{
        editGps(item){//编辑gps
            this.visible = true
            this.sportName = item.name
            this.sportNation = item.nationality
            this.gpsid = item.sportsmanGpsId
            this.sportId = item.id
            this.gpsNO = item.gNo
        },
        handleOk(){//确定修改
            let gpsparams = {
                id:this.gpsid,//获取的sportsmanGpsId
                sportsmanId:this.sportId,//人员id
                competitionId:this.currentGameId,//赛事id
            }
            replaceSportsmanGps(gpsparams,this.gpsNO).then(res=>{
                if(res.status == 1){
                    this.$message.success('修改成功！',1).then(res=>{
                        this.getGpsMan()
                        this.visible = false
                    })
                }
            })
        },
        search(){//搜索
            this.getGpsMan()
        },
        click(e){//选择已分配还是未分配
            if(e.key == 'yfp'){
                this.operate_type=1
            }else{
                this.operate_type=2
            }
        },
        getGps(){//获取未使用的gps列表
            findAllGpsList().then(res=>{
                if(res.status == 1){
                    this.gpsNum = res.data.length
                }
            })
        },
        handlegameceChange(value) {//赛事选择
            if(value!='请选择'){
                this.cities = this.gameItem[value]//赛项列表
                this.gameItemName = this.gameItem[value][0]//赛项名称
                this.currentGame = value//赛事名称
                this.currentGameId = this.gameList[value]//赛事id
                this.currentGameItemId = this.gameItemListId[value][this.gameItemName]//赛项id
                this.getGpsMan()
                this.getwfpGpsMan()
                this.selectedMan = []
                this.current[0]= 'yfp',//当前选择的导航
                this.operate_type=1
            }
        },
        handlegameItemceChange(value) {//赛项选择
            this.gameItemName = value
            this.groupList = this.gameItemList[this.currentGame][value]//组别列表
            this.groupName = this.gameItemList[this.currentGame][value][0]//组别名称
            this.currentGameItemId = this.gameItemListId[this.currentGame][value]//赛项id
            this.crrrentGroupId = this.gameItemListId[this.currentGame][value+this.groupName]//组别id
            this.getGpsMan()
            this.getwfpGpsMan()
            this.selectedMan = []
            this.current[0]= 'yfp',//当前选择的导航
            this.operate_type=1
        },
        handlegameItemgroupChange(value){//组别选择
            this.crrrentGroupId = this.gameItemListId[this.currentGame][this.gameItemName+value]//组别id
            this.getGpsMan()
            this.selectedMan = []
            this.operate_type=1
        },
        getGameList(){//获取赛事列表
            findAllCompetition().then(res=>{
                let data = res;
                if(data.status==1){
                    let gameList = data.data;
                    gameList.forEach(ele => {
                        this.game.push(ele.name)
                        this.gameList[ele.name] = ele.id//赛事对应id
                        findEntity(ele.id).then(res=>{//获取赛项列表
                            console.log(res)
                            if(res.status==1){
                                let gameDetail = res.data;
                                this.gameItem[gameDetail.name] = []//赛事下的赛项
                                this.gameItemList[gameDetail.name]={}//组别
                                this.gameItemListId[gameDetail.name]={}//赛项id
                                gameDetail.itemGroup.forEach((ele,index)=>{
                                    if(this.gameItem[gameDetail.name].indexOf(ele.itemName)<0){
                                        this.gameItem[gameDetail.name].push(ele.itemName)
                                    }
                                    this.gameItemListId[gameDetail.name][ele.itemName] = ele.competitionItemId//赛项id
                                    this.gameItemListId[gameDetail.name][ele.itemName+ele.groupName] = ele.id
                                    if(!this.gameItemList[gameDetail.name][ele.itemName]){
                                        this.gameItemList[gameDetail.name][ele.itemName] = []
                                    }
                                    this.gameItemList[gameDetail.name][ele.itemName].push(ele.groupName)
                                })
                            }
                        })
                    });
                }
            })
        },
        getGpsMan(){//获取已分配人员
            this.tableData = []
            this.spinning = true
            findEntityByGps(this.currentGameId,this.searchInfo).then(res=>{
                if(res.status == 1){
                    this.distributed = res.data
                    this.spinning = false
                }
            }).catch(err=>{
                this.spinning = false
            })
        },
        getwfpGpsMan(){//获取未分配人员
            this.tableData = []
            findEntityByNoGps(this.currentGameId).then(res=>{
                if(res.status == 1){
                    res.data.forEach((item,index) => {
                        this.tableData.push({
                            key: index,
                            id: '号码布id',
                            name: item.name,
                            address: item.nationality,
                            manid:item.id
                        })
                    })
                }
            })
        },  
        onTableChange(selectedRowKeys, selectedRows){
            this.selectedMan=[]
            selectedRows.forEach(item=>{
                this.selectedMan.push({
                    id:item.manid
                })
            })
        },
        onTableSelect(record, selected, selectedRows) {
        },
        onTableSelectAll (selected, selectedRows, changeRows) {
        },
        async operate(){
            this.spinning = true
            let gpsNum
            await  findAllGpsList().then((res)=>{
                if(res.status == 1){
                    this.gpsNum = res.data.length
                }
            })
            if(this.selectedMan.length>this.gpsNum){
                this.spinning = false
                alert('剩余'+this.gpsNum+'个GPS，您的选择已超出！')
            }else{
                updateEntityAndGps(this.selectedMan,this.currentGameId,this.currentGameItemId).then(res=>{
                    if(res.status == 1){
                        this.spinning = false
                        this.$message.success('分配成功！',1).then(res=>{
                            this.selectedMan=[]
                            this.operate_type=1
                            this.current[0]= 'yfp',//当前选择的导航
                            this.getGpsMan()
                            this.getwfpGpsMan()
                        })
                    }else{
                        this.spinning = false
                    }
                }).catch(err=>{
                    this.spinning = false
                })
            }
        },
        prtBtn(){//打印
        }
        
    }
}
</script>
<style lang="scss" scoped>
    p{
        margin-bottom: 0
    }
    ul{
        margin-bottom: 0
    }
    .game_name{
        input{
            width: 200px;
        }
    }
    .gpsmodal{
        div{
            margin-bottom: 20px;
            padding-left: 40px;
        }
    }
    .modal_title{
        display: inline-block;
        text-align: right;
        width: 60px;
    }
    .yfphead{
        display: flex;
        margin-bottom: 15px;
        input{
            width: 230px;
            margin-right: 10px
        }
        button{
            margin-right:10px 
        }
    }
    .tablecont{
        overflow-y: auto
    }
    .drawLoats_cont_navigation{
        padding: 0;
        text-align: left;
        li{
            height: 40px;
        }
    }
    .drawLoats_head{
        background-color: #E2F2FF;
        height: 40px;
        display: flex;
        align-items: center;
        .game_select{
            margin-left: 30px
        }
    }
    .drawLoats_cont{
        padding: 20px 30px;
        padding-top: 0;
        .table{
            overflow-y: auto;
            padding-bottom: 10px;
            margin-top: 10px;
            table{
                width: 100%;
                border: 1px solid #ddd;
                tr{
                    height: 40px;
                    border-top: 1px solid #ddd;
                    th{
                        background-color: #F7FBFF;
                    }
                    td{
                        background: #fff;
                        height: 40px !important;
                        input{
                            text-align: center;
                            border: 1px solid #999;
                            width: 120px;
                            padding: 2px 0;
                            color: #387EE8;
                        }
                        img{
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
    .operate_btn{
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background-color: #E2F2FF;
        position: absolute;
        bottom: -70px;
        left: 0;
        right: 0
    }
</style>


