<template>
  <div v-show="getTreeArr['菜品同步记录']">

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree  :data='getDishesRecordTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">

        <div class="flex_es margin_b_10">

          <div class="flex_a">
            <!--<h3 class="margin_r_10">{{levelName}}</h3>-->
            <div class="margin_r_10">
              <span>菜品分组名称</span>
              <el-input size="small" v-model="dishname" placeholder="请输入菜品分组名称"></el-input>
            </div>
            <div class="margin_r_10">
              <span>门店分组名称</span>
              <el-input size="small" v-model="storename" placeholder="请输入门店分组名称"></el-input>
            </div>
          </div>


          <div class="flex_a">

            <el-button size="small" @click="search()">查询</el-button>
          </div>
        </div>

        <el-table :data="tableData" border :height="tableHeight - 40" style="width: 100%;">


          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="序号" width="80">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="pgroupname" label="菜品分组名称" min-width="140">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" label="店铺分组名称" min-width="140">
          </el-table-column>
          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="sequence" label="下发平台" width="140">-->
          <!--</el-table-column>-->


          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="planTypeLabel" label="下发类型" width="140">
          </el-table-column>
          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="sequence" label="执行状态" width="140">-->
          <!--</el-table-column>-->
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="created_at" label="添加时间" width="200">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="timetype" label="下发方式" width="140">
          </el-table-column>
          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="sequence" label="总数/成功个数" width="140">-->
          <!--</el-table-column>-->
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="username" label="操作人" width="140">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="100">
          <template slot-scope="scope">
              <el-button size="small"  @click="show(scope.row.id)" v-show="getTreeArr['菜品同步记录详情']">查看详情</el-button>
          </template>
          </el-table-column>
        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>


    </div>




  </div>
</template>

<script>


  import {recur} from '../../utility/communApi'
  import Hub from '../../utility/commun'
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';

  import getApi1 from '../../infrastructure/DishesLibrary/dishesLibrary.service'
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
        navList: [{name: "聚合外卖管理", url: ''},{name: "门店管理", url: ''},{name: "菜品同步记录", url: ''}],
        levelName:'',
        tableData: [],
        p: {page: 1, size: 20, total: 0},

      }
    },
    watch: {},
    methods: {
      ...mapActions(['setDishesRecordTree','setDishesRecordLevelId']),
      ...mapGetters(['getDishesRecordTree','getDishesRecordLevelId']),

      show(id){
        this.$router.push({path: `/x2OperationScheme/dishesRecord/dishesRecordDetail/${id}`})
      },

      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p);
      },

      search() {
        this.showResouce(this.p = {page: 1, size: 20, total: 0})
      },

      showResouce(p){
        let params = {
          redirect: "x2a.dishlog.index",
          levelid: this.getDishesRecordLevelId(),
          sgroupname: this.storename,
          pgroupname:this.dishname,
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

      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setDishesRecordTree({list:res.data.data});
            if (this.getDishesRecordLevelId() === '') {
              this.setDishesRecordLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p);
            recur(res.data.data,true,this.getDishesRecordLevelId(),this)
          }
        });
      },


    },
    created() {
      if(this.getDishesRecordTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.p);
        recur(this.getDishesRecordTree(),false,this.getDishesRecordLevelId(),this)
      }

    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setDishesRecordLevelId({levelId: e.levelid});
        recur(this.getDishesRecordTree(),false,this.getDishesRecordLevelId(),this);

        this.storename = '';
        this.dishname = '';
        this.showResouce(this.p = {page: 1, size: 20, total: 0});
      });
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(() => {
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })

      })
    },
    updated() {
      let bodyWidth = document.querySelector('.content div').clientWidth;
      this.tableWidth = bodyWidth - this.$refs.tree.clientWidth;



    },
    destroyed(){
      Hub.$off("showAdd");
    }
  }
</script>

<style scoped>

</style>
