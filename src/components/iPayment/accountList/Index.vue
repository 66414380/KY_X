<template>
  <div class="rightContent">
    <div class="contentMsg">
      <xo-nav-path></xo-nav-path>
    </div>
    <el-card style="height: calc(100% - 38px)" v-show="getTreeArr['账户列表']">
      <div class="contentMsg">
        <div id="detailMsg">
          <el-form :inline="true" :model="ruleForm" class="demo-form-inline" :label-position="'top'">

            <el-form-item label="支付方式">
              <el-select v-model="ruleForm.payMethod" placeholder="全部" clearable filterable>
                <el-option
                  v-for="item in ruleForm.payOptions"
                  :key="item.id"
                  :label="item.memo"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="支付通道">
              <el-select v-model="ruleForm.Payment" placeholder="全部" clearable filterable>
                <el-option
                  v-for="item in ruleForm.paymentOptions"
                  :key="item.id"
                  :label="item.memo"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="账号名称">
              <el-input v-model="ruleForm.userName" placeholder=""></el-input>
            </el-form-item>

            <el-form-item style="vertical-align: bottom">
              <el-button @click="search">搜索</el-button>
            </el-form-item>

            <el-form-item style="vertical-align: bottom">
              <router-link to="/iPayment/accountList/account">
                <el-button type="primary" icon="edit" v-show="getTreeArr['新增、保存账户']">新增账号</el-button>
              </router-link>
            </el-form-item>

          </el-form>

          <el-table
            :data="tableData"
            :height="height"
            v-loading="loading"
            border
            style="width: 100%">


            <el-table-column label-class-name="table_head" header-align="center" align="center"
              type="index"
              label="序号"
              width="70">
            </el-table-column>

            <el-table-column label-class-name="table_head" header-align="center" align="center"
              label="账户编码"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.acountCode }}</span>
              </template>
            </el-table-column>

            <el-table-column label-class-name="table_head" header-align="center" align="center"
              label="账户名称"
              width="180"
            >
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="24">
                    <!--<el-input v-model="scope.row.accountName" placeholder=""></el-input>-->
                    <div>{{scope.row.accountName}}</div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>

            <el-table-column label-class-name="table_head" header-align="center" align="center"
              label="支付方式">
              <template slot-scope="scope">
                <div v-for="item in scope.row.paymentName">{{ item }}</div>
              </template>
            </el-table-column>


            <el-table-column label-class-name="table_head" header-align="center" align="center"
              label="支付通道">
              <template slot-scope="scope">
                <div>{{ scope.row.paymentChannel }}</div>
              </template>
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center"
              label="状态">
              <template slot-scope="scope">
                <span>{{ scope.row.status }}</span>
              </template>
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center"
              label="查看" width="70">
              <template slot-scope="scope">
                <el-popover trigger="click" placement="top" width="200">
                  <p v-if="checkoutData.acountCode">账号编号: {{ checkoutData.acountCode }}</p>
                  <div v-if="checkoutData.thirdCode" >第三方编码:
                    <span v-for="item in checkoutData.thirdCode">{{item.code1}} - {{item.code2}}</span>
                  </div>
                  <p v-if="checkoutData.accountName">账号名称: {{ checkoutData.accountName }}</p>
                  <div v-if="checkoutData.paymentName" >支付方式:
                    <span v-for="item in checkoutData.paymentName">{{item}}&nbsp;</span>
                  </div>
                  <p v-if="checkoutData.paymentChannel">支付通道: {{ checkoutData.paymentChannel }}</p>
                  <p v-if="checkoutData.token">商户号: {{ checkoutData.token }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag @click.native="handleCheck(scope.row.acountCode)">查看</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" label="删除" width="80">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row.acountCode)" v-show="getTreeArr['删除']">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <footer>
        <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
      </footer>
    </el-card>
  </div>
</template>
<script>
  import xoDetailMsg from './DetailMsg.vue'
  import xoNavPath from './NavPath.vue'
  import {mapGetters, mapActions} from 'vuex'
  import {oneTwoApi, payMethods, payMent} from '@/api/api.js'
  import Hub from '../../utility/commun'
  export default{
    data(){
      return {
        p: {page:1, size:10, total:0},
        ruleForm: {
          payMethod: '', // 支付方式
          payOptions: [],  // 支付方式
          Payment: '', // 支付通道
          paymentOptions: [],  // 支付通道
          userName: ''  // 用户名
        },
        tableData: [],
        height: 0,
        loading: true,
        checkoutData: {}
      }
    },
    components: {
      xoDetailMsg,
      xoNavPath
    },
    methods: {
      ...mapActions(['setTreeArr']),
      getPage(value){
        console.log(1);
        this.p.page = value;
        this.api();
      },
      getPageSize(value){
        this.p.size = value;
        this.api();
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {

        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        }).then(() => {
          var params = {
            redirect: 'x1.accountmanage.delAccount',
            id: row
          };

          oneTwoApi(params).then((res) => {
            if (res.errcode == 0){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.api();
            }
          });
        });
      },
      handleSave(index,row){
        var param = {
          redirect: 'x1.accountmanage.accountSaveData',
          id: row.accountCode,
          paymentMethod: this.ruleForm.payMethod,
          paymentChannel: this.ruleForm.Payment,
          accountName: this.ruleForm.userName,
          page: this.p.page,
          pagesize: this.p.size
        };

        console.log(index);
        console.log(row);
      },
      handleCheck(value){
        var param = {
          redirect: 'x1.accountmanage.accountInfo',
          id: value
        };

        // 账户列表初始化 -> 获取表格数据
        oneTwoApi(param).then((res) => {
          if (res.errcode == 0){
            this.checkoutData = res.data;
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      onSubmit() {
        console.log('submit!');
      },
      search() {
        this.p.page = 1;
        this.api();
      },
      save() {
        console.log('save');
      },
      api(){
        this.loading = true;

        var param = {
          redirect: 'x1.accountmanage.accountList',
          paymentMethod: this.ruleForm.payMethod,
          paymentChannel: this.ruleForm.Payment,
          accountName: this.ruleForm.userName,
          page: this.p.page,
          pagesize: this.p.size
        };

        // 账户列表初始化 -> 获取表格数据
        oneTwoApi(param).then((res) => {
          this.loading = false;
          if (res.errcode == 0){
            this.tableData = res.data.list;
            this.p.total = res.data.count;
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    deleteApi(value){
      var params = {
        redirect: 'x1.accountmanage.delAccount',
        id: value
      };

      oneTwoApi(params).then((res) => {
        if (res.errcode == 0){
          this.api();
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    computed: {
      ...mapGetters([
        'getTopHeight',
        'getLoadingStatus',
        'getTreeArr'
      ]),
    },
    mounted(){
      // 高度调整
      var topH = document.querySelector('.el-form--label-top').clientHeight;
      var pageH = document.querySelector('.el-pagination').clientHeight;
      this.height = window.innerHeight - this.getTopHeight - topH - pageH - 145;

      var params = {};

      // 支付方式初始化
      payMethods(params).then((res) => {
        if (res.errcode == 0) {
          this.ruleForm.payOptions = res.data;
        } else {
          this.$confirm(res.errormsg, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'error'
          })
        }
      }).catch((err) => {
        console.log(err);
      });

      // 支付通道初始化
      payMent(params).then((res) => {
        if (res.errcode == 0) {
          this.ruleForm.paymentOptions = res.data;
        } else {
          this.$confirm(res.errormsg, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'error'
          })
        }
      }).catch((err) => {
        console.log(err);
      });

      this.api();
      Hub.$emit('mountedOk','mountedOk');

    },
    destroyed(){

    }
  }
</script>

<style scoped lang="less">
  .rightContent{
    height: 100%;
  }

  .content {
    padding: 25px;
  }

  .contentMsg {
    padding: 0 0 25px 0;
  }
</style>
