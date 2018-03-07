<template>

  <div v-show="getTreeArr['列表']">
    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>

    <div :style="{height:tableHeight + 'px'}">
      <el-tabs v-model="activeName" @tab-click="handleClick" >
        <el-tab-pane label="待激活" name="1">

          <el-table :data="storeData" border >

            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id"
                             label="序号"
                             width="80">
              <template slot-scope="scope">
                <div>{{scope.$index + 1}}</div>
              </template>
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="companyName"
                             label="商户名称"></el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="userPhone"
                             label="注册账号"></el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center"  width="100"
                             label="证件资料">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="show(scope.row.id)" v-show="getTreeArr['查看']">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="addTime"
                             label="提交时间"></el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="statusFormate"
                             label="状态"></el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center"
                             label="操作" width="160">
              <template slot-scope="scope">
                <div v-show="getTreeArr['审核']">
                  <div v-show="scope.row.status !== 2">
                    <el-button size="small" type="primary" @click="activate(scope.row.id)">激活</el-button>
                    <el-button size="small" @click="reject(scope.row.id)">驳回</el-button>
                  </div>
                  <div v-show="scope.row.status === 2">
                    <el-button size="small" type="primary" @click="activate(scope.row.id)">重新激活</el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>


        </el-tab-pane>

        <el-tab-pane label="已激活" name="2">

          <el-table :data="storeData" border class="flex_1">

            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id"
                             label="序号"
                             width="80">
              <template slot-scope="scope">
                <div>{{scope.$index + 1}}</div>
              </template>
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="companyName"
                             label="商户名称"></el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="userPhone"
                             label="注册账号"></el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center"  width="100"
                             label="证件资料">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="show(scope.row.id)" v-show="getTreeArr['查看']">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="addTime"
                             label="提交时间"></el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="statusFormate"
                             label="状态"></el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center"
                             label="操作" width="160">
              <template slot-scope="scope">

              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>


    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

    <!--激活-->
    <el-dialog
      title="将此商户放入至"
      :visible.sync="dialogVisible1"
      width="50%" size="tiny">
      <div class="flex flex_d_c">
        <div v-for="(item,index) in agentList" :key="item.levelId"  class=" margin_b_10">
          <el-button :plain="true" type="info" style="width: 250px" @click="handleAgent(item.levelId)">{{item.levelName}}</el-button>
        </div>

      </div>

    </el-dialog>

    <!--驳回-->
    <el-dialog
      title=""
      :visible.sync="dialogVisible2"
      width="50%" size="tiny" @close="close2">
      <el-form ref="formRules" :model="rejectForm" label-width="100px">
        <el-form-item label="驳回原因:" prop="text" :rules="{required: true, message: '请输入内容', trigger: 'blur'}">
          <el-input v-model="rejectForm.text" type="textarea" :rows="5" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>

      <div class="margin_t_10">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="rejectSubmit('formRules')">确认</el-button>
      </div>
    </el-dialog>

    <!--查看-->
    <el-dialog
      title="查看证件资料"
      :visible.sync="dialogVisible"
      width="50%" @close="close">

      <div class="flex_j">
        <el-form label-width="120px" class="myBusiness">
          <el-form-item label="营业执照" class="">
            <div class="flex_r" style="align-items: flex-end">
              <img class="avatar-uploader-icon" :src="registInfo.businessImg">
              <a class="margin_l_10 pointer" :href="registInfo.businessImg" :download="registInfo.businessImg">下载图片</a>
            </div>
          </el-form-item>

          <el-form-item label="组织机构代码证" class="">
            <div class="flex_r" style="align-items: flex-end">
              <img class="avatar-uploader-icon" :src="registInfo.organizationImg">
              <a class="margin_l_10 pointer" :href="registInfo.organizationImg" :download="registInfo.organizationImg">下载图片</a>
            </div>
          </el-form-item>

          <el-form-item label="开户许可证" class="">
            <div class="flex_r" style="align-items: flex-end">
              <img class="avatar-uploader-icon" :src="registInfo.accountOpeningPermit">
              <a class="margin_l_10 pointer" :href="registInfo.accountOpeningPermit" :download="registInfo.accountOpeningPermit">下载图片</a>
            </div>
          </el-form-item>

          <el-form-item label="税务登记证" class="">
            <div class="flex_r" style="align-items: flex-end">
              <img class="avatar-uploader-icon" :src="registInfo.taxRegistrationCertificate">
              <a class="margin_l_10 pointer" :href="registInfo.taxRegistrationCertificate" :download="registInfo.taxRegistrationCertificate">下载图片</a>
            </div>
          </el-form-item>

        </el-form>
      </div>


    </el-dialog>

  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import getApi from './businessList.service';
  import Hub from '../../utility/commun'
  import { mapActions,mapGetters } from 'vuex';
  export default {
    components: {},
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    data() {
      return {
        navList: [{name: "商户资料核实", url: ''}, {name: "商户审核", url: ''}],
        activeName: '1',
        tableHeight: 0,
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2: false,
        storeData: [],
        registInfo:{},
        agentList:[],
        id:'',
        rejectForm: {text: ''},
        p: {page: 1, size: 20, total: 0},
      }
    },
    methods: {
      handleAgent(levelId){
        getApi.checkRegist(this.id,1,levelId).then((res)=>{
          if(res.data.errcode === 0){
            this.$message('操作成功');
            this.dialogVisible1 = false;
            this.showResouce(this.p, this.activeName)
          }
        })

      },
      close(){
        this.registInfo = {};
        this.id = ''
      },
      close2(){
        this.$refs['formRules'].resetFields();
        this.id = ''
      },
      handleClick(tab, event) {
        this.storeData = [];
        this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.activeName)
      },
      rejectSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            getApi.checkRegist(this.id,2,this.rejectForm.text).then((res)=>{
              if(res.data.errcode === 0){
                this.$message('操作成功');
                this.dialogVisible2 = false;
                this.showResouce(this.p, this.activeName)
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      show(id) {
        getApi.companyRegistInfo(id).then((res)=>{
          if(res.data.errcode === 0){
            this.dialogVisible = true;
            this.registInfo = res.data.data
          }
        })

      },
      activate(id) {
        this.id = id;
        getApi.getAgentList().then((res)=>{
          if(res.data.errcode === 0){
            this.dialogVisible1 = true;
            this.agentList = res.data.data.list
          }
        });


      },
      reject(id) {
        this.id = id;
        this.dialogVisible2 = true
      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p, this.activeName)
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p, this.activeName)
      },

      showResouce(p,activeName){
        getApi.companyRegistList(p,activeName).then((res)=>{
          if(res.data.errcode === 0){
            this.storeData = res.data.data.list;
            this.p.total = res.data.data.count
          }
        })
      },
    },

    created() {
      this.showResouce(this.p, this.activeName)
    },
    mounted(){
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

</style>
