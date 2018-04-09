<template>
  <div v-show="getTreeArr['列表']">

    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_sb">
        <div class="flex_1">
          <el-button size="small" @click="addRole('新增')" v-show="getTreeArr['新增']">新增</el-button>
          <el-button size="small" type="danger" @click="del()" v-show="getTreeArr['删除']">删除</el-button>
        </div>
        <div class="flex_r">
          <el-input size="small" v-model="searchName" icon="search" placeholder="请输入角色名称">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button class="margin_l_10" size="small" @click="search()">搜索</el-button>
        </div>
      </div>

    </div>
    <el-table :data="storeData" border :height="tableHeight"  @select-all="handleSelectionChange" ref="multipleTable">
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
                       label="角色编码"
                       width="100"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name"
                       label="角色名称"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="is_use" label="是否启用"
      ></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="config(scope.row)" v-show="getTreeArr['配置权限']">配置权限</el-button>
          <el-button size="small" @click="editRole('修改',scope.row)" v-show="getTreeArr['编辑']">修改</el-button>


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
      @open="dialogOpen"
      @close="dialogClose"
      width="30%">
      <el-form ref="formRules" :model="form" label-width="100px">
        <!--<el-form-item label="编码:" prop="code">-->
        <!--<el-input v-model="form.code" placeholder="请输入内容" disabled></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="名称:" prop="name" :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>

        <el-form-item label="角色类型:" prop="typeId"
                      :rules="{type:'number',required: true, message: '请选择角色类型', trigger: 'change'}">
          <el-select v-model="form.typeId" placeholder="请选择">
            <el-option
              v-for="item in roleType"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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


        <el-form-item label="状态:">

          <el-switch
            v-model="form.status"
            on-color="#13ce66"
            off-color="#ff4949">
          </el-switch>
        </el-form-item>
        <div class="margin_t_10">
          <el-button type="primary" @click="submitFrom('formRules')">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--配置权限弹窗-->
    <el-dialog
      title="配置权限"
      :visible.sync="dialogVisible2"
      @close="roleClose"
      @open="roleOpen"
      width="100%" size="large">
      <div>
        <roleTree :data="roleList" :count=0></roleTree>
        <el-button type="primary" @click="submitRole()">确定</el-button>
        <el-button @click="dialogVisible2 = false">取消</el-button>

      </div>
    </el-dialog>

  </div>
</template>

