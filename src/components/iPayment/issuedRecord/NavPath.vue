<template>
  <div id="xoNavPath">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>支付管理</el-breadcrumb-item>
      <el-breadcrumb-item>下发记录</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    data(){
      return {

      }
    },
    computed: {
      ...mapGetters([
        'getNavPath'
      ])
    }
  }
</script>
<style scoped lang="less">
  .xo-breadcrumb {
    font-size: 15px;
    .xo-breadcrumb__separator {
      margin: 0 8px 0 0;
    }
  }
</style>
