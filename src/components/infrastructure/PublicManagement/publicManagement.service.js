import {axios,get} from '../../utility/communApi'

//获取公众号列表
let getGzhInfo = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("levelid", id);

    axios.post(`index.php?controller=Wechat&action=getGzhInfo&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//第三方授权
let threeAuthorize = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("levelid", id);

    axios.post(`index.php?controller=Wechat&action=threeAuthorize&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


export default {getGzhInfo,threeAuthorize}



