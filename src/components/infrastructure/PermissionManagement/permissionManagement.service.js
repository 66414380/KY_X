import {axios, get} from '../../utility/communApi'

//添加用户组
let newLyGroup = (formGroup, level_id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("name", formGroup.name);
    formData.append("third_code", window.JSON.stringify(formGroup.third_code));
    formData.append("level_id", level_id);
    axios.post(`index.php?controller=power&action=newLyGroup&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};

//编辑用户组
let editorGroup = (formGroup, level_id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("group_id", formGroup.id);
    formData.append("name", formGroup.name);
    formData.append("third_code", window.JSON.stringify(formGroup.third_code));
    formData.append("level_id", level_id);
    axios.post(`index.php?controller=power&action=editorGroup&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};

//删除用户组
let deletGroup = (group_id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("group_id", group_id);

    axios.post(`index.php?controller=power&action=deletGroup&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};

//获取用户组列表

let getGroupList = (p, level_id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("level_id", level_id);
    formData.append("page", p.page);
    formData.append("pagesize", p.size);
    axios.post(`index.php?controller=power&action=getGroupList&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};


//查看账户拥有的权限
let lookUser = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);

    axios.post(`index.php?controller=power&action=lookUser&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};


//根据组ID获取用户组信息
let infoByGroupId = (group_id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("group_id", group_id);

    axios.post(`index.php?controller=power&action=infoByGroupId&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};


//新增账户
let newlyAddAccount = (formUser,level_id) => {
  return new Promise((resolve, reject) => {
    let status;
    if(formUser.status === true){
      status = 1
    }else {
      status = 0
    }
    let formData = new FormData();
    formData.append("nickname", formUser.nickname);
    formData.append("phone", formUser.phone);
    formData.append("group_id", formUser.group_id);
    formData.append("billHuman", window.JSON.stringify(formUser.billHuman) );
    formData.append("status", status);
    formData.append("level_id", level_id);

    axios.post(`index.php?controller=power&action=newlyAddAccount&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//上传文件
let updateXlsFile = (group_id, fileurl, level_id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("group_id", group_id);
    formData.append("fileurl", fileurl);
    formData.append("level_id", level_id);
    // formData.append("over", over);
    axios.post(`index.php?controller=power&action=upload&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};

//批量更新用户组
let settingBatchUserGroup = (ids,status) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("ids", ids);
    formData.append("status", status);
    axios.post(`index.php?controller=power&action=settingBatchUserGroup&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};

//用户列表
let userList = (p,nickname,phone,levelId,groupId) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("phone", phone);
    formData.append("levelId", levelId);
    formData.append("groupId", groupId);
    formData.append("page", p.page);
    formData.append("pagesize", p.size);
    axios.post(`index.php?controller=power&action=userList&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};

export default {
  newLyGroup,
  deletGroup,
  editorGroup,
  getGroupList,
  infoByGroupId,
  lookUser,
  newlyAddAccount,
  updateXlsFile,
  settingBatchUserGroup,
  userList
}



