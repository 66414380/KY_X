<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm"
           v-loading="loading"
  >
    <!-- 账户编码 -->
    <el-form-item label="账户编码">
      <el-input v-model="ruleForm.accountCode" :disabled="true"></el-input>
    </el-form-item>

    <div v-for="(domain, index) in ruleForm.domains" class="flex_r">
      <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
        <div>
          <el-row>
            <el-col>
              <div style="width:150px">
                <el-input v-model="domain.code1" placeholder="请输入第三方名称"></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-col :span="1" style="text-align: center;line-height: 36px;">
        -
      </el-col>
      <el-form-item label-width="0" :key="domain.key">
        <div>
          <el-row>
            <el-col>
              <div style="width:150px">
                <el-input v-model="domain.code2" placeholder="请输入第三方编码"></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <div class="flex_sc">
        <div class="m-storeCode margin_l_10" @click="addDomain">
          <i class="fa fa-plus-circle" aria-hidden="true"></i>
        </div>
        <div v-if="(ruleForm.domains.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
             @click.prevent="removeDomain(domain)">
          <i class="fa fa-minus-circle" aria-hidden="true"></i>
        </div>
      </div>
    </div>


    <!-- 账户名称 -->
    <el-form-item label="账户名称:" prop="accountName">
      <el-input v-model="ruleForm.accountName"></el-input>
    </el-form-item>

    <!-- 支付通道 -->
    <el-form-item label="支付通道:" prop="Payment">
      <el-select v-model="ruleForm.Payment" placeholder="请选择" @change="change">
        <el-option
          v-for="item in ruleForm.paymentOptions"
          :key="item.id"
          :label="item.memo"
          :disabled="item.disabled"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 支付方式 -->
    <el-form-item label="支付方式:" prop="checkboxGroup">
      <el-checkbox-group v-model="ruleForm.checkboxGroup">
        <el-checkbox-button v-for="city in ruleForm.payOptions" :label="city.id" :key="city.id">{{city.memo}}
        </el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>

    <!-- 商户号 -->
    <el-form-item label="商户号:" prop="Merchants">
      <el-input v-model="ruleForm.Merchants" placeholder="商户号为关键信息且唯一，请谨慎填写"></el-input>
    </el-form-item>

    <el-form-item>
      <router-link to="/iPayment/accountList">
        <el-button> 取消 </el-button>
      </router-link>
      <el-button type="primary" @click="submitForm('ruleForm')"> 保存 </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {oneTwoApi, payMethods, payMent} from '@/api/api.js'

  export default {
    data() {
      return {
        ruleForm: {
          accountCode: '系统自动生成', // 账户编码
          accountName: '',    // 账户名称
          Merchants: '',      // 商户号
          payOptions: [],    // 支付方式
          checkboxGroup: [],
          paymentOptions: [], // 支付方式
          Payment: '',    // 支付通道
          domains: [{  // 第三方编码
            code1: '',
            code2: ''
          }]
        },
        loading: false,       // 加载状态
        rules: {
          accountName: [  // 账号名称
            {required: true, message: '请输入账号名称', trigger: 'change'}
          ],
          name: [   // 活动名称
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          Merchants: [  // 商户号
            {required: true, message: '请输入商户号', trigger: 'change'}
          ],
          payKey: [ // 支付秘钥
            {required: true, message: '请选择商户支付秘钥', trigger: 'change'}
          ],
          Payment: [
            { type: "number", required: true, message: '请选择支付通道', trigger: 'blur' }
          ],
          checkboxGroup: [
            { type: 'array', required: true, message: '请至少选择一个支付方式', trigger: 'change' }
          ],
        },
      };
    },
    methods: {
      change(e){

        let  params = {
          channelId:e
        }
        // 支付方式初始化
        payMethods(params).then((res) => {
          if (res.errcode == 0) {
            this.ruleForm.payOptions = res.data;

          } else {
            this.$confirm(res.errormsg, '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'error'
            })
          }
        }).catch((err) => {
          console.log(err);
        });

      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;

            // 拼接支付方式格式
              var paymentMethod = "";
              for (var value in this.ruleForm.checkboxGroup) {
                paymentMethod += this.ruleForm.checkboxGroup[value] + ',';
              }

            paymentMethod = paymentMethod.substring(0,paymentMethod.length - 1);

              // 已有账户保存
              var params = {
                redirect: "x1.accountmanage.accountSaveData",
                thirdCode: this.ruleForm.domains,           // 第三方编码
                accountName: this.ruleForm.accountName,     // 账户名
                paymentChannel: this.ruleForm.Payment,      // 支付通道
                paymentMethod: paymentMethod,               // 支付方式
                merchants: this.ruleForm.Merchants,         // 商户号
              };

              oneTwoApi(params).then((res) => {
                if (res.errcode == 0){
                  this.loading = false;
                  this.$message({
                    showClose: true,
                    message: "提交成功",
                    type: "success",
                  });

                  var _this = this;
                  setTimeout(function () {
                    _this.$router.push('/iPayment/accountList');
                  },400);
                }else {

                }
              }).catch((err) => {
                console.log(err);
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      removeDomain(item) {
        var index = this.ruleForm.domains.indexOf(item)
        if (index !== -1) {
          this.ruleForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.ruleForm.domains.push({
          code1: '',
          code2: '',
        });
      },
    },
    mounted() {

      var params = {};

      // 支付通道初始化
      payMent(params).then((res) => {
        if (res.errcode == 0) {

          res.data.forEach((item)=>{
            if(item.memo !== "民生银行"){
              item.disabled = true
            }
          });

          this.ruleForm.paymentOptions = res.data;
        } else {
          this.$confirm(res.errormsg, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'error'
          })
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  }
</script>
<style scoped lang="less">
  .plusBtn {
    border: none;
    color: red;
    font-size: 35px;
    padding: 0 9px 0 9px;
  }

  .minusBtn {
    border: none;
    color: deepskyblue;
    font-size: 35px;
    padding: 0 9px 0 9px;
  }

  .m-storeCode {
    font-size: 30px;
  }
</style>
