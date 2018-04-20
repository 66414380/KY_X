/**
 * Created by W-Q on 2017/9/21.
 */
import * as types from './type'

export default {
  topHeight({commit}, height){
    commit(types.TOPHEIGHT,height);
  },
  setBodyHeight({commit}, height){
    commit(types.BODYHEIGHT,height);
  },
  setLoadingStatus({commit}, isLoading){
    commit(types.UPDATELOADINGSTATUS,isLoading);
  },
  NavPathChange({commit},path){
    commit(types.NAVPATHCHANGE,path);
  },
  setPublicLevelId({commit},obj){
    commit(types.PUBLICLEVELID,obj);
  },
  setPermissionLevelId({commit},obj){
    commit(types.PERMISSIONLEVELID,obj);
  },
  setX1StoreLevelId({commit},obj){
    commit(types.X1STORELEVELID,obj);
  },
  setX2StoreLevelId({commit},obj){
    commit(types.X2STORELEVELID,obj);
  },
  setPrintConfLevelId({commit},obj){
    commit(types.PRINTCONFLEVELID,obj);
  },
  setRunningStateLevelId({commit},obj){
    commit(types.RUNNINGSTATELEVELID,obj);
  },
  setPushStateLevelId({commit},obj){
    commit(types.PUSHSTATELEVELID,obj);
  },
  setBusinessConfLevelId({commit},obj){
    commit(types.BUSINESSCONFLEVELID,obj);
  },
  setStoreTreeList({commit},obj){
    commit(types.STORETREELIST,obj);
  },
  setShowStoreTree({commit},obj){
    commit(types.SHOWSTORETREE,obj);
  },
  setTreeArr({commit},obj){
    commit(types.TREEARR,obj);
  },


  setPermissionTree({commit},obj){
    commit(types.PERMISSIONTREE,obj);
  },
  setBusinessConfTree({commit},obj){
    commit(types.BUSINESSCONFTREE,obj);
  },
  setPushStateTree({commit},obj){
    commit(types.PUSHSTATETREE,obj);
  },
  setRunningStateTree({commit},obj){
    commit(types.RUNNINGSTATETREE,obj);
  },
  setPrintConfTree({commit},obj){
    commit(types.PRINTCONFTREE,obj);
  },
  setX2storeTree({commit},obj){
    commit(types.X2STORETREE,obj);
  },
  setX1storeTree({commit},obj){
    commit(types.X1STORETREE,obj);
  },
  setPublicTree({commit},obj){
    commit(types.PUBLICTREE,obj);
  },

  setScatterMapTree({commit},obj){
    commit(types.SCATTERMAPTREE,obj);
  },
  setScatterMapTreeLevelId({commit},obj){
    commit(types.SCATTERMAPTREELEVELID,obj);
  },
  setDishesLibraryTree({commit},obj){
    commit(types.DISHESLIBRARYTREE,obj);
  },
  setDishesLibraryLevelId({commit},obj){
    commit(types.DISHESLIBRARYLEVELID,obj);
  },
  setSalesRankingTree({commit},obj){
    commit(types.SALESRANKINGTREE,obj);
  },
  setSalesRankingLevelId({commit},obj){
    commit(types.SALESRANKINGLEVELID,obj);
  },
  setSettlementRecordTree({commit},obj){
    commit(types.SETTLEMENTRECORDTREE,obj);
  },
  setSettlementRecordLevelId({commit},obj){
    commit(types.SETTLEMENTRECORDLEVELID,obj);
  },
  setDishesSpecTree({commit},obj){
    commit(types.DISHESSPECTREE,obj);
  },
  setDishesSpecLevelId({commit},obj){
    commit(types.DISHESSPECLEVELID,obj);
  },
  setBoxSettingTree({commit},obj){
    commit(types.BOXSETTINGTREE,obj);
  },
  setBoxSettingLevelId({commit},obj){
    commit(types.BOXSETTINGLEVELID,obj);
  },
  setDishesCategoryTree({commit},obj){
    commit(types.DISHESCATEGORYTREE,obj);
  },
  setDishesCategoryLevelId({commit},obj){
    commit(types.DISHESCATEGORYLEVELID,obj);
  },
  setStoreDishesManageTree({commit},obj){
    commit(types.STOREDISHESMANAGETREE,obj);
  },
  setStoreDishesManageLevelId({commit},obj){
    commit(types.STOREDISHESMANAGELEVELID,obj);
  },
  setDishesGroupTree({commit},obj){
    commit(types.DISHESGROUPTREE,obj);
  },
  setDishesGroupLevelId({commit},obj){
    commit(types.DISHESGROUPELEVELID,obj);
  },
  setStoreLabelTree({commit},obj){
    commit(types.STORELABELTREE,obj);
  },
  setStoreLabelLevelId({commit},obj){
    commit(types.STORELABELLEVELID,obj);
  },
  setOperationSchemeTree({commit},obj){
    commit(types.OPERATIONSCHEMETREE,obj);
  },
  setOperationSchemeLevelId({commit},obj){
    commit(types.OPERATIONSCHEMELEVELID,obj);
  },
  setDishesRecordTree({commit},obj){
    commit(types.DISHESRECORDTREE,obj);
  },
  setDishesRecordLevelId({commit},obj){
    commit(types.DISHESRECORDLEVELID,obj);
  },

  setStoreRecordTree({commit},obj){
    commit(types.STORERECORDTREE,obj);
  },
  setStoreRecordLevelId({commit},obj){
    commit(types.STORERECORDLEVELID,obj);
  },
  setAccountListTree({commit},obj){
    commit(types.ACCOUNTLISTTREE,obj);
  },
  setAccountListLevelId({commit},obj){
    commit(types.ACCOUNTLISTLEVELID,obj);
  },

  setActivitySettingTree({commit},obj){
    commit(types.ACTIVITYSETTINGTREE,obj);
  },
  setActivitySettingLevelId({commit},obj){
    commit(types.ACTIVITYSETTINGLEVELID,obj);
  },
}
