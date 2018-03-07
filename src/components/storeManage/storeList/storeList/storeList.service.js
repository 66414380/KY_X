import {axios,get} from '../../../utility/communApi'



//获取门店列表
let getList = (p,levelId,storeName) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("redirect", "x1.store.storeList");

    formData.append("page", p.page);
    formData.append("pagesize", p.size);
    formData.append("storeName", storeName);
    formData.append("levelId", levelId);
    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//编辑门店标签
let updateOne = () => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("redirect", "x1.store.editStoreLabel");

    formData.append("id", "");
    formData.append("name", "");
    formData.append("thrdcode", "");
    formData.append("storeIds", "");

    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })

  })
};


//删除门店
let del = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("redirect", "x1.store.delStores");
    formData.append("storeId", id);
    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


//获取标签下的门店列表

let getOne = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("redirect", "x1.store.getStoreListByLabelId");

    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//开启、关闭门店
let storesStatus = (ids,status) => {
  console.log(ids)
  console.log(status)
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("redirect", "x1.store.changeStoresStatus");
    formData.append("storeId", ids);
    formData.append("status", status);
    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//修改url
let urlStatus = (ids,url) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("redirect", "x1.store.setStoresUrl");
    formData.append("storeId", ids);
    formData.append("url", url);
    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//添加门店时候，读取基础库
let getBaseStore = (levelId) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("redirect", "x1.store.getBaseStore");
    formData.append("levelId", levelId);

    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//从基础门店中添加门店
let addStore = (storeIds) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("redirect", "x1.store.addStore");
    formData.append("storeIds", storeIds);

    axios.post(`index.php?controller=admin&action=api&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

export default {getList, updateOne,getOne,del,storesStatus,urlStatus,getBaseStore,addStore}



