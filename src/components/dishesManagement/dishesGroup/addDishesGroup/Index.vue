<template>
  <div id="newPayment">
    <div class="contentMsg">
      <xo-nav-path :navList="navList"></xo-nav-path>
    </div>
    <div class="contentMsg">
      <el-card>
        <el-row>
          <el-col :span="24" style="border-bottom: 1px solid gainsboro">
            <h3 style="margin-bottom: 10px;">新增菜品组</h3>
          </el-col>

          <el-col :span="24" class="cell">
            <el-form ref="formRules" :model="form" label-width="100px">

              <el-form-item label="菜品组名称	:" prop="name" :rules="{required: true, message: '请输入菜品组名称', trigger: 'blur'}">
                <el-input v-model="form.name" placeholder="请输入内容"></el-input>
              </el-form-item>

              <el-form-item label="菜品组备注	:" >
                <el-input v-model="form.remark" placeholder="请输入内容"></el-input>
              </el-form-item>

              <div v-for="(domain, index) in form.thirdPartyCoding" class="flex_r">
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
                <div class="flex_sc">
                  <div class="m-storeCode margin_l_10" @click="addDomain">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                  </div>
                  <div v-if="(form.thirdPartyCoding.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                       @click.prevent="removeDomain(index)">
                    <i class="fa fa-minus-circle" aria-hidden="true"></i>
                  </div>
                </div>
              </div>

              <el-form-item label="包含菜品:">
                <el-button @click='openDialog()'>+添加菜品</el-button>
              </el-form-item>

              <div class="margin_b_10">
                <el-table :data="dishesList" border style="width: 100%;">
                  <el-table-column label-class-name="table_head" header-align="center" align="center" prop="productname" label="菜品名称" >

                  </el-table-column>
                  <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作">
                    <template slot-scope="scope">
                      <el-button size="small" type="danger" @click="del(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>



              <el-col :span="24">
                <el-col :span="12" class="flex-jc">
                  <el-button type="primary" @click="submitFrom('formRules')">保存</el-button>
                </el-col>
                <el-col :span="12" class="flex-jc">
                  <el-button @click="$router.go(-1)">取消</el-button>
                </el-col>
              </el-col>

            </el-form>
          </el-col>
        </el-row>

      </el-card>
    </div>

    <el-dialog title="添加菜品" :visible.sync="dialogFormVisible">

      <div class="flex_a">
        <div class="flex_1">
          <el-checkbox v-model="selectedAll" @change="handleCheckAll">全选</el-checkbox>
        </div>
        <div class="flex_1 flex_a">
          <div class="margin_r_10" >
            <el-input placeholder="菜品名称" v-model="dishesName"></el-input>
          </div>
          <el-button type="primary" @click="search()">搜索</el-button>
        </div>
      </div>

      <div class="margin_t_10">
        <el-table :data="storeData" border style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="菜品编码">
            <template slot-scope="scope">
              <div>
                <el-checkbox v-model="scope.row.select" @change="handleChecked"> {{scope.row.x0_productid}}</el-checkbox>
              </div>
            </template>

          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="productname" label="名称">

          </el-table-column>

        </el-table>
      </div>
      <div class="margin_b_10 margin_t_10">
        <!--<xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>-->
      </div>
      <div class="margin_t_10">
        <el-button type="primary" @click="addDishes()" >确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>

    </el-dialog>

  </div>
</template>
<script>
  import {oneTwoApi} from '@/api/api.js';
  export default {
    data() {
      return {
        bank:'',
        dialogFormVisible: false,
        navList: [{name: "菜单管理", url: ''}, {name: "菜品组", url: '/dishesManagement/dishesGroup'}, {name: "新增菜品组", url: ''}],
        form: {
          name: '',
          remark: '',
         thirdPartyCoding: [
           {code1: '', code2: ''}
         ],
        },
        dishesList:[],
        selectedAll:false,
        value1: 1,
        storeData: [],
        dishesName:'',
        p: {page: 1, size: 20, total: 0},
      }
    },
    components: {
    },
    methods: {
      search(){
        let params = {
          redirect: "x2a.product.index",
          levelid:this.$route.params.id,
          productname:this.dishesName,
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.dialogFormVisible = true;
            this.selectedAll = false;
            res.data.list.forEach((item)=>{
              this.$set(item,'select',false)
            });
            this.storeData = res.data.list;

          }
        })
      },
      addDishes(){
        let list = [];
        list = this.storeData.filter((item)=>{
          return item.select
        });

        if(list.length === 0){
          this.$message("最少选择一个菜品");
        } else {
          this.dishesList = list;
          this.dialogFormVisible = false
        }

      },
      getPage(page) {
        this.p.page = page;
        //this.showResouce(this.p, this.levelId,this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        //this.showResouce(this.p, this.levelId,this.searchName);
      },
      handleCheckAll(bool) {
        if (bool.target.checked === true) {
          this.storeData.forEach((data) => {
            data.select = true
          })
        } else {
          this.storeData.forEach((data) => {
            data.select = false
          })
        }
      },
      handleChecked(){
        let list =  this.storeData.filter((item)=>{
          return item.select === true
        });
        (list.length === this.storeData.length) ? this.selectedAll = true : this.selectedAll = false;
      },
      del(i){
        this.dishesList.splice(i, 1)
      },
      openDialog() {
        this.selectedAll = false;
        let params = {
          redirect: "x2a.product.index",
          levelid:this.$route.params.id,
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.dialogFormVisible = true;
            res.data.list.forEach((item)=>{
              this.$set(item,'select',false)
            });
            this.storeData = res.data.list;
          }
        })

      },
      removeDomain(index) {
        this.form.thirdPartyCoding.splice(index, 1)
      },
      addDomain() {
        this.form.thirdPartyCoding.push( {code1: '', code2: ''});
      },
      submitFrom(formRules) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            let list = [];
            this.dishesList.forEach((item)=>{
              list.push(item.x0_productid)
            });
            let params = {
              redirect: "x2a.pgroup.create",
              levelid:this.$route.params.id,
              pgroupname:this.form.name,
              morecodes: window.JSON.stringify(this.form.thirdPartyCoding),
              remark:this.form.remark,
              productids:list.join(','),
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.$message("操作成功");
                this.$router.go(-1)
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    created() {
      console.log(this.$route.params.id)
    },
  };

</script>
<style scoped lang="less">

  .contentMsg {
    padding: 0 0 25px 0;
  }

  .cell {
    margin-top: 20px;
    width: 50%;
  }
</style>
