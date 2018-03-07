import {axios,get} from '../../utility/communApi'
//基础支付通道配置
let getCommonChannelList = (p,name) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("name", name);

    formData.append("page", p.page);
    formData.append("pagesize", p.size);

    axios.post(`index.php?controller=jichu&action=commonChannel&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//勾选基础支付通道的支付方式

let eidtChannelPayment = (channelId,paymentId,status) => {
  return new Promise((resolve, reject) => {

    let formData = new FormData();
    formData.append("channelId", channelId);
    formData.append("paymentId", paymentId);
    formData.append("status", status);
    axios.post(`index.php?controller=jichu&action=eidtChannelPayment&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//开启、关闭基础支付通道

let eidtChannelStatus = (channelId,isOpen) => {
  return new Promise((resolve, reject) => {

    let formData = new FormData();

    formData.append("channelId", channelId);
    formData.append("isOpen", isOpen);
    axios.post(`index.php?controller=jichu&action=eidtChannelStatus&&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


export default {getCommonChannelList,eidtChannelPayment,eidtChannelStatus}



