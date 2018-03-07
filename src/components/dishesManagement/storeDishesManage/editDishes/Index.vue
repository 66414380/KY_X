<template>
  <div>

    <div class="margin_b_10">
      <xo-nav-path :navList="navList"></xo-nav-path>
    </div>

    <div>
      <el-form ref="formRules" :model="form">
        <el-table :data="form.dishesList" border style="width: 100%;">

        <el-table-column label-class-name="table_head" header-align="center" align="center" label="排序">

          <template slot-scope="scope">
            <el-input v-model="scope.row.sequence"></el-input>
          </template>

        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品名称"
                         width="160">
          <template slot-scope="scope">
            <el-form-item label="" :prop="'dishesList.' + scope.$index + '.productname'" :rules="{required: true, message: '请输入菜品名称', trigger: 'blur'}">
              <el-input v-model="scope.row.productname" class="m_t_22"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid"
                         label="菜品编码"
                         width="120"></el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center"
                         label="第三方编码" width="420">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.morecodes" class="flex_r padding_10">
              <div style="width:150px">
                <el-input v-model="item.code1" placeholder="请输入名称"></el-input>
              </div>
              <div class="m-rank">
                <div class="m-rank-child"></div>
              </div>
              <div style="width:150px">
                <el-input v-model="item.code2" placeholder="请输入编码"></el-input>
              </div>
              <div class="flex_sb" style="width:80px">
                <div class="m-storeCode margin_l_10" @click="addDomain(scope.row.morecodes)">
                  <i class="fa fa-plus-circle" aria-hidden="true"></i>
                </div>
                <div v-if="index !== 0" class="m-storeCode margin_l_10"
                     @click.prevent="removeDomain(scope.row.morecodes,index)">
                  <i class="fa fa-minus-circle" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </template>


        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="所属品类" width="200">
          <template slot-scope="scope">
            <el-form-item label="" :prop="'dishesList.' + scope.$index + '.categoryid'" :rules="{type:'number',required: true, message: '请选择品类', trigger: 'blur'}" class="m_t_22">
              <el-select v-model="scope.row.categoryid" placeholder="请选择">
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.categoryname"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="参考价格"
                         width="120">
          <template slot-scope="scope">
            <el-form-item label="" :prop="'dishesList.' + scope.$index + '.price'" :rules="{required: true, validator: checkNumber, trigger: 'blur'}">
              <el-input v-model="scope.row.price" class="m_t_22"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品图片"
                         width="440">
          <template slot-scope="scope">
            <!--<el-form-item label="" :prop="'dishesList.' + scope.$index + '.image'" :rules="{required: true, message: '请选择图片', trigger: 'change'}" class="m_t_22">-->
              <el-radio-group v-model="scope.row.image" >
                <div class="flex">
                  <div v-for="(item,index) in scope.row.imageSelect" class="flex_a" style="margin: 7px 0">
                    <el-radio  :label="item.imgurl" v-if="item.imgurl"  class="margin_10">{{item.radio}}</el-radio>
                    <el-popover
                      placement="top"
                      width="200"
                      trigger="hover">
                      <img :src="item.imgurl" alt="" style="width: 200px;height: 200px">
                      <img slot="reference" :src="item.imgurl" alt="" style="width: 100px;height: 100px">
                    </el-popover>
                  </div>
                </div>
              </el-radio-group>
            <!--</el-form-item>-->

          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品详情"
                         width="220">
          <template slot-scope="scope">

            <el-input v-model="scope.row.description"></el-input>

          </template>

        </el-table-column>


        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品规格" width="360">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.skus" class="flex_a margin_b_10">

              <el-form-item label="" :prop="'dishesList.' + scope.$index  + '.skus.' + index + '.skuid'" :rules="{type:'number',required: true, message: '请选择菜品规格', trigger: 'blur'}" class="m_t_22">
                <el-select v-model="item.skuid" placeholder="请选择" style="width:120px">
                  <el-option
                    v-for="item1 in skuList"
                    :key="item1.id"
                    :label="item1.skuname"
                    :value="item1.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <div class="margin_l_10" style="width:120px">
                <el-form-item label="" :prop="'dishesList.' + scope.$index  + '.skus.' + index + '.price'" :rules="{required: true, validator: checkNumber, trigger: 'blur'}">
                  <el-input v-model="item.price" placeholder="请输入价格" class="m_t_22"></el-input>
                </el-form-item>
              </div>

              <div class="m-storeCode margin_l_10" @click="addDomain2(scope.row.skus)">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </div>

              <div v-if="index !== 0" class="m-storeCode margin_l_10"
                   @click.prevent="removeDomain2(scope.row.skus, index)">
                <i class="fa fa-minus-circle" aria-hidden="true"></i>
              </div>
            </div>
          </template>
        </el-table-column>


        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品属性"
                         width="300">
          <template slot-scope="scope">
            <div class="">
              <el-button size="small" type="primary" @click="addAttr(scope.row.property)" class="margin_b_10">+新增属性</el-button>
              <div v-for="(item,index) in scope.row.property" class="margin_b_10">
                <div class="flex_a margin_b_10">
                  <div style="position: relative" class="margin_r_10">
                    <el-input size="small" v-model="item.attr" placeholder="属性">
                    </el-input>
                    <i class="el-icon-delete pointer" style="position: absolute;top: 0;right: 0" @click="delAttr(scope.row.property,index)"></i>
                  </div>
                  <el-button size="small" type="primary" @click="addAttrCell(item)">+属性值</el-button>

                </div>

                <div  class="flex_a" >
                  <div style="position: relative" v-for="(item1,index1) in item.list" class="margin_r_10">
                    <el-input size="small"  v-model="item1.value" placeholder="如冷热">
                    </el-input>
                    <i class="el-icon-delete pointer" style="position: absolute;top: 0;right: 0" @click="delAttrCell(item.list,index1)"></i>
                  </div>
                </div>

              </div>
            </div>

          </template>

        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="餐盒配置"
                         width="360">

          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.lunchboxes" class="flex_a margin_b_10">
              <el-form-item label="" :prop="'dishesList.' + scope.$index  + '.lunchboxes.' + index + '.lunchboxid'" :rules="{type:'number',required: true, message: '请选择餐盒配置', trigger: 'blur'}" class="m_t_22">
                <el-select v-model="item.lunchboxid" placeholder="请选择" style="width:120px">
                  <el-option
                    v-for="item1 in boxList"
                    :key="item1.id"
                    :label="item1.lunchboxname"
                    :value="item1.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div class="margin_l_10" style="width:120px">
                <el-form-item label="" :prop="'dishesList.' + scope.$index  + '.lunchboxes.' + index + '.count'" :rules="{required: true, validator: checkNumber_1, trigger: 'blur'}">
                  <el-input v-model="item.count" placeholder="请输入数量" class="m_t_22"></el-input>
                </el-form-item>
              </div>

              <div class="m-storeCode margin_l_10" @click="addDomain4(scope.row.lunchboxes)">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </div>

              <div v-if="index !== 0" class="m-storeCode margin_l_10"
                   @click.prevent="removeDomain4(scope.row.lunchboxes, index)">
                <i class="fa fa-minus-circle" aria-hidden="true"></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="status" label="平台信息"-->
                         <!--width="340">-->

          <!--<template slot-scope="scope">-->
            <!--<div class="flex_r">-->
              <!--<div class="flex_1" v-for="(item,index) in scope.row.plat">-->
                <!--<div>-->
                  <!--{{item.value}}-->
                <!--</div>-->
                <!--<div class="margin_b_10">-->
                  <!--{{item.value1}}-->
                <!--</div>-->
                <!--<div v-for="(item1,index) in item.value2">-->
                  <!--{{item1.value}} {{item1.value1}}-->
                <!--</div>-->

              <!--</div>-->
            <!--</div>-->

          <!--</template>-->

        <!--</el-table-column>-->


      </el-table>
      </el-form>
    </div>

    <div class="flex margin_t_10">
      <el-button type="primary" @click="submitForm('formRules')">确定</el-button>
      <el-button type="primary" @click="reset('formRules')">重置</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>

  import {oneTwoApi} from '@/api/api.js';

  export default {
    components: {
    },
    data() {
      return {
        navList: [{name: "菜品管理", url: ''},{name: "菜品列表", url: '/dishesManagement/dishesManageList'}, {name: "编辑菜品", url: ''}],

        categoryList:[],
        skuList:[],
        boxList:[],
        form:{dishesList: []},

      }
    },
    watch: {},
    methods: {
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.dishesList.forEach((item)=>{

              delete item.x0product;
              delete item.created_at;
              delete item.updated_at;
              delete item.CategoryName
            });
            let params = {
              redirect: "x2a.product.update",
              //levelid:this.$route.params.levelId,
              data:window.JSON.stringify(this.form.dishesList),
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.$message("操作成功");
                this.$router.go(-1)
              }
            })


          } else {
            console.log('error submit!!');
            this.$message({
              message: '请填写所需选项',
              type: 'warning'
            });
            return false;
          }
        });
      },
      checkNumber(rule, value, callback){
        let re = /^0{1}([.]([1-9][0-9]?)|[.][0-9][1-9])$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/;
        if (value === '') {
          callback(new Error('请输入价格'));
        }else {
          if(re.test(value)){
            callback()
          }else {
            callback(new Error('价格格式错误'));
          }
        }
      },
      checkNumber_1(rule, value, callback){
        let re = /^[1-9]\d*$/;
        if (value === '') {
          callback(new Error('请输入数量'));
        }else {
          if(re.test(value)){
            callback()
          }else {
            callback(new Error('数量格式错误'));
          }
        }
      },
      delAttrCell(list,i){
        list.splice(i, 1)
      },
      delAttr(list,i){
        list.splice(i, 1)
      },
      addAttr(item){
        item.push({attr:'',list:[]});
      },
      addAttrCell(item){
        if(item.list.length === 3){
          return
        }
        item.list.push({value:''})
      },
      changeAttr(changeAttr){
        changeAttr.checkList = []
      },

      removeDomain(list, i) {
        list.splice(i, 1)
      },
      addDomain(list) {
        list.push({code1: '', code2: ''});
      },

      removeDomain2(list, i) {
        list.splice(i, 1)
      },
      addDomain2(list) {
        list.push({skuid: '', price: ''});
      },

      removeDomain4(list, i) {
        list.splice(i, 1)
      },
      addDomain4(list) {
        list.push({lunchboxid: '', count: ''});
      },
      showResouce(){
        let params = {
          redirect: "x2a.product.view",
          levelid:this.$route.params.levelId,
          x0_productids:this.$route.params.id,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            res.data.forEach((item)=>{
              item.imageSelect.forEach((item1)=>{
                item1.radio = ''
              });
              if(item.skus.length === 0){
                item.skus.push({skuid: '', price: ''})
              }
              if(item.lunchboxes.length === 0){
                item.lunchboxes.push({lunchboxid: '', count: ''})
              }

            });
            this.form.dishesList = res.data;
          }
        })
      },
      reset(formName){
        this.$refs[formName].resetFields();
        this.showResouce()
      },
    },


    created() {
      this.showResouce()
    },
    mounted() {
      let params = {
        redirect: "x2a.category.index",
        levelid:this.$route.params.levelId,
        noPage:1,
      };
      oneTwoApi(params).then((res) => {
        if(res.errcode === 0){
          this.categoryList = res.data.list;

        }
      });
      let params1 = {
        redirect: "x2a.sku.index",
        levelid:this.$route.params.levelId,
        noPage:1,
      };
      oneTwoApi(params1).then((res) => {
        if(res.errcode === 0){

          this.skuList = res.data.list;

        }
      });
      let params2 = {
        redirect: "x2a.lunchbox.index",
        levelid:this.$route.params.levelId,
        noPage:1,
      };
      oneTwoApi(params2).then((res) => {
        if(res.errcode === 0){

          this.boxList = res.data.list;

        }
      })

    }


  }
</script>


<style scoped lang="less">
  .item {
    margin-right: 10px;
  }
  .m_t_22{
    margin-top: 22px;
  }
</style>
