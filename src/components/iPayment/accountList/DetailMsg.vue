<template>
  <div id="detailMsg">
    <el-form :inline="true" :model="ruleForm" class="demo-form-inline" :label-position="'top'">

      <el-form-item label="支付方式">
        <el-select v-model="ruleForm.payMethod" placeholder="全部">
          <el-option
            v-for="item in ruleForm.payOptions"
            :key="item.id"
            :label="item.memo"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="支付通道">
        <el-select v-model="ruleForm.Payment" placeholder="全部">
          <el-option
            v-for="item in ruleForm.paymentOptions"
            :key="item.id"
            :label="item.memo"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="账号名称">
        <el-input v-model="ruleForm.user" placeholder=""></el-input>
      </el-form-item>

      <el-form-item style="vertical-align: bottom">
        <el-button @click="search">搜索</el-button>
      </el-form-item>

      <el-form-item style="vertical-align: bottom">
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>

      <el-form-item style="vertical-align: bottom">
        <router-link to="/iPayment/accountList/account">
          <el-button type="primary" icon="edit">新增账号</el-button>
        </router-link>
      </el-form-item>

    </el-form>

    <el-table
      :data="tableData"
      :height="height"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column
        label="序号"
        width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.acountCode }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="账户编号"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.accountNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="账户名称"
        width="180"
      >
        <template slot-scope="scope">
          <el-row>
            <el-col :span="18">
              <el-input v-model="scope.row.accountName" placeholder=""></el-input>
            </el-col>
            <el-col :span="5" :offset="1" style="line-height: 36px">
              <el-button
                size="small"
                type="primary"
                @click="handleDelete(scope.$index, scope.row)">保存
              </el-button>
            </el-col>

          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="支付通道">
        <template slot-scope="scope">
          <div v-for="item in scope.row.paymentName">{{ item }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="查看">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p v-if="scope.row.count">序号: {{ scope.row.count }}</p>
            <p v-if="scope.row.accountNum">账号编号: {{ scope.row.accountNum }}</p>
            <p v-if="scope.row.account">账号名称: {{ scope.row.account }}</p>
            <p v-if="scope.row.payment">支付通道: {{ scope.row.payment }}</p>
            <p v-if="scope.row.status">状态: {{ scope.row.status }}</p>
            <p v-if="scope.row.lastEdit">最后编辑人: {{ scope.row.lastEdit }}</p>
            <p v-if="scope.row.lastDate">最后编辑事件: {{ scope.row.lastDate }}</p>
            <p v-if="scope.row.useStore">使用中的门店: {{ scope.row.useStore }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag>查看</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  import {mapGetters, mapActions} from 'vuex'
  import {oneTwoApi, payMethods, payMent} from '@/api/api.js'

  export default {
    data() {
      return {
        ruleForm: {
          payMethod: '', // 支付方式
          payOptions: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }
          ],  // 支付方式

          Payment: '', // 支付通道
          paymentOptions: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }
          ],  // 支付通道

          user: ''  // 用户名
        },
        tableData: [{
          count: 1,
          accountNum: 11233,
          account: '支付宝',
          payment: '易极付',
          status: '开户成功',
          thirdPartCode: '美团-89898989',
          lastEdit: '王小虎',
          lastDate: '2016-05-04 04:33:23',
          useStore: '天河一店 天河二店'
        }, {
          count: 1,
          accountNum: 11233,
          account: '支付宝',
          payment: '易极付',
          status: '开户成功',
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          count: 1,
          accountNum: 11233,
          account: '支付宝',
          payment: '易极付',
          status: '开户成功',
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          count: 1,
          accountNum: 11233,
          account: '支付宝',
          payment: '易极付',
          status: '开户成功',
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        height: 0,
        loading: true
      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index,1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      onSubmit() {
        console.log('submit!');
      },
      search() {
        // 账户列表 -> 搜索
        var param = {
          redirect: 'x1.accountmanage.accountList',
          paymentMethod: '',
          paymentChannel: '',
          accountName: '',
          page: '',
          pagesize: ''
        };

        // 账户列表初始化 -> 获取表格数据
        oneTwoApi(param).then((res) => {
          this.loading = false;
          if (res.errcode == 0){
            this.tableData = res.data.list;
            console.log(res);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      save() {
        console.log('save');
      },
      api(){
        var param = {
          redirect: 'x1.accountmanage.accountList',
          paymentMethod: '',
          paymentChannel: '',
          accountName: '',
          page: '',
          pagesize: ''
        };

        // 账户列表初始化 -> 获取表格数据
        oneTwoApi(param).then((res) => {
          this.loading = false;
          if (res.errcode == 0){
            this.tableData = res.data.list;
            console.log(res);
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    computed: {
      ...mapGetters([
        'getTopHeight',
        'getLoadingStatus'
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

    }
  }
</script>
<style scoped lang="less">
  div.cell {
    text-align: center;
  }
</style>

