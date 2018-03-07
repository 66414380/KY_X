<template>
  <div v-show="getTreeArr['列表']">

    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_sb">
        <div class="flex_1">
          <el-button size="small" @click="addPay('新增')" v-show="getTreeArr['新增']">新增</el-button>
          <!--<el-button size="small" type="danger" @click="del()">删除</el-button>-->
        </div>
        <div class="flex_r">
          <el-input size="small" v-model="searchName" icon="search" placeholder="请输入支付方式名称">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button class="margin_l_10" size="small" @click="search()">搜索</el-button>
        </div>
      </div>

    </div>
    <el-table :data="paymentList" border :height="tableHeight">
      <el-table-column  label-class-name="table_head" header-align="center" align="center" width="80" label="序号">
        <template slot-scope="scope">
          {{scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id"
                       label="支付方式编码"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="thirdCode"
                       label="第三方编码">

        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.thirdCode">{{item.code1}} {{item.code2}}</div>
        </template>
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="支付方式名称"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="payment" label="基础支付方式"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="small" @click="editPay('编辑',scope.row)" v-show="getTreeArr['编辑']">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>


    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

    <!--弹窗新增角色/修改角色-->
    <el-dialog
      :title="name"
      :visible.sync="dialogVisible"
      @close="dialogClose"
      width="30%">
      <el-form ref="formRules" :model="form" label-width="120px">


        <el-form-item label="支付方式名称:" prop="name" :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
          <el-input v-model="form.name" placeholder="请输入内容"></el-input>
        </el-form-item>

        <!--<el-form-item label="支付方式编码:" prop="code" >-->
          <!--<el-input v-model="form.code" placeholder="请输入内容" disabled></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="关联支付方式:" prop="paymentId">
          <el-radio class="radio" v-model="form.paymentId" :label=1>微信</el-radio>
          <el-radio class="radio" v-model="form.paymentId" :label=2>支付宝</el-radio>
        </el-form-item>

        <div v-for="(domain, index) in form.thirdCode" class="flex_r">
          <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.code1" placeholder="请输入第三方名称"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="m-rank">
            <div class="m-rank-child"></div>
          </div>
          <el-form-item label-width="0" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.code2" placeholder="请输入第三方编码"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="flex_a" style="margin-bottom: 22px">
            <div class="m-storeCode margin_l_10" @click="addDomain()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(form.thirdCode.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <div class="margin_t_10">
          <el-button type="primary" @click="submitFrom('formRules')">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>



  </div>
</template>

<script>

  import {getScrollHeight} from '../../utility/getScrollHeight'
  import getApi from './paymentManagement.service'
  import ElButton from "element-ui/packages/button/src/button";

  import { mapActions,mapGetters } from 'vuex';
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr'
      ]),
    },
    components: {},
    data() {
      return {
        add1: '',
        del1: '',
        edit1: '',
        find1: '',
        roleList: [],
        form: {
          name: '',
          paymentId:'',
          thirdCode: [
            {code1: '', code2: ''}
          ],
        },
        dialogVisible: false,
        tableHeight: 0,
        navList: [{name: "基础设置", url: ''}, {name: "支付管理", url: ''}],
        name: '',
        selectedAll: false,
        roleType:[],
        paymentList: [],
        p: {page: 1, size: 20, total: 0},
        roleId:'',
        searchName:''
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setTreeArr']),
      search(){
        if(this.searchName === ''){
          this.getPaymentList(this.p = {page: 1, size: 20, total: 0})
        }else {
          this.getPaymentList(this.p = {page: 1, size: 20, total: 0},this.searchName)
        }
      },
      getPage(page) {
        this.p.page = page;
        this.getPaymentList(this.p,this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.getPaymentList(this.p,this.searchName);
      },
      roleOpen() {

      },
      roleClose() {
        this.roleList = []

      },
      removeDomain(item) {
        var index = this.form.thirdCode.indexOf(item)
        if (index !== -1) {
          this.form.thirdCode.splice(index, 1)
        }
      },
      addDomain() {
        this.form.thirdCode.push({code1: '', code2: ''});
      },
      dialogClose() {
        this.form = {
          name: '',
          paymentId:'',
          thirdCode: [
            {code1: '', code2: ''}
          ],
        };
        this.$refs['formRules'].resetFields();
      },
      submitFrom(formRules) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            if(this.name === "新增"){
              getApi.addPayment(this.form).then((res) => {
                if (res.data.errcode === 0) {
                  this.getPaymentList(this.p = {page: 1, size: 20, total: 0});
                  this.dialogVisible = false
                }
              })
            } else {
              getApi.editPayment(this.form).then((res)=>{
                if (res.data.errcode === 0) {
                  this.getPaymentList(this.p);
                  this.dialogVisible = false
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      addPay(name) {
        this.name = name
        this.dialogVisible = true
      },

      editPay(name,row) {
        this.name = name;
        getApi.paymentInfo(row.id).then((res)=>{

          if(res.data.errcode === 0){
            this.form = res.data.data
          }
        });
        this.dialogVisible = true
      },
      del() {

        let list = [];
        this.paymentList.forEach((item) => {
          if (item.select) {
            list.push(item.id)
          }
        });
        if (list.length === 0) {
          this.$message('请勾选角色');
        } else {
          this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // getApi.delRole(list.join(",")).then((res) => {

            //   if(res.data.errcode === 0){
            //     this.$message({
            //       type: 'info',
            //       message: '删除成功'
            //     });
            //     this.getPaymentList(this.p = {page: 1, size: 20, total: 0});
            //   }
            //
            // })

          }).catch(() => {
            //
          });
        }

      },

      getPaymentList(p,name = "") {
        getApi.getPaymentList(p,name).then((res) => {
          if (res.data.errcode === 0) {

            this.paymentList = res.data.data.list;
            this.p.total = res.data.data.count
          }else {
            // this.$alert('请重新登录', '超时', {
            //   confirmButtonText: '确定',
            //   callback: action => {
            //     this.$router.push('/login')
            //   }
            // })
          }
        })
      }
    },
    created() {

      this.getPaymentList(this.p)

    },
    mounted() {

    },
    updated() {
      getScrollHeight().then((h) => {
        this.tableHeight = h;
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
