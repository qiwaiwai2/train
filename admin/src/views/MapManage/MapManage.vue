<template>
    <div class="game">
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
            <div class="game_select">
                组别：
                <a-select v-model="groupName" style="width: 250px" @change="handlegameItemgroupChange">
                    <a-select-option v-for="group in groupList" :key="group">{{group}}</a-select-option>
                </a-select>
            </div>
        </div>
        <div class="mapCont">
            <div class="upButton">
                <a-button type="primary" @click="visible=true">地图导入</a-button>
            </div>
            <div v-if="!noData" class="mapBox">
                <div id="mapcontainer" :style="{'height':contHeight-210+'px'}"></div>
                <div class="mapset">
                    <div>贴图调整</div>
                    <div>
                        <span>经度</span>
                        <a-input @pressEnter="longsetfun" v-model="longset"></a-input>
                    </div>
                    <div>
                        <span>纬度</span>
                        <a-input @pressEnter="latsetfun" v-model="latset"></a-input>
                    </div>
                    <div class="mapsetbtn">
                        <p @click="resetMapSet">重置</p>
                        <p @click="handleOk">确定</p>
                    </div>
                </div>
                <a-select class="mapStyle" :defaultValue="mapTypes[0]" style="width: 105px" @change="handleMapStyle">
                    <a-select-option v-for="maptypeitem in mapTypes" :key="maptypeitem">{{maptypeitem}}</a-select-option>
                </a-select>
            </div>
            <div v-else class="noData">该赛项暂未导入地图！</div>
        </div>
        <!-- 地图导入/编辑 -->
        <a-modal
            title="导入/编辑地图"
            v-model="visible"
            @ok="handleOk"
            >
            <div class="game_name">
                <span style="display:inline-block;width:100px;text-align:right">西南角经度：</span><a-input v-model="westlng" placeholder="请输入"/>
            </div>
             <div class="game_name">
                <span style="display:inline-block;width:100px;text-align:right">西南角纬度：</span><a-input v-model="southlat" placeholder="请输入"/>
            </div>
             <div class="game_name">
                <span style="display:inline-block;width:100px;text-align:right">东北角经度：</span><a-input v-model="eastlng" placeholder="请输入"/>
            </div>
             <div class="game_name">
                <span style="display:inline-block;width:100px;text-align:right">东北角纬度：</span><a-input v-model="northlat" placeholder="请输入"/>
            </div>
            <div class="game_name">
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
import {findAllCompetition,findEntity,mapfindEntity,saveData} from '@/api'
import Maploader from "@/assets/js/AMap.js"
import axios from '@/utils/request.js'
export default {
    data(){
        return {
            mapTypes:['普通地图','卫星地图'],
            noData:true, //未导入地图
            longset:0,//经度设置
            latset:0,//纬度设置
            westlng:'', //西南角经度
            southlat:'', //西南角纬度
            eastlng:'', //东北角经度
            northlat:'', //东北角纬度
            originalwestlng:'', //原始西南角经度
            originalsouthlat:'', //原始西南角纬度
            originaleastlng:'', //原始东北角经度
            originalnorthlat:'', //原始东北角纬度
            visible:false,
            gameList:{}, //赛事列表
            uploading:false,
            gameItemList:{
                请选择:{
                    请选择:['请选择']
                }
            }, //组别
            gameItemListId:{}, //赛项对应的id
            game:[
                '请选择', 
            ],
            gameItem:{
                请选择: ['请选择'],
            },
            cities:null, //赛项列表
            groupList:null, //组别列表
            gameItemName:null, //赛项名称
            groupName:null, //组别名称
            currentGame:'', //当前选择的赛事名称
            currentGameId:'', //当前选择的赛事Id
            currentGameItemId:'', //当前选择的赛项Id
            crrrentGroupId:'', //当前选择的组别id
            imgName:'', //图片名称
            fileList:[], //文件数组
            imgUrl:'', //贴图路径
            satellitelayer:null, //卫星图层
            mapid:null, //地图id
            mapCenter:null, //地图中心
        }
    },
    props:['contHeight'],
    mounted() {
        this.cities = this.gameItem[this.game[0]] //赛项列表
        this.gameItemName = this.gameItem[this.game[0]][0] //赛项名称
        this.groupList = this.gameItemList[this.cities[0]][this.gameItemName] //组别列表
        this.groupName = this.gameItemList[this.cities[0]][this.gameItemName][0] //组别名称
        this.getGameList()
        this.currentGameId = ''
        this.currentGameItemId = ''
        this.getMap()
    },
    methods:{
        handleMapStyle(value){ //选择地图类型
            if(value == '卫星地图'){
                this.createmap.add(this.satellitelayer)
            }else{ //普通地图
                this.createmap.remove(this.satellitelayer)
            }
        },
        handleRemove(file) {//删除文件
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList;
        },
        resetMapSet(){ //重置地图设置
            this.westlng = this.originalwestlng
            this.southlat = this.originalsouthlat
            this.eastlng = this.originaleastlng
            this.northlat = this.originalnorthlat
            this.longset = 0
            this.latset = 0
            this.getMap()
        },
        longsetfun(){ // 经度设置
            console.log(this.westlng)
            this.westlng += +this.longset
            this.eastlng += +this.longset
            console.log(this.westlng)
            this.getMap()
        },
        latsetfun(){ // 纬度设置
            this.southlat += +this.latset
            this.northlat += +this.latset
            this.getMap()
        },
        handleOk() {//保存地图配置
            let params = {}
            params.competitionId = this.currentGameId,
            params.competitionItemId = this.currentGameItemId,
            params.groupId = this.crrrentGroupId,
            params.mapUrl  = this.imgUrl,
            params.westlng = this.westlng,
            params.southlat = this.southlat,
            params.eastlng = this.eastlng,
            params.northlat = this.northlat
            params.mapid = this.mapid
            console.log(params)
            // return
            saveData(params).then(res=>{
                console.log(res)
                if(res.status == 1){
                    let that = this
                    this.$message.success('保存成功！',1).then((res)=>{
                        this.getMapData()
                        this.visible = false
                    })
                }else{
                    this.$message.error('保存失败！').then(()=>{
                        this.visible = false
                    })
                }
            })
        },
        getMap() {//获取地图
            let that = this;
            Maploader()
                .then(AMap => {
                    that.theamap = AMap;
                    that.satellitelayer = new AMap.TileLayer.Satellite()
                    let imageLayer = new AMap.ImageLayer({
                        //地图贴图
                        url: 'http://run.alongtech.com:82/' + that.imgUrl,
                        bounds: new AMap.Bounds(
                            [that.westlng,that.southlat],//西南角经纬度
                            [that.eastlng,that.northlat]//东北角经纬度
                        ),
                        opacity:0.7,
                        zooms: [5, 20]
                    });
                    that.createmap = new AMap.Map("mapcontainer", {
                        //创建地图
                        center: that.mapCenter,
                        expandZoomRange: true,
                        zooms: [5, 20],
                        zoom: 15,
                        layers: [
                            new AMap.TileLayer(), //图片切层,取消则不显示地图
                            imageLayer,
                        // new AMap.TileLayer.Satellite()
                        ]
                    })
                }).catch(error => {
                    console.log("失败");
                });
        },
        beforeUpload(file) {//上传图片
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
        handlegameceChange(value) { //赛事选择
            if(value != '请选择') {
                this.cities = this.gameItem[value] //赛项列表
                this.groupList = this.gameItemList[value][this.cities[0]]//组别列表
                this.gameItemName = this.gameItem[value][0] //赛项名称
                this.currentGame = value //赛事名称
                this.groupName = this.gameItemList[value][this.cities[0]][0]//组别名称
                this.currentGameId = this.gameList[value] //赛事id
                this.currentGameItemId = this.gameItemListId[value][this.gameItemName] //赛项id
                this.crrrentGroupId = this.gameItemListId[value][this.gameItemName+this.groupName]//组别id
                this.getMapData()
            }
        },
        handlegameItemceChange(value) {//赛项选择
            this.gameItemName = value
            this.groupList = this.gameItemList[this.currentGame][value] //组别列表
            this.groupName = this.gameItemList[this.currentGame][value][0] //组别名称
            this.currentGameItemId = this.gameItemListId[this.currentGame][value] //赛项id
            this.crrrentGroupId = this.gameItemListId[this.currentGame][value+this.groupName] //组别id
            this.getMapData()
        },
        handlegameItemgroupChange(value) { //组别选择
            this.crrrentGroupId = this.gameItemListId[this.currentGame][this.gameItemName+value] //组别id
            this.getMapData()
        },
        async getGameList() { //获取赛事列表
            let data = await findAllCompetition().then(res => {
                return res
            })
            if(data.status == 1){
                let gameList = data.data
                for(let i = 0;i<gameList.length;i++){
                    let ele = gameList[i]
                    this.game.push(ele.name)
                    this.gameList[ele.name] = ele.id //赛事对应id
                    await findEntity(ele.id).then(res => { //获取赛项列表
                        if(res.status==1){
                            let gameDetail = res.data
                            this.gameItem[gameDetail.name] = [] //赛事下的赛项
                            this.gameItemList[gameDetail.name]={} //组别
                            this.gameItemListId[gameDetail.name]={} //赛项id
                            gameDetail.itemGroup.forEach((ele,index) => {
                                if(this.gameItem[gameDetail.name].indexOf(ele.itemName)<0){
                                    this.gameItem[gameDetail.name].push(ele.itemName)
                                }
                                this.gameItemListId[gameDetail.name][ele.itemName] = ele.competitionItemId //赛项id
                                this.gameItemListId[gameDetail.name][ele.itemName+ele.groupName] = ele.id
                                if(!this.gameItemList[gameDetail.name][ele.itemName]){
                                    this.gameItemList[gameDetail.name][ele.itemName] = []
                                }
                                this.gameItemList[gameDetail.name][ele.itemName].push(ele.groupName)
                            })
                        }
                    })
                }
            }
        },
        getMapData(){ //获取地图信息
            mapfindEntity(this.currentGameId,this.currentGameItemId,this.crrrentGroupId).then(res=>{
                console.log(res)
                if(res.status == '1'){
                    if(res.data){
                        this.imgUrl =  res.data.mapUrl,
                        this.westlng = res.data.westLng,
                        this.southlat = res.data.southLat,
                        this.eastlng = res.data.eastLng,
                        this.northlat = res.data.northLat
                        this.originalwestlng = res.data.westLng,
                        this.originalsouthlat = res.data.southLat,
                        this.originaleastlng = res.data.eastLng,
                        this.originalnorthlat = res.data.northLat
                        this.mapid = res.data.id
                        this.noData = false
                        this.mapCenter = [(this.originalwestlng+this.originaleastlng)/2,(this.originalsouthlat+this.originalnorthlat)/2]
                        this.getMap()
                    }else{
                        this.noData = true
                        this.mapid = null
                    }
                }
            })
        }
    }
        
       
}
</script>
<style lang="scss" scoped>
    .drawLoats_head{
        background-color: #E2F2FF;
        height: 40px;
        display: flex;
        align-items: center;
        .game_select{
            margin-left: 30px
        }
    }
    .mapCont{
        .upButton{
            display: flex;
            justify-content: flex-start;
            margin: 14px 0
        }
        .mapBox{
            position: relative;
            .mapset{
                position: absolute;
                right: 10px;
                top: 10px;
                background-color: #fff;
                border-radius: 5px;
                padding: 20px;
                padding-bottom: 10px;
                padding-top: 0;
                box-shadow:0 4px 12px rgba(0, 0, 0, 0.15);
                div{
                    margin-top: 10px
                }
                div:nth-child(1){
                    color: #387EE8;
                    font-weight: 600;
                    text-align: left
                }
                .mapsetbtn{
                    display: flex;
                    justify-content: space-between;
                    p{
                        flex: 0.6;
                        border-radius: 2px;
                        cursor: pointer;
                    }
                    p:nth-child(1){
                        border: 1px solid #387EE8;
                        color: #387EE8;
                        margin-right: 10px
                    }
                    p:nth-child(2){
                        background-color: #387EE8;
                        color: #fff
                    }
                }
                input{
                    width: 80px;
                    margin-left: 5px
                }
            }
            .mapStyle{
                position: absolute;
                left: 10px;
                top: 10px;
                color:#387EE8
            }
        }
    }
    .noData{
        margin: 0 auto;
        margin-top: 100px;
        text-align: center
    }
    .game_name{
        margin: 15px 0;
        input{
            width: 300px;
            margin-left: 10px
        }
    }

</style>


