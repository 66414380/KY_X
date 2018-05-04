<template>
  <div class="banner flex">

    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left"
             class="demo-ruleForm login-container demo-form-inline">
      <div class="title">
        <img src="../../assets/login-ky-login-small.png" alt="" style="width: 130px;height: 50px;">
        <h3 style="line-height: 50px">款易系统登录</h3>
      </div>

      <el-form-item prop="account" label="账号:" label-width="60px">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>


      <el-form-item prop="checkPass" label="密码:" label-width="60px" @keydown.native.13="handleSubmit2">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>

      <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>

      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2">登录
        </el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {requestLogin} from '@/api/api.js';
  import {mapActions, mapGetters} from 'vuex';
  export default {
    data() {
      return {
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            //{ validator: validaePass }
          ],
          checkPass: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            //{ validator: validaePass2 }
          ]
        },
        checked: false
      };
    },
    methods: {
      ...mapActions(['setTheme']),
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {

        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {

            let loginParams = {username: this.ruleForm2.account, password: this.ruleForm2.checkPass};

            // 跳转路由
            let formData = new FormData();
            formData.append("user_name", loginParams.username);
            formData.append("password", loginParams.password);
            this.$http.request({
              url: 'index.php?controller=user&action=newLogin',
              method: 'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              data: formData,
            }).then((res) => {
              if (res.data.errcode === 0) {
                this.$localStorage.set("token", res.data.data.token);
                this.$localStorage.set("user", res.data.data.nickname);
                if(res.data.data.theme !== null){
                  this.$localStorage.set("logo", res.data.data.theme.logo_src);
                  this.$localStorage.set("theme", res.data.data.theme.base_color);
                }

                this.$router.push('/home');

                if(this.checked === true){
                  localStorage.setItem('account', this.ruleForm2.account);
                  localStorage.setItem('checkPass', this.ruleForm2.checkPass);
                }
                this.$message({
                  message: '登录成功',
                  type: 'success'
                });
              }
            });

            //this.$router.push('/operate/runningState');
            // 提交给后台服务器
            /*requestLogin(loginParams).then(data => {
              this.logining = false;
              //NProgress.done();
              let { msg, code, user } = data;
              if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                sessionStorage.setItem('user', JSON.stringify(user));
                this.$router.push({ path: '/main' });
              }
            });*/

          } else {
            console.log('error submit!!');

            return false;
          }
        });
      }
    },
    watch: {
      checked(newValue) {
        if (newValue) {
          // 将账号密码存入本地
          localStorage.setItem('account', this.ruleForm2.account);
          localStorage.setItem('checkPass', this.ruleForm2.checkPass);
        } else {
          // 将账号密码从本地移除
          localStorage.removeItem('account');
          localStorage.removeItem('checkPass');
        }
      }
    },
    created(){
      this.$localStorage.set("treeArr",{});
    },
    mounted() {
      this.ruleForm2.account = localStorage.getItem('account');
      this.ruleForm2.checkPass = localStorage.getItem('checkPass');

      if (this.ruleForm2.account) {
        this.checked = true;
      }
    }
  }

</script>

<style lang="less" scoped>
  .banner {
    width: 100%;
    height: 100%;
  }

  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 0 auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
      display: flex;
      justify-content: space-evenly;
    }
    .remember {
      margin: 10px 0px 25px 0px;
    }
  }
</style>
