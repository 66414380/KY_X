<template>
  <div class="scroll_of" v-show="getTreeArr['日报推送']">
    <div class="bodyTop">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

        <div class="flex_ce">
          <el-input size="small" class="margin_r_10" v-model="searchName" style="width: 200px" placeholder="请输入接收人邮箱搜索">
          </el-input>
          <el-button size="small" @click="search()">搜索</el-button>
          <el-button size="small" @click="operate('add')" type="primary" icon="plus" v-show="getTreeArr['新建日报推送']">新增推送</el-button>
        </div>

    </div>
      <el-table :data="tableData" border :height="tableHeight">
        <el-table-column header-align="center" align="center" prop="user_name" label="序号" width="80">
          <template slot-scope="scope">
            <div>{{scope.$index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="sendto" label="接收人邮箱" >
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="stores_str" label="接收门店">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.stores">
              <span v-if="index < 3">{{item.storename}}</span>
            </div>
            <el-button type="text" size="small" v-if="scope.row.stores.length > 3" @click="more(scope.row.stores)">查看更多</el-button>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="sendtime" label="接收时间" >
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="remark" label="操作" >
          <template slot-scope="scope">
            <el-button type="text" @click="operate(scope.row.id)" v-show="getTreeArr['修改日报推送']">修改</el-button>
            <el-button type="text" @click="del(scope.row.id)" v-show="getTreeArr['删除日报推送']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

    <el-dialog title="" :visible.sync="dialogFormVisible" size="tiny" @close="close">
      <el-table :data="stores" border >
        <el-table-column header-align="center" align="center" prop="storename" label="门店" >
        </el-table-column>
      </el-table>


    </el-dialog>


  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'
  import {oneTwoApi} from '@/api/api.js';
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
        dialogFormVisible:false,
        navList:[{name: "数据统计", url: ''}, {name: "聚合外卖运营数据", url: ''}, {name:"日报推送",url:''}],
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        searchName:'',
        stores:[]
      }
    },

    methods: {
      ...mapActions(['setTreeArr']),
      close(){
        this.stores = []
      },
      more(stores){
        this.dialogFormVisible =true;
        this.stores = stores
      },
      operate(name){
        this.$router.push({path: `/report/dailyPush/operateDaily/${name}`})
      },
      search() {
        this.showResouce(this.p= {page: 1, size: 20, total: 0},this.searchName)

      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p)
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p)
      },
      del(id){
        this.$confirm(
          '确认删除吗？删除后，该邮箱则不在接收日报推送', '删除', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

          let params = {
            redirect: "x2a.reportmail.delete",
            id: id,
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.showResouce(this.p)
            }
          });



        }).catch(() => {
          //
        });
      },

      showResouce(p,sendto = ''){
        let params = {
          redirect: "x2a.reportmail.index",
          sendto: sendto,
          page: p.page,
          pagesize:p.size
        };

        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            res.data.list.forEach((item)=>{
              item.storesTemp = item.stores.map(item1=>item1.storename);
              item.stores_str = item.storesTemp.join(',');
            });
            this.tableData = res.data.list;
            this.p.total = res.data.count;
          }
        });
      },

    },
    created(){
      this.showResouce(this.p)
    },
    updated(){

    },
    mounted() {
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
<style scoped>

  .bodyTop{
    padding-bottom: 10px;
  }
</style>
