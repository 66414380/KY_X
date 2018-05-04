import {axios,get} from '../../../utility/communApi'

//方案列表
let jumpUseList = (p,levelid) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=jump&action=jumpUseList&token=${get('token')}`,{ params: {
        level_id:levelid,
        page:p.page,
        pagesize:p.size
      },}).then((res)=>{
      resolve(res)
    })
  })
};


//新增方案
let jumpAdd = (level_id,formEdit) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("level_id", level_id);
    formData.append("name", formEdit.name);
    formData.append("third_code", window.JSON.stringify(formEdit.third_code));
    formData.append("status", formEdit.status === false? 0: 1);
    formData.append("type", formEdit.type);
    formData.append("start_time", formEdit.start_time === undefined || formEdit.start_time === '' ? '' :  new Date(formEdit.start_time).Format('yyyy-MM-dd hh:mm:ss'));
    formData.append("end_time",  formEdit.end_time === undefined || formEdit.end_time === '' ? '' : new Date(formEdit.end_time).Format('yyyy-MM-dd hh:mm:ss'));
    formData.append("activity_id", formEdit.activity_id);

    axios.post(`index.php?controller=jump&action=jumpAdd&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//活动方案详情
let jumpUseInfo = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=jump&action=jumpUseInfo&token=${get('token')}`,{ params: {
        id:id,
      },}).then((res)=>{
      resolve(res)
    })
  })
};




export default {jumpUseList,jumpAdd,jumpUseInfo}



