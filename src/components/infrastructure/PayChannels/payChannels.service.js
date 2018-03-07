import {axios,get} from '../../utility/communApi'

//商家自定义支付通道列表
let getChannelList = (p,name) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("name", name);

    formData.append("page", p.page);
    formData.append("pagesize", p.size);
    axios.post(`index.php?controller=payment&action=channelList&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//商家自定义支付通道详情
let getChannelInfo = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);

    axios.post(`index.php?controller=payment&action=channelInfo&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


//新增商家自定义支付通道

let addCannel = (from) => {
  return new Promise((resolve, reject) => {

    let formData = new FormData();
    formData.append("name", from.name);
    formData.append("channelId", from.channelId);
    formData.append("paymentIds", from.paymentIds.join(','));
    formData.append("thirdCode", window.JSON.stringify(from.thirdCode));
    axios.post(`index.php?controller=payment&action=addCannel&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//编辑商家自定义支付通道

let editChannel = (from) => {
  return new Promise((resolve, reject) => {
    console.log(from)
    let formData = new FormData();
    formData.append("id", from.id);
    formData.append("name", from.name);
    formData.append("channelId", from.channelId);
    formData.append("paymentIds", from.paymentIds.join(','));
    formData.append("thirdCode", window.JSON.stringify(from.thirdCode));
    axios.post(`index.php?controller=payment&action=editChannel&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//删除商家自定义支付通道
let delChannel = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);

    axios.post(`index.php?controller=payment&action=delChannel&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//商家自定义支付通道勾选支付方式

let setChannelPayment = (channelId,paymentId,status) => {
  return new Promise((resolve, reject) => {

    let formData = new FormData();
    formData.append("channelId", channelId);
    formData.append("paymentId", paymentId);
    formData.append("status", status);
    axios.post(`index.php?controller=payment&action=setChannelPayment&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//基础支付通道配置
let getCommonChannelList = () => {
  return new Promise((resolve, reject) => {


    axios.post(`index.php?controller=payment&action=commonChannel&token=${get('token')}`).then((res)=>{
      resolve(res)
    })
  })
};


export default {getChannelList,getChannelInfo,addCannel,editChannel,delChannel,setChannelPayment,getCommonChannelList}
