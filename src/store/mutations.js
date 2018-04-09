/**
 * Created by W-Q on 2017/9/21.
 */
import getters from './getters'
import * as types from './type'

const state = {
  height: 0,//顶部高度
  bodyHeight: 0,//内容高度
  navPath: [],
  isLoading: false,
  treeArr:{},//页面权限

  storeTreeList:[],//门店库树
  showStoreTree: {levelid: '', type: '', showAdd: false},//门店库树状态
  publicTree:[],//公众号树
  publicLevelId:'',//公众号levelid(没有使用,用了localStorage)
  permissionTree:[],//用户组管理树
  permissionLevelId:'',//用户组管理levelid
  x1storeTree:[],//x1门店管理树
  x1storeLevelId:'',//x1门店列表levelid
  x2storeTree:[],//x2门店管理树
  x2storeLevelId:'',//x2门店管理levelid
  printConfTree:[],//打印机配置树
  printConfLevelId:'',//打印机配置levelid
  runningStateTree:[],//终端状态树
  runningStateLevelId:'',//终端状态levelid
  pushStateTree:[],//推送状态树
  pushStateLevelId:'',//推送状态levelid
  businessConfTree:[],//商户配置树
  businessConfLevelId:'',//商户配置levelid
  dishesLibraryTree:[],//菜品库树
  dishesLibraryLevelId:'',//菜品库levelid
  scatterMapTree: [], // 散点地图树
  scatterMapTreeLevelId: '', // 散点地图树levelid
  salesRankingTree:[],//菜品销售排行树
  salesRankingLevelId:'',//菜品销售排行levelid
  settlementRecordTree:[],//结算记录树
  settlementRecordLevelId:'',//结算记录levelid
  dishesSpecTree:[],//菜品规格树
  dishesSpecLevelId:'',//菜品规格levelid
  boxSettingTree:[],//餐盒树
  boxSettingLevelId:'',//餐盒levelid
  dishesCategoryTree:[],//菜品品类树
  dishesCategoryLevelId:'',//菜品品类levelid
  storeDishesManageTree:[],//菜品列表树
  storeDishesManageLevelId:'',//菜品列表levelid
  dishesGroupTree:[],//菜品组树
  dishesGroupLevelId:'',//菜品组levelid
  storeLabelTree:[],//门店标签树
  storeLabelLevelId:'',//门店标签levelid
  operationSchemeTree:[],//x2运营方案树
  operationSchemeLevelId:'',//x2运营方案levelId
  dishesRecordTree:[],//菜品同步记录树
  dishesRecordLevelId:'',//菜品同步记录levelId

  storeRecordTree:[],//门店同步记录树
  storeRecordLevelId:''//门店同步记录levelId
};

