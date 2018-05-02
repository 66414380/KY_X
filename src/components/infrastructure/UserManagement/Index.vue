<template>
  <div v-show="getTreeArr['列表']">

    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
      <div class="flex_es ">
        <div class="flex_r">
          <div class="margin_r_10">
            <div>
              用户姓名
            </div>
            <el-input v-model="nickname" size="small" placeholder="请输入姓名">
            </el-input>
          </div>

          <div class="margin_r_10">
            <div>
              用户手机号
            </div>
            <el-input v-model="phone" size="small" placeholder="请输入手机号">
            </el-input>
          </div>
          <div class="margin_r_10">
            <div>
              所属组织
            </div>
            <el-cascader
              size="small"
            :props="defaultProps"
            :options="dataLevel"
            v-model="selectedOptions"
            change-on-select
            clearable
            @change="handleChange">
            </el-cascader>
          </div>
          <div class="margin_r_10">
            <div>
              用户组
            </div>
            <el-select size="small" v-model="groupId" clearable filterable placeholder="请选择" @visible-change="vc">
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>

        </div>

        <el-button @click="search()" size="small">搜索</el-button>

      </div>

    </div>
    <el-table :data="userData" border :height="tableHeight" >
      <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
        width="70">
        <template slot-scope="scope">
          <div>
            {{scope.$index + 1}}
          </div>
        </template>
      </el-table-column>

      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="phone" label="用户账号"
                       width="140"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="nickname"
                       label="用户姓名"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="role"
                       label="所属角色">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.role" :key="item.id">
            {{item.name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="brand"
                       label="所属品牌"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="group"
                       label="所属用户组"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="status"
                       label="用户状态" width="100"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="320">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="editAccount(scope.row)">修改</el-button>
          <el-button size="small" @click="passWord(scope.row)" v-show="getTreeArr['修改密码']">修改密码</el-button>
          <el-button size="small" @click="showStore(scope.row)">关联门店</el-button>
          <el-button size="small" type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

    <!--弹窗编辑用户-->
    <el-dialog
      title="编辑用户"
      :visible.sync="dialogVisible"
      @close="close"
      @open="open"
      width="560px">
      <el-form ref="formRules" :model="formUserEdit" label-width="100px">
        <el-form-item label="名称:" prop="nickname" :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
          <el-input v-model="formUserEdit.nickname" placeholder="请输入内容" ></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone" :rules="{validator: checkMyPhone,required: true, trigger: 'blur'}">
          <el-input v-model="formUserEdit.phone" :maxlength="11"  placeholder="请输入手机号"></el-input>
        </el-form-item>

        <div v-for="(domain, index) in formUserEdit.billHuman" class="flex_r">
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
            <div class="m-storeCode margin_l_10" @click="addDomain3()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(formUserEdit.billHuman.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain3(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <el-form-item label="角色:">
          <el-select v-model="formUserEdit.role_id" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户组:" prop="groupId" :rules="{type:'number',required: true, message: '请选择用户组', trigger: 'change'}">
          <el-select v-model="formUserEdit.groupId" placeholder="请选择">
            <el-option
              v-for="item in groupListEdit"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <!--<el-form-item label="拥有权限:">-->
          <!--<el-button size="small" type="primary" @click="showPermission(formUserEdit.role_id)">查看</el-button>-->
        <!--</el-form-item>-->

        <el-form-item label="状态:">

          <el-switch
                     v-model="formUserEdit.status"
                     >
          </el-switch>
        </el-form-item>

        <div class="margin_t_10">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFromEdit('formRules')" >确认</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--关联门店-->
    <xo-affiliated-store ref="affiliatedStore" :uid="uid" :username="username"></xo-affiliated-store>

    <!--修改密码-->
    <xo-auth ref="auth" :id="uid"></xo-auth>

  </div>
</template>

<script>

  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {getLevel,checkPhone} from '../../utility/communApi'
  import getApi1 from '../PermissionManagement/permissionManagement.service'
  import getApi2 from '../PermissionManagement/user/user.service'
  import {mapActions, mapGetters} from 'vuex';
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
        phone: '',
        nickname: '',
        levelId:'',
        dataLevel:[],

        roleList: [],

        dialogVisible: false,

        tableHeight: 0,
        navList: [{name: "基础设置", url: ''}, {name: "权限管理", url: ''},{name: "用户管理", url: ''}],
        name: '',
        selectedOptions:[],

        userData: [],
        p: {page: 1, size: 20, total: 0},
        uid:'',
        groupList:[],
        groupListEdit:[],
        groupId:'',
        defaultProps: {
          value:'id',
          children: 'child',
          label: 'levelname'
        },

        username:'',
        formUserEdit:{
          nickname: '',
          phone: '',
          groupId:'',
          role_id:[],
          billHuman: [
            {code1: '', code2: ''}
          ],
          status: false
        },
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setTreeArr']),

      checkMyPhone(rule, value, callback){
        checkPhone(rule, value, callback)
      },
      open(){
        getApi2.getRoleList().then((res)=>{
          if(res.data.errcode === 0){
            this.roleList = res.data.data.list
          }
        });
      },
      close(){
        this.$refs['formRules'].resetFields();
      },
      removeDomain3(item) {
        let index = this.formUserEdit.billHuman.indexOf(item);
        if (index !== -1) {
          this.formUserEdit.billHuman.splice(index, 1)
        }
      },
      addDomain3() {
        this.formUserEdit.billHuman.push({code1: '', code2: ''});
      },
      showStore(row) {
        this.uid = row.id;
        this.username = row.phone;
        this.$refs.affiliatedStore.openDialog();
      },

      handleChange(value) {
       this.levelId = value[value.length -1];
        this.groupList = [];
        this.groupId =''
      },
      vc(e){
        if(e === true){
          getApi1.getGroupList({page: 1, size: 1000, total: 0},this.levelId).then((res)=>{
            if(res.data.errcode === 0){
              this.groupList = res.data.data.list
            }
          })
        }
      },
      search() {
        this.userList(this.p = {page: 1, size: 20, total: 0},this.nickname,this.phone,this.levelId,this.groupId);
      },
      passWord(row) {
        this.uid = row.id;
        this.$refs.auth.openDialog();
      },

      getPage(page) {
        this.p.page = page;
        this.userList(this.p,this.nickname,this.phone,this.levelId,this.groupId);
      },
      getPageSize(size) {
        this.p.size = size;
        this.userList(this.p,this.nickname,this.phone,this.levelId,this.groupId);
      },
      submitFromEdit(formRules){
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            //let group_id = this.$route.params.id;
            getApi2.editor(this.formUserEdit).then((res)=>{
              if(res.data.errcode === 0){
                this.dialogVisible = false;
                this.userList(this.p,this.nickname,this.phone,this.levelId,this.groupId);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      submitFrom(formRules) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {


          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      editAccount(row) {
        getApi2.userInfoById(row.id).then((res)=>{
          if(res.data.errcode === 0){
            if(res.data.data[0].status ===1) {
              res.data.data[0].status = true
            }else {
              res.data.data[0].status = false
            }
            res.data.data[0].groupId = (res.data.data[0].group_id ==='' || res.data.data[0].group_name ===null)? '' : res.data.data[0].group_id * 1;

            if(res.data.data[0].role_id === ""){
              res.data.data[0].role_id = []
            }
            if(res.data.data[0].billHuman === null){
              res.data.data[0].billHuman = [{code1: '', code2: ''}]
            }
            this.formUserEdit = res.data.data[0]
          }
        });
        getApi1.getGroupList({page: 1, size: 1000, total: 0},'').then((res)=>{
          if(res.data.errcode === 0){
            this.groupListEdit = res.data.data.list
          }
        });


        this.dialogVisible = true
      },

      del(row) {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getApi2.delBatch(row.id).then((res) => {
            if (res.data.errcode === 0) {
              this.$message({
                type: 'info',
                message: '删除成功'
              });
              this.userList(this.p,this.nickname,this.phone,this.levelId,this.groupId);
            } else {
              this.$message({
                type: 'info',
                message: res.data.data
              });
            }

          })
        }).catch(() => {
          //
        });
      },

      userList(p,nickname,phone,levelId,groupId) {
        getApi1.userList(p,nickname,phone,levelId,groupId).then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.list.forEach((data) => {
              if (data.status === 1) {
                data.status = "启用"
              } else {
                data.status = "关闭"

              }

            });
            this.userData = res.data.data.list;
            this.p.total = res.data.data.count;

          } else {

          }
        })
      },

    },
    created() {

      this.userList(this.p,this.nickname,this.phone,this.levelId,this.groupId);

      getLevel().then((res) => {
        if (res.data.errcode === 0) {
          this.dataLevel = res.data.data;
        }
      });

    },
    mounted() {
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    updated() {

    },
    destroyed() {

    }
  }
</script>

<style scoped lang="less">


</style>
