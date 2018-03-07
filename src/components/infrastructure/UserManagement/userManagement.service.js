import {axios,get} from '../../utility/communApi'

//角色列表
let getRoleList = (p,name) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("name", name);

    formData.append("page", p.page);
    formData.append("pagesize", p.size);

    axios.post(`index.php?controller=role&action=roleList&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};



export default {getRoleList}



