// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import element from 'element-ui'
import store from './store'
import utility from './components/utility'
import localStorage from './components/utility/localStorage'
//IE11
import 'babel-polyfill'
// 样式导入
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.css'

import '@/plugins/dataFormat/index.js'

// 修改vue的原型对象
Vue.prototype.$http = Axios;


// let url = 'http://test0.kuan1.cn';  // 测试环境

let url = 'http://x.kuan1.cn';      // 正式环境


Vue.prototype.$jqUrl = `${url}/kybase/`;

Axios.defaults.baseURL = `${url}/kybase/`;

//图片上传地址
Vue.prototype.$updateUrl = `${url}/oss/index.php?controller=index&action=upload_img`;

//上传xls地址
Vue.prototype.$updateXlsUrl = `${url}/oss/index.php?controller=index&action=upload_file&dir=file`;
//下载xls地址 门店
Vue.prototype.$xlsUrl = `${url}/kybase/uploads/x0read.xlsx`;

//下载xls地址 菜品
Vue.prototype.$xlsDishesUrl = `${url}/kybase/uploads/x0readproduct.xlsx`;

//下载xls地址 权限 用户
Vue.prototype.$xlsDishesUser ='http://images.kuan1.cn/kuan1/upload/file/20171220/20171220142722_65041.xlsx';

//打开夸域cookie
Axios.defaults.withCredentials = true;

Vue.prototype.$localStorage = localStorage;

// 关闭生产模式下给出的提示
Vue.config.productionTip = false;

Vue.use(element);

Object.keys(utility).forEach(function (item) {
  Vue.component(`${item}`, utility[item])
});

Date.prototype.format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
};

router.beforeEach(({ meta, path }, from, next) => {
  const { auth = true } = meta;
  const isLogin = Boolean(localStorage.get("token"));
  if (auth && !isLogin && path !== '/login') {
    let to = { path: '/login' };
    return next(to)
  }
  next()
});

// 路由切换加载提示
/*router.beforeEach(function (to, from, next) {
  store.commit('UPDATELOADINGSTATUS', {isLoading: true})
  setTimeout(function () {
    next()
  }, 1000);
});
router.afterEach(function (to) {
  store.commit('UPDATELOADINGSTATUS', {isLoading: false})
});*/

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
