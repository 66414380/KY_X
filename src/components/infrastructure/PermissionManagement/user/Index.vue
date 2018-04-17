<template>
  <div>
    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">
        <div>
          <div>

            <el-button size="small" type="text" @click="$router.go(-1)"> 返回用户组</el-button>
            <el-button size="small" @click="addAccount('添加用户')" v-show="getTreeArr['新增用户']">添加用户</el-button>
            <!--<el-button size="small" @click="showStore()">关联门店</el-button>-->
            <el-button size="small" @click="isSwitch()" v-show="getTreeArr['批量开启、关闭用户']">批量开启/关闭</el-button>

          </div>
        </div>

      </div>
    </div>

    <el-table :data="userList" border :height="tableHeight" v-show="getTreeArr['用户列表']" @select-all="handleSelectionChange" ref="multipleTable">
      <el-table-column
        header-align="center" align="center"
        type="selection"
        label-class-name="mySelect"
        width="100">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id"
                       label="编码"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="phone"
                       label="用户账号/手机号"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="nickname"
                       label="用户姓名"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="status"
                       label="状态"></el-table-column>

      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="role_id"
                       label="关联角色">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.role_id">
            <div v-for="(item1,index) in roleList">
              <div v-if="item === item1.id">
                {{item1.name}}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="360">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="showStore(scope.row)" v-show="getTreeArr['关联门店']">关联门店</el-button>
          <el-button size="small" @click="editAccount('查看',scope.row)" v-show="getTreeArr['查看用户详情']">查看</el-button>
          <el-button size="small" @click="editAccount('编辑用户',scope.row)" v-show="getTreeArr['编辑用户']">编辑</el-button>
          <el-button size="small" @click="passWord(scope.row)" >修改密码</el-button>
          <el-button size="small" type="danger" @click="del(scope.row)" v-show="getTreeArr['删除用户']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <!--<xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>-->
    </footer>


    <!--新增用户-->

    <el-dialog
      :title="userName"
      @open="dialogOpen"
      @close="dialogClose"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="formRules" :model="formUser" label-width="100px">

        <el-form-item label="名称:" prop="nickname" :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
          <el-input v-model="formUser.nickname" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone" :rules="{validator: checkMyPhone,required: true,  trigger: 'blur'}">
          <el-input v-model="formUser.phone" :maxlength="11"  placeholder="请输入手机号"></el-input>
        </el-form-item>
        <div v-for="(domain, index) in formUser.billHuman" class="flex_r">
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
            <div class="m-storeCode margin_l_10" @click="addDomain2()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(formUser.billHuman.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain2(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <el-form-item label="状态:">

          <el-switch
            v-model="formUser.status"
            on-color="#13ce66"
            off-color="#ff4949">
          </el-switch>
        </el-form-item>

        <div class="margin_t_10">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFromAdd('formRules')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--编辑用户-->
    <el-dialog
      :title="userName"

      :visible.sync="dialogVisible3"
      width="50%">
      <el-form ref="formRules3" :model="formUserEdit" label-width="100px">

        <el-form-item label="名称:" prop="nickname" :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
          <el-input v-model="formUserEdit.nickname" placeholder="请输入内容" :disabled="showDetail"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone" :rules="{validator: checkMyPhone,required: true, trigger: 'blur'}">
          <el-input v-model="formUserEdit.phone" :maxlength="11"  placeholder="请输入手机号" :disabled="showDetail"></el-input>
        </el-form-item>


        <div v-for="(domain, index) in formUserEdit.billHuman" class="flex_r">
          <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.code1" :disabled="showDetail" placeholder="请输入第三方名称"></el-input>
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
                    <el-input v-model="domain.code2" :disabled="showDetail" placeholder="请输入第三方编码"></el-input>
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
          <el-select v-model="formUserEdit.role_id" multiple placeholder="请选择" :disabled="showDetail">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="用户组:">
          <el-select v-model="formUserEdit.groupId" placeholder="请选择" :disabled="showDetail">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="拥有权限:">
          <el-button size="small" type="primary" @click="showPermission(formUserEdit.role_id)">查看</el-button>
        </el-form-item>

        <el-form-item label="状态:">

          <el-switch :disabled="showDetail"
            v-model="formUserEdit.status"
            on-color="#13ce66"
            off-color="#ff4949">
          </el-switch>
        </el-form-item>

        <div class="margin_t_10">
          <el-button @click="dialogVisible3 = false">取消</el-button>
          <el-button type="primary" @click="submitFromEdit('formRules3')" :disabled="showDetail">确认</el-button>
        </div>
      </el-form>
    </el-dialog>


    <!--查看权限-->
    <el-dialog
      title=""
      :visible.sync="dialogVisible1"
      width="100%" size="large">
      <!--<el-table :data="storeData1" border>-->
        <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="x" width="120"-->
                         <!--label="模块"></el-table-column>-->
        <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="operation"-->
                         <!--label="操作权限">-->
          <!--<template slot-scope="scope">-->
            <!--<el-checkbox v-for="(item,index) in scope.row.operation" v-model="item.is">{{item.name}}</el-checkbox>-->
          <!--</template>-->

        <!--</el-table-column>-->
      <!--</el-table>-->

      <roleTree :data="showRoleList" :count=0></roleTree>

    </el-dialog>



    <!--开启/关闭-->
    <el-dialog
      title="开启/关闭"
      :visible.sync="dialogVisible4"
      width="50%" size="tiny">
      <el-switch
        v-model="storeStatusValue"
        on-color="#13ce66"
        off-color="#ff4949">
      </el-switch>
      <div class="margin_t_10">
        <el-button @click="dialogVisible4 = false">取消</el-button>
        <el-button type="primary" @click="changeStoresStatus()">确认</el-button>
      </div>
    </el-dialog>

    <!--关联门店-->
    <xo-affiliated-store ref="affiliatedStore" :uid="uid" :username="username"></xo-affiliated-store>
    <!--修改密码-->
    <xo-auth ref="auth" :id="uid"></xo-auth>

  </div>
