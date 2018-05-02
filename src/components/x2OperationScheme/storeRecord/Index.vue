<template>
  <div v-show="getTreeArr['门店同步记录']">

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree  :data='getStoreRecordTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">

        <div class="flex_es margin_b_10">

          <div class="flex_a">
            <h3 class="margin_r_10">{{levelName}}</h3>
            <el-select size="small" clearable filterable v-model="storeData_id" placeholder="请选择" @change="handleStore" @visible-change="canSelect">
              <el-option
                v-for="item in storeData"
                :key="item.base_store_id"
                :label="item.storename"
                :value="item.base_store_id">
              </el-option>
            </el-select>
            <div class="margin_l_10 flex_a">
            </div>
          </div>

        </div>

        <el-table :data="tableData" border :height="tableHeight - 40" style="width: 100%;" >
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sequence" label="排序" width="80">
            <template slot-scope="scope" >
              <div class="flex">
                {{scope.$index + 1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x2dishname" label="菜品" width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="created_at" label="同步时间" >
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="source" label="同步平台" >
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="result" label="同步状态" >
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="errmsg" label="失败原因" >
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="username" label="操作人" width="100">
          </el-table-column>

          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="80">-->
          <!--<template slot-scope="scope">-->

              <!--<el-button size="small"  @click="show(scope.row.id)">查看同步菜品详情</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>


    </div>
    <el-dialog title="" :visible.sync="dialogVisible2">
      <el-table :data="tableData2" border style="width: 100%;" >
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sequence" label="排序" width="140">
          <template slot-scope="scope" >
            <div class="flex">
              {{scope.$index + 1 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="菜品编码" width="100">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="菜品名称" width="100">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="同步状态" width="100">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="失败原因" width="100">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="操作" width="100">
          <template slot-scope="scope">

            <el-button size="small"  @click="step(scope.row.id)">重新同步</el-button>
          </template>
        </el-table-column>
      </el-table>


    </el-dialog>

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

        dialogVisible2: false,
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "聚合外卖管理", url: ''},{name: "门店管理", url: ''},{name: "门店同步记录", url: ''}],
        levelName:'',
        tableData: [],
        tableData2: [],
        p: {page: 1, size: 20, total: 0},
        storeData:[],
        selectOne:false,
        storeData_id:''
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setStoreRecordTree','setStoreRecordLevelId']),
      ...mapGetters(['getStoreRecordTree','getStoreRecordLevelId']),
      getSchemeData(p) {
        //门店同步记录列表
        let params = {
          redirect: "x2a.dishpushlog.index",
          base_store_id:this.storeData_id,
          dishname: '',
          page: p.page,
          pagesize: p.size

        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            res.data.list.forEach((item)=> {
              item.created_at = new Date((item.created_at + '000') * 1).format("yyyy-MM-dd hh:mm:ss");
            });
            this.tableData = res.data.list;
            this.p.total = res.data.count;

          }
        })

      },
      handleStore() {
        if(this.selectOne === true) {
          this.getSchemeData(this.p = {page: 1, size: this.p.size, total: 0})
        }
      },
      canSelect(e){
        (e === true)? this.selectOne = true: this.selectOne = false
      },
      getPage(page) {
        this.p.page = page;
        this.getSchemeData(this.p);
      },
      getPageSize(size) {
        this.p.size = size;
        this.getSchemeData(this.p);
      },


      show(){
        this.dialogVisible2 = true
      },
      step(){

      },
      showResouce(){
        //获取门店列表
        let params = {
          redirect: "x2.store.index",
          levelid: this.getStoreRecordLevelId(),
          storeName: '',
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            if (res.data.list.length !== 0) {
              this.storeData_id = res.data.list[0].base_store_id;
            }

            this.storeData = res.data.list;

            this.getSchemeData(this.p = {page: 1, size: this.p.size, total: 0})
          }
        })


      },
      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setStoreRecordTree({list:res.data.data});
            if (this.getStoreRecordLevelId() === '') {
              this.setStoreRecordLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce();
            recur(res.data.data,true,this.getStoreRecordLevelId(),this)
          }
        });
      },
    },
    created() {
      if(this.getStoreRecordTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce();
        recur(this.getStoreRecordTree(),false,this.getStoreRecordLevelId(),this)
      }

    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setStoreRecordLevelId({levelId: e.levelid});
        recur(this.getStoreRecordTree(),false,this.getStoreRecordLevelId(),this);
        this.storeData_id = "";
        this.showResouce();
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