<script>

  import {getScrollHeight} from '../../utility/getScrollHeight'
  import getApi from './roleManagement.service'
  import ElButton from "element-ui/packages/button/src/button";
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components: {
      ElButton,
      roleTree: {
        name: 'roleTrees',
        props: ['data', 'count'],
        template: `
            <div >
              <div v-for='(item,index) in data' :style="{'margin-left': count +20 + 'px'}" style="line-height: 35px;">
                <div class="flex_r">

                  <el-checkbox v-model="item.selected" @change="()=>changeTree(item)">{{item.name}}</el-checkbox>

                  <div  style="margin-left: 50px;">

                    <div class="margin_r_10" style="display: inline-block" v-for="(item1,index) in item.arr">
                      <el-checkbox v-model="item1.selected" @change="()=>cell(item1,item)">{{item1.name}}</el-checkbox>
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
          recurParent(list,pid,parent){
            list.forEach((item) => {
              if(item.id === pid){
                item.selected = true;
                if(parent.$parent.data){
                  this.recurParent(parent.$parent.data,item.pid,parent.$parent)
                }
              } else {
                //item.selected = false
              }
            });
          },
          cell(item1,item) {
          let listTemp = item.arr.filter((data)=>{
              return data.selected === true
            });
            if(listTemp.length > 0){
              item.selected = true
            } else {
              item.selected = false
            }
            if(this.$parent.data){
              this.recurParent(this.$parent.data,item.pid,this.$parent)
            }

          },

          changeTree(item) {
            if (item.selected === true) {
              this.recur(item, true)
            } else {
              this.recur(item, false)
            }
            if(this.$parent.data){
              this.recurParent(this.$parent.data,item.pid,this.$parent)
            }
          },
          recur(data, bool) {
            if(data.selected === true){
              data.arr.forEach((item)=>{
                item.selected = true
              })
            }else {
              data.arr.forEach((item)=>{
                item.selected = false
              })
            }


            // data.children.forEach((map) => {
            //   if (map.children) {
            //     this.$set(map, "selected", bool);
            //     this.recur(map, bool)
            //   }
            // })
          },

        }
      }
    },
    data() {
      return {
        add1: '',
        del1: '',
        edit1: '',
        find1: '',
        roleList: [],
        form: {
          name: '',
          status: true,
          typeId: '',
          thirdCode: [
            {code1: '', code2: ''}
          ],
        },
        dialogVisible: false,
        dialogVisible2: false,
        tableHeight: 0,
        navList: [{name: "基础设置", url: ''}, {name: "角色管理", url: ''}],
        name: '',
        selectedAll: false,
        roleType:[],
        storeData: [],
        p: {page: 1, size: 20, total: 0},
        roleId:'',
        searchName:'',
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setTreeArr']),
      handleChecked(data) {
        let list =  this.storeData.filter((item)=>{
          return item.select === true
        });
        if (list.length === this.storeData.length) {
          list.forEach((item)=>{
            this.$refs.multipleTable.toggleRowSelection(item)
          })
        }else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        if(val.length === this.storeData.length){
          this.storeData.forEach((map) => {
            this.$set(map, 'select', true)
          });
        }else {
          this.storeData.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },
      search(){
        if(this.searchName === ''){
          this.showRoleList(this.p = {page: 1, size: 20, total: 0})
        }else {
          this.showRoleList(this.p = {page: 1, size: 20, total: 0},this.searchName)
        }
      },
      recurRoleOk(list,list1){
        list.forEach((item) => {
          if (item.selected === true) {
            list1.push(item.id)
          }
          item.arr.forEach((item1) => {
            if (item1.selected === true) {
              list1.push(item1.id)
            }
          });
          this.recurRoleOk(item.children,list1)
        });

      },
      submitRole() {
        let list1 = [];

        this.recurRoleOk(this.roleList,list1);

        getApi.saveRolePower(this.roleId,list1).then((res)=>{

          this.dialogVisible2 = false
        })

      },
      getPage(page) {
        this.p.page = page;
        this.showRoleList(this.p,this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showRoleList(this.p,this.searchName);
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
      dialogOpen() {
        if(this.name === "新增"){
          this.form = {
            name: '',
            status: true,
            typeId: '',
            thirdCode: [
              {code1: '', code2: ''}
            ],
          };

        }

      },
      dialogClose(){
        this.$refs['formRules'].resetFields();
      },
      submitFrom(formRules) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            if(this.name === "新增"){
              getApi.saveRole(this.form).then((res) => {
                if (res.data.errcode === 0) {
                  this.showRoleList(this.p = {page: 1, size: 20, total: 0});
                  this.dialogVisible = false
                }
              })
            } else {
              getApi.saveRoleEdit(this.form).then((res)=>{
                if (res.data.errcode === 0) {
                  this.showRoleList(this.p);
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
      addRole(name) {
        this.name = name
        this.dialogVisible = true
      },
      handle() {


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

      config(row) {
        this.roleId = row.id;
        this.dialogVisible2 = true;
        getApi.rolePower(row.id).then((res) => {
          if (res.data.errcode === 0) {
            this.recurRole(res.data.data);
            this.roleList = res.data.data;
          }
        })
      },
      editRole(name,row) {
        this.name = name;
        getApi.roleInfo(row.id).then((res)=>{
          if(res.data.errcode === 0){
            if(res.data.data.status === 1){
              res.data.data.status = true
            }else {
              res.data.data.status = false
            }
            if(res.data.data.thirdCode.length === 0){
              res.data.data.thirdCode = [{code1: '', code2: ''}]
            }
            this.form = res.data.data
          }
        });

        this.dialogVisible = true
      },
      del() {

        let list = [];
        this.storeData.forEach((item) => {
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
            getApi.delRole(list.join(",")).then((res) => {
              if(res.data.errcode === 0){
                this.$message({
                  type: 'info',
                  message: '删除成功'
                });
                this.showRoleList(this.p = {page: 1, size: 20, total: 0});
              }

            })

          }).catch(() => {
            //
          });
        }
      },

      showRoleList(p,name = "") {
        getApi.getRoleList(p,name).then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.list.forEach((data) => {
              data.select = false;

              if (data.is_use === 1) {
                data.is_use = "启用"
              } else {
                data.is_use = "关闭"

              }

            });
            this.storeData = res.data.data.list;
            this.p.total = res.data.data.count;
          }else {

          }
        })
      }
    },
    created() {
      this.showRoleList(this.p);
      getApi.roleType().then((res)=>{
        this.roleType = res.data.data
      })
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
    destroyed(){

    }
  }
</script>

<style scoped lang="less">



</style>
