<style scoped>

  .bodyTop{
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
        <div class="flex_es padding_t_10">
          <div class="flex_es">
            <div class=" margin_r_10">
              <div>门店</div>
              <el-select v-model="store_id" clearable filterable placeholder="请选择" @change="selectStore" size="small">
                <el-option
                  v-for="item in storeData"
                  :key="item.id"
                  :label="item.storeName"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <el-button @click="showData(0)" type="primary" size="small">显示全部支付数据</el-button>
            <el-button @click="showData(1)" size="small">仅显示在线支付数据</el-button>
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
              {{scope.row.NO}}
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="time" label="日期" width="200"></el-table-column>
        <el-table-column header-align="center" align="center" prop="store_name" label="门店" width="200"></el-table-column>
        <el-table-column header-align="center" align="center" prop="total_money" label="总支付金额" width="120"></el-table-column>
        <el-table-column header-align="center" align="center" prop="total_num" label="总支付笔数" width="120"></el-table-column>
        <el-table-column header-align="center" align="center" prop="ali_money" label="支付宝" width="100"></el-table-column>
        <el-table-column header-align="center" align="center" prop="ali_num" label="支付宝笔数" width="120"></el-table-column>

        <el-table-column header-align="center" align="center" prop="wx_money" label="微信支付" width="100"></el-table-column>

        <el-table-column header-align="center" align="center" prop="wx_num" label="微信支付笔数" width="140"></el-table-column>
        <el-table-column header-align="center" align="center" prop="other_num" label="其他统计笔数" width="140"></el-table-column>
        <el-table-column header-align="center" align="center" prop="other_money" label="其他统计金额" width="140"></el-table-column>
        <el-table-column header-align="center" align="center" prop="refund_money" label="退款金额" width="100"></el-table-column>
        <el-table-column header-align="center" align="center" prop="refund_num" label="退款笔数" width="100"></el-table-column>
        <el-table-column header-align="center" align="center" prop="receive_money" label="实收金额（总）" width="140"></el-table-column>
      </el-table>

    <footer>
      <!--<xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>-->
    </footer>
  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {oneTwoApi} from '@/api/api.js';
  import {getStoreListAll} from '../../utility/communApi'
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'
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
        width:0,
        tableHeight:0,
        navList:[{name:"统计报表",url:''},{name:"交易统计",url:''}],

        storeData: [],
        value: '',
        tableData: [],
        store_id_list:[],
        store_id:'',
        store_name:'',
        p: {page: 1, size: 20, total: 0},
        dateSelected:[],
      }
    },

    methods: {
      ...mapActions(['setTreeArr']),
      showData(int){
        let store = this.store();
        this.orderCount(this.dateSelected[0] ,this.dateSelected[1],store,this.store_name,this.p,'',int)
      },

      selectStore(id){
        if(id === ''){
          this.store_name = ''
        }else {
          this.storeData.forEach((item)=>{

            if(item.id === id){
              this.store_name = item.storeName
            }
          })
        }
        console.log(this.store_name)
      },
      out(){
        let store = this.store();
        let params = {
          redirect: "x1.order.orderCount",
          start_time: this.dateSelected[0],
          end_time: this.dateSelected[1],
          store_id: store,
          store_name: this.store_name,
          pageCount: this.p.size,
          pageNumber: this.p.page,
          export: 1,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            window.location.href = res.data
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
            let store = this.store();

            this.orderCount(this.dateSelected[0] ,this.dateSelected[1],store,this.store_name,this.p)
          }
        }

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
      getPage(page) {
        this.p.page = page;
        let store = this.store();
        this.orderCount(this.dateSelected[0] ,this.dateSelected[1],store,this.store_name,this.p)

      },
      getPageSize(size) {
        this.p.size = size;
        let store = this.store();

        this.orderCount(this.dateSelected[0] ,this.dateSelected[1],store,this.store_name,this.p)

      },
      getRadioDate(d){
        this.dateSelected = d
      },
      orderCount(start_time,end_time,store_id,store_name,p,export1 = '',type =''){

        let params = {
          redirect: "x1.order.orderCount",
          start_time: start_time,
          end_time: end_time,
          store_id: store_id,
          store_name: store_name,
          pageCount: p.size,
          pageNumber: p.page,
          export: export1,
          type:type
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            for(let i = 0;i<res.data.list.length;i++){
              res.data.list[i].NO = i + 1;
              if(res.data.list[i].NO === res.data.list.length){
                res.data.list[i].NO = "合计"
              }
              if(res.data.list[i].time === 0 || res.data.list[i].time === "总计"){
                res.data.list[i].time = ''
              }
            }
            this.tableData = res.data.list;
            this.p.total = res.data.count
          }
        })
      }
    },
    created(){

    },
    mounted() {
      getStoreListAll().then((res)=>{
        let list = [];
        res.data.data.forEach((item)=>{
          list.push(item.id)
        });
        this.store_id_list = list;

        this.orderCount(this.dateSelected[0] ,this.dateSelected[1],this.store_id_list.join(','),this.store_name,this.p);

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
    updated(){

    },

  }
</script>
