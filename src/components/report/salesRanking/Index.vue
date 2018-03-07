<template>
  <div class="scroll_of" v-show="getTreeArr['菜品销售排行']">
    <div class="bodyTop">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>

    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow: auto" :style="{height:tableHeight + 'px'}">

        <xo-pub-tree  :data='getSalesRankingTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10" :style="{width:tableWidth + 'px'}">
        <h3>{{levelName}}</h3>
        <div class="flex_es margin_b_10">
          <div class="flex_a">
            <div class=" margin_r_10">
              <div>门店</div>
              <el-select size="small" v-model="storeId" clearable filterable placeholder="请选择" @change="handleStoreId">
                <el-option
                  v-for="item in storeData"
                  :key="item.base_store_id"
                  :label="item.storename"
                  :value="item.base_store_id">
                </el-option>
              </el-select>
            </div>

            <div class=" margin_r_10">
              <div>请选择时间</div>

              <div class="flex_a">
                <div class=" margin_r_10 ">

                  <el-date-picker
                    size="small"
                    v-model="time_start"
                    @change="timeStart"
                    type="datetime"
                    placeholder="选择开始日期时间">
                  </el-date-picker>
                </div>

                <div >
                  <span>至</span>
                  <el-date-picker
                    size="small"
                    v-model="time_end"
                    @change="timeEnd"
                    type="datetime"
                    placeholder="选择结束日期时间">
                  </el-date-picker>
                </div>
              </div>
            </div>

            <div class=" margin_r_10">
              <div>请选择平台</div>
              <el-select size="small" v-model="radio" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in planData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>

          </div>
          <div class="flex_ec">
            <el-button @click="search()" size="small">查询</el-button>
          </div>
        </div>
          <el-table :data="tableData" border :height="tableHeight - 83">
            <el-table-column header-align="center" align="center" prop="date" label="日期" width="160"></el-table-column>
            <el-table-column header-align="center" align="center" prop="category" label="品类" ></el-table-column>
            <el-table-column header-align="center" align="center" prop="name" label="菜品" ></el-table-column>
            <el-table-column header-align="center" align="center" prop="sku" label="规格属性" ></el-table-column>
            <el-table-column header-align="center" align="center" prop="totalNum" label="销售数量" sortable></el-table-column>
            <el-table-column header-align="center" align="center" prop="numPct" label="销量占比" sortable></el-table-column>
            <el-table-column header-align="center" align="center" prop="totalPrice" label="销售金额" sortable></el-table-column>

            <el-table-column header-align="center" align="center" prop="pricePct" label="销售额占比" sortable></el-table-column>
          </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>

    </div>



  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {oneTwoApi} from '@/api/api.js';
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'
  import {getLevel,recur} from '../../utility/communApi'

  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components:{

    },
    data() {
      return {
        levelName:'',
        tableWidth:0,
        tableHeight:0,
        navList:[{name:"统计报表",url:''},{name:"菜品销售排行",url:''}],
        storeData: [],
        tableData: [],
        storeId:'',
        planData:[{id:'el',name:'饿了么'},{id:'mt',name:'美团'},{id:'bd',name:'百度'}],
        radio:'',
        p: {page: 1, size: 20, total: 0},
        time_start: '',
        time_end: '',
        start_stamp: '',
        end_stamp: '',
        checkList:[]
      }
    },

    methods: {
      ...mapActions(['setSalesRankingTree','setSalesRankingLevelId']),
      ...mapGetters(['getSalesRankingTree','getSalesRankingLevelId']),

      handleStoreId(){

      },
      timeStart(d) {
        if (d === undefined) {
          this.start_stamp = ""
        } else {
          this.start_stamp = new Date(this.time_start) /1000;
        }

      },
      timeEnd(d) {
        if (d === undefined) {
          this.end_stamp = ""
        } else {
          this.end_stamp = new Date(this.time_end) /1000;
        }

      },

      search() {
        this.showResouce(this.p= {page: 1, size: 20, total: 0},this.getSalesRankingLevelId());

      },

      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p,this.getSalesRankingLevelId());
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p,this.getSalesRankingLevelId());
      },

      showLevel() {
        getLevel().then((res) => {
          if (res.data.errcode === 0) {
            this.setSalesRankingTree({list:res.data.data});

            if (this.getSalesRankingLevelId() === '') {
              this.setSalesRankingLevelId({levelId: res.data.data[0].id});
            }

            this.name = res.data.data[0].levelname;
            this.showResouce(this.p,res.data.data[0].id);
            this.getStoreData(res.data.data[0].id);
            recur(res.data.data,true,this.getSalesRankingLevelId(),this);
          } else {

          }
        })

      },
      showResouce(p,levelId){
        let params = {
          redirect: "x2a.order.productsellrank",
          levelId:levelId,
          storeId:this.storeId,
          begTime: this.start_stamp,
          endTime:this.end_stamp,
          source:this.radio,
          page: p.page,
          pageSize:p.size

        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.tableData = res.data.list;
            this.p.total = res.data.count;
          }
        })

      },
      getStoreData(levelId = ''){
        let params = {
          redirect: "x2.store.index",
          levelId: levelId,
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.storeData = res.data.list;
          }
        });
      }

    },
    created(){
      if(this.getSalesRankingTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.p,this.getSalesRankingLevelId());
        this.getStoreData(this.getSalesRankingLevelId());
        recur(this.getSalesRankingTree(),false,this.getSalesRankingLevelId(),this);
      }
    },
    mounted() {
      Hub.$on('showAdd', (e) => {
        this.storeId = '';
        this.radio = '';
        this.time_start = '';
        this.start_stamp = '';
        this.time_end = '';
        this.end_stamp = '';
        this.showResouce(this.p={page: 1, size: this.p.size, total: 0},e.levelid);
        this.getStoreData(e.levelid);
        this.setSalesRankingLevelId({levelId: e.levelid});
        recur(this.getSalesRankingTree(),false,this.getSalesRankingLevelId(),this);
      });

      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    destroyed(){
      Hub.$off("showAdd");
    },
    updated(){
      let bodyWidth = document.querySelector('.content div').clientWidth;
      let clientWidth = this.$refs.tree? this.$refs.tree.clientWidth : 0;
      this.tableWidth = bodyWidth - clientWidth;
    },

  }
</script>

<style scoped>

  .bodyTop{
    padding-bottom: 10px;
  }
</style>
