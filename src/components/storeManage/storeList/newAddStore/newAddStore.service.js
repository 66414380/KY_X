import {axios,get} from '../../../utility/communApi'

//新增门店

let addStore = (levelid,type,data) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("levelid", levelid);
    formData.append("type", type);
    formData.append("data", window.JSON.stringify(data) );
    axios.post(`index.php?controller=stores&action=create&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//返回当前的组织架构下的品牌
let getBrand = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=level&action=brand&token=${get('token')}&id=${id}`).then((res)=>{
      resolve(res)
    })
  })
};


export default {addStore,getBrand}



