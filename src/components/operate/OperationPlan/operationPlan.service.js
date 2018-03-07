import {axios,get} from '../../utility/communApi'

//X1运营方案
let getProject = (p) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("redirect", "x1.accountmanage.project");
    formData.append("page", p.page);
    formData.append("pagesize", p.size);

    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

export default {getProject}
