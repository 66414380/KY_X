import {axios,get} from '../../../utility/communApi'

//新增下发
let jumpUseAdd = (form,selectStore) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("jumpId", form.name);
    formData.append("storeIds", selectStore);
    formData.append("isStop", form.checked ? 1: 0);
    formData.append("rules", form.rules);
    formData.append("isRun", form.runTime);

    formData.append("runTime", form.runTimeValue);
    formData.append("delayTime", form.delayTime);


    axios.post(`index.php?controller=jump&action=jumpUseAdd&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

export default {jumpUseAdd}



