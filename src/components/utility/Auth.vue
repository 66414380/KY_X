<style lang="less" scoped>


</style>

<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    @close="passClose"
    @open="passOpen"
    width="400px" >
    <div>
      <el-form ref="formRules" :model="formPassWord" label-width="100px">
        <el-form-item label="原密码:" prop="oldPassWord" :rules="{required: true, message: '请输入原密码', trigger: 'blur'}">
          <el-input type="password" v-model="formPassWord.oldPassWord" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassWord"
                      :rules="{required: true, validator: validatePass, trigger: 'blur'}">
          <el-input type="password" v-model="formPassWord.newPassWord" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop="confirmPassWord"
                      :rules="{required: true, validator: validatePass2, trigger: 'blur'}">
          <el-input type="password" v-model="formPassWord.confirmPassWord" placeholder="请确认新密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码:" prop="vCode" :rules="{required: true, message: '请确认验证码', trigger: 'blur'}">
          <div class="flex_r">
            <el-input v-model="formPassWord.vCode" placeholder="请确认验证码"></el-input>
            <img class="margin_l_10 pointer" :src="authImg" alt="" @click="selectAuth()">
          </div>

        </el-form-item>
      </el-form>

      <el-button type="primary" @click="submit('formRules')">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>

    </div>
  </el-dialog>
</template>

<script>
  import getApi from '../infrastructure/PermissionManagement/user/user.service'

  export default {
    name: 'auth',
    props: ['id'],
    watch: {},
    data() {
      return {
        dialogVisible: false,
        authImg: '',
        formPassWord :{
          oldPassWord: '',
          newPassWord: '',
          confirmPassWord: '',
          vCode: ''
        }
      }
    },
    methods: {
      passOpen() {
        getApi.validateImg().then((res) => {
          this.authImg = `data:image/png;base64,${res.data.data}`
        })
      },
      passClose() {
        //this.uid = '';
        this.$refs["formRules"].resetFields();
      },
      openDialog() {
        this.dialogVisible = true
      },
      validatePass(rule, value, callback){
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.formPassWord.confirmPassWord !== '') {
            this.$refs.formRules.validateField('confirmPassWord');
          }
          callback();
        }
      },
      validatePass2(rule, value, callback){
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.formPassWord.newPassWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      selectAuth(){
        getApi.validateImg().then((res)=>{
          this.authImg = `data:image/png;base64,${res.data.data}`
        })
      },
      submit(formRules) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            getApi.updatePassword(this.id,this.formPassWord).then((res)=>{
              if(res.data.errcode === 0){
                this.$localStorage.remove("token");
                this.$localStorage.remove("user");

                this.$alert('密码修改成功，请重新登录', '', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push("/login")
                  }
                });

              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    created() {
    },
    mounted() {
    },
    destroyed() {
    }
  }
</script>
