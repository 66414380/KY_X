/**
 * Created by W-Q on 2017/9/21.
 */
export default{
  // 测试方法,开发时可以删除
  getData(state, getters, rootState){
    return state.data;
  },
  getTopHeight(state){
    return state.height;
  },
  getBodyHeight(state){
    return state.bodyHeight;
  },
  getNavPath(state){
    return state.navPath;
  },
  // 获取isLoading状态
  getLoadingStatus(state){
    return state.isLoading;
  },
  getPublicLevelId(state){
    return state.publicLevelId;
  },
  getPermissionLevelId(state){
    return state.permissionLevelId;
  },
  getX1StoreLevelId(state){
    return state.x1storeLevelId;
  },
  getX2StoreLevelId(state){
    return state.x2storeLevelId;
  },
  getPrintConfLevelId(state){
    return state.printConfLevelId;
  },
  getRunningStateLevelId(state){
    return state.runningStateLevelId;
  },
  getPushStateLevelId(state){
    return state.pushStateLevelId;
  },
  getBusinessConfLevelId(state){
    return state.businessConfLevelId;
  },
  getStoreTreeList(state){
    return state.storeTreeList;
  },
  getShowStoreTree(state){
    return state.showStoreTree;
  },
  getTreeArr(state){
    //需要打印才能正常return
     console.log(state.treeArr)
    // return state.treeArr;
    return window.JSON.parse(window.localStorage.getItem('treeArr'));
  },

  getPermissionTree(state){
    return state.permissionTree;
  },
  getBusinessConfTree(state){
    return state.businessConfTree;
  },
  getPushStateTree(state){
    return state.pushStateTree;
  },
  getRunningStateTree(state){
    return state.runningStateTree;
  },
  getPrintConfTree(state){
    return state.printConfTree;
  },
  getX2storeTree(state){
    return state.x2storeTree;
  },
  getX1storeTree(state){
    return state.x1storeTree;
  },
  getPublicTree(state){
    return state.publicTree;
  },
  getScatterMapTree(state){
    return state.scatterMapTree;
  },
  getScatterMapTreeLevelId(state){
    return state.scatterMapTreeLevelId;
  },
  getDishesLibraryTree(state){
    return state.dishesLibraryTree;
  },
  getDishesLibraryLevelId(state){
    return state.dishesLibraryLevelId;
  },
  getSalesRankingTree(state){
    return state.salesRankingTree;
  },
  getSalesRankingLevelId(state){
    return state.salesRankingLevelId;
  },
  getSettlementRecordTree(state){
    return state.settlementRecordTree;
  },
  getSettlementRecordLevelId(state){
    return state.settlementRecordLevelId;
  },
  getDishesSpecTree(state){
    return state.dishesSpecTree;
  },
  getDishesSpecLevelId(state){
    return state.dishesSpecLevelId;
  },
  getBoxSettingTree(state){
    return state.boxSettingTree;
  },
  getBoxSettingLevelId(state){
    return state.boxSettingLevelId;
  },
  getDishesCategoryTree(state){
    return state.dishesCategoryTree;
  },
  getDishesCategoryLevelId(state){
    return state.dishesCategoryLevelId;
  },
  getStoreDishesManageTree(state){
    return state.storeDishesManageTree;
  },
  getStoreDishesManageLevelId(state){
    return state.storeDishesManageLevelId;
  },

  getDishesGroupTree(state){
    return state.dishesGroupTree;
  },
  getDishesGroupLevelId(state){
    return state.dishesGroupLevelId;
  },

  getStoreLabelTree(state){
    return state.storeLabelTree;
  },
  getStoreLabelLevelId(state){
    return state.storeLabelLevelId;
  },
  getOperationSchemeTree(state){
    return state.operationSchemeTree;
  },
  getOperationSchemeLevelId(state){
    return state.operationSchemeLevelId;
  },
  getDishesRecordTree(state){
    return state.dishesRecordTree;
  },
  getDishesRecordLevelId(state){
    return state.dishesRecordLevelId;
  },

  getStoreRecordTree(state){
    return state.storeRecordTree;
  },
  getStoreRecordLevelId(state){
    return state.storeRecordLevelId;
  },
  getAccountListTree(state){
    return state.accountListTree;
  },
  getAccountListLevelId(state){
    return state.accountListLevelId;
  },

  getActivitySettingTree(state){
    return state.activitySettingTree;
  },
  getActivitySettingLevelId(state){
    return state.activitySettingLevelId;
  },

  getActivityDownRecordTree(state){
    return state.activityDownRecordTree;
  },
  getActivityDownRecordLevelId(state){
    return state.activityDownRecordLevelId;
  },

  getPostPaymentJumpTree(state){
    return state.postPaymentJumpTree;
  },
  getPostPaymentJumpLevelId(state){
    return state.postPaymentJumpLevelId;
  },
}
