<template>
  <div id="issuedRecord" v-show="getTreeArr['列表']">
    <div class="contentMsg">
      <el-row>
        <el-col :span="24">
          <el-col :span="18" style="display: flex;align-items: center">
            <xo-nav-path :navList="navList"></xo-nav-path>
          </el-col>
          <el-col :span="2" :offset="2">
            <router-link to="/iPayment/issuedRecord/newIssued">
              <el-button size="small" type="primary" icon="plus" v-show="getTreeArr['新增下发']">新增下发</el-button>
            </router-link>
          </el-col>
        </el-col>
      </el-row>
    </div>

    <el-card style="height: calc(100% - 38px)">
      <div>
        <el-form :inline="true" :model="form" :label-position="'top'">
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择状态" clearable filterable>
              <el-option
                v-for="item in form.options"
                :key="item.id"
                :label="item.memo"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="vertical-align: bottom">
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>

        <el-table
          :data="tableData"
          :height="height"
          border
          style="width: 100%">
          <el-table-column label-class-name="table_head" header-align="center" align="center"
            type="index"
            label="序号"
            width="65">
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center"
            label="支付方式 - 支付通道 - 账户"
          >
            <template slot-scope="scope">
              <div style="margin-left: 10px" v-for="item in scope.row.account">
                <span>{{item.paymentMethod}}</span> - <span>{{item.paymentChannel}}</span> - <span>{{item.name}}</span>
              </div>
            </template>
          </el-table-column>


          <!--<el-table-column
            label="支付通道"
            width="103">
            <template scope="scope">
              <div style="margin-left: 10px" v-for="item in scope.row.payment">{{ item }}</div>
            </template>
          </el-table-column>

          <el-table-column
            label="账户"
            width="144">
            label="支付通道">
            <template scope="scope">
              <div style="margin-left: 10px" v-for="item in scope.row.account">{{ item }}</div>
            </template>
          </el-table-column>-->

          <el-table-column label-class-name="table_head" header-align="center" align="center"
            prop="time"
            label="时间" width="200">
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center"
            prop="operator"
            label="操作员" width="160">
          </el-table-column>


          <el-table-column label-class-name="table_head" header-align="center" align="center"
            label="状态"
            width="120"
          >
            <template slot-scope="scope">

              <el-tag
                :type="scope.row.statusCode === 1 ? 'primary' : 'danger'"
                close-transition>{{scope.row.status}}
              </el-tag>

              <div style="color: red">{{scope.row.waitTime}}</div>

            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" width="80"
            label="操作">
            <template slot-scope="scope">
              <el-button size="small" @click="examine(scope)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          title="下发记录详情"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          width="600px"
        >
          <div>操作员: {{checkData.operator}}</div>
          <div>添加时间: {{checkData.addTime}}</div>
          <div>执行时间: {{checkData.doTime}}</div>
          <div>状态: {{checkData.status}}</div>
          <div>下发账户</div>
          <el-table
            style="width: 100%"
            :data="checkData.account.account"
          >
            <el-table-column
              type="index"
              width="50">
            </el-table-column>

            <el-table-column
              property="accountId"
              label="账户编码"
            >
            </el-table-column>

            <el-table-column
              property="name"
              label="支付账户"
            >
            </el-table-column>

            <el-table-column
              property="paymentChannel"
              label="支付通道"
              :width="150"
            >
            </el-table-column>

            <el-table-column
              property="paymentMethod"
              label="支付方式"
              :width="150"
            >
            </el-table-column>

          </el-table>

          <div>下发备用账户</div>
          <el-table
            style="width: 100%"
            :data="checkData.account.reserveAcc"
          >
            <el-table-column
              type="index"
              width="50">
            </el-table-column>

            <el-table-column
              property="accountId"
              label="账户编码"
            >
            </el-table-column>

            <el-table-column
              property="name"
              label="支付账户"
            >
            </el-table-column>

            <el-table-column
              property="paymentChannel"
              label="支付通道"
              :width="150"
            >
            </el-table-column>

            <el-table-column
              property="paymentMethod"
              label="支付方式"
              :width="150"
            >
            </el-table-column>

          </el-table>

          <div>下发门店</div>
          <el-table
            style="width: 100%"
            :data="checkData.stores"
          >
            <el-table-column
              type="index"
              width="50">
            </el-table-column>

            <el-table-column
              property="code"
              label="门店编码"
            >
            </el-table-column>

            <el-table-column
              property="storeName"
              label="门店名称"
            >
            </el-table-column>

          </el-table>


          <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>
      </div>

      <div style="margin-top: 25px;">
        <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import xoScreenForm from './ScreenForm.vue'

  import {mapGetters, mapActions} from 'vuex'
  import {oneTwoApi} from '@/api/api.js'
  import Hub from '../../utility/commun'
  export default {
    data() {
      return {
        navList: [{name: "聚合支付管理", url: ''},{name: "支付下发", url: ''}],
        p: {page: 1, size: 10, total: 0},
        form: {
          options: [],
          status: ''
        },
        tableData: [],
        dialogVisible: false,
        index: 0,
        height: 0,
        checkData: {
          account: {
            account: [],
            reserveAcc: []
          },
          stores: []
        }
      }
    },
    methods: {
      ...mapActions(['setTreeArr']),
      getPage(value) {
        this.p.page = value;
        this.api();
      },
      getPageSize(value) {
        this.p.size = value;
        this.api();
      },
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.state === value;
      },
      handleClose(done) {
        done();
      },
      search() {
        this.api();
      },
      examine(scope) {
        this.index = scope.$index;
        this.dialogVisible = true;

        var id = this.tableData[scope.$index].id;
        this.checkApi(id)
      },
      api() {

        var param = {
          redirect: 'x1.accountmanage.accountUseLog',
          status: this.form.status,
          page: this.p.page,
          pagesize: this.p.size
        };

        // 账户列表初始化 -> 获取表格数据
        oneTwoApi(param).then((res) => {
          console.log(res);
          if (res.errcode == 0) {

            this.p.total = res.data.count;
            this.tableData = res.data.list;
          }

        }).catch((err) => {
          console.log(err);
        });

      },
      checkApi(value) {
        var param = {
          redirect: 'x1.accountmanage.accountUseLogInfo',
          id: value
        };

        // 账户列表初始化 -> 获取表格数据
        oneTwoApi(param).then((res) => {
          console.log(res);
          if (res.errcode == 0) {
            this.checkData = res.data;
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    computed: {
      ...mapGetters([
        'getTopHeight',
        'getTreeArr'
      ]),
    },
    components: {
      xoScreenForm,
    },
    mounted() {

      // 下发状态接口
      var params = {
        redirect: 'x1.accountmanage.projectStatus',
      };

      oneTwoApi(params).then((res) => {
        console.log(res);
        if (res.errcode == 0) {
          this.form.options = res.data;
        }
      }).catch((err) => {
        console.log(err);
      });


      this.api();
      Hub.$emit('mountedOk','mountedOk');
    },
    updated(){
      // 高度调整
      var topH = document.querySelector('.el-form--label-top').clientHeight;
      var pageH = document.querySelector('.el-pagination').clientHeight;
      this.height = window.innerHeight - this.getTopHeight - topH - pageH - 180;
    },
    destroyed(){

    }
  }
</script>
<style scoped lang="less">
  div.cell {
    text-align: center;
  }

  .contentMsg {
    padding: 0 25px 10px 0;
  }
</style>
