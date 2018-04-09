
<template>
  <div class="scroll_of" v-show="getTreeArr['订单列表']">
    <div class="bodyTop">
      <div class="">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">
        <div class="flex_a f_f">

          <div class=" margin_r_10 margin_t_10">
            <span>下单日期</span>
            <el-date-picker
              size="small"
              v-model="time_start"
              @change="timeStart"
              type="datetime"
              placeholder="选择开始日期时间">
            </el-date-picker>
          </div>

          <div class=" margin_r_10 margin_t_10">
            <span>至</span>
            <el-date-picker
              size="small"
              v-model="time_end"
              @change="timeEnd"
              type="datetime"
              placeholder="选择结束日期时间">
            </el-date-picker>
          </div>

          <div class=" margin_r_10 margin_t_10">
            <span>订单状态</span>
            <el-select v-model="status" clearable filterable placeholder="请选择订单状态" size="small" @change="handleStatus">
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>

          <div class=" margin_r_10 margin_t_10">
            <span>选择门店</span>
            <el-select v-model="storeId" clearable filterable placeholder="请选择" size="small" @change="handleStoreId">
              <el-option
                v-for="item in storeData"
                :key="item.base_store_id"
                :label="item.storename"
                :value="item.base_store_id">
              </el-option>
            </el-select>
          </div>

          <div class=" margin_r_10 margin_t_10">
            <span>选择来源</span>
            <el-select v-model="source" clearable filterable placeholder="请选择订单状态" size="small" @change="handleSource">
              <el-option
                v-for="item in soucesList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>



        </div>
        <div class=" margin_r_10 margin_t_10">

          <el-button size="small" type="primary" @click="out()">导出</el-button>

        </div>
      </div>

      <!--<div class="margin_t_10">-->
        <!--<el-button @click="search()">查询</el-button>-->
        <!--<el-button type="primary" @click="out()">导出</el-button>-->
        <!--<el-button type="primary" @click="">切换到原始数据</el-button>-->
      <!--</div>-->
    </div>

    <el-table :data="tableData" border :height="tableHeight">
      <el-table-column header-align="center" align="center" prop="no" label="序号" width="70">
        <template slot-scope="scope">
          <div>
            {{scope.$index + 1}}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="order_source" label="来源" width="100">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="order_no" label="平台单号" min-width="240">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="store_name" label="门店" width="150">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="order_status" label="订单状态" width="100">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="shop_money" label="实收金额" width="140">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="add_time" label="下单时间" width="160">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="op_time" label="完成时间" width="160">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="wm_name" label="用户" width="140">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="pay_status" label="操作" width="80">
        <template slot-scope="scope">
          <el-button size="small" @click="info(scope.row.id)" v-show="getTreeArr['订单详情']">详情</el-button>
        </template>
      </el-table-column>


    </el-table>
    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="50%">

      <h3 class="border_b">菜品信息</h3>
      <div class="flex_f flex" v-for="(item,index) in detail.productList">
        <div class="flex_sc info_width" >
          <div class="flex_1">
            菜品名称：{{item.name}}
          </div>
          <div class="flex_1">
          </div>
        </div>
        <div class="flex_sc info_width" >
          <div class="flex_1">
            菜品单价：{{item.price}}
          </div>
          <div class="flex_1">
            菜品份数：{{item.count}}
          </div>
        </div>
        <div class="flex_sc info_width" >
          <div class="flex_1">
            规格属性：{{item.attr}}
          </div>
          <div class="flex_1">

          </div>
        </div>
      </div>

      <h3 class="border_b margin_t_10">顾客信息</h3>
      <div class="flex_f flex">
        <div class="flex_sc info_width" >
          <div class="flex_1">
            客户：{{detail.userInfo?detail.userInfo.wm_name:""}}
          </div>
          <div class="flex_1">
            操作人：{{detail.userInfo?detail.userInfo.deliver_name:""}}
          </div>
        </div>

        <div class="flex_sc info_width" >
          <div class="flex_1">
            用餐时间：{{detail.userInfo?detail.userInfo.deliver_time:""}}
          </div>
          <div class="flex_1">
            门店：{{detail.userInfo?detail.userInfo.store:""}}
          </div>
        </div>

        <div class="flex_sc info_width" >
          <div class="flex_1">

          </div>
          <div class="flex_1">
            总份数：{{detail.userInfo?detail.userInfo.product_num:""}}
          </div>
        </div>


        <div class="flex_sc info_width" >
          <div class="flex_1">
            配送费：{{detail.userInfo?detail.userInfo.deliver_Fee:""}}
          </div>
          <div class="flex_1">
            客户备注：{{detail.userInfo?detail.userInfo.order_tip:""}}
          </div>
        </div>

        <div class="flex_sc info_width" >
          <div class="flex_1">
            商家备注：{{detail.userInfo?detail.userInfo.store_tip:""}}
          </div>
          <div class="flex_1">
            收货地址：{{detail.userInfo?detail.userInfo.wm_addr:""}}
          </div>
        </div>

        <div class="flex_sc info_width" >
          <div class="flex_1">
            收货电话：{{detail.userInfo?detail.userInfo.wm_tel:""}}
          </div>
          <div class="flex_1">
          </div>
        </div>

      </div>

      <h3 class="border_b margin_t_10">订单信息</h3>
      <div class="flex_f flex">
        <div class="flex_sc info_width" >
          <div class="flex_1">
            订单来源：{{detail.orderInfo?detail.orderInfo.order_source:""}}
          </div>
          <div class="flex_1">
            订单编号：{{detail.orderInfo?detail.orderInfo.order_no:""}}
          </div>
        </div>

        <div class="flex_sc info_width" >
          <div class="flex_1">
            订单状态：{{detail.orderInfo?detail.orderInfo.order_status:""}}
          </div>
          <div class="flex_1">
            下单时间：{{detail.orderInfo?detail.orderInfo.order_time:""}}
          </div>
        </div>

        <div class="flex_sc info_width" >
          <div class="flex_1">
            订单金额：{{detail.orderInfo?detail.orderInfo.order_price:""}}
          </div>
          <div class="flex_1">
            支付类型：{{detail.orderInfo?detail.orderInfo.pay_type:""}}
          </div>
        </div>

        <div class="flex_sc info_width" >
          <div class="flex_1">
            支付时间：{{detail.orderInfo?detail.orderInfo.pay_time:""}}
          </div>
          <div class="flex_1">
            支付金额：{{detail.orderInfo?detail.orderInfo.pay_money:""}}
          </div>
        </div>

        <div class="flex_sc info_width" >
          <div class="flex_1">
            实收金额：{{detail.orderInfo?detail.orderInfo.shop_money:""}}
          </div>
          <div class="flex_1">
          </div>
        </div>

      </div>
      <h3 class="border_b margin_t_10">订单信息</h3>
      <div class="flex_f flex">
        <div class="flex_sc info_width" >
          <div class="flex_1">
            平台补贴：{{detail.tackoutInfo?detail.tackoutInfo.plat_fee:""}}
          </div>
          <div class="flex_1">
            商家补贴：{{detail.tackoutInfo?detail.tackoutInfo.store_fee:""}}
          </div>
        </div>
        <div class="flex_sc info_width" >
          <div class="flex_1">
            餐盒费：{{detail.tackoutInfo?detail.tackoutInfo.package_fee:""}}
          </div>
          <div class="flex_1">
          </div>
        </div>
      </div>


    </el-dialog>

  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'

  import {getStoreListAll, getArr} from '../../utility/communApi'
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
        dialogVisible:false,
        width: 0,
        tableHeight: 0,
        navList: [{name: "统计报表", url: ''}, {name: "订单列表", url: ''}],
        time_start: '',
        time_end: '',
        start_stamp: '',
        end_stamp: '',
        pay_status: '',
        tableData: [],
        dateSelected: [],
        storeData: [],
        storeId:'',
        statusList: [{id:1,name:'未接单'},{id:2,name:'已接单'},{id:3,name:'配送中'},{id:4,name:'订单取消'},{id:5,name:'已完成'},{id:6,name:'已退款'},{id:8,name:'完成前退款中'},{id:10,name:'完成后退款中'}],
        status: '',
        soucesList:[{id:'el',name:'饿了么'},{id:'mt',name:'美团外卖'},{id:'bd',name:'百度外卖'}],
        source:'',
        p: {page: 1, size: 20, total: 0},
        detail:{}
      }
    },

    methods: {
      ...mapActions(['setTreeArr']),
      timeStart(d) {
        if (d === undefined) {
          this.start_stamp = ""
        } else {
          this.start_stamp = new Date(this.time_start) /1000;
        }
        this.orderList(this.start_stamp,this.end_stamp,this.p)
      },
      timeEnd(d) {
        if (d === undefined) {
          this.end_stamp = ""
        } else {
          this.end_stamp = new Date(this.time_end) /1000;
        }
        this.orderList(this.start_stamp,this.end_stamp,this.p)
      },
      info(id) {
        this.dialogVisible =true;
        let params = {
          redirect: "x2.order.detail",
          id: id,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.detail = res.data
          }
        })

      },
      handleStatus(){
        this.orderList(this.start_stamp,this.end_stamp,this.p)
      },
      handleStoreId(){
        this.orderList(this.start_stamp,this.end_stamp,this.p)
      },
      handleSource(){
        this.orderList(this.start_stamp,this.end_stamp,this.p)
      },
      search() {
        // if (this.start_stamp * 1> this.end_stamp * 1) {
        //   this.$message({
        //     message: '开始时间不能大于结束时间',
        //     type: 'warning'
        //   });
        // } else {
        //   //ok
        //
        // }
        this.orderList(this.start_stamp,this.end_stamp,this.p)
      },
      getPage(page) {
        this.p.page = page;
        this.orderList(this.start_stamp,this.end_stamp,this.p)

      },
      getPageSize(size) {
        this.p.size = size;
        this.orderList(this.start_stamp,this.end_stamp,this.p)
      },

      orderList(begDate,endDate,p){
        let params = {
          redirect: "x2.order.index",
          begTime: begDate,
          endTime:endDate,
          status:this.status,
          storeId:this.storeId,
          source:this.source,
          page:p.page,
          pagesize:p.size,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.tableData = res.data.list;
            this.p.total = res.data.count;
          }
        })
      },
      out(){
        let params = {
          redirect: "x2a.order.exportorder",
          begTime: this.start_stamp,
          endTime:this.end_stamp,
          status:this.status,
          storeId:this.storeId,
          source:this.source,
          page:this.p.page,
          pagesize:this.p.size,
          export:1
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            window.location.href = res.data
          }
        });
      }
    },
    created() {
      this.orderList('','',this.p);
    },
    mounted() {
      let params = {
        redirect: "x2.store.index",
        noPage:1
      };
      oneTwoApi(params).then((res) => {
        if(res.errcode === 0){
          this.storeData = res.data.list;
        }
      });
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
  .border_b {
    border-bottom: 1px solid #8c939d;

  }
  .info_width {
    width: 500px;
    margin-top: 6px;
  }
</style>
