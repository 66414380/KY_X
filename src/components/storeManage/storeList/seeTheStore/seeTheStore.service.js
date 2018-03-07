import {axios,get} from '../../../utility/communApi'

//查看门店-基础信息

let getFirst = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("redirect", "x1.store.storeBaseInfo");

    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{

        resolve(res)

    })
  })
};

//查看门店-收款账户
let getSecond = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("redirect", "x1.store.storeAccount");

    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{

      resolve(res)

    })
  })
};
export default {getFirst,getSecond}



