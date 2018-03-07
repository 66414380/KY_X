import {axios,get} from '../../utility/communApi'




let getDishes = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`index.php?controller=productapi&action=brandproduct&token=${get('token')}&levelid=${id}&x2=1`).then((res)=>{
      resolve(res)
    })
  })
};


export default {getDishes}



