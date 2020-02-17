<template>
    <div class="drawLoats">
        <div class="drawLoats_head">
            <div class="game_select">
                赛事：
                <a-select :defaultValue="game[0]" style="width: 250px" @change="handlegameceChange">
                    <a-select-option v-for="province in game" :key="province">{{province}}</a-select-option>
                </a-select>
            </div>
            <!-- <div class="game_select">
                赛项：
                <a-select v-model="gameItemName" style="width: 250px" @change="handlegameItemceChange">
                    <a-select-option v-for="city in cities" :key="city">{{city}}</a-select-option>
                </a-select>
            </div>
            <div class="game_select">
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
            <div class="table"  :style="{'height':contHeight-220+'px'}">
                <a-table v-show="operate_type==2" :columns="columns" :dataSource="tableData" :rowSelection="rowSelection" :pagination="false" />
                <table v-show="operate_type==1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>姓名</th>
                            <th>单位</th>
                            <th>GPS ID</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in distributed" :key="index">
                            <td>号码布ID</td>
                            <td>{{item.name}}</td>
                            <td>{{item.nationality}}</td>
                            <td>{{item.gNo}}</td>
                            <td>编辑</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="operate_btn">
            <a-button type="primary" @click="operate()">{{operate_type==1?'分配':'打印'}}</a-button>
        </div>
    </div>
</template>
<script>
import {findAllCompetition,findEntity,findEntityByGps,findAllGpsList,updateEntityAndGps} from '@/api'
export default {
    data(){
        return {
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
            tableData:[
                
            ],
            rowSelection:{
                onChange:this.onTableChange,
                onSelect:this.onTableSelect,
                onSelectAll:this.onTableSelectAll
            },
            operate_type:1,//操作类型---1，分配2，打印
            selectedMan:[],//选中的人员
            distributed:[],//已经分配的人员
            gpsNum:0,
        }
    },
    props:['contHeight'],
    mounted(){
        this.cities = this.gameItem[this.game[0]]//赛项列表
        this.gameItemName = this.gameItem[this.game[0]][0]//赛项名称
        this.groupList = this.gameItemList[this.cities[0]][this.gameItemName]//组别列表
        this.groupName = this.gameItemList[this.cities[0]][this.gameItemName][0]//组别名称
        // this.getGps()
        this.getGameList()
        this.currentGameId=''
        this.currentGameItemId=''
        this.selectedMan = []
    },
    methods:{
        getGps(){//获取未使用的gps列表
            findAllGpsList().then(res=>{
                console.log(res)
                if(res.status == 1){
                    this.gpsNum = res.data.length
                }
            })
        },
        handlegameceChange(value) {//赛事选择
            if(value!='请选择'){
                this.cities = this.gameItem[value]//赛项列表
                this.groupList = this.gameItemList[value][this.cities[0]]//组别列表
                this.gameItemName = this.gameItem[value][0]//赛项名称
                this.currentGame = value//赛事名称
                this.groupName = this.gameItemList[value][this.cities[0]][0]//组别名称
                this.currentGameId = this.gameList[value]//赛事id
                this.currentGameItemId = this.gameItemListId[value][this.gameItemName]//赛项id
                this.crrrentGroupId = this.gameItemListId[value][this.gameItemName+this.groupName]//组别id
                // console.log(this.currentGameId,this.currentGameItemId,this.crrrentGroupId)
                this.getGpsMan(this.currentGameId,this.currentGameItemId,this.crrrentGroupId,0)
                this.selectedMan = []
                this.operate_type=1
            }
        },
        handlegameItemceChange(value) {//赛项选择
            this.gameItemName = value
            this.groupList = this.gameItemList[this.currentGame][value]//组别列表
            this.groupName = this.gameItemList[this.currentGame][value][0]//组别名称
            this.currentGameItemId = this.gameItemListId[this.currentGame][value]//赛项id
            this.crrrentGroupId = this.gameItemListId[this.currentGame][value+this.groupName]//组别id
            // console.log(this.currentGameId,this.currentGameItemId,this.crrrentGroupId)
            this.getGpsMan(this.currentGameId,this.currentGameItemId,this.crrrentGroupId,0)
            this.selectedMan = []
            this.operate_type=1
        },
        handlegameItemgroupChange(value){//组别选择
            this.crrrentGroupId = this.gameItemListId[this.currentGame][this.gameItemName+value]//组别id
            // console.log(this.currentGameId,this.currentGameItemId,this.crrrentGroupId)
            this.getGpsMan(this.currentGameId,this.currentGameItemId,this.crrrentGroupId,1)
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
                            // console.log(res)
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
        getGpsMan(competitionId){//获取人员
            this.tableData = []
            findEntityByGps(competitionId,'').then(res=>{
                console.log(res)
                if(res.status == 1){
                    // if(isGps==0){
                    //     res.data.forEach((item,index) => {
                    //         this.tableData.push({
                    //             key: index,
                    //             id: '号码布id',
                    //             name: item.name,
                    //             address: item.nationality,
                    //             manid:item.id
                    //         })
                    //     })
                    // }else{
                        this.distributed = res.data
                    // }
                }
            })
        },
        onTableChange(selectedRowKeys, selectedRows){
            this.selectedMan=[]
            selectedRows.forEach(item=>{
                this.selectedMan.push({
                    id:item.manid
                })
                // this.selectedMan.push(item.manid)
            })
            // console.log(selectedRows)
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onTableSelect(record, selected, selectedRows) {
            // console.log(record, selected, selectedRows);
        },
        onTableSelectAll (selected, selectedRows, changeRows) {
            // console.log(selected, selectedRows, changeRows);
        },
        async operate(){
            if(this.operate_type==1){//分配
                let gpsNum
                await  findAllGpsList().then((res)=>{
                    if(res.status == 1){
                        this.gpsNum = res.data.length
                    }
                })
                if(this.selectedMan.length>this.gpsNum){
                    alert('剩余'+this.gpsNum+'个GPS，您的选择已超出！')
                }else{
                    updateEntityAndGps(this.selectedMan,this.currentGameId).then(res=>{
                        console.log(res)
                        if(res.status == 1){
                            this.selectedMan=[]
                            this.operate_type=2
                            this.getGpsMan(this.currentGameId,this.currentGameItemId,this.crrrentGroupId,1)
                        }
                    })
                }
            }else{//打印

            }
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
    .drawLoats_cont_navigation{
        padding: 0
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
                        input{
                            text-align: center;
                            border: 1px solid #999;
                            width: 120px;
                            padding: 2px 0;
                            color: #387EE8;
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
        bottom: 0px;
        left: 0;
        right: 0
    }
</style>


