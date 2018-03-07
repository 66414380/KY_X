<template>
  <div id="accountAdd">
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">

      <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :label="'账号' + index"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
        :rules="{
      required: true, message: '账号不能为空', trigger: 'blur'
    }"
      >

        <el-row>
          <el-col :span="6">
            <el-select v-model="domain.account1.value" placeholder="请选择">
              <el-option
                v-for="item in domain.account1.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="6" :offset="1">
            <el-select v-model="domain.account2.value" placeholder="请选择">
              <el-option
                v-for="item in domain.account2.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="6" :offset="1">
            <el-select v-model="domain.account3.value" placeholder="请选择">
              <el-option
                v-for="item in domain.account3.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-col>

          <el-col :offset="1" :span="2">
            <el-button @click.prevent="removeDomain(domain,false)">删除</el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button @click="addDomain(false)">新增账号</el-button>
      </el-form-item>
    </el-form>

    <el-form :model="reserveDynamicValidateForm" ref="reserveDynamicValidateForm" label-width="100px" class="demo-dynamic">

      <el-form-item label="备用账号">
        <el-radio class="radio" v-model="radio" label="1">关闭</el-radio>
        <el-radio class="radio" v-model="radio" label="2">开启</el-radio>
      </el-form-item>

      <el-form-item
        v-for="(domain, index) in reserveDynamicValidateForm.domains"
        :label="'账号' + index"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
        :rules="{
      required: true, message: '账号不能为空', trigger: 'blur'
    }"
        v-if="radio == '2'"
      >
        <el-row>
          <el-col :span="6">
            <el-select v-model="domain.reserveAccount1.value" placeholder="请选择">
              <el-option
                v-for="item in domain.reserveAccount1.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="6" :offset="1">
            <el-select v-model="domain.reserveAccount2.value" placeholder="请选择">
              <el-option
                v-for="item in domain.reserveAccount2.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="6" :offset="1">
            <el-select v-model="domain.reserveAccount3.value" placeholder="请选择">
              <el-option
                v-for="item in domain.reserveAccount3.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-col>

          <el-col :offset="1" :span="2">
            <el-button @click.prevent="removeDomain(domain,true)">删除</el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item v-if="radio == '2'">
        <el-button @click="addDomain(true)">新增账号</el-button>
      </el-form-item>
    </el-form>

    <el-form label-width="100px" class="demo-dynamic">
      <el-form-item label="下发门店">
        <el-radio class="radio" v-model="store" label="1">全部门店</el-radio>
        <el-radio class="radio" v-model="store" label="2">部分门店</el-radio>
        <el-button size="small">新增</el-button>
      </el-form-item>
      <el-form-item>
        <xo-issued-stores></xo-issued-stores>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import xoIssuedStores from './IssuedStores.vue'
  export default {
    data() {
      return {
        dynamicValidateForm: {
          domains: [{
            account1: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            },
            account2: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            },
            account3: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            }
          }],
        },
        reserveDynamicValidateForm: {
          domains: [{
            reserveAccount1: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            },
            reserveAccount2: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            },
            reserveAccount3: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            }
          }],
        },
        radio: '1',
        store: '1'
      };
    },
    methods: {
      removeDomain(item,state) {
        if (!state){
          if (this.dynamicValidateForm.domains.length == 1){
            this.$message('不能再删啦!');
          }else {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
              this.dynamicValidateForm.domains.splice(index, 1)
            }
          }
        }else {
          if (this.reserveDynamicValidateForm.domains.length == 1){
            this.$message('不能再删啦!');
          }else {
            var index = this.reserveDynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
              this.reserveDynamicValidateForm.domains.splice(index, 1)
            }
          }
        }
      },
      addDomain(state) {
        if (!state){
          this.dynamicValidateForm.domains.push({
            account1: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            },
            account2: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            },
            account3: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            },
            value: '',
            key: Date.now()})
        }else {
          this.reserveDynamicValidateForm.domains.push({
            reserveAccount1: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            },
            reserveAccount2: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            },
            reserveAccount3: {
              options: [{
                value: 'Alipay',
                label: '支付宝'
              }, {
                value: 'WEPay',
                label: '微信支付',
                disabled: true
              }, {
                value: 'QQPay',
                label: 'QQ支付'
              }],
              value: ''
            },
            value: '',
            key: Date.now()})
        }
      }
    },
    components: {
      xoIssuedStores
    }
  }
</script>
