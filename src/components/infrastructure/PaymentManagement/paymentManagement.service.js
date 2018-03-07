import {axios,get} from '../../utility/communApi'
//商家自定义支付方式列表
let getPaymentList = (p,name) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("name", name);

    formData.append("page", p.page);
    formData.append("pagesize", p.size);

    axios.post(`index.php?controller=payment&action=paymentList&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//新增商家自定义支付方式

let addPayment = (from) => {
  return new Promise((resolve, reject) => {

    let formData = new FormData();
    formData.append("name", from.name);
    formData.append("paymentId", from.paymentId);
    formData.append("thirdCode", window.JSON.stringify(from.thirdCode));
    axios.post(`index.php?controller=payment&action=addPayment&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//编辑商家自定义支付方式

let editPayment = (from) => {
  return new Promise((resolve, reject) => {

    let formData = new FormData();
    formData.append("id", from.id);
    formData.append("name", from.name);
    formData.append("paymentId", from.paymentId);
    formData.append("thirdCode", window.JSON.stringify(from.thirdCode));
    axios.post(`index.php?controller=payment&action=editPayment&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//商家自定义支付方式详情
let paymentInfo = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    axios.post(`index.php?controller=payment&action=paymentInfo&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//删除



export default {getPaymentList,addPayment,editPayment,paymentInfo}



