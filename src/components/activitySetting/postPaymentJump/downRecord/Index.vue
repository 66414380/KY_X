<template>
  <div >

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_sb">
          <div></div>
          <el-button size="small" @click="activeDown()">+新增下发</el-button>

      </div>

    </div>
    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree :data='getActivityDownRecordTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>


      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">

        <el-table :data="tableData" border :height="tableHeight" style="width: 100%;" >

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号" min-width="100">
            <template slot-scope="scope">
              <div>{{scope.$index + 1}}</div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="方案名称" prop="jumpName" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="下发时间" prop="addTime" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作员" prop="operator" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="状态" prop="statusFormate" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" prop="operator" width="80">
            <template slot-scope="scope">
              <el-button size="small" type="text" style="color:blue;" @click="optionShow(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
        </div>

      </div>


    <el-dialog title="下发记录详情" :visible.sync="dialogFormVisible" width="600px">
      <div>
        <span>操作员：{{jumpUseInfo.operator}}</span>
      </div>
      <div>
        <span>添加时间：{{jumpUseInfo.addTime}}</span>
      </div>
      <div>
        <span>执行时间：{{jumpUseInfo.runTime}}</span>
      </div>
      <div>
        <span>状态：{{jumpUseInfo.statusFormate}}</span>
      </div>

      <div class="margin_t_10">下发方案</div>
      <el-table :data="schemeData" border style="width: 100%;" >
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号" width="100">
          <template slot-scope="scope">
            <div>{{scope.$index + 1}}</div>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="方案编码">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="方案名称">
        </el-table-column>
      </el-table>

      <div class="margin_t_10">下发门店</div>
      <el-table :data="jumpUseInfo.store" border style="width: 100%;" >
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号" width="100">
          <template slot-scope="scope">
            <div>{{scope.$index + 1}}</div>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storeId" label="门店编码">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storeName" label="门店名称">
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>


  import {recur} from '../../../utility/communApi'
  import Hub from '../../../utility/commun'
  import {getScrollHeight} from '../../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';
  import getApi1 from '../../../infrastructure/DishesLibrary/dishesLibrary.service'
  import getApi from './downRecord.service'
  export default {
    components: {},
    computed: {
      ...mapGetters([
        'getTreeArr', 'getBodyHeight'
      ]),
    },
    data() {
      return {
        dialogFormVisible: false,
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "活动方案", url: ''},{name: "下发记录", url: ''}],
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        schemeData:[],
        jumpUseInfo:{},

      }
    },
    watch: {},
    methods: {
      ...mapActions(['setActivityDownRecordTree', 'setActivityDownRecordLevelId']),
      ...mapGetters(['getActivityDownRecordTree', 'getActivityDownRecordLevelId']),
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p);
      },
      search() {
        this.showResouce(this.p = {page: 1, size: 20, total: 0});
      },

      optionShow(id) {
        this.dialogFormVisible = true;
        getApi.jumpUseInfo(id).then((res) => {
          if (res.data.errcode === 0) {
            this.jumpUseInfo = res.data.data
          }
        })
      },
      activeDown() {

        this.$router.push({path:`/activitySetting/postPaymentJump/activeDown/${this.getActivityDownRecordLevelId()}`})

      },

      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setActivityDownRecordTree({list: res.data.data});
            if (this.getActivityDownRecordLevelId() === '') {
              this.setActivityDownRecordLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p);
            recur(res.data.data, true, this.getActivityDownRecordLevelId(), this)
          }
        });
      },

      showResouce(p) {

        getApi.jumpUseList(p,this.getActivityDownRecordLevelId()).then((res) => {
          res.data.data.list.forEach((item)=>{
            item.select = false
          });
          if (res.data.errcode === 0) {
            this.tableData = res.data.data.list;
            this.p.total = res.data.data.count;
          }
        })

      },

    },
    created() {
      if (this.getActivityDownRecordTree().length === 0) {
        this.showLevel()
      } else {
        this.showResouce(this.p);
        recur(this.getActivityDownRecordTree(), false, this.getActivityDownRecordLevelId(), this)
      }


    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setActivityDownRecordLevelId({levelId: e.levelid});
        recur(this.getActivityDownRecordTree(), false, this.getActivityDownRecordLevelId(), this);

        this.showResouce(this.p = {page: 1, size: this.p.size, total: 0});
      });
      Hub.$emit('mountedOk', 'mountedOk');
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
    destroyed() {
      Hub.$off("showAdd");

    }
  }
</script>

<style scoped>


</style>
