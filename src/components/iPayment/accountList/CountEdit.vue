<template>
  <div id="countEdit">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" :label-position="'top'">

      <el-form-item label="支付方式">
      <el-select v-model="formInline.action" placeholder="全部">
        <el-option label="全部" value="All"></el-option>
        <el-option label="支付宝" value="Alipay"></el-option>
        <el-option label="微信支付" value="WeChat"></el-option>
        <el-option label="QQ钱包" value="QQ"></el-option>
      </el-select>
    </el-form-item>

      <el-form-item label="支付通道">
        <el-select v-model="formInline.region" placeholder="全部">
          <el-option label="全部" value="shanghai"></el-option>
          <el-option label="易级付款" value="beijing"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="账号名称">
        <el-input v-model="formInline.user" placeholder=""></el-input>
      </el-form-item>

      <el-form-item style="vertical-align: bottom">
        <el-button @click="search">搜索</el-button>
      </el-form-item>

      <el-form-item style="vertical-align: bottom">
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>

      <el-form-item style="vertical-align: bottom">
        <router-link to="/iPayment/accountList/account"><el-button type="primary" icon="edit">新增账号</el-button></router-link>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formInline: {
          action: '',
          region: '',
          user: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      search(){
        console.log('search');
      },
      save(){
        console.log('save');
      }
    }
  }
</script>
