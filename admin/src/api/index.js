import axios from '@/utils/request.js'
import QS from 'qs'
/**
 * 赛事
 */
export function findAllCompetition(){//赛事列表
    return axios.post('along/CrossCompetitionController/findAllCompetition')
}
export function findEntity(competitionId){//赛事下面的赛项
    return axios.post('along/CrossCompetitionController/findEntity',QS.stringify({competitionId:competitionId}))
}
/**
 * 抽签
 */
export function findGroupAndChild(competitionId,competitionItemId){//获取所有抽签前的数据结果集
    return axios.post('along/CrossCompetitionItemsController/findGroupAndChild',QS.stringify({competitionId:competitionId,competitionItemId:competitionItemId}))
}
export function drawLots(competitionId,competitionItemId){//抽签，抽签返回的数据可以不处理
    return axios.post('along/CrossCompetitionItemsController/drawLots',QS.stringify({competitionId:competitionId,competitionItemId:competitionItemId}))
}
export function findEntityList(competitionId,competitionItemId){//出发批次表
    return axios.post('along/CrossBatchController/findEntityList',QS.stringify({competitionId:competitionId,competitionItemId:competitionItemId}))
}
export function selectListByCompetition(competitionId,competitionItemId){//出发时刻表
    return axios.post('along/CrossSportsmanController/selectListByCompetition',QS.stringify({competitionId:competitionId,competitionItemId:competitionItemId}))
}
/**
 * 设备绑定
 */
