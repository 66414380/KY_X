<template>
  <div>
    <el-form-item label-width="200px" label="款易APP发送订单语音提醒" class="margin_b_10">
      <el-switch v-model="send_message"></el-switch>
    </el-form-item>
    <el-form-item label-width="200px" label="自动接单" class="margin_b_10">
      <el-switch v-model="auth_accept"></el-switch>
    </el-form-item>

    <div class="flex">
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>
<script>
  import {oneTwoApi} from '@/api/api.js'

  export default {
    props: ['send_message', 'auth_accept','dataList'],
    data() {
      return {


      };
    },
    methods: {

      save(){
        //点击保留外卖映射弹窗的信息
        if(this.dataList.length !== 0){
          let accept,message;
          if (this.auth_accept === false){
            accept = 0
          } else {
            accept = 1
          }
          if (this.send_message === false){
            message = 0
          } else {
            message = 1
          }
          let params = {
            redirect: "x2.store.setWmData",
            id: this.dataList[0].id,
            auth_accept:accept,
            send_message:message,
          };
          oneTwoApi(params).then((res) => {
            if (res.errcode === 0) {
              this.$message(res.errmsg);
              this.$router.go(-1)
            }
          })
        }

      },

    },
    mounted() {


    }
  }
</script>
<style scoped lang="less">

</style>
