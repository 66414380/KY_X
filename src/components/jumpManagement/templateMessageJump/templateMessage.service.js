import {axios,get} from '../../utility/communApi'

//方案列表
let getList = (p,levelid,name) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=templatejump&action=getList&token=${get('token')}`,{ params: {
        level_id:levelid,
        name:name,
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
    formData.append("status", formEdit.status);
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
let jumpInfo = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=jump&action=jumpInfo&token=${get('token')}`,{ params: {
        id:id,
      },}).then((res)=>{
      resolve(res)
    })
  })
};


//修改活动方案
let jumpEdit = (level_id,formEdit) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", formEdit.id);

    formData.append("level_id", level_id);
    formData.append("name", formEdit.name);
    formData.append("third_code", window.JSON.stringify(formEdit.third_code));
    formData.append("status", formEdit.status);
    formData.append("type", formEdit.type);
    formData.append("start_time", formEdit.start_time === undefined || formEdit.start_time === '' ? '' :  new Date(formEdit.start_time).Format('yyyy-MM-dd hh:mm:ss'));
    formData.append("end_time",  formEdit.end_time === undefined || formEdit.end_time === '' ? '' : new Date(formEdit.end_time).Format('yyyy-MM-dd hh:mm:ss'));
    formData.append("activity_id", formEdit.activity_id);

    axios.post(`index.php?controller=jump&action=jumpEdit&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//删除活动方案
let jumpDel = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    axios.post(`index.php?controller=jump&action=jumpDel&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//批量删除
let JumpDelAll = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    axios.post(`index.php?controller=jump&action=JumpDelAll&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


//批量开启关闭
let JumpEditAll = (id,storeStatusValue) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("status", storeStatusValue === true ? 1: 2);
    axios.post(`index.php?controller=jump&action=JumpEditAll&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


export default {getList,jumpAdd,jumpInfo,jumpEdit,jumpDel,JumpDelAll,JumpEditAll}



