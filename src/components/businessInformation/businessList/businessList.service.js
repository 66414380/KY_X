import {axios,get} from '../../utility/communApi'

//商户列表
let companyRegistList = (p,type) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("type", type);
    formData.append("page", p.page);
    formData.append("pagesize", p.size);
    axios.post(`index.php?controller=regist&action=companyRegistList&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//查看证件资料
let companyRegistInfo = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    axios.post(`index.php?controller=regist&action=companyRegistInfo&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//审核操作
let checkRegist = (id,type,data) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("type", type);
    if(type === 1){
      formData.append("levelId", data);
    } else {
      formData.append("reason", data);
    }
    axios.post(`index.php?controller=regist&action=checkRegist&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//获取大商户
let getAgentList = () => {
  return new Promise((resolve, reject) => {
    axios.post(`index.php?controller=regist&action=getAgentList&token=${get('token')}`).then((res)=>{
      resolve(res)
    })
  })
};

export default {companyRegistList,companyRegistInfo,checkRegist,getAgentList}
