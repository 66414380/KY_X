import {axios,get} from '../../utility/communApi'



//获取账号列表
let getAccountList = () => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("redirect", "x1.accountmanage.accountList");

    formData.append("paymentMethod", '');
    formData.append("paymentChannel", '');
    formData.append("accountName", '');
    formData.append("page", 1);
    formData.append("pagesize", 1000);
    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};



//交易方式
let getWayInfo = () => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=jichuapi&action=getCommon&token=${get('token')}&data=[["key","way"]]`).then((res)=>{
      resolve(res)
    })
  })
};
//交易通道
let getChannelInfo = () => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=jichuapi&action=getCommon&token=${get('token')}&data=[["key","channel"]]`).then((res)=>{
      resolve(res)
    })
  })
};

//交易状态
let putOrderStatus = () => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=jichuapi&action=getCommon&token=${get('token')}&data=[["key","payStatus"]]`).then((res)=>{
      resolve(res)
    })
  })
};

let orderList = (start_time,end_time,store_id,iway,ichannel,account,pay_status,order_no,out_order_no,scavengingForm,receive_terminal,p,export1) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("redirect", "x1.order.orderList");
    formData.append("start_time", start_time);
    formData.append("end_time", end_time);
    formData.append("store_id", store_id);
    formData.append("iway", iway);
    formData.append("ichannel", ichannel);
    formData.append("account", account);
    formData.append("pay_status", pay_status);
    formData.append("order_no", order_no);
    formData.append("out_order_no", out_order_no);

    formData.append("scanId", scavengingForm);
    formData.append("receiveId", receive_terminal);

    formData.append("pageCount", p.size);
    formData.append("pageNumber", p.page);
    formData.append("export", export1);
    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};



export default {getWayInfo,getChannelInfo,getAccountList,putOrderStatus,orderList}
