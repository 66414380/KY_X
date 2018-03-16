<template>
  <div class="scroll_of" v-show="getTreeArr['订单统计']">
    <div class="bodyTop">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="padding_t_10 flex_es">
        <div class="flex_a f_f">


          <div class=" margin_r_10">
            <div>请选择门店</div>
            <el-select v-model="storeId" clearable filterable placeholder="请选择" size="small">
              <el-option
                v-for="item in storeData"
                :key="item.base_store_id"
                :label="item.storename"
                :value="item.base_store_id">
              </el-option>
            </el-select>

          </div>


          <div class=" margin_r_10">
            <div>起始时间</div>
            <el-date-picker
              size="small"
              v-model="time_start"
              type="datetime"
              placeholder="选择开始日期时间">
            </el-date-picker>

          </div>

          <div class=" margin_r_10">
            <div>结束时间</div>
            <el-date-picker
              size="small"
              v-model="time_end"
              type="datetime"
              placeholder="选择结束日期时间">
            </el-date-picker>
          </div>
          <div class=" margin_r_10">
            <div>平台</div>
            <el-radio-group v-model="radio" style="height: 30px" class="flex_a">
              <el-radio  label="">全部</el-radio>
              <el-radio  label="mt">美团外卖</el-radio>
              <el-radio  label="el">饿了么外卖</el-radio>
              <el-radio  label="bd">百度外卖</el-radio>
            </el-radio-group>

          </div>
        </div>

      </div>

      <div class="margin_t_10">
        <el-button @click="search()" size="small">查询</el-button>
        <el-button type="primary" @click="out()" size="small">导出</el-button>

      </div>
    </div>

    <el-table :data="tableData" border :height="tableHeight" v-if="show === ''">
      <el-table-column header-align="center" align="center" prop="date" label="日期" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="store_name" label="门店名称"></el-table-column>
      <el-table-column header-align="center" align="center" prop="order_price" label="订单金额"></el-table-column>
      <el-table-column header-align="center" align="center" prop="order_num" label="支付单数" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="pay_money" label="支付金额" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="shop_money" label="实收金额"></el-table-column>
    </el-table>

    <el-table :data="tableData" border :height="tableHeight" v-if="show === 'mt' || show === 'bd'">
      <el-table-column header-align="center" align="center" prop="date" label="日期" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="store_name" label="门店名称"></el-table-column>
      <el-table-column header-align="center" align="center" prop="order_price" label="订单金额"></el-table-column>
      <el-table-column header-align="center" align="center" prop="order_num" label="支付单数" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="pay_money" label="支付金额" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="shop_money" label="实收金额"></el-table-column>

      <el-table-column header-align="center" align="center" prop="income" label="预计收入" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="plat_part" label="平台补贴" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="shop_part" label="商家补贴" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="activity_fee" label="活动补贴" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="service_fee" label="服务费用" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="shop_fee" label="商家支出" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="deliver_Fee" label="配送费用" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="package_fee" label="餐盒费" ></el-table-column>
    </el-table>



    <el-table :data="tableData" border :height="tableHeight" v-if="show === 'el'">
      <el-table-column header-align="center" align="center" prop="date" label="日期" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="store_name" label="门店名称"></el-table-column>
      <el-table-column header-align="center" align="center" prop="order_price" label="订单金额"></el-table-column>
      <el-table-column header-align="center" align="center" prop="order_num" label="支付单数" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="pay_money" label="支付金额" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="shop_money" label="实收金额"></el-table-column>

      <el-table-column header-align="center" align="center" prop="income" label="预计收入" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="product_money" label="菜品金额"></el-table-column>
      <el-table-column header-align="center" align="center" prop="plat_part" label="平台补贴" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="shop_part" label="商家补贴" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="activity_fee" label="活动补贴" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="service_fee" label="服务费用" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="shop_fee" label="商家支出" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="deliver_Fee" label="配送费用" ></el-table-column>
      <el-table-column header-align="center" align="center" prop="package_fee" label="餐盒费" ></el-table-column>
    </el-table>



    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'

  import Hub from '../../utility/commun'
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components: {},
    data() {
      return {
        width: 0,
        tableHeight: 0,
        navList: [{name: "统计报表", url: ''}, {name: "交易列表", url: ''}],
        radio:"",
        storeData:[],
        storeId:'',
        tableData: [],
        time_start: '',
        time_end: '',
        show:'',

        p: {page: 1, size: 20, total: 0},

      }
    },

    methods: {
      out() {
        let params = {
          redirect: "x2a.order.orderstat",
          storeId:this.storeId,
          begTime: this.time_start === undefined  || this.time_start === '' ? '' : (new Date(this.time_start) * 1 + '').substr(0, 10),
          endTime:this.time_end === undefined || this.time_end === '' ? '' : (new Date(this.time_end) * 1 + '').substr(0, 10),
          source:this.radio,
          export:1
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            window.location.href = res.data
          }
        });
      },
      search() {

        // if (this.start_stamp > this.end_stamp) {
        //   this.$message({
        //     message: '开始时间不能大于结束时间',
        //     type: 'warning'
        //   });
        // } else {
        //   //ok
        //
        //
        // }
        this.show = this.radio;

        this.showResouce(this.p = {page: 1, size: 20, total: 0})

      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p)
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p)
      },

      showResouce(p){
        let params = {
          redirect: "x2a.order.orderstat",
          storeId:this.storeId,
          begTime: this.time_start === undefined  || this.time_start === '' ? '' : (new Date(this.time_start) * 1 + '').substr(0, 10),
          endTime:this.time_end === undefined || this.time_end === '' ? '' : (new Date(this.time_end) * 1 + '').substr(0, 10),
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
      }

    },
    created() {
      let params = {
        redirect: "x2.store.index",
        noPage:1
      };
      oneTwoApi(params).then((res) => {
        if(res.errcode === 0){
          this.storeData = res.data.list;
        }
      });
      this.showResouce(this.p)
    },
    mounted() {
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    destroyed() {

    },
    updated() {

    },

  }
</script>
<style scoped>

  .bodyTop {
    padding-bottom: 10px;
  }
</style>
