import {axios,get} from '../../utility/communApi'

//获取组织架构
let getLevel = (id,brand) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=level&action=index&token=${get('token')}&id=${id}&brand=${brand}`).then((res)=>{
      resolve(res)
    })
  })
};

//返回当前的组织架构下的品牌
let getBrand = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=level&action=brand&token=${get('token')}&id=${id}`).then((res)=>{
      resolve(res)
    })
  })
};


//菜品列表
let getProductList = (p,levelid,searchName) => {
  return new Promise((resolve, reject) => {

    // formData.append("x2", '');
    // formData.append("productIdIn", '');

    axios.get(`index.php?controller=product&action=index&token=${get('token')}`,{ params: {
        levelid:levelid,
        product_name:searchName,
        page:p.page,
        pagesize:p.size
      },}).then((res)=>{
      resolve(res)
    })
  })
};

//获取菜品详情
let getView = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=product&action=view&token=${get('token')}&id=${id}`).then((res)=>{
      resolve(res)
    })
  })
};



//修改菜品
let updateProduct = (oneList) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();

    formData.append("id", oneList.id);
    formData.append("imgurl_1", oneList.imgurl_1);
    formData.append("imgurl_2", oneList.imgurl_2);
    formData.append("imgurl_3", oneList.imgurl_3);
    formData.append("product_name", oneList.product_name);
    formData.append("price", oneList.price);
    formData.append("levelid", oneList.levelid);
    formData.append("productcodes",  window.JSON.stringify(oneList.productcodes));

    formData.append("material", oneList.material);
    // formData.append("status", status);
    // formData.append("unit", oneList.unit);

    axios.post(`index.php?controller=product&action=update&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//删除菜品
let delProduct = (id) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("id", id);
    axios.post(`index.php?controller=product&action=delete&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//上传菜品文件
let updateXlsDishesFile = (brandid,fileurl,over) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("brandid", brandid);
    formData.append("fileurl", fileurl);
    formData.append("over", over);
    axios.post(`index.php?controller=product&action=upload&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

//批量修改菜品

let batchChange = (data) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("data", window.JSON.stringify(data) );
    axios.post(`index.php?controller=product&action=batchChange&token=${get('token')}`,formData).then((res)=>{
      resolve(res)
    })
  })
};

export default {getLevel,getProductList,getView,getBrand,updateProduct,delProduct,updateXlsDishesFile,batchChange}



