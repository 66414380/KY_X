import {axios,get} from '../../utility/communApi'

//新建组织架构
let addLevel = (data) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", data.id);
    formData.append("levelname", data.levelname);
    formData.append("levelcodes", window.JSON.stringify(data.levelcodes) );

    formData.append("business_src", data.business_src_url);
    formData.append("businesscode_src", data.businesscode_src_url);
    formData.append("account_src", data.account_src_url);
    formData.append("tax_src", data.tax_src_url);
    formData.append("legalman_1", data.legalman_1_url);
    formData.append("legalman_2", data.legalman_2_url);

    axios.post(`index.php?controller=level&action=create&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};


//获取单个组织架构
let getOneLevel = (data) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=level&action=view&token=${get('token')}&id=${data.id}`).then((res)=>{
      resolve(res)
    })
  })
};

//更新组织架构
let updateLevel = (data) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", data.id);
    formData.append("levelname", data.levelname);
    formData.append("levelcodes", window.JSON.stringify(data.levelcodes) );

    formData.append("business_src", data.business_src_url);
    formData.append("businesscode_src", data.businesscode_src_url);
    formData.append("account_src", data.account_src_url);
    formData.append("tax_src", data.tax_src_url);
    formData.append("legalman_1", data.legalman_1_url);
    formData.append("legalman_2", data.legalman_2_url);
    axios.post(`index.php?controller=level&action=update&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

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

//获取基础门店列表
let getBsList = (p,levelid,storename) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=stores&action=index&token=${get('token')}`,{ params: {
        levelid:levelid,
        storename:storename,
        page:p.page,
        pagesize:p.size
      },}).then((res)=>{
      resolve(res)
    })
  })
};

//获取一条基础门店
let getBsOne = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=stores&action=view&token=${get('token')}&id=${id}`).then((res)=>{
      resolve(res)
    })
  })
};


//更新一条基础门店
let updateBsOne = (data) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", data.id);
    formData.append("storename", data.storename);
    formData.append("storecodeid", data.storecodeid);
    formData.append("tel", data.tel);
    formData.append("brand", data.brand);
    formData.append("provinceid", data.provinceid);
    formData.append("cityid", data.cityid);
    formData.append("areaid", data.areaid);
    formData.append("storecodes", window.JSON.stringify(data.storecodes));
    formData.append("business_src", data.business_src);
    formData.append("businesscode_src", data.businesscode_src);
    formData.append("account_src", data.account_src);
    formData.append("tax_src", data.tax_src);
    formData.append("legalman_1", data.legalman_1);
    formData.append("legalman_2", data.legalman_2);
    axios.post(`index.php?controller=stores&action=update&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//删除一条基础门店
let delBsOne = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);

    axios.post(`index.php?controller=stores&action=delete&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//获取单个门店的操作记录
let log = (id = '') => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    axios.get(`index.php?controller=stores&action=log&token=${get('token')}&id=${id}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//批量开启/关闭
let storesStatus = (id,status) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    axios.post(`index.php?controller=stores&action=open&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//上传文件
let updateXlsFile = (brandid,fileurl,over) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("brandid", brandid);
    formData.append("fileurl", fileurl);
    formData.append("over", over);
    axios.post(`index.php?controller=stores&action=upload&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

export default {addLevel,updateLevel,delLevel,getOneLevel,getBsList,getBsOne,updateBsOne,delBsOne,log,updateXlsFile,storesStatus}



