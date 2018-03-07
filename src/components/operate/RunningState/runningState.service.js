import {axios,get} from '../../utility/communApi'

//获取门店运行状态列表
let getService = (p,levelid,storename) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=service&action=index&token=${get('token')}&levelid=${levelid}&storename=${storename}&page=${p.page}&pagesize=${p.size}`).then((res)=>{
      resolve(res)
    })
  })
};

//获取门店运行状态的打印机操作列表
let opration = (storeid) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=service&action=opration&token=${get('token')}&storeid=${storeid}`).then((res)=>{
      resolve(res)
    })
  })
};

//打印机的命令执行
let sendcmd = (storeid,data) => {
  let formData = new FormData();
  formData.append("storeid", storeid);
  formData.append("data", data);
  return new Promise((resolve, reject) => {
    axios.post(`index.php?controller=service&action=sendcmd&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

export default {getService,opration,sendcmd}
