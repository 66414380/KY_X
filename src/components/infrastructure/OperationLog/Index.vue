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
          <div class="flex_a">
            <div class=" margin_r_10">
              <div>操作人</div>
              <el-input class="margin_r_10" v-model="user_name"></el-input>
            </div>

            <div >
              <div>操作类型</div>
              <el-select v-model="power_attr" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in logType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="flex_ec">
            <el-input class="margin_r_10" v-model="name"></el-input>
            <el-button @click="search()">查询</el-button>
          </div>

        </div>

    </div>
      <el-table :data="tableData" border :height="tableHeight">
        <el-table-column header-align="center" align="center" prop="user_name" label="操作人"></el-table-column>
        <el-table-column header-align="center" align="center" prop="power_attr" label="操作类型" width="160"></el-table-column>
        <el-table-column header-align="center" align="center" prop="power_name" label="操作动作"></el-table-column>
        <el-table-column header-align="center" align="center" prop="add_time_formated" label="操作时间" ></el-table-column>
        <el-table-column header-align="center" align="center" prop="ip" label="IP" ></el-table-column>
        <el-table-column header-align="center" align="center" prop="remark" label="备注" ></el-table-column>
      </el-table>

    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>
  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import getApi from './operationLog.service';
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
        navList:[{name:"系统设置",url:''},{name:"操作日志",url:''}],

        value: '',
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        dateSelected:[],
        name:'',
        logType:[],
        power_attr:'',
        user_name:''
      }
    },

    methods: {
      ...mapActions(['setTreeArr']),
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

            this.getAdminLogList(this.dateSelected[0] ,this.dateSelected[1],this.user_name,this.power_attr,this.name,this.p)

          }
        }

      },
      getPage(page) {
        this.p.page = page;
        this.getAdminLogList(this.dateSelected[0] ,this.dateSelected[1],this.user_name,this.power_attr,this.name,this.p)
      },
      getPageSize(size) {
        this.p.size = size;
        this.getAdminLogList(this.dateSelected[0] ,this.dateSelected[1],this.user_name,this.power_attr,this.name,this.p)
      },

      getRadioDate(d){
        this.dateSelected = d
      },
      getAdminLogList(start_time,end_time,user_name,power_attr,name,p){
        getApi.getAdminLogList(start_time,end_time,user_name,power_attr,name,p).then((res)=>{
          if(res.data.errcode === 0){
            this.tableData = res.data.data.list;
            this.p.total = res.data.data.count

          }
        })
      }
    },
    created(){
      getApi.getAdminLogType().then((res)=>{
       this.logType = res.data.data
      })
    },
    updated(){

    },
    mounted() {
      this.getAdminLogList(this.dateSelected[0] ,this.dateSelected[1],this.user_name,this.power_attr,this.name,this.p);
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    destroyed(){

    }
  }
</script>
