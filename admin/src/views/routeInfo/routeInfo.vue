<template>
  <div class="routeInfo" id="route">
    <div class="drawLoats_head">
        <div class="game_select">
            赛事：
            <a-select :defaultValue="game[0]" style="width: 250px" @change="handlegameceChange">
                <a-select-option v-for="province in game" :key="province">{{province}}</a-select-option>
            </a-select>
        </div>
        <div class="game_select">
            赛项：
            <a-select v-model="secondCity" style="width: 250px" @change="handlegameItemceChange">
                <a-select-option v-for="city in cities" :key="city">{{city}}</a-select-option>
            </a-select>
        </div>
    </div>
    <div class="route_cont">
        <div v-show="!isupload" class="beforeUpload">
            <div class="operate_tip" v-show="currentGameId==''||currentGameItemId==''">请先选择赛事和赛项！</div>
            <!-- v-show="currentGameId&&currentGameItemId" -->
            <div class="operate_tip" v-show="currentGameId&&currentGameItemId">
                <h4>路线信息导入</h4>
                <div class="fileBox">
                    <a-upload
                    :fileList="fileList"
                    :remove="handleRemove"
                    :beforeUpload="beforeUpload"
                    >
                        <a-button>
                            选择
                        </a-button>
                    </a-upload>
                    <a-button
                        type="primary"
                        @click="handleUpload"
                        :disabled="fileList.length === 0"
                        :loading="uploading"
                        style="margin-top: 16px"
                        >
                        {{uploading ? '上传中' : '确定' }}
                    </a-button>
                </div>
            </div>
        </div>
        <div v-show="isupload" class="uploaded" :style="{'height':contHeight-240+'px'}">
            <table>
                <thead>
                    <tr>
                        <th>路线名称</th>
                        <th>路线信息</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in lineInfoList" :key="index">
                        <td>{{item.lineName}}</td>
                        <td>
                            路线名称
                            <span v-for="(lineItem,lineIndex) in item.pointList" :key="lineIndex">{{lineItem.pointNo}} {{lineIndex == item.pointList.length-1?'':'-'}}</span>
                        </td>
                        <td>操作</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="operate_btn" v-show="isupload">
        <a-button type="primary" @click="operate()">打印</a-button>
    </div>
  </div>
</template>
<script>
import {findAllCompetition,findEntity,findLineData} from '@/api'
import axios from '@/utils/request.js'
export default {
  data(){
      return {
        isupload:false,//是否有信息表
        fileList: [],
        uploading: false,
        gameList:{},//赛事列表
        gameItemList:{},//赛项列表
        game:[
            '请选择', 
        ],
        gameItem:{
            请选择: ['请选择'],
        },
        cities:null,//赛事
        secondCity:null,//赛项
        currentGame:'',//当前选择的赛事名称
        currentGameId:'',//当前选择的赛事Id
        currentGameItemId:'',//当前选择的赛项Id
        lineInfoList:null,//路线信息表
      }
  },
  props:['contHeight'],
  mounted(){
    this.cities = this.gameItem[this.game[0]]
    this.secondCity = this.gameItem[this.game[0]][0]
    this.getGameList()
    this.currentGameId=''
    this.currentGameItemId=''
  },
  methods:{
    handleOk(e) {
        console.log(e);
        this.visible = false
    },
    handlegameceChange(value) {//赛事赛项选择
        if(value!='请选择'){
            this.cities = this.gameItem[value]
            this.secondCity = this.gameItem[value][0]
            this.currentGame = value//赛事名称
            this.currentGameId = this.gameList[value]//赛事id
            this.currentGameItemId = this.gameItemList[value][this.secondCity]//赛项id
            this.isupload=false
            this.getLineData(this.currentGameId,this.currentGameItemId)
        }else{
            this.cities = this.gameItem[this.game[0]]
            this.secondCity = this.gameItem[this.game[0]][0]
            this.currentGameId=''
            this.currentGameItemId=''
            this.currentGame = ''//赛事名称
            this.isupload=false
        }
    },
    handlegameItemceChange(value) {//赛事赛项选择
        this.currentGameItemId = this.gameItemList[this.currentGame][value]//赛项id
        this.isupload=false
        this.getLineData(this.currentGameId,this.currentGameItemId)
    },
    getGameList(){//获取赛事列表
        findAllCompetition().then(res=>{
            let data = res;
            if(data.status==1){
                let gameList = data.data;
                // console.log(gameList)
                gameList.forEach(ele => {
                    this.game.push(ele.name)
                    this.gameList[ele.name] = ele.id
                    findEntity(ele.id).then(res=>{//获取赛项列表
                        if(res.status==1){
                            let gameDetail = res.data;
                            this.gameItem[gameDetail.name] = []
                            this.gameItemList[gameDetail.name]={}
                            gameDetail.competitionItem.forEach(ele=>{
                                this.gameItem[gameDetail.name].push(ele.itemName)
                                this.gameItemList[gameDetail.name][ele.itemName] = ele.id
                            })
                        }
                    })
                });
            }
        })
    },
    leadIn(){//导入
        // let createinput = '<input class="import-btn" type="file" accept=".xlsx" style="display: block">';
        let createinput=document.createElement('input');
        createinput.setAttribute('type','file')
        createinput.setAttribute('accept','.xlsx')
        createinput.classList.add('import-btn')
        createinput.style.display='block'
        console.log(document.getElementById('route'))
        console.log(createinput)
        return
        document.getElementById('route').appendChild(p)
    },
    handleRemove(file) {
        console.log(678)
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
    getLineData(currentGameId,currentGameItemId){
        this.lineInfoList = []
        findLineData(currentGameId,currentGameItemId).then(res=>{
            console.log(res)
            if(res.status==1){
                if(res.data.length>0){
                    this.lineInfoList = res.data
                    this.isupload=true
                }else{
                    //没有数据
                    this.isupload=false
                }
            }
        }).catch(err=>{
            // console.log(err)
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
        margin-left: 60px
    }
}
.route_cont {
    .operate_tip{
        text-align: left;
        margin-top: 30px;
        padding-left: 60px;
        h4{
            font-weight: 700;
        }
        .fileBox{
            input{
                width: 220px;
                margin-left: 15px
            }
            button{
                margin-left: 15px
            }
        }
    }
    .uploaded{
        margin: 15px 0;
        padding-bottom: 15px;
        overflow-y: auto;
        table{
            border: 1px solid #DDDDDD;
            border-bottom: none;
            // width: 650px;
            text-align: left;
            thead{
                tr{
                    background-color: #F7FBFF;
                    border-bottom: 1px solid #DDDDDD;
                    height: 35px;
                    padding-left: 15px;
                    th{
                        min-width: 110px;
                        padding-left: 15px
                    }
                }
            }
            tbody{
                tr{
                    background-color: #fff;
                    border-bottom: 1px solid #DDDDDD;
                    height: 35px;
                    color: #666;
                    padding-left: 15px;
                    td{
                        min-width: 110px;
                        padding-left: 15px
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