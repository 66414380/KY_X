<style scoped>
  .time {
    margin-left: 100px;
  }
  .bodyTop{
    padding-bottom: 10px;
  }
</style>

<template>
  <div class="scroll_of">
    <div class="bodyTop">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
      <xo-datePicker @getRadioDate="getRadioDate"></xo-datePicker>

        <div class="flex_es padding_t_10">
          <div  class="flex_a">
            <div class="margin_r_10">
              <div>门店</div>
              <el-select v-model="store_id" clearable filterable placeholder="请选择" size="small">
                <el-option
                  v-for="item in storeData"
                  :key="item.id"
                  :label="item.storeName"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class=" margin_r_10">
              <div>支付方式</div>
              <el-select v-model="iway" clearable filterable placeholder="请选择支付方式" size="small">
                <el-option
                  v-for="item in getWayInfo"
                  :key="item.id"
                  :label="item.memo"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="flex_ec">
            <el-button size="small" @click="search()">查询</el-button>
            <el-button type="primary" size="small" @click="out()">导出</el-button>
          </div>
        </div>

    </div>

      <el-table :data="tableData" border :height="tableHeight">
        <el-table-column header-align="center" align="center" prop="no" label="序号" width="70">
          <template slot-scope="scope">
            {{scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="date" label="差异日期" ></el-table-column>
        <el-table-column header-align="center" align="center" prop="storeName" label="差异门店" ></el-table-column>
        <el-table-column header-align="center" align="center" prop="money" label="差异金额" ></el-table-column>
        <el-table-column header-align="center" align="center" prop="posMoney" label="pos金额" ></el-table-column>
        <el-table-column header-align="center" align="center" prop="payMoney" label="支付金额" ></el-table-column>
        <el-table-column header-align="center" align="center" prop="outOrderNo" label="差异账单号(pos)" ></el-table-column>
        <el-table-column header-align="center" align="center" prop="orderNo" label="支付单号（款易）" ></el-table-column>
        <el-table-column header-align="center" align="center" prop="payment" label="支付方式" ></el-table-column>
        <el-table-column header-align="center" align="center" prop="payTime" label="支付时间" ></el-table-column>

      </el-table>

    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import Hub from '../../utility/commun'
  import { mapActions,mapGetters } from 'vuex';
  import {getStoreListAll} from '../../utility/communApi'
  import getApi1 from '../transactionList/transactionList.service';
  import {oneTwoApi} from '@/api/api.js';
  export default {
    components:{

    },
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    data() {
      return {
        width:0,
        tableHeight:0,
        navList:[{name:"统计报表",url:''},{name:"差异账单查询",url:''}],
        store_id:'',
        iway:'',
        storeData:[],
        getWayInfo:[],
        p: {page: 1, size: 20, total: 0},
        tableData: [],
        dateSelected: [],
      }
    },

    methods: {
      search(){
        if (this.dateSelected[0] === '' && this.dateSelected[1] ==='') {
          this.$message({
            message: '请选择时间',
            type: 'warning'
          });
        } else {
          if (this.dateSelected[0] === '') {
            this.$message({
              message: '开始时间不能为空',
              type: 'warning'
            });
          } else if (this.dateSelected[1] === '') {
            this.$message({
              message: '结束时间不能为空',
              type: 'warning'
            });
          } else if (this.dateSelected[0] > this.dateSelected[1]) {
            this.$message({
              message: '开始时间不能大于结束时间',
              type: 'warning'
            });
          } else {
            //ok
            this.getDifferenceOrder(this.p = {page: 1, size: 20, total: 0})
          }
        }

      },
      out(){
        let params = {
          redirect: "x1.order.getDifferenceOrder",
          startTime: this.dateSelected[0] === ''? '': (this.dateSelected[0] / 1000).toFixed(0),
          endTime: this.dateSelected[1] === ''? '': (this.dateSelected[1] / 1000).toFixed(0),
          storeId: this.store_id,
          iway: this.iway,
          page: this.p.size,
          pagesize: this.p.page,
          export: 1,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            window.location.href = res.data
          }
        })

      },
      getPage(page) {
        this.p.page = page;
        this.getDifferenceOrder(this.p)
      },
      getPageSize(size) {
        this.p.size = size;
        this.getDifferenceOrder(this.p)
      },
      getRadioDate(d) {
        this.dateSelected = d
      },
      getDifferenceOrder(p){
        let params = {
          redirect: "x1.order.getDifferenceOrder",
          startTime: this.dateSelected[0] === ''? '': (this.dateSelected[0] / 1000).toFixed(0),
          endTime: this.dateSelected[1] === ''? '': (this.dateSelected[1] / 1000).toFixed(0),
          storeId: this.store_id,
          iway: this.iway,
          page: p.page,
          pagesize:p.size

        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.tableData = res.data.list;
            this.p.total = res.data.count
          }
        })
      }

    },

    created(){
      getApi1.getWayInfo().then((res) => {
        this.getWayInfo = res.data.data
      });
      getStoreListAll().then((res)=>{
        this.storeData = res.data.data
      });

    },
    mounted() {
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      });
      this.getDifferenceOrder(this.p)
    },
    updated(){

    },

  }
</script>