const mutations = {
  [types.TOPHEIGHT](state, height){
    state.height = height;
  },
  [types.BODYHEIGHT](state, height){
    state.bodyHeight = height;
  },
  [types.NAVPATHCHANGE](state,path){
    state.navPath = path;
  },
  [types.UPDATELOADINGSTATUS](state, payload) {
    state.isLoading = payload.isLoading
  },
  [types.PUBLICLEVELID](state, obj){
    state.publicLevelId = obj.levelId
  },
  [types.PERMISSIONLEVELID](state, obj){
    state.permissionLevelId = obj.levelId
  },
  [types.X1STORELEVELID](state, obj){
    state.x1storeLevelId = obj.levelId
  },
  [types.X2STORELEVELID](state, obj){
    state.x2storeLevelId = obj.levelId
  },
  [types.PRINTCONFLEVELID](state, obj){
    state.printConfLevelId = obj.levelId
  },
  [types.RUNNINGSTATELEVELID](state, obj){
    state.runningStateLevelId = obj.levelId
  },
  [types.PUSHSTATELEVELID](state, obj){
    state.pushStateLevelId = obj.levelId
  },
  [types.BUSINESSCONFLEVELID](state, obj){
    state.businessConfLevelId = obj.levelId
  },
  [types.SHOWSTORETREE](state, obj){
    state.showStoreTree = obj.obj
  },
  [types.TREEARR](state, obj){
    state.treeArr = obj.obj;
    window.localStorage.setItem('treeArr',window.JSON.stringify(obj.obj))
  },
  [types.STORETREELIST](state, obj){
    state.storeTreeList = obj.list
  },
  [types.PERMISSIONTREE](state, obj){
    state.permissionTree = obj.list
  },
  [types.BUSINESSCONFTREE](state, obj){
    state.businessConfTree = obj.list
  },
  [types.PUSHSTATETREE](state, obj){
    state.pushStateTree = obj.list
  },
  [types.RUNNINGSTATETREE](state, obj){
    state.runningStateTree = obj.list
  },
  [types.PRINTCONFTREE](state, obj){
    state.printConfTree = obj.list
  },
  [types.X2STORETREE](state, obj){
    state.x2storeTree = obj.list
  },
  [types.X1STORETREE](state, obj){
    state.x1storeTree = obj.list
  },
  [types.PUBLICTREE](state, obj){
    state.publicTree = obj.list
  },
  // 散点树
  [types.SCATTERMAPTREE](state,obj){
    state.scatterMapTree = obj.list;
  },
  [types.SCATTERMAPTREELEVELID](state, obj){
    state.scatterMapTreeLevelId = obj.levelId;
  },
  [types.DISHESLIBRARYTREE](state,obj){
    state.dishesLibraryTree = obj.list;
  },
  [types.DISHESLIBRARYLEVELID](state, obj){
    state.dishesLibraryLevelId = obj.levelId
  },
  [types.SALESRANKINGTREE](state,obj){
    state.salesRankingTree = obj.list;
  },
  [types.SALESRANKINGLEVELID](state, obj){
    state.salesRankingLevelId = obj.levelId
  },
  [types.SETTLEMENTRECORDTREE](state,obj){
    state.settlementRecordTree = obj.list;
  },
  [types.SETTLEMENTRECORDLEVELID](state, obj){
    state.settlementRecordLevelId = obj.levelId
  },
  [types.DISHESSPECTREE](state,obj){
    state.dishesSpecTree = obj.list;
  },
  [types.DISHESSPECLEVELID](state, obj){
    state.dishesSpecLevelId = obj.levelId
  },
  [types.BOXSETTINGTREE](state,obj){
    state.boxSettingTree = obj.list;
  },
  [types.BOXSETTINGLEVELID](state, obj){
    state.boxSettingLevelId = obj.levelId
  },
  [types.DISHESCATEGORYTREE](state,obj){
  state.dishesCategoryTree = obj.list;
  },
  [types.DISHESCATEGORYLEVELID](state, obj){
    state.dishesCategoryLevelId = obj.levelId
  },

  [types.STOREDISHESMANAGETREE](state,obj){
    state.storeDishesManageTree = obj.list;
  },
  [types.STOREDISHESMANAGELEVELID](state, obj){
    state.storeDishesManageLevelId = obj.levelId
  },

  [types.DISHESGROUPTREE](state,obj){
    state.dishesGroupTree = obj.list;
  },
  [types.DISHESGROUPELEVELID](state, obj){
    state.dishesGroupLevelId = obj.levelId
  },
  [types.STORELABELTREE](state,obj){
    state.storeLabelTree = obj.list;
  },
  [types.STORELABELLEVELID](state, obj){
    state.storeLabelLevelId = obj.levelId
  },

  [types.OPERATIONSCHEMETREE](state,obj){
    state.operationSchemeTree = obj.list;
  },
  [types.OPERATIONSCHEMELEVELID](state, obj){
    state.operationSchemeLevelId = obj.levelId
  },

  [types.DISHESRECORDTREE](state,obj){
    state.dishesRecordTree = obj.list;
  },
  [types.DISHESRECORDLEVELID](state, obj){
    state.dishesRecordLevelId = obj.levelId
  },

  [types.STORERECORDTREE](state,obj){
    state.storeRecordTree = obj.list;
  },
  [types.STORERECORDLEVELID](state, obj){
    state.storeRecordLevelId = obj.levelId
  },
};

export default {
  state,
  getters,
  mutations
}
