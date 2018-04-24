import {axios,get} from '../../utility/communApi'



//删除组织架构
let delLevel = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);

    axios.post(`index.php?controller=level&action=delete&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//活动方案列表
let getActivityList = (p,levelid,storename) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=activity&action=activityList&token=${get('token')}`,{ params: {
        level_id:levelid,
        //storename:storename,
        page:p.page,
        pagesize:p.size
      },}).then((res)=>{
      resolve(res)
    })
  })
};


//新增活动方案
let addActivity = (level_id,formEdit) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("level_id", level_id);

    formData.append("third_code", window.JSON.stringify(formEdit.third_code));
    formData.append("name", formEdit.name);
    formData.append("type", formEdit.type);
    formData.append("status", formEdit.status === false? 0: 1);
    formData.append("start_time", formEdit.start_time === undefined || formEdit.start_time === '' ? '' :  (new Date(formEdit.start_time) * 1 + '').substr(0, 10));
    formData.append("end_time",  formEdit.end_time === undefined || formEdit.end_time === '' ? '' : (new Date(formEdit.end_time) * 1 + '').substr(0, 10));
    formData.append("appId", formEdit.appId);
    formData.append("path", formEdit.path);
    formData.append("card_id", formEdit.card_id);
    formData.append("material_id", formEdit.material_id);
    formData.append("limit_house_num", formEdit.limit_house_num);
    formData.append("limit_num", formEdit.limit_num);
    formData.append("home_notes_url", formEdit.home_notes_url);
    formData.append("home_background_url", formEdit.home_background_url);
    formData.append("home_start_url", formEdit.home_start_url);
    formData.append("notes_background_url", formEdit.notes_background_url);
    formData.append("notes_info", formEdit.notes_info);
    formData.append("notes_button", formEdit.notes_button);
    formData.append("subject_data", window.JSON.stringify(formEdit.subject_data));
    formData.append("element1", formEdit.element1);
    formData.append("element2", formEdit.element2);
    formData.append("element3", formEdit.element3);
    formData.append("element4", formEdit.element4);
    formData.append("receive_success_url", formEdit.receive_success_url);
    formData.append("receive_info_url", formEdit.receive_info_url);
    formData.append("share_button", formEdit.share_button);

    axios.post(`index.php?controller=activity&action=addActivity&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//活动方案详情
let getInfo = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=activity&action=getInfo&token=${get('token')}`,{ params: {
        id:id,
      },}).then((res)=>{
      resolve(res)
    })
  })
};


//修改活动方案
let updateActivity = (formEdit) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", formEdit.id);

    formData.append("third_code", window.JSON.stringify(formEdit.third_code));
    formData.append("name", formEdit.name);
    formData.append("type", formEdit.type);
    formData.append("status", formEdit.status === false? 0: 1);
    formData.append("start_time", formEdit.start_time === undefined || formEdit.start_time === '' ? '' :  (new Date(formEdit.start_time) * 1 + '').substr(0, 10));
    formData.append("end_time",  formEdit.end_time === undefined || formEdit.end_time === '' ? '' : (new Date(formEdit.end_time) * 1 + '').substr(0, 10));
    formData.append("appId", formEdit.appId);
    formData.append("path", formEdit.path);
    formData.append("card_id", formEdit.card_id);
    formData.append("material_id", formEdit.material_id);
    formData.append("limit_house_num", formEdit.limit_house_num);
    formData.append("limit_num", formEdit.limit_num);
    formData.append("home_notes_url", formEdit.home_notes_url);
    formData.append("home_background_url", formEdit.home_background_url);
    formData.append("home_start_url", formEdit.home_start_url);
    formData.append("notes_background_url", formEdit.notes_background_url);
    formData.append("notes_info", formEdit.notes_info);
    formData.append("notes_button", formEdit.notes_button);
    formData.append("subject_data", window.JSON.stringify(formEdit.subject_data));
    formData.append("element1", formEdit.element1);
    formData.append("element2", formEdit.element2);
    formData.append("element3", formEdit.element3);
    formData.append("element4", formEdit.element4);
    formData.append("receive_success_url", formEdit.receive_success_url);
    formData.append("receive_info_url", formEdit.receive_info_url);
    formData.append("share_button", formEdit.share_button);

    axios.post(`index.php?controller=activity&action=updateActivity&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};



export default {delLevel,getActivityList,addActivity,getInfo,updateActivity}



