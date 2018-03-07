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

              <el-form-item label="所属品牌:" prop="bank" :rules="{type:'number',required: true, message: '请选择品牌', trigger: 'change'}">

                <el-select v-model="form.bank" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>

              </el-form-item>

              <el-form-item label="菜品组备注	:" >
                <el-input v-model="form.remarks" placeholder="请输入内容"></el-input>
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
                  <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="菜品名称" >

                  </el-table-column>
                  <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作">
                    <template slot-scope="scope">
                      <el-button size="small" type="danger" @click="del()">删除</el-button>
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
          <el-select v-model="bank" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select v-model="bank" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="flex_1 flex_a">
          <div class="margin_r_10" >
            <el-input placeholder="菜品名称"></el-input>
          </div>
          <el-button type="primary" @click="">搜索</el-button>
        </div>
      </div>

      <div class="margin_t_10">
        <el-table :data="storeData" border style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code" label="菜品编码">
            <template slot-scope="scope">
              <div>
                <el-checkbox v-model="scope.row.select" @change="handleChecked"> {{scope.row.code}}</el-checkbox>
              </div>
            </template>

          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="名称">

          </el-table-column>

        </el-table>
      </div>
      <div class="margin_b_10 margin_t_10">
        <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
      </div>
      <div class="margin_t_10">
        <el-button type="primary">确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>

      </div>

    </el-dialog>

  </div>
</template>
<script>

  export default {
    data() {
      return {
        bank:'',
        dialogFormVisible: false,
        navList: [{name: "菜单管理", url: ''}, {name: "菜品组", url: '/dishesManagement/dishesGroup'}, {name: "新增菜品组", url: ''}],
        form: {
          name: '',
          remarks: '',
          bank:'',
         thirdPartyCoding: [
           {code1: '', code2: ''}
         ],
        },
        dishesList:[
          {name:"鱼香肉丝"},
          {name:"水煮鱼"},
        ],
        selectedAll:false,
        value1: 1,
        storeData: [{
          code: '33',
          name:"11",

        }, {
          code: '11',
          name:"22",

        }],
        options: [{
          id: 1,
          name: '黄金糕'
        }, {
          id: 2,
          name: '双皮奶'
        }],
        p: {page: 1, size: 20, total: 0},
      }
    },
    components: {
    },
    methods: {
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
        let count =0;
        this.storeData.forEach((data) => {
          if (data.select === true) {
            count += data.select*1
          }
        });

        if(count === this.storeData.length){
          this.selectedAll = true;

        }else {
          this.selectedAll = false;
        }

      },
      del(){

      },
      openDialog() {
        this.selectedAll = false;
        this.dialogFormVisible = true;
        this.storeData.forEach((data)=>{
          this.$set(data,'select',false)
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
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
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

  .contentMsg {
    padding: 0 0 25px 0;
  }

  .cell {
    margin-top: 20px;
    width: 50%;
  }
</style>