// export function findListJoinCardByCompetition(competitionId){//获取赛事下所有人员信息，以及绑定的指卡
//     return axios.post('along/CrossSportsmanController/findListJoinCardByCompetition',QS.stringify({competitionId:competitionId}))
// }
export function findListJoinCardByCompetition(competitionId){//获取赛事下所有人员信息，以及绑定的指卡
    return axios({
        method:'post',
        url:'along/CrossSportsmanController/findListJoinCardByCompetition',
        data:JSON.stringify({
            competitionId:competitionId
        }),
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
// export function findEntityByGps(competitionId,isGps){//gps绑定与未绑定人员获取
//     return axios.post('along/CrossSportsmanController/findEntityByGps',QS.stringify({
//         competitionId:competitionId,
//         isGps:isGps,//0为未绑定，1为绑定
//     }))
// }
export function findEntityByGps(competitionId,keyWord){//已绑定gps
    return axios({
        method:'post',
        url:'along/CrossSportsmanController/findEntityByGps',
        data:JSON.stringify({
            competitionId:competitionId,
            keyWord:keyWord,
        }),
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function findEntityByNoGps(competitionId){//未绑定gps
    return axios({
        method:'post',
        url:'along/CrossSportsmanController/findEntityByNoGps',
        data:JSON.stringify({
            competitionId:competitionId,
        }),
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function updateEntityAndCard(id,sportsmanId,cardNo,competitionId){//人员分配为指卡
    return axios({
        method:'post',
        url:'along/CrossSportsmanController/updateEntityAndCard',
        data:JSON.stringify({
            id:id,
            sportsmanId:sportsmanId,
            cardNo:cardNo,
            competitionId:competitionId
        }),
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
    // return axios.post('along/CrossSportsmanController/updateEntityAndCard',QS.stringify({id:id,sportsmanId:sportsmanId,cardNo:cardNo,competitionId:competitionId}))
}
export function findAllGpsList(){//赛事列表
    return axios.post('along/CrossGpsController/findAllGpsList')
}

export function updateEntityAndGps(sportsmanList,competitionId,competitionItemId){//赛事列表
    return axios({
        method:"post",
          url:"along/CrossSportsmanController/updateEntityAndGps",
          data:JSON.stringify({
            sportsmanList:sportsmanList,
            competitionId:competitionId,
            competitionItemId:competitionItemId
          }),            //参数
          headers:{
              'Content-Type':'application/json;charset=UTF-8;'   
          }
    })
}
export function replaceSportsmanGps(gps,gpsNo){//替换gps
    return axios({
        method:"post",
          url:"along/CrossSportsmanController/replaceSportsmanGps",
          data:JSON.stringify({
            gps:gps,
            gpsNo:gpsNo
          }),            //参数
          headers:{
              'Content-Type':'application/json;charset=UTF-8;'   
          }
    })
}
/**
 * 路线信息
 */
export function findLineData(competitionId,competitionItemId){//路线信息列表
    return axios.post('along/CrossLineController/findLineData',QS.stringify({competitionId:competitionId,competitionItemId:competitionItemId}))
}
/**
 * 赛事
 */
export function findAllGetPage(name,pageNumber,length){//赛事列表，分页
    return axios({
        method:"post",
          url:"along/CrossCompetitionController/findAllGetPage",
          data:JSON.stringify({
            name:name,
            pageNumber:pageNumber,
            length:length
          }),            //参数
          headers:{
              'Content-Type':'application/json;charset=UTF-8;'   
          }
    })
}
export function saveEntity(id,name,startDate,location,isPublish){//新增赛事
    return axios({
        method:"post",
        url:"along/CrossCompetitionController/saveEntity",
        data:JSON.stringify({
            id:id,
            name:name,
            startDate:startDate,
            location:location,
            isPublish:isPublish
        }),            //参数
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function delEntity(competitionId){//删除赛事
    return axios.post('along/CrossCompetitionController/delEntity',QS.stringify({competitionId:competitionId}))
}
export function findAllList(competitionId){//获取所有赛项列表
    return axios.post('along/CrossCompetitionItemsController/findAllList',QS.stringify({competitionId:competitionId}))
}
export function gameitemsaveEntity(id,itemName,startDate,endDate,competitionId,type){//新增,修改赛项
    return axios({
        method:"post",
        url:"along/CrossCompetitionItemsController/saveEntity",
        data:JSON.stringify({
            id:id,
            itemName:itemName,
            startDate:startDate,
            endDate:endDate,
            competitionId:competitionId,
            type:type
        }),            //参数
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function gameitemdelEntity(competitionItemId){//删除赛项
    return axios.post('along/CrossCompetitionItemsController/delEntity',QS.stringify({competitionItemId:competitionItemId}))
}
export function groupfindAllList(competitionId){//获取所有组别
    return axios.post('along/CrossGroupController/findAllList',QS.stringify({competitionId:competitionId}))
}
export function groupsaveEntity(params){//新增,修改组别信息
    return axios({
        method:"post",
        url:"along/CrossGroupController/saveEntity",
        data:JSON.stringify({
            id:params.id,
            groupName:params.groupName,
            competitionId:params.competitionId,
            parentId:params.parentId,
            isAb:params.isAb,//ab线，a为1，b为2
            sortNum:params.sortNum

        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function groupdelEntity(groupId){//删除组别
    return axios.post('along/CrossGroupController/delEntity',QS.stringify({groupId:groupId}))
}
export function findItemGroupList(competitionId,competitionItemId){//获取赛事赛项关系数据组别
    return axios({
        method:"post",
        url:"along/CrossCompetitionItemGroupController/findItemGroupList",
        data:JSON.stringify({
            competitionId:competitionId,
            competitionItemId:competitionItemId
        }),            //参数
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function bindsaveEntity(competitionId,competitionItemId,params){//绑定赛事赛项关系数据组别
    return axios({
        method:"post",
        url:"along/CrossCompetitionItemGroupController/saveEntity",
        data:JSON.stringify({
            competitionId:competitionId ,//赛事id
            competitionItemId:competitionItemId,//赛项id
            itemGroupList:params
            
        }),  
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function fingerupdateEntity(competitionId,params){//配置赛事赛项关系数据组别
    return axios({
        method:"post",
        url:"along/CrossCompetitionItemGroupController/updateEntity",
        data:JSON.stringify({
            competitionId:competitionId ,//赛事id
            itemGroupList:params
            
        }),  
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
/**
 * 号码布分配
 */
export function findSportsmanNoList(competitionId,competitionItemId){//获取号码布列表分配
    return axios({
        method:"post",
        url:"along/CrossSportsmanController/findSportsmanNoList",
        data:JSON.stringify({
            competitionId:competitionId,
            competitionItemId:competitionItemId
        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function bibsaveEntity(params){//获取号码布列表分配
    return axios({
        method:"post",
        url:"along/CrossSportsmanNoController/saveEntity",
        data:JSON.stringify(params),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
/**
 * 设备维护
 */
export function GPSfindAllGetPage(pageNumber,length,no){//gps列表
    return axios({
        method:"post",
        url:"along/CrossGpsController/findAllGetPage",
        data:JSON.stringify({
            pageNumber:pageNumber,
            length:length,
            no:no
        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function GPSsaveEntity(params){//gps新增，修改
    return axios({
        method:"post",
        url:"along/CrossGpsController/saveEntity",
        data:JSON.stringify({
            id:params.id,//id
            no:params.no,//gps编号
            state:params.state,//默认为0未使用  1使用  2损坏
            gpsNo:params.gpsNo,//gps短号
        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function gpsdelEntity(gpsId){//gps删除
    return axios.post('along/CrossGpsController/delEntity',QS.stringify({gpsId:gpsId}))
}
export function fingerfindAllGetPage(pageNumber,length,cardNo){//指卡列表
    return axios({
        method:"post",
        url:"along/CrossFingerCardController/findAllGetPage",
        data:JSON.stringify({
            pageNumber:pageNumber,
            length:length,
            cardNo:cardNo
        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function fingersaveEntity(params){//指卡新增修改
    return axios({
        method:"post",
        url:"along/CrossFingerCardController/saveEntity",
        data:JSON.stringify({
            id:params.id,
            cardNo:params.cardNo,
            state:params.state
        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function fingerdelEntity(cardId){//指卡删除
    return axios.post('along/CrossFingerCardController/delEntity',QS.stringify({cardId:cardId}))
}
export function findNationList(pageNumber,length,searchKeyWord ){//单位列表数据
    return axios({
        method:"post",
        url:"along/CrossNationalityController/findList",
        data:JSON.stringify({
            pageNumber:pageNumber,
            length:length,
            searchKeyWord:searchKeyWord
        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function saveEntityNation(params){//新增，编辑单位
    return axios({
        method:"post",
        url:"along/CrossNationalityController/saveEntity",
        data:JSON.stringify({
            code:params.code,
            chinseName:params.chinseName,
            englishName:params.englishName,
            nationalFlagUrl:params.nationalFlagUrl,
            id:params.nationid
        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function delData(id){//删除单位
    return axios.post('along/CrossNationalityController/delData',QS.stringify({id:id}))
}
export function mapfindEntity(competitionId,competitionItemId,groupId){ //获取地图数据
    return axios({
        method:"post",
        url:"along/CrossMapController/findEntity",
        data:JSON.stringify({
            competitionId:competitionId,
            competitionItemId:competitionItemId,
            groupId:groupId,
        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function saveData(params){//新增，编辑单位
    return axios({
        method:"post",
        url:"along/CrossMapController/saveData",
        data:JSON.stringify({
            competitionId:params.competitionId,
            competitionItemId:params.competitionItemId,
            groupId:params.groupId,
            mapUrl:params.mapUrl,
            westLng:params.westlng,
            southLat:params.southlat,
            eastLng:params.eastlng,
            northLat:params.northlat,
            id:params.mapid
        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}
export function unBindGps(competitionId){ //设备解绑
    return axios({
        method:"post",
        url:"along/CrossSportsmanController/unBindGps",
        data:JSON.stringify({
            competitionId:competitionId,
        }),       
        headers:{
            'Content-Type':'application/json;charset=UTF-8;'   
        }
    })
}