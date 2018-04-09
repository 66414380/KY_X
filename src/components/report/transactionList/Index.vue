<style scoped>

  .bodyTop {
    padding-bottom: 10px;
  }
</style>

<template>
  <div class="scroll_of" v-show="getTreeArr['列表']">
    <div class="bodyTop">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
      <xo-datePicker @getRadioDate="getRadioDate"></xo-datePicker>

        <div class="padding_t_10 flex_es">
          <div class="flex_a">
            <div class=" margin_r_10">
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

            <div class=" margin_r_10">
              <div>支付通道</div>
              <el-select v-model="ichannel" clearable filterable placeholder="请选择通道列表" size="small">
                <el-option
                  v-for="item in getChannelInfo"
                  :key="item.id"
                  :label="item.memo"
                  :value="item.id">
                </el-option>
              </el-select>

            </div>
            <!--<div class=" margin_r_10">-->
              <!--<div>账户</div>-->
              <!--<el-select v-model="account" clearable placeholder="请选择账户">-->
                <!--<el-option-->
                  <!--v-for="item in accountList"-->
                  <!--:key="item.id"-->
                  <!--:label="item.accountName"-->
                  <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->

            <!--</div>-->

            <div class=" margin_r_10">
              <div>交易状态
              </div>
              <el-select v-model="pay_status" clearable filterable placeholder="请选择" size="small">
                <el-option
                  v-for="item in transactionStatus"
                  :key="item.id"
                  :label="item.memo"
                  :value="item.value">
                </el-option>
              </el-select>

            </div>

            <div class=" margin_r_10">
              <div>支付单号</div>
              <el-input v-model="order_no" placeholder="请输入支付单号" size="small"></el-input>

            </div>

            <div class=" margin_r_10">
              <div>扫码支付形式</div>
              <el-select v-model="scavengingForm" clearable filterable placeholder="请选择支付形式" size="small">
                <el-option
                  v-for="item in payInfo"
                  :key="item.scanId"
                  :label="item.scavengingFormName"
                  :value="item.scanId">
                </el-option>
              </el-select>

            </div>

            <div class=" margin_r_10">
              <div>收款终端</div>
              <el-select v-model="receive_terminal" clearable filterable placeholder="请选择收款终端" size="small">
                <el-option
                  v-for="item in terminalInfo"
                  :key="item.receiveId"
                  :label="item.receiveTerminalName"
                  :value="item.receiveId">
                </el-option>
              </el-select>

            </div>

            <div class=" margin_r_10">
              <div>商家单号</div>
              <el-input v-model="out_order_no" placeholder="请输入商家单号" size="small"></el-input>
            </div>
          </div>

          <div class="flex_ec">
            <el-button @click="search()" size="small">查询</el-button>
            <el-button type="primary" @click="out()" v-show="getTreeArr['导出']" size="small">导出</el-button>
          </div>
        </div>
    </div>

      <el-table :data="tableData" border :height="tableHeight">
        <el-table-column header-align="center" align="center" prop="no" label="序号" width="70">
          <template slot-scope="scope">
            <div>
              {{scope.$index + 1}}
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="additional_data" label="桌号"
                         width="100"></el-table-column>
        <el-table-column header-align="center" align="center" prop="order_no" label="支付单号（款易）"
                         min-width="200"></el-table-column>
        <el-table-column header-align="center" align="center" prop="out_order_no" label="商家单号（pos）"
                         min-width="200"></el-table-column>
        <el-table-column header-align="center" align="center" prop="store_name" label="门店"
                         min-width="160"></el-table-column>
        <el-table-column header-align="center" align="center" prop="iway" label="支付方式"
                         width="100"></el-table-column>

        <el-table-column header-align="center" align="center" prop="scavengingForm" label="扫码支付形式"
                         width="130"></el-table-column>
        <el-table-column header-align="center" align="center" prop="receive_terminal" label="收款终端"
                         width="100"></el-table-column>

        <el-table-column header-align="center" align="center" prop="ichannel" label="支付通道"
                         width="100"></el-table-column>
        <!--<el-table-column header-align="center" align="center" prop="account" label="帐户" width="70"></el-table-column>-->
        <el-table-column header-align="center" align="center" prop="pay_money" label="支付金额"
                         width="100"></el-table-column>
        <el-table-column header-align="center" align="center" prop="refund_money" label="退款金额"
                         width="100"></el-table-column>

        <el-table-column header-align="center" align="center" prop="receive_money" label="实收金额"
                         width="100"></el-table-column>

        <el-table-column header-align="center" align="center" prop="add_time" label="交易时间"
                         width="200"></el-table-column>
        <el-table-column header-align="center" align="center" prop="pay_status" label="交易状态"
                         width="100"></el-table-column>
        <el-table-column header-align="center" align="center" prop="refund_time" label="退款时间"
                         width="200"></el-table-column>
        <el-table-column header-align="center" align="center" prop="refund_user" label="退款人" width="100"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作" fixed="right" width="140">
          <template slot-scope="scope">
            <div class="flex">
              <el-button size="small" @click="orderStatus(scope.row)" >查询</el-button>
              <div class="margin_l_10" v-if="scope.row.is_refund == 0 && scope.row.pay_status == '支付完成' && scope.row.iway !== '其他'">
                <el-button size="small" @click="refund(scope.row)">退款</el-button>
              </div>
            </div>

          </template>
        </el-table-column>
      </el-table>


    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>


    <el-dialog
      title="确认退款?"
      :visible.sync="dialogVisible"
      @close="close"
      width="30%">

      <el-form label-position="right" label-width="80px" ref="refundForm" :model="refundForm">
        <el-form-item label="账号："  prop="user_name" :rules="{required: true, message: '请输入账号名称', trigger: 'blur'}">
          <el-input
            type="account"
            :rows="2"
            placeholder="请输入账号名称"
            v-model="refundForm.user_name">
          </el-input>
        </el-form-item>


        <el-form-item label="密码："  prop="password" :rules="{required: true, message: '请输入密码', trigger: 'blur'}">
          <el-input
            type="password"
            :rows="2"
            placeholder="请输入密码"
            v-model="refundForm.password">
          </el-input>
        </el-form-item>

        <el-form-item label="支付金额">
          <el-input
            type="number"
            v-model="actualRefundMoney"
            placeholder="" disabled></el-input>
        </el-form-item>

        <el-form-item label="退款金额"  prop="refund_money" :rules="{validator: checkRefund,required: true, trigger: 'blur'}">
          <el-input
            type="number"
            min="0"
            v-model="refundForm.refund_money"
            placeholder="请输入退款金额"></el-input>
        </el-form-item>

        <el-form-item label="退款原因"  prop="remark" :rules="{required: true, message: '请输入备注内容', trigger: 'change'}">
          <!--<el-input-->
            <!--type="textarea"-->
            <!--:rows="2"-->
            <!--placeholder="请输入备注内容"-->
            <!--v-model="refundForm.remark">-->
          <!--</el-input>-->
          <el-radio-group v-model="refundForm.remark">
            <el-radio label="收错钱">收错钱</el-radio>
            <el-radio label="退菜">退菜</el-radio>
            <el-radio label="不想吃了">不想吃了</el-radio>
            <el-radio label="爱吃不吃">爱吃不吃</el-radio>
            <el-radio label="其他">其他</el-radio>
          </el-radio-group>

        </el-form-item>



      </el-form>




      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="makeSureRefund">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import getApi from './transactionList.service';
  import {getStoreListAll} from '../../utility/communApi'
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'

  import { oneTwoApi } from '../../../api/api'
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components: {

    },
    data() {
      return {
        width: 0,
        tableHeight: 0,
        navList: [{name: "统计报表", url: ''}, {name: "交易列表", url: ''}],
        order_no: '',
        out_order_no: '',

        pay_status: '',
        transactionStatus: [],
        payInfo:[],
        scavengingForm:"",
        terminalInfo:[],
        receive_terminal:"",
        tableData: [],
        dateSelected: [],
        getWayInfo:[],
        iway:'',
        getChannelInfo:[],
        ichannel:'',
        storeData: [],
        store_id: '',
        accountList:[],
        account:'',
        p: {page: 1, size: 20, total: 0},
        store_id_list:[],

        dialogVisible: false,
        refundForm:{
          refund_money: '',
          remark: '',
          user_name: '',
          password: '',
        },
        refundOrderNo: '',
        actualRefundMoney: '',

      }
    },

    methods: {
      ...mapActions(['setTreeArr']),
      orderStatus(row){
        let params = {
          redirect: 'x1.order.checkOrderStatus',
          orderId: row.id,

        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0 &&  res.errmsg === "success"){
            this.$message({
              message: "操作成功",
              type: 'success'
            });
            let store = this.store();
            this.orderList(this.dateSelected[0] ,this.dateSelected[1],store,this.iway,this.ichannel,this.account,this.pay_status,this.order_no,this.out_order_no,this.scavengingForm,this.receive_terminal,this.p)

          }
        })
      },
      checkRefund(rule, value, callback){

        if (value === '') {
          callback(new Error('请输入退款金额'));
        }else {
          if ((value *1) <= 0) {
            callback(new Error('退款金额不可少于或等于0'));
          }else {
            callback()
          }
        }
      },
      close(){
        this.$refs['refundForm'].resetFields();
      },
      store(){
        let store;
        if(this.store_id === ''){
          store = this.store_id_list.join(',')
        }else {
          store = this.store_id
        }
        return store
      },
      out(){
       let store = this.store();
        getApi.orderList(this.dateSelected[0] ,this.dateSelected[1],store,this.iway,this.ichannel,this.account,this.pay_status,this.order_no,this.out_order_no,this.scavengingForm,this.receive_terminal,this.p,1).then((res)=>{
          if(res.data.errcode === 0){
            window.location.href = res.data.data
          }
        })
      },
      search() {
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
              console.log(this.dateSelected[0] ,this.dateSelected[1])
              let store = this.store();
              this.orderList(this.dateSelected[0] ,this.dateSelected[1],store,this.iway,this.ichannel,this.account,this.pay_status,this.order_no,this.out_order_no,this.scavengingForm,this.receive_terminal,this.p)
            }
        }

      },
      getPage(page) {
        this.p.page = page;
        let store = this.store();
        this.orderList(this.dateSelected[0] ,this.dateSelected[1],store,this.iway,this.ichannel,this.account,this.pay_status,this.order_no,this.out_order_no,this.scavengingForm,this.receive_terminal,this.p)

      },
      getPageSize(size) {
        this.p.size = size;
        let store = this.store();
        this.orderList(this.dateSelected[0] ,this.dateSelected[1],store,this.iway,this.ichannel,this.account,this.pay_status,this.order_no,this.out_order_no,this.scavengingForm,this.receive_terminal,this.p)

      },

      getRadioDate(d) {
        this.dateSelected = d
      },
      orderList(start_time,end_time,store_id,iway,ichannel,account,pay_status,order_no,out_order_no,scavengingForm,receive_terminal,p,export1 = ''){
        getApi.orderList(start_time,end_time,store_id,iway,ichannel,account,pay_status,order_no,out_order_no,scavengingForm,receive_terminal,p,export1).then((res)=>{
          if(res.data.errcode === 0){
            res.data.data.list.forEach((item)=>{
              item.add_time = new Date((item.add_time + '000') * 1).format("yyyy-MM-dd hh:mm:ss");
              if(item.refund_time){
                item.refund_time = new Date((item.refund_time +'000') * 1).format("yyyy-MM-dd hh:mm:ss")
              }
            });
            this.tableData = res.data.data.list;
            this.p.total = res.data.data.count
          }
        })
      },

      // 退款
      refund(value){
        console.log(value);
        this.dialogVisible = true;
        this.refundOrderNo = value.order_no;
        this.actualRefundMoney = value.pay_money;
      },
      makeSureRefund(){
        if (this.refundForm.refund_money > this.actualRefundMoney){
          this.$message({
            message: '退款金额不能大于支付金额',
            type: 'warning'
          });
        }else {

          this.$refs['refundForm'].validate((valid) => {
            if (valid) {

              let params = {
                redirect: 'x1.order.refund',
                order_no: this.refundOrderNo,
                money: this.refundForm.refund_money,
                memo: this.refundForm.remark,
                operate: JSON.parse(localStorage.getItem('user')),
                user_name: this.refundForm.user_name,
                password: this.refundForm.password
              };
              oneTwoApi(params).then((res) => {
                this.dialogVisible = false;
                if (res.errcode === "0" || res.errcode === 0){
                  this.$message({
                    message: "操作成功",
                    type: 'success'
                  });
                  let store = this.store();
                  this.orderList(this.dateSelected[0] ,this.dateSelected[1],store,this.iway,this.ichannel,this.account,this.pay_status,this.order_no,this.out_order_no,this.scavengingForm,this.receive_terminal,this.p)
                }
              })

            } else {
              console.log('error submit!!');
              return false;
            }
          });

        }
      },

    },
    created() {

      getApi.getWayInfo().then((res) => {
        this.getWayInfo = res.data.data
      });

      getApi.getChannelInfo().then((res) => {
        this.getChannelInfo = res.data.data
      });

      // getApi.getAccountList().then((res)=> {
      //   this.accountList = res.data.data.list
      // });

      getApi.putOrderStatus().then((res)=>{
        if(res.data.errcode === 0){
          this.transactionStatus = res.data.data
        }
      });


      let params = {
        redirect: 'x1.order.getReceiveTerminal',
      };
      oneTwoApi(params).then((res) => {
        if(res.errcode === 0){
          this.terminalInfo = res.data
        }
      });

      let params1 = {
        redirect: 'x1.order.getScavengingForm',
      };
      oneTwoApi(params1).then((res) => {
        if(res.errcode === 0){
          this.payInfo = res.data
        }
      });


    },
    mounted() {
      getStoreListAll().then((res)=>{
        let list = [];
        console.log(res)
        res.data.data.forEach((item)=>{
          list.push(item.id)
        });
        this.store_id_list = list;

        this.orderList(this.dateSelected[0] ,this.dateSelected[1],this.store_id_list.join(','),this.iway,this.ichannel,this.account,this.pay_status,this.order_no,this.out_order_no,this.scavengingForm,this.receive_terminal,this.p)

        this.storeData = res.data.data
      });
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    destroyed(){

    },
    updated() {

    },

  }
</script>
