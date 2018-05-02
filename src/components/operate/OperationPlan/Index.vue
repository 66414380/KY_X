<template>
  <div>
    <div class="padding_b_10 flex_sb bodyTop">
      <xo-nav-path :navList="navList"></xo-nav-path>
    </div>
    <div>
      <el-table :data="tableData" border :height="tableHeight" style="width: 100%" v-show="getTreeArr['列表']">
        <el-table-column header-align="center" align="center" label="序号" width="65">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="账户 -- 支付方式 -- 支付通道">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.account">
              <div>{{item.name}} -- {{item.paymentMethod}} -- {{item.paymentChannel}}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column header-align="center" align="center" label="时间" prop="time" width="200">
        </el-table-column>
        <el-table-column header-align="center" align="center" label="门店" prop="store">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.store">
              <div>{{item}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="操作员" prop="operator" width="150">
        </el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="100">
          <template slot-scope="scope">
              <el-switch v-show="getTreeArr['开启、关闭']"
                v-model="scope.row.isOpen"
                on-value="1"
                off-value="0"
                @change="changeSwitch(scope.row.isOpen,scope.row.id)"
              >
              </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>
  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import getApi from './operationPlan.service'
  import {oneTwoApi} from '@/api/api.js'
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components: {},
    data() {
      return {
        tableHeight: 0,
        navList: [{name: "聚合支付管理", url: ''},{name: "运营方案", url: ''}],
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        arr:{}
      }
    },

    methods: {
      ...mapActions(['setTreeArr']),
      getPage(page) {
        this.p.page = page;
        this.showResouce();
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce();
      },
      showResouce() {
        getApi.getProject(this.p).then((res) => {
          this.tableData = res.data.data.list;
          this.p.total = res.data.data.count
        })
      },
      changeSwitch(statue, id) {

        var params = {
          redirect: 'x1.accountmanage.setProjectOpen',
          id: id,
          isOpen: statue
        };

        oneTwoApi(params).then((res) => {

        }).catch((err) => {
          console.log(err);})
      }
    },

    updated() {

    },
    created() {
      this.showResouce();

    },
    mounted(){
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
<style scoped lang="less">
  .m-rank {
    width: 40px;
    .m-rank-child {
      height: 18px;
      border-bottom: 1px solid #000;
    }
  }

  .m-storeCode {
    font-size: 30px;
  }
</style>
