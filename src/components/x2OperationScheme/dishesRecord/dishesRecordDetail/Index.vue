<template>
  <div >

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r width_100" >

      <div class="width_100" >

        <div class="flex_es margin_b_10" >

          <div class="flex_a">
            <!--<h3 class="margin_r_10">{{levelName}}</h3>-->
            <div class="margin_r_10">
              <span>菜品名称</span>
              <el-input size="small" v-model="dishname" placeholder="请输入菜品名称"></el-input>
            </div>

          </div>


          <div class="flex_a">

            <el-button size="small" @click="search()">查询</el-button>
          </div>
        </div>

        <el-table :data="tableData" border  style="width: 100%;" :height="tableHeight - 103">


          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="序号" width="80">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storename" label="店铺名" >
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="categoryname" label="品类名称" >
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="planTypeLabel" label="品类操作类型" >
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="dishname" label="菜品名称" >
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="result" label="菜品同步状态" >
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="typeLabel" label="同步平台" >
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="updated_at" label="最后操作时间">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="errmsg" label="失败原因">
          </el-table-column>
        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>


    </div>
<div class="flex margin_t_10">
  <el-button size="small"  @click="$router.go(-1)">返回</el-button>
</div>



  </div>
</template>

<script>

  import {getScrollHeight} from '../../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';

  export default {
    components: {

    },
    computed:{
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    data() {
      return {
        storename:'',
        dishname:'',
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "菜品同步记录", url: '/x2OperationScheme/dishesRecord'},{name: "详情", url: ''},],
        levelName:'',
        tableData: [],
        p: {page: 1, size: 20, total: 0},

      }
    },
    watch: {},
    methods: {


      search() {
        this.showResouce(this.p = {page: 1, size: 20, total: 0})
      },

      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p);
      },

      showResouce(p){

        let params = {
          redirect: "x2a.dishlog.view",
          dishplanid: this.$route.params.id,
          dishname:this.dishname,
          page: p.page,
          pagesize: p.size
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.tableData = res.data.list;
            this.p.total = res.data.count;
          }
        })

      },


    },
    created() {
      this.showResouce(this.p);
    },

    mounted() {
      this.$nextTick(() => {
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })

      })
    },
    updated() {



    },
    destroyed(){

    }
  }
</script>

<style scoped>

</style>
