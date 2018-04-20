<template>
  <div id="main">
    <xo-header></xo-header>
    <el-row type="flex">
      <el-col :span="4">
        <xo-left-nav></xo-left-nav>
      </el-col>
      <el-col :span="20" id="getContentHeight" style="overflow-y: scroll" :style="{height:getBodyHeight +'px'}">
        <div class="content">
          <!--路由视图-->
          <router-view></router-view>
        </div>
        <!--<div :style="{height:ListHeight + 'px'}">

        </div>-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  import xoHeader from './Header.vue'
  import xoHome from './Home.vue'
  import xoNavPath from './NavPath.vue'
  import xoLeftNav from './LeftNav.vue'

  export default {
    name: 'Header',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        ListHeight: 0,
      }
    },
    computed: {
      ...mapGetters([
        'getTopHeight','getBodyHeight'
      ]),
      getMsg() {
        return this.msg;
      }
    },
    components: {
      xoHeader,
      xoNavPath,
      xoLeftNav,
      xoHome
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    created() {

    },
    mounted() {

      this.ListHeight = this.getTopHeight;
    },
    updated() {

    }
  }
</script>

<!-- 添加scoped属性为了限制CSS只在这个组件中生效 -->
<style scoped lang="less">
  .content {
    padding: 25px;
    /*height: calc(~'100% - 50px');*/

  }
</style>
