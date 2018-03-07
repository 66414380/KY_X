import {axios,get} from '../../../utility/communApi'

//角色列表
let getRoleList = () => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("name", "");

    formData.append("page", 1);
    formData.append("pagesize", 1000);

    axios.post(`index.php?controller=role&action=roleList&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


//获取基础门店列表
let getBsList = (levelid,storename) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=stores&action=index&token=${get('token')}`,{ params: {
        levelid:levelid,
        storename:storename,
        page:1,
        pagesize:1000
      },}).then((res)=>{
      resolve(res)
    })
  })
};


//用户组查看用户
let getUserFromGroup = (group_id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("group_id", group_id);
    axios.post(`index.php?controller=power&action=getUserFromGroup&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//批量删除账户名
let delBatch = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    axios.post(`index.php?controller=power&action=deleteBatch&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//查看账户拥有的权限
let lookUser = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);

    axios.post(`index.php?controller=power&action=lookUser&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//修改账户拥有的权限
let editor = (formUser,group_id) => {
  return new Promise((resolve, reject) => {
    let status;
    if(formUser.status === true){
      status = 1
    }else {
      status = 0
    }
    let formData = new FormData();
    formData.append("id", formUser.id);
    formData.append("nickname", formUser.nickname);
    formData.append("phone", formUser.phone);
    formData.append("group_id", formUser.groupId);
    formData.append("role_id", formUser.role_id.join(','));
    formData.append("billHuman", window.JSON.stringify(formUser.billHuman) );

    formData.append("status", status);

    axios.post(`index.php?controller=power&action=editor&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//新增账户
let newlyAddAccount = (formUser,level_id,group_id) => {
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
    formData.append("group_id", group_id);
    formData.append("billHuman", window.JSON.stringify(formUser.billHuman) );
    formData.append("status", status);
    formData.append("level_id", level_id);

    axios.post(`index.php?controller=power&action=newlyAddAccount&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//获取单条用户信息
let userInfoById = (uid) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("uid", uid);
    axios.post(`index.php?controller=power&action=userInfoById&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//获取用户已关联门店
let getUserStore = (uid) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("uid", uid);
    axios.post(`index.php?controller=power&action=getUserStore&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//关联门店： 门店和用户关联
let userStoreInfo = (data) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("data", window.JSON.stringify(data));
    axios.post(`index.php?controller=power&action=userStoreInfo&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//获取角色的权限配置
let rolePower = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);

    axios.post(`index.php?controller=role&action=rolePower&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};
//批量启动/关闭
let settingBatch = (id,type) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("type", type);

    axios.post(`index.php?controller=power&action=settingBatch&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};

//修改密码时获取验证码
let validateImg = () => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    axios.post(`index.php?controller=power&action=validateImg&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};

//修改密码
let updatePassword = (id,form) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("oldPassword", form.oldPassWord);
    formData.append("password", form.newPassWord);
    formData.append("repeatPassword", form.confirmPassWord);
    formData.append("code", form.vCode);
    axios.post(`index.php?controller=power&action=updatePassword&token=${get('token')}`, formData).then((res) => {
      resolve(res)
    })
  })
};

export default {getRoleList,getUserFromGroup,getBsList,delBatch,lookUser,editor,newlyAddAccount,userInfoById,getUserStore,userStoreInfo,rolePower,settingBatch,validateImg,updatePassword}



