import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main.vue'

import Login from '../components/login/Login.vue'
import Users from '../components/user/Users.vue'
import NotFound from '@/components/404/NotFound.vue'

/************************** home-logo ***************************/
import HomeLogo from '@/components/Home.vue'

/************************** 支付管理 ***************************/
import Account from '../components/iPayment/accountList/account/Index.vue'
import Record from '../components/iPayment/issuedRecord/Index.vue'
import IssuedAdd from '../components/iPayment/issuedRecord/newIssued/NewAdd/Index.vue'
import NewIssued from '../components/iPayment/issuedRecord/newIssued/Index.vue'
import IPayment from '../components/iPayment/accountList/Index.vue'

/************************** 门店管理 ***************************/
import StoreList from '../components/storeManage/storeList/storeList/Index.vue'
import NewAddStore from '../components/storeManage/storeList/newAddStore/Index.vue'
import SeeTheStore from '../components/storeManage/storeList/seeTheStore/Index.vue'
import StoreGroup from '../components/storeManage/storesGroup/Index.vue'
import EditStoreAccount from '../components/storeManage/storeList/seeTheStore/editStoreAccount/Index.vue'
import addGroup from '../components/storeManage/storesGroup/optionGroup/Index.vue'


/************************** x1统计报表 ***************************/
import TransactionList from '../components/report/transactionList/Index.vue'
import TransactionCount from '../components/report/transactionCount/Index.vue'
import SettlementRecord from '../components/report/settlementRecord/Index.vue'
import BillQuery from '../components/report/billQuery/Index.vue'
import Invoice from '../components/report/invoice/Index.vue'

/************************** x2统计报表 ***************************/
import orderList from '../components/report/orderList/Index.vue'
import orderCount from '../components/report/orderCount/Index.vue'
import salesRanking from '../components/report/salesRanking/index.vue'
import dailyPush from '../components/report/dailyPush/index.vue'
import operateDaily from '../components/report/dailyPush/operateDaily/index.vue'

/************************** 基础设置 ***************************/
import BusinessConf from '@/components/infrastructure/BusinessConf/Index.vue'
import PaymentManagement from '@/components/infrastructure/PaymentManagement/Index.vue'
import PaymentWay from '@/components/infrastructure/PaymentWay/Index.vue'
import PayChannels from '@/components/infrastructure/PayChannels/Index.vue'
import DishesLibrary from '@/components/infrastructure/DishesLibrary/Index.vue'

import AddDishes from '@/components/infrastructure/DishesLibrary/addDishes/Index.vue'
import StoreLibrary from '@/components/infrastructure/StoreLibrary/Index.vue'
import RoleManagement from '@/components/infrastructure/RoleManagement/Index.vue'
import UserManagement from '@/components/infrastructure/UserManagement/Index.vue'
import PermissionManagement from '@/components/infrastructure/PermissionManagement/Index.vue'
import PermissionUserManagement from '@/components/infrastructure/PermissionManagement/user/Index.vue'
import OperationLog from '@/components/infrastructure/OperationLog/Index.vue'

/************************** 运营 ***************************/
import RunningState from '../components/operate/RunningState/Index.vue'
import OperationPlan from '../components/operate/OperationPlan/Index.vue'

/************************** 公众号管理 ***************************/
import PublicManagement from '@/components/infrastructure/PublicManagement/Index.vue'

import TemplateMessageConf from '@/components/infrastructure/PublicManagement/TemplateMessageConf/Index.vue'

/************************** 菜品管理 ***************************/
import dishesManageList from '@/components/dishesManagement/storeDishesManage/Index.vue'

import editDishes from '@/components/dishesManagement/storeDishesManage/editDishes/Index.vue'

import dishesGroup from '@/components/dishesManagement/dishesGroup/Index.vue'
import addDishesGroup from '@/components/dishesManagement/dishesGroup/addDishesGroup/Index.vue'
import dishesCategory from '@/components/dishesManagement/dishesCategory/Index.vue'
import dishesSpec from '@/components/dishesManagement/dishesSpec/Index.vue'
import dishesAttr from '@/components/dishesManagement/dishesAttr/Index.vue'
import boxSetting from '@/components/dishesManagement/boxSetting/Index.vue'
import mealManage from '@/components/dishesManagement/mealManage/Index.vue'

