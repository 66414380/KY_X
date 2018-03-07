<template>
  <div class="scroll_of" v-show="getTreeArr['列表']">
    <div class="bodyTop">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
      <div class="flex_es ">
        <xo-datePicker @getRadioDate="getRadioDate"></xo-datePicker>
        <div class="flex_ec">
          <div class="margin_r_10">
            <span>门店</span>
            <el-select v-model="store_id" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in storeData"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <el-button class="margin_l_10" @click="search()">查询</el-button>
          <el-button type="primary" @click="out()">导出</el-button>
        </div>
      </div>

      <div class="flex_es padding_t_10">
        <div class="flex_a">
          <div class="invoice_top margin_r_10">开票张数总计：{{total_num}}</div>
          <div class="invoice_top">开票金额总计：¥{{total_price}}</div>
        </div>
        <div class="flex_r">

        </div>

      </div>

    </div>
      <el-table :data="tableData" border :height="tableHeight">
        <el-table-column header-align="center" align="center" label="序号" width="70">
          <template slot-scope="scope">
            <div>
              {{scope.$index + 1}}
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="invoice_number" label="发票号码"></el-table-column>
        <el-table-column header-align="center" align="center" prop="store_name" label="开票门店"></el-table-column>
        <el-table-column header-align="center" align="center" prop="title" label="购买方名称"></el-table-column>
        <el-table-column header-align="center" align="center" prop="phone" label="电话"></el-table-column>
        <el-table-column header-align="center" align="center" prop="price" label="开票金额"></el-table-column>
        <el-table-column header-align="center" align="center" prop="add_time" label="开票时间"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <el-popover
              ref="popover4"
              placement="right"
              width="300"
              trigger="click" @show="()=>{
                return showPop(scope.row.id)
              }">
             <div>
               <div class="flex_a pop_cell">
                 <div class="flex_1">购买方名称</div>
                 <div class="flex_2">{{invoiceInfo.name}}</div>
               </div>

               <div class="flex_a pop_cell">
                 <div class="flex_1">购买方税号</div>
                 <div class="flex_2">{{invoiceInfo.number}}</div>
               </div>
               <div class="flex_a pop_cell">
                 <div class="flex_1">购买方地址</div>
                 <div class="flex_2">{{invoiceInfo.address}}</div>
               </div>
               <div class="flex_a pop_cell">
                 <div class="flex_1">购买电话</div>
                 <div class="flex_2">{{invoiceInfo.tel}}</div>
               </div>

               <div class="flex_a pop_cell">
                 <div class="flex_1">金额</div>
                 <div class="flex_2">¥{{invoiceInfo.price}}</div>
               </div>
               <div class="flex_a pop_cell">
                 <div class="flex_1">税额</div>
                 <div class="flex_2">¥{{invoiceInfo.tax_price}}</div>
               </div>
               <div class="flex_a pop_cell">
                 <div class="flex_1">价税合计</div>
                 <div class="flex_2">¥{{invoiceInfo.count_price}}</div>
               </div>
               <div style="border-bottom: 1px solid #bfcbd9;width: 100%">

               </div>

               <div class="flex_a pop_cell">
                 <div class="flex_1">发票代码</div>
                 <div class="flex_2 pop_cell_color">{{invoiceInfo.invoice_code}}</div>
               </div>
               <div class="flex_a pop_cell">
                 <div class="flex_1">发票号码</div>
                 <div class="flex_2 pop_cell_color">{{invoiceInfo.invoice_number}}</div>
               </div>
               <div class="flex_a pop_cell">
                 <div class="flex_1">开票日期</div>
                 <div class="flex_2"> {{invoiceInfo.add_time}}</div>
               </div>

             </div>
              <el-button size="small" type="primary"  slot="reference" v-show="getTreeArr['详情']">查看详情</el-button>
            </el-popover>

          </template>
        </el-table-column>

      </el-table>

    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {getStoreListAll} from '../../utility/communApi'
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'
  import {oneTwoApi} from '@/api/api.js';
  export default {
    components: {

    },
    data() {
      return {
        store_id:'',
        storeData:[],
        width: 0,
        tableHeight: 0,
        navList: [{name: "统计报表", url: ''}, {name: "发票", url: ''}],

        tableData: [],
        p: {page: 1, size: 20, total: 0},
        dateSelected:[],
        total_price:'',
        total_num:'',
        invoiceInfo:{}
      }
    },
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    methods: {
      out(){
        this.getInvoiceList(this.p,this.store_id,this.dateSelected[0] ,this.dateSelected[1],1)
      },
      showPop(id){
        let params = {
          redirect: "x1.invoice.invoiceInfo",
          id: id,
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.invoiceInfo = res.data
          }
        });

      },
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

            this.getInvoiceList(this.p = {page: 1, size: 20, total: 0},this.store_id,this.dateSelected[0] ,this.dateSelected[1],'');
          }
        }
      },
      getPage(page) {
        this.p.page = page;
        this.getInvoiceList(this.p,this.store_id,this.dateSelected[0] ,this.dateSelected[1],'');
      },
      getPageSize(size) {
        this.p.size = size;
        this.getInvoiceList(this.p,this.store_id,this.dateSelected[0] ,this.dateSelected[1],'');
      },
      getRadioDate(d) {
        this.dateSelected = [(d[0] + "").substr(0,10),(d[1] + "").substr(0,10)]
      },
      getInvoiceList(p,store_id,create_time,end_time,myExport){

        let params = {
          redirect: "x1.invoice.invoiceStatistics",
          store_id: store_id,
          create_time: create_time,
          end_time: end_time,
          export: myExport,
          page: p.page,
          pagesize: p.size
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            if(myExport === ""){
              this.tableData = res.data.list;
              this.total_num = res.data.total_num;
              this.total_price = res.data.total_price;
              this.p.total = res.data.count
            }else {
              window.location.href = res.data
            }
          }
        });

      },
    },
    created() {

    },
    mounted(){
      getStoreListAll().then((res)=>{
        this.storeData = res.data.data
      });
      this.getInvoiceList(this.p,this.store_id,this.dateSelected[0] ,this.dateSelected[1],'');
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    updated() {

    },

  }
</script>

<style scoped>

  .bodyTop {
    padding-bottom: 10px;
  }
  .invoice_top{
    height: 36px;
    display: flex;
    align-items: center;
    border:1px solid #bfcbd9;
    padding: 0 10px;
    border-radius:5px;
  }

  .pop_cell{
    height: 36px;
  }
  .pop_cell_color{
    color: #C5996E;
    font-size: 13px;
  }
</style>
