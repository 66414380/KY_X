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

//角色类型
let roleType = () => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=role&action=roleType&token=${get('token')}`).then((res)=>{
      resolve(res)
    })
  })
};


//新增用户角色

let saveRole = (from) => {
  return new Promise((resolve, reject) => {
    let is_use;
    if(from.status === true){
      is_use = 1
    }else {
      is_use = 2
    }
    let formData = new FormData();

    formData.append("typeId", from.typeId);
    formData.append("name", from.name);
    formData.append("thirdCode", window.JSON.stringify(from.thirdCode));
    formData.append("is_use", is_use);

    axios.post(`index.php?controller=role&action=saveRole&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


//角色详情
let roleInfo = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    axios.post(`index.php?controller=role&action=roleInfo&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


//修改用户角色

let saveRoleEdit = (from) => {
  return new Promise((resolve, reject) => {
    let is_use;
    if(from.status === true){
      is_use = 1
    }else {
      is_use = 2
    }
    let formData = new FormData();

    formData.append("id", from.id);
    formData.append("typeId", from.typeId);
    formData.append("name", from.name);
    formData.append("thirdCode", window.JSON.stringify(from.thirdCode));
    formData.append("is_use", is_use);

    axios.post(`index.php?controller=role&action=saveRole&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//删除用户角色

let delRole = (ids) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("ids", ids);

    axios.post(`index.php?controller=role&action=delRole&token=${get('token')}`,formData).then((res)=>{
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

//保存角色的权限配置
let saveRolePower = (id,powerIds) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("powerIds", powerIds.join(','));

    axios.post(`index.php?controller=role&action=saveRolePower&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

export default {getRoleList,roleType,saveRole,saveRoleEdit,roleInfo,delRole,rolePower,saveRolePower}



