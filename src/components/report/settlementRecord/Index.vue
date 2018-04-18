<template>
  <div class="scroll_of">
    <div class="bodyTop">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>
      <div class="flex_r">
        <div ref="tree" style="min-width: 200px;overflow: auto" :style="{height:tableHeight + 'px'}">

          <xo-pub-tree  :data='getSettlementRecordTree()' :count=0 style="width: max-content;"></xo-pub-tree>
        </div>

        <div class="padding_l_10" :style="{width:tableWidth -10 + 'px'}">
          <h3>{{name}}</h3>
          <div class=" flex_es margin_b_10">
            <div class="flex_a">
              <div class="margin_r_10">
                <div>账户</div>
                <el-select v-model="userId" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in userList"
                    :key="item.acountCode"
                    :label="item.accountName"
                    :value="item.acountCode">
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
            </div>


            <div class="flex_ec">
              <el-button size="small" @click="search()">查询</el-button>
              <el-button type="primary" size="small" @click="out()">导出</el-button>
            </div>
          </div>

          <el-table :data="tableData" border :height="tableHeight -83">
            <el-table-column header-align="center" align="center" prop="no" label="序号" width="70">
              <template slot-scope="scope">
                <div>
                  {{scope.$index + 1}}
                </div>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" prop="create_time" label="划账日期" width="140"></el-table-column>
            <el-table-column header-align="center" align="center" prop="account" label="账户名称" width="220"></el-table-column>
            <el-table-column header-align="center" align="center" prop="time" label="交易起止时间" width="340"></el-table-column>
            <el-table-column header-align="center" align="center" prop="money" label="交易金额（元）" width="140"></el-table-column>
            <el-table-column header-align="center" align="center" prop="num" label="交易笔数" width="100"></el-table-column>
            <el-table-column header-align="center" align="center" prop="refund_money" label="退款金额（元）" width="140"></el-table-column>
            <el-table-column header-align="center" align="center" prop="refund_num" label="退款笔数" width="100"></el-table-column>
            <el-table-column header-align="center" align="center" prop="jine" label="支付净额（差额）元" width="180"></el-table-column>
            <el-table-column header-align="center" align="center" prop="charge" label="手续费金额（元）" width="180"></el-table-column>
            <el-table-column header-align="center" align="center" prop="huazhang" label="划账金额（元）" width="140"></el-table-column>
            <el-table-column header-align="center" align="center" prop="amountTime" label="划账金额到账时间" width="180"></el-table-column>
            <el-table-column header-align="center" align="center" prop="issuingBank" label="结算银行卡号" width="160"></el-table-column>
            <!--<el-table-column header-align="center" align="center" prop="cardNumber" label="操作" width="70">-->
              <!--<template slot-scope="scope">-->
                <!--<el-button type="primary" @click="info()">明细</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->


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
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'
  import {getLevel,recur} from '../../utility/communApi'
  import {oneTwoApi} from '@/api/api.js'
  export default {

    data() {
      return {
        name:'',
        tableWidth:0,
        tableHeight:0,
        navList:[{name:"统计报表",url:''},{name:"结算记录",url:''}],
        input1:'',
        input2:'',
        userList: [],
        userId: '',
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        time_start: '',
        time_end: '',
        start_stamp: '',
        end_stamp: '',
      }
    },
    computed:{
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    methods: {
      ...mapActions(['setSettlementRecordTree','setSettlementRecordLevelId']),
      ...mapGetters(['getSettlementRecordTree','getSettlementRecordLevelId']),
      info(){

      },
      search(){
        this.showResouce(this.p = {page: 1, size: 20, total: 0},this.userId,this.start_stamp,this.end_stamp);
      },
      out(){

      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p,this.userId,this.start_stamp,this.end_stamp);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p,this.userId,this.start_stamp,this.end_stamp);
      },


      showLevel() {
        getLevel().then((res) => {
          if (res.data.errcode === 0) {
            this.setSettlementRecordTree({list:res.data.data});

            if (this.getSettlementRecordLevelId() === '') {
              this.setSettlementRecordLevelId({levelId: res.data.data[0].id});
            }

            this.name = res.data.data[0].levelname;
            this.showResouce(this.p,this.userId,this.start_stamp,this.end_stamp);

            recur(res.data.data, true, this.getSettlementRecordLevelId(), this);
          } else {

          }
        })

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

      showResouce(p,account_id = '',start_date = '',end_date = ''){
        let param = {
          redirect: 'x1.withdraw.withdrawList',
          level_id:this.getSettlementRecordLevelId(),
          account_id:account_id,
          start_date:start_date,
          end_date:end_date,
          page: p.page,
          pagesize: p.size
        };

        oneTwoApi(param).then((res) => {
          if (res.errcode === 0){
            this.tableData = res.data.list;
            this.p.total = res.data.count;
          }
        })

        let param1 = {
          redirect: 'x1.accountmanage.accountList',
          paymentMethod: '',
          paymentChannel: '',
          accountName: '',
          level_id:this.getSettlementRecordLevelId(),
          page: 1,
          pagesize: 1000
        };

        oneTwoApi(param1).then((res) => {
          if (res.errcode === 0){
            this.userList = res.data.list;

          }
        })
      }
    },
    created(){
      if(this.getSettlementRecordTree().length === 0){
        this.showLevel()
      }else {
         this.showResouce(this.p,this.userId,this.start_stamp,this.end_stamp);

        recur(this.getSettlementRecordTree(), false, this.getSettlementRecordLevelId(), this);
      }

    },
    mounted(){
      Hub.$on('showAdd', (e) => {
        this.setSettlementRecordLevelId({levelId: e.levelid});
        this.showResouce(this.p,this.userId = '',this.start_stamp = '',this.end_stamp = '');

        recur(this.getSettlementRecordTree(), false, this.getSettlementRecordLevelId(), this);
      });
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    updated(){
      let bodyWidth = document.querySelector('.content div').clientWidth;
      let clientWidth = this.$refs.tree? this.$refs.tree.clientWidth : 0;
      this.tableWidth = bodyWidth - clientWidth;

    },
    destroyed(){
      Hub.$off("showAdd");
    },
  }
</script>
<style scoped >

  .bodyTop{
    padding-bottom: 10px;
  }
</style>
