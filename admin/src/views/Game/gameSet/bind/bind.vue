<template>
  <div class="bind">
    <a-spin :spinning="spinning" :tip="loadingText">
      <div class="bind_cont" v-show="!ispreview">
        <div class="gameItem">
          <div class="header">
            赛项：
            <a-select placeholder="请选择赛项" style="min-width: 130px" @change="handlegameceChange">
              <a-select-option v-for="item in gameItemList" :key="item.key">{{item.name}}</a-select-option>
            </a-select>
          </div>
          <div class="grouplist">
            <div v-for="(item,index) in grouplist" :key="index">{{item.groupName}}</div>
          </div>
        </div>
        <div class="group">
          <div class="header">组别</div>
          <div class="grouplist">
            <div style="padding-left:15px" v-for="(item,index) in allGroupList" :key="index">
              <a-checkbox @change="onChange" :value="item.id">{{item.groupName}}</a-checkbox>
            </div>
          </div>
          <a-button class="sureBtn" @click="sureDis" type="primary">确定</a-button>
        </div>
      </div>
      <div class="bind_preview" v-show="ispreview">
        <div class="gameitem_list">
          <p>赛项名称1</p>
          <p>组别名称1</p>
          <p>组别名称2</p>
        </div>
        <div class="gameitem_list">
          <p>赛项名称1</p>
          <p>组别名称1</p>
          <p>组别名称2</p>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
import {
  groupfindAllList,
  findAllList,
  findItemGroupList,
  bindsaveEntity
} from "@/api";
export default {
  data() {
    return {
      gameItem: [
        {
          name: "白白米",
          id: 1
        },
        {
          name: "嘿嘿",
          id: 2
        }
      ],
      selectCheckBox: [],
      ispreview: false,
      groupList: [], //组别列表
      gameItemList: [], //赛项列表
      competitionId: "", //赛事id
      competitionItemid: "", //赛项id
      grouplist: [], //赛项对应组别列表
      allGroupList: [], //所有组别列表
      gameitemtype: "", //赛项类型
      loadingText: "绑定中",
      spinning: false //loading
    };
  },
  created() {
    this.competitionId = this.$route.query.gameId;
    this.getGameItem();
    this.getAllgroup();
  },
  mounted() {
    console.log(this.gameItemList);
    //this.gameitemtype = this.gameItemList[0].type
  },
  methods: {
    handlegameceChange(e) {
      //选择赛项
      this.competitionItemid = e;
      // console.log(this.gameItemList);
      // console.log(e);
      for (let i = 0; i < this.gameItemList.length; i++) {
        let item = this.gameItemList[i];
        if (item.key == e) {
          // console.log(item.type);
          this.gameitemtype = item.type;
        }
      }
      this.getGroupList();
    },
    onChange(e) {
      //    console.log(e)
      let value = e.target.value;
      if (e.target.checked) {
        this.selectCheckBox.push(value);
      } else {
        if (this.selectCheckBox.indexOf(value) >= 0) {
          this.selectCheckBox.splice(this.selectCheckBox.indexOf(value), 1);
        }
      }
      // console.log(this.selectCheckBox)
    },
    sureDis() {
      //确定分组
      // this.ispreview = true
      this.spinning = true;
      let paramslist = [];
      this.selectCheckBox.forEach(item => {
        paramslist.push({
          groupId: item,
          competitionItemId: this.competitionItemid,
          itemType: this.gameitemtype
        });
      });
      // console.log(paramslist);
      //此处有改！！！！
      //paramslist.forEach(item => {
        if (paramslist.length>0&&paramslist[0].itemType) {
          //console.log(item.itemType)
          bindsaveEntity(
            this.competitionId,
            this.competitionItemid,
            paramslist
          ).then(res => {
            // console.log(res)
            if (res.status == 1) {
              this.spinning = false;
              this.$message.success("绑定成功", 1).then(res => {
                this.getGroupList();
              });
            } else {
              this.spinning = false;
            }
          });
        }else{
            alert('请选择赛项')
            this.spinning = false
        }
      //});
    },
    getGroupList() {
      //获取赛项对应组别
      this.grouplist = [];
      findItemGroupList(this.competitionId, this.competitionItemid).then(
        res => {
          // console.log(res)
          if (res.status == 1) {
            if (res.data.length > 0) {
              this.grouplist = res.data;
            }
          }
        }
      );
    },
    getGameItem() {
      //获取所有赛项
      this.gameItemList = [];
      findAllList(this.competitionId).then(res => {
        // console.log(res);
        if (res.status == 1) {
          let data = res.data;
          if (data.length > 0) {
            this.competitionItemid = data[0].id;
            // this.getGroupList();
            data.forEach((item, index) => {
              this.gameItemList.push({
                key: item.id,
                name: item.itemName,
                type: item.type,
                starttime: item.startDate
                  ? this.$formatDate(item.startDate)
                  : "",
                endtime: item.endDate ? this.$formatDate(item.endDate) : "",
                address: item.type == 1 ? "单人" : "接力",
                align: "center"
              });
            });
            // this.gameItemList.unshift({
            //     name:'请选择赛项',
            // })
          }
        }
        // console.log(this.gameItemList)
      });
    },
    getAllgroup() {
      //获取所有组别
      this.allGroupList = [];
      groupfindAllList(this.competitionId).then(res => {
        // console.log(res);
        if (res.status == 1) {
          let data = res.data;
          this.allGroupList = data;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.bind_cont {
  display: flex;
  position: relative;
  .gameItem {
    width: 400px;
    border-right: 1px solid #ddd;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
  }
  .group {
    width: 400px;
    border-right: 1px solid #ddd;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    position: relative;
  }
  .header {
    border-bottom: 1px solid #ddd;
    height: 50px;
    line-height: 50px;
    font-weight: 800;
  }
  .grouplist {
    div {
      margin: 12px 0;
      text-align: left;
      padding-left: 110px;
    }
  }
  .sureBtn {
    position: absolute;
    bottom: -50px;
    right: 10px;
  }
}
.bind_preview {
  .gameitem_list {
    display: flex;
    border-left: 1px solid #ddd;
    margin-bottom: 20px;
    p {
      border: 1px solid #ddd;
      border-left: none;
      padding-bottom: 0;
      margin-bottom: 0;
      width: 200px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }
  }
}
</style>