</template>

<script>
  import {checkPhone} from '../../../utility/communApi'
  import {getScrollHeight} from '../../../utility/getScrollHeight'
  import getApi from './user.service'
  import getApi1 from '../permissionManagement.service'
  import { mapActions,mapGetters } from 'vuex';
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr'
      ]),
    },
    components: {

      roleTree: {
        name: 'roleTrees',
        props: ['data', 'count'],
        template: `
            <div>
              <div v-for='(item,index) in data' :style="{'margin-left': count +20 + 'px'}" style="line-height: 35px;">
                <div class="flex_r">
                  <el-checkbox v-model="item.selected" disabled>{{item.name}}</el-checkbox>

                  <div  style="margin-left: 50px">

                    <div class="margin_r_10" style="display: inline-block" v-for="(item1,index) in item.arr">
                      <el-checkbox v-model="item1.selected" disabled>{{item1.name}}</el-checkbox>
                    </div>

                  </div>

                </div>
                <roleTrees :data='item.children'  :count='count' class="heightTran"></roleTrees>
            </div>
            </div>
        `,
        data() {
          return {}
        },
        methods: {
        }
      }
    },
    data() {
      return {
        levelId:'',//结构ID
        searchName:'',

        storeStatusValue: false,
        dialogVisible: false,
        dialogVisible1: false,

        dialogVisible3:false,
        dialogVisible4:false,

        tableHeight: 0,
        navList: [{name: "基础设置", url: ''}, {name: "权限管理", url: ''}],
        groupList:[],
        storeName: '',
        storeData1: [
          {x: 'x1', operation: [{name: '列表', is: true}, {name: '删除', is: false}, {name: '编辑', is: false}]},
          {x: 'x2', operation: [{name: '列表', is: true}, {name: '删除', is: true}, {name: '编辑', is: true}]}
        ],
        userList: [],
        roleList: [],
        showRoleList:[],
        levelName: '款易',
        p: {page: 1, size: 20, total: 0},
        formUser: {
          nickname: '',
          phone: '',
          billHuman: [
            {code1: '', code2: ''}
          ],
          status:false
        },
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
        userName: '',
        showDetail:true,

        storeList:[],
        selectedOptions:[],
        uid:'',
        username:'',
      }
    },
    watch: {},
    methods: {
      checkMyPhone(rule, value, callback){
        checkPhone(rule, value, callback)
      },
      passWord(row){
        this.uid = row.id;
        this.$refs.auth.openDialog();
      },

      handleChecked(data) {
        let list =  this.userList.filter((item)=>{
          return item.select === true
        });
        if (list.length === this.userList.length) {
          list.forEach((item)=>{
            this.$refs.multipleTable.toggleRowSelection(item)
          })
        }else {
          this.$refs.multipleTable.clearSelection();
        }

      },
      handleSelectionChange(val) {
        if(val.length === this.userList.length){
          this.userList.forEach((map) => {
            this.$set(map, 'select', true)
          });
        }else {
          this.userList.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },


      isSwitch() {
        this.storeStatusValue = false;
        let list = [];
        this.userList.forEach((item) => {
          if (item.select) {
            list.push(item.id)
          }
        });

        if (list.length === 0) {
          this.$message('请勾选门店');
        } else {
          this.dialogVisible4 = true
        }
      },
      //批量状态设置
      changeStoresStatus() {
        let type,list = [];
        if (this.storeStatusValue) {
          type = "on"
        } else {
          type = "off"
        }
        this.userList.forEach((item) => {
          if (item.select) {
            list.push(item.id)
          }
        });
        getApi.settingBatch(list.join(','),type).then((res) => {
          if (res.data.errcode === 0) {
            this.$message('操作成功');
            this.getUserFromGroup();
            this.dialogVisible4 = false
          }
        })
      },

      submitFromEdit(formRules){
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            //let group_id = this.$route.params.id;
            getApi.editor(this.formUserEdit).then((res)=>{
              if(res.data.errcode === 0){
                this.dialogVisible3 = false;
                this.getUserFromGroup();
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitFromAdd(formRules){
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            let levelId = this.$route.params.levelId;
            let group_id = this.$route.params.id;
              getApi.newlyAddAccount(this.formUser,levelId,group_id).then((res)=>{
                if(res.data.errcode === 0){
                  this.dialogVisible = false;
                  this.getUserFromGroup();
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      showStore(row) {
        this.uid = row.id;
        this.username = row.username;
        this.$refs.affiliatedStore.openDialog();
      },

      recurRole(list) {
        list.forEach((item) => {
          if (item.is_select === 0) {
            item.selected = false
          } else {
            item.selected = true
          }

          item.arr.forEach((item1) => {
            if (item1.is_select === 0) {
              item1.selected = false
            } else {
              item1.selected = true
            }
          })
          this.recurRole(item.children)
        });
      },
      showPermission(role_id) {
        this.dialogVisible1 = true;

        getApi.rolePower(role_id.join(',')).then((res) => {
          if (res.data.errcode === 0) {
            this.recurRole(res.data.data);
            this.showRoleList = res.data.data;
          }
        })

      },

      dialogOpen(){
        this.formUser = {
          nickname: '',
          phone: '',
          billHuman: [
            {code1: '', code2: ''}
          ],
          status:false
        };
      },
      dialogClose() {

        this.$refs['formRules'].resetFields();
      },
      addAccount(name) {
        this.userName = name;
        this.dialogVisible = true
      },

      editAccount(name,row) {
        if(name === '查看'){
          this.showDetail = true
        } else {
          this.showDetail = false
        }

        this.userName = name;
        getApi.userInfoById(row.id).then((res)=>{
          if(res.data.errcode === 0){
            if(res.data.data[0].status ===1) {
              res.data.data[0].status = true
            }else {
              res.data.data[0].status = false
            }
            res.data.data[0].groupId = res.data.data[0].group_id * 1;
            this.formUserEdit = res.data.data[0]
          }
        });

        this.dialogVisible3 = true
      },


      removeDomain2(item) {
        let index = this.formUser.billHuman.indexOf(item)
        if (index !== -1) {
          this.formUser.billHuman.splice(index, 1)
        }
      },
      addDomain2() {
        this.formUser.billHuman.push({code1: '', code2: ''});
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


      del(row) {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getApi.delBatch(row.id).then((res) => {
            if (res.data.errcode === 0) {
              this.$message({
                type: 'info',
                message: '删除成功'
              });
              this.getUserFromGroup();
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

      getPage(page) {
        this.p.page = page;
        //this.getBsList();
      },
      getPageSize(size) {
        this.p.size = size;
        //this.getBsList();
      },

      getUserFromGroup(){
        let id = this.$route.params.id;
        getApi.getUserFromGroup(id).then((res)=>{
          for(let item of res.data.data.list){
            if(item.status === 1){
              item.status = "开启"
            }else {
              item.status = "关闭"
            }
            item.select = false
          }
          this.userList = res.data.data.list;
        })
      },

    },
    created() {


      this.getUserFromGroup();

      getApi.getRoleList().then((res)=>{
        if(res.data.errcode === 0){
          this.roleList = res.data.data.list
        }
      });

      getApi1.getGroupList({page: 1, size: 1000, total: 0},this.$route.params.levelId).then((res)=>{
        if(res.data.errcode === 0){
          this.groupList = res.data.data.list
        }
      })

    },
    mounted() {

    },
    updated() {
      getScrollHeight().then((h) => {
        this.tableHeight = h;
      })
    },
    destroyed() {

    }
  }
</script>

<style lang="less" scoped>


</style>
