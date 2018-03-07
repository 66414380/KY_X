import axios from 'axios'
import qs from 'qs'

let get= function(key) {
  return window.JSON.parse(window.localStorage.getItem(key));
};

// 延迟时间
let timeOut = {timeout: 1000 * 60};
let token = get('token');

// 调用x1,x2接口
let changeUrl = `index.php?controller=admin&action=api&token=${get('token')}`;

/********************** X1X2所有接口 *******************************/
// 通用接口
export const oneTwoApi = params => { return axios.post(`index.php?controller=admin&action=api&token=${get('token')}`, qs.stringify(params),timeOut).then(res => res.data); };

/********************** 基础设置 *******************************/
// 支付方式列表
export const payMethods = params => { return axios.post(`index.php?controller=jichu&action=getWayInfo&token=${get('token')}`, qs.stringify(params),timeOut).then(res => res.data); };

// 支付通道列表
export const payMent = params => { return axios.post(`index.php?controller=jichu&action=getChannelInfo&token=${get('token')}`, qs.stringify(params),timeOut).then(res => res.data); };


// 获取地区接口
export const accessRegion = params => { return axios.post(`index.php?controller=area&action=getAreaList&token=${get('token')}`, qs.stringify(params),timeOut).then(res => res.data); };






export const requresEmployessInfo = params => { return axios.post(`${base}/kqadmin/api.php?controller=SysAdmin&action=yaoqing&mod=erweima`,qs.stringify(params),timeOut).then(res => res.data)};

// get请求示例
export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

// 如果post提交后台,需要将参数通过qs转化
export const postTest = params => { return axios.post(`${base}/kqadmin/api.php?controller=SysAdmin&action=yaoqing`,qs.stringify(params),timeOut).then(res => res.data)};
