import {axios,get} from '../../utility/communApi'


let getAdminLogList = (timeStart,timeEnd,user_name,power_attr,name,p) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();

    formData.append("timeStart", timeStart);
    formData.append("timeEnd", timeEnd);
    formData.append("power_attr", power_attr);
    formData.append("user_name", user_name);
    formData.append("name", name);
    formData.append("page", p.page);
    formData.append("pagesize", p.size);

    axios.post(`index.php?controller=adminlog&action=getAdminLogList&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


let getAdminLogType = () => {
  return new Promise((resolve, reject) => {

    axios.post(`index.php?controller=adminlog&action=getAdminLogType&token=${get('token')}`).then((res)=>{
      resolve(res)
    })
  })
};

export default {getAdminLogList,getAdminLogType}
