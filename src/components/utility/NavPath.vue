<template>
  <div id="xoNavPath">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: item.url }" v-for="(item,index) in navList" :key="item.name">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
//  import {mapGetters} from 'vuex'

  export default {
    props:['navList'],
    data(){
      return {
      }
    },
    computed: {
//      ...mapGetters([
//        'getNavPath'
//      ])
    },
    created(){
    }
  }
</script>
<style lang="less">
  .xo-breadcrumb {
    font-size: 15px;
    .xo-breadcrumb__separator {
      margin: 0 8px 0 0;
    }
  }
</style>
