<template>
  <div id="app">
    <transition name="fade"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

  import Axios from 'axios'
  import { Loading, Message,MessageBox } from 'element-ui'
  import {mapActions} from 'vuex';
export default {
  name: 'app',
  data(){
    return {
      flag: true
    }
  },

  methods:{
    ...mapActions(['setLoadingStatus']),
  },

  mounted(){

    //var loadinginstace;
    Axios.interceptors.request.use(config => {
      //console.log('拦截开始');
      //loadinginstace = Loading.service({ fullscreen: true });
      this.setLoadingStatus({isLoading: true});
      return config
    }, error => {
      //loadinginstace.close()
      Message.error({
        message: '加载超时'
      })
      return Promise.reject(error)
    });


    Axios.interceptors.response.use(data => {// 响应成功关闭loading
      this.setLoadingStatus({isLoading: false});
      //loadinginstace.close()
      if (data.data.errcode){
        // token失效,重新登录
        if (data.data.errcode == 210){
          if (this.flag){
            this.flag = false;
            this.$alert(data.data.errmsg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push('/');
                this.flag = true;
              }
            });
          }
        }else if(data.data.errcode == 203){
          //不处理
        }else if (data.data.errcode != 0){
          this.$alert(data.data.errmsg, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              /*this.$message({
                type: 'warning',
                message: data.data.errmsg
              });*/
            }
          });
        }
      }
      return data
    }, error => {
      //loadinginstace.close()
      Message.error({
        message: '加载失败'
      })
      return Promise.reject(error)
    });
  }
}
</script>

<style lang="less">
  @import "./common/style/main.less";
  body {
    margin: 0px;
    padding: 0px;
    /*background: url(assets/bg1.jpg) center !important;
          background-size: cover;*/
    // background: #1F2D3D;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }

  #app {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
  }

  .el-submenu [class^=fa] {
    vertical-align: baseline;
    margin-right: 10px;
  }

  .el-menu-item [class^=fa] {
    vertical-align: baseline;
    margin-right: 10px;
  }

  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    //border:1px solid #dfe6ec;
    margin: 10px 0px;
    .el-form-item {
      margin-bottom: 10px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
</style>