/************************** 发票方案 ***************************/
import invoiceScheme from '@/components/invoice/invoiceScheme/Index.vue'
import confInvoice from '@/components/invoice/invoiceScheme/confInvoice/Index.vue'
import downRecord from '@/components/invoice/downRecord/Index.vue'
import pageDesign from '@/components/invoice/pageDesign/Index.vue'


/************************** x2运营方案 ***************************/
import storeManagement from '@/components/x2OperationScheme/storeManagement/Index.vue'
import storeManagementTakeOut from '@/components/x2OperationScheme/storeManagement/takeOut/Index.vue'
import printerConfig from '@/components/x2OperationScheme/printerConfig/Index.vue'
import pushState from '@/components/x2OperationScheme/pushState/Index.vue'
import scatterMap from '@/components/x2OperationScheme/scatterMap/index.vue'


/************************** 商户资料核实 ***************************/

import businessList from '@/components/businessInformation/businessList/Index.vue'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/main',
      meta: { auth: true },
      name: '首页',
      component: Main,
      children:[
        /********************* logo  *************************/
        {
          // 支付管理/账户列表
          path: '/home',
          meta: { auth: true },
          name: 'home-logo',
          component: HomeLogo,
        },
        /**********************支付管理**************************/
        {
          // 支付管理/账户列表
          path: '/iPayment/accountList',
          meta: { auth: true },
          name: '支付管理/账户列表',
          component: IPayment,
        },
        {
          path: '/iPayment/accountList/account',
          meta: { auth: true },
          name: '支付管理/账户列表/新增账户',
          component: Account
        },
        {
          // 支付管理/下发记录
          path: '/iPayment/issuedRecord',
          meta: { auth: true },
          name: '支付管理/下发记录',
          component: Record,
        },
        {
          // 支付管理/下发记录/新增下发
          path: '/iPayment/issuedRecord/newIssued',
          meta: { auth: true },
          name: '支付管理/下发记录/新增下发',
          component: NewIssued,
        },
        {
          // 支付管理/下发记录/新增下发/新增门店
          path: '/iPayment/issuedRecord/newIssued/newAdd',
          meta: { auth: true },
          name: '支付管理/下发记录/新增下发/新增门店',
          component: IssuedAdd,
        },


        /************************** 门店管理 ***************************/
        {
          // 门店管理
          path: '/storeManage/storeList',
          meta: { auth: true },
          name: '门店管理/门店列表',
          component: StoreList,
        },
        {
          // 新增门店
          path: '/storeManage/storeList/newAddStore/:number/:levelid/:type',
          meta: { auth: true },
          name: '门店管理/门店列表/新增门店',
          component: NewAddStore,
        },
        {
          // 查看门店
          path: '/storeManage/storeList/seeTheStore/:id',
          meta: { auth: true },
          name: '门店管理/门店列表/查看门店',
          component: SeeTheStore,
        },
        {
          // 收款账户编辑
          path: '/storeManage/storeList/editStoreAccount/:id',
          meta: { auth: true },
          name: '门店管理/门店列表/查看门店/收款账户编辑',
          component: EditStoreAccount,
        },

        {
          // 门店组
          path: '/storeManage/storeGroup',
          meta: { auth: true },
          name: '门店管理/门店组',
          component: StoreGroup,
        },
        {
          // 新增门店组
          path: '/storeManage/storeGroup/addGroup',
          meta: { auth: true },
          name: '门店管理/门店组/新增门店组',
          component: addGroup,
        },


        /************************** x1统计报表 ***************************/
        {
          // 交易列表
          path: '/report/transactionList',
          meta: { auth: true },
          name: '统计报表/交易列表',
          component: TransactionList,
        },
        {
          // 交易统计
          path: '/report/transactionCount',
          meta: { auth: true },
          name: '统计报表/交易统计',
          component: TransactionCount,
        },
        {
          // 结算记录
          path: '/report/settlementRecord',
          meta: { auth: true },
          name: '统计报表/结算记录',
          component: SettlementRecord,
        },
        {
          // 差异账单查询
          path: '/report/billQuery',
          meta: { auth: true },
          name: '统计报表/差异账单查询',
          component: BillQuery,
        },
        {
          // 发票
          path: '/report/invoice',
          meta: { auth: true },
          name: '统计报表/发票',
          component: Invoice,
        },

        /************************** x2统计报表 ***************************/
        {
          // 订单列表
          path: '/report/orderList',
          meta: { auth: true },
          name: '统计报表/订单列表',
          component: orderList,
        },
        {
          // 订单统计
          path: '/report/orderCount',
          meta: { auth: true },
          name: '统计报表/订单统计',
          component: orderCount,
        },
        {
          // 散点地图
          path: '/report/scatterMap',
          meta: { auth: true },
          name: 'x2运营数据/散点地图',
          component: scatterMap,
        },
        {
          // 菜品销售排行
          path: '/report/salesRanking',
          meta: { auth: true },
          name: 'x2运营数据/菜品销售排行',
          component: salesRanking,
        },
        {
          // 日报推送
          path: '/report/dailyPush',
          meta: { auth: true },
          name: 'x2运营数据/日报推送',
          component: dailyPush,
        },
        {
          // 操作日报推送
          path: '/report/dailyPush/operateDaily/:data',
          meta: { auth: true },
          name: 'x2运营数据/操作日报推送',
          component: operateDaily,
        },
        /**********************基础设置***************************/
        // 基础设置/商户配置
        {
          path: '/infrastructure/BusinessConf',
          meta: { auth: true },
          name: '基础设置/商家信息',
          component: BusinessConf
        },
        // 基础设置/支付管理
        {
          path: '/infrastructure/PaymentManagement',
          meta: { auth: true },
          name: '基础设置/支付管理',
          component: PaymentManagement
        },
        // 基础设置/支付配置
        {
          path: '/infrastructure/PaymentWay',
          meta: { auth: true },
          name: '基础设置/支付配置',
          component: PaymentWay
        },
        // 基础设置/支付通道
        {
          path: '/infrastructure/PayChannels',
          meta: { auth: true },
          name: '基础设置/支付通道',
          component: PayChannels
        },

        //基础设置/菜品库
        {
          path: '/infrastructure/DishesLibrary',
          meta: { auth: true },
          name: '基础设置/菜品库',
          component: DishesLibrary
        },
        //基础设置/菜品库/新增菜品
        {
          path: '/infrastructure/DishesLibrary/addDishes/:number/:levelid',
          meta: { auth: true },
          name: '基础设置/菜品库/新增菜品',
          component: AddDishes
        },
        //门店库
        {
          path: '/infrastructure/StoreLibrary',
          meta: { auth: true },
          name: '基础设置/门店库',
          component: StoreLibrary
        },
        //角色管理
        {
          path: '/infrastructure/RoleManagement',
          meta: { auth: true },
          name: '基础设置/角色管理',
          component: RoleManagement
        },
        //权限管理
        {
          path: '/infrastructure/PermissionManagement',
          meta: { auth: true },
          name: '基础设置/权限管理',
          component: PermissionManagement
        },
        //权限管理/查看用户
        {
          path: '/infrastructure/PermissionManagement/User/:id/:levelId',
          meta: { auth: true },
          name: '基础设置/权限管理/查看用户',
          component: PermissionUserManagement
        },
        //用户管理
        {
          path: '/infrastructure/UserManagement',
          meta: { auth: true },
          name: '用户管理',
          component: UserManagement
        },

        //操作日志
        {
          path: '/infrastructure/OperationLog',
          meta: { auth: true },
          name: '操作日志',
          component: OperationLog
        },
        //公众号管理
        {
          path: '/infrastructure/PublicManagement',
          meta: { auth: true },
          name: '公众号管理',
          component: PublicManagement
        },
        //模板消息配置
        {
          path: '/infrastructure/PublicManagement/TemplateMessageConf/:id',
          meta: { auth: true },
          name: '公众号管理/模板消息配置',
          component: TemplateMessageConf
        },

        /**********************运营***************************/
        //运行状态
        {
          path: '/operate/runningState',
          meta: { auth: true },
          name: '运行状态',
          component: RunningState
        },
        //运营方案
        {
          path: '/operate/OperationPlan',
          meta: { auth: true },
          name: '运营方案',
          component: OperationPlan
        },

        /**********************菜品管理***************************/

        //门店菜品管理
        {
          path: '/dishesManagement/dishesManageList',
          meta: { auth: true },
          name: '菜品管理/菜品列表',
          component: dishesManageList
        },
        //门店菜品管理/编辑
        {
          path: '/dishesManagement/storeDishesManage/editDishes/:levelId/:id',
          meta: { auth: true },
          name: '菜品管理/编辑菜品',
          component: editDishes
        },
        //菜品品类
        {
          path: '/dishesManagement/dishesCategory',
          meta: { auth: false },
          name: '菜品管理/菜品品类',
          component: dishesCategory
        },

        //菜品组
        {
          path: '/dishesManagement/dishesGroup',
          meta: { auth: false },
          name: '菜品管理/菜品组',
          component: dishesGroup
        },
        //新增菜品组
        {
          path: '/dishesManagement/dishesGroup/addDishesGroup',
          meta: { auth: false },
          name: '菜品管理/菜品组/新增菜品组',
          component: addDishesGroup
        },
        //菜品规格
        {
          path: '/dishesManagement/dishesSpec',
          meta: { auth: false },
          name: '菜品管理/菜品规格',
          component: dishesSpec
        },
        //菜品属性
        {
          path: '/dishesManagement/dishesAttr',
          meta: { auth: false },
          name: '菜品管理/菜品属性',
          component: dishesAttr
        },
        //餐盒设置
        {
          path: '/dishesManagement/boxSetting',
          meta: { auth: false },
          name: '菜品管理/餐盒设置',
          component: boxSetting
        },
        //套餐管理
        {
          path: '/dishesManagement/mealManage',
          meta: { auth: false },
          name: '菜品管理/套餐管理',
          component: mealManage
        },
        /**********************发票***************************/

        //发票方案
        {
          path: '/invoice/invoiceScheme',
          meta: { auth: false },
          name: '发票方案',
          component: invoiceScheme
        },
        //发票方案/营销模板配置
        {
          path: '/invoice/invoiceScheme/confInvoice/:id',
          meta: { auth: false },
          name: '营销模板配置',
          component: confInvoice
        },
        //下发记录
        {
          path: '/invoice/downRecord',
          meta: { auth: false },
          name: '下发记录',
          component: downRecord
        },
        //页面设计
        {
          path: '/invoice/pageDesign/:id',
          meta: { auth: false },
          name: '页面设计',
          component: pageDesign
        },

        /**********************x2运营方案***************************/
        //门店管理
        {
          path: '/x2OperationScheme/storeManagement',
          meta: { auth: false },
          name: 'x2门店管理',
          component: storeManagement
        },
        //外卖平台映射
        {
          path: '/x2OperationScheme/storeManagement/takeOut/:id',
          meta: { auth: false },
          name: 'x2门店管理/外卖平台映射',
          component: storeManagementTakeOut
        },

        //打印机配置
        {
          path: '/x2OperationScheme/printerConfig',
          meta: { auth: false },
          name: '打印机配置',
          component: printerConfig
        },
        //推送状态
        {
          path: '/x2OperationScheme/pushState',
          meta: { auth: false },
          name: '推送状态',
          component: pushState
        },

        /**********************商户资料核实***************************/
        //商户列表
        {
          path: '/businessInformation/businessList',
          meta: { auth: false },
          name: '商户列表',
          component: businessList
        },

      ]
    },
    {
      path: '/', redirect: '/users'
    },
    {
      path: '*', redirect: '/login'
    },
    {
      path: '/login',
      meta: { auth: false },
      component: Login,
      name: '登陆页',
      hidden: true
    },
    {
      path: '/404',
      meta: { auth: false },
      component: NotFound,
      name: '',
      hidden: true
    },
  ]
})
