<template>
  <div>

    <div class="margin_b_10">
      <xo-nav-path :navList="navList"></xo-nav-path>
    </div>

    <div class="margin_t_10 width_100">
      <el-form ref="formRules" :model="form">
      <el-table :data="form.dishesData" border :height="tableHeight" style="width: 100%;">
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品名称" width="200">
          <template slot-scope="scope">
            <el-form-item label="" :prop="'dishesData.' + scope.$index + '.product_name'" :rules="{required: true, validator: checkName, trigger: 'blur'}">
            <el-input v-model="scope.row.product_name" placeholder="请输入菜品名称">
            </el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center" label="第三方编码" width="420">
          <template slot-scope="scope">
            <div v-for="(domain, index) in scope.row.productcodes" class="flex_r p_b_22">
              <div style="width:150px">
                <el-input v-model="domain.name" placeholder="请输入第三方名称"></el-input>
              </div>
              <div class="m-rank">
                <div class="m-rank-child"></div>
              </div>
              <div style="width:150px">
                <el-input v-model="domain.providerid" placeholder="请输入第三方编码"></el-input>
              </div>
              <div class="flex_sb" style="width:80px">
                <div class="m-storeCode margin_l_10" @click="addDomain(scope.row.productcodes)">
                  <i class="fa fa-plus-circle" aria-hidden="true"></i>
                </div>
                <div v-if="(scope.row.productcodes.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                     @click.prevent="removeDomain(scope.row.productcodes,index)">
                  <i class="fa fa-minus-circle" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!--<el-table-column label-class-name="table_head" header-align="center" align="center" label="所属品牌" width="200">-->
          <!--<template slot-scope="scope">-->
            <!--<el-select v-model="scope.row.levelid"-->
                       <!--placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in brandList"-->
                <!--:key="item.id"-->
                <!--:label="item.levelname"-->
                <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</template>-->
        <!--</el-table-column>-->


        <el-table-column label-class-name="table_head" header-align="center" align="center" label="参考价格" width="200">
          <template slot-scope="scope">
              <el-form-item label="" :prop="'dishesData.' + scope.$index + '.price'" :rules="{required: true, validator: checkNumber, trigger: 'blur'}">
                <el-input v-model="scope.row.price" placeholder="请输入参考价格" >
                </el-input>
              </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center" :render-header="header" width="600">
          <template slot-scope="scope">
            <div class="flex_r">
              <el-upload
                class="avatar-uploader margin_r_10"
                :action="$updateUrl"
                name='filename'
                :show-file-list="false"
                :on-success="(res, file,list)=>{
                  return handleAvatarSuccess1(res, file,list,scope.row)
                }"
                :before-upload="beforeAvatarUpload">
                <img v-if="scope.row.imgurl_1" :src="scope.row.imgurl_1" class="avatar">
                <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
              </el-upload>

              <el-upload
                class="avatar-uploader margin_r_10"
                :action="$updateUrl"
                name='filename'
                :show-file-list="false"
                :on-success="(res, file,list)=>{
                  return handleAvatarSuccess2(res, file,list,scope.row)
                }"
                :before-upload="beforeAvatarUpload">
                <img v-if="scope.row.imgurl_2" :src="scope.row.imgurl_2" class="avatar">
                <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
              </el-upload>

              <el-upload
                class="avatar-uploader"
                :action="$updateUrl"
                name='filename'
                :show-file-list="false"
                :on-success="(res, file,list)=>{
                  return handleAvatarSuccess3(res, file,list,scope.row)
                }"
                :before-upload="beforeAvatarUpload">
                <img v-if="scope.row.imgurl_3" :src="scope.row.imgurl_3" class="avatar">
                <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
              </el-upload>
            </div>
          </template>
        </el-table-column>


      </el-table>
      </el-form>
      <div class="flex margin_t_10">
        <el-button type="primary" @click="submitFrom('formRules')">保存</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import getApi from "./addDishes.service"
  import ElButton from "../../../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    components: {
      ElButton
    },

    data() {
      return {
        tableHeight: 0,
        navList: [{name: "菜品库", url: '/infrastructure/DishesLibrary'}, {name: "新增菜品", url: ''}],
        brandList: [],
        form:{dishesData: []},
        va: "",
        index: ''
      }
    },
    watch: {},
    methods: {
      checkName(rule, value, callback){
        if (value === '') {
          callback(new Error('请输入菜品名称'));
        }else {
          if(value.trim()){
            callback()
          }else {
            callback(new Error('菜品名称格式错误'));
          }
        }
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

      submitFrom(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            getApi.addDishes(this.$route.params.levelid, this.form.dishesData).then((res) => {
              if (res.data.errcode === 0) {
                this.$alert('添加成功', '', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.go(-1)
                  }
                })
              }

            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },

      removeDomain(list, i) {
        list.splice(i, 1)
      },
      addDomain(list) {
        list.push({name: '',  providerid: ''});
      },


      beforeAvatarUpload(file) {
        const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5;
        let img;

        if (isJPG || isPNG) {
          img = true
        } else {
          img = false;
          this.$message.error('上传菜品图片只能是 JPG,PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传菜品图片大小不能超过5M！');
        }
        return img && isLt5M;
      },
      handleAvatarSuccess1(res, file,list,item) {
        item.imgurl_1 = file.response.data.file_url;
      },
      handleAvatarSuccess2(res, file,list,item) {
        item.imgurl_2 = file.response.data.file_url;
      },
      handleAvatarSuccess3(res, file,list,item) {
        item.imgurl_3 = file.response.data.file_url;
      },
      header(h) {
        return h(
          'span',
          {attrs:{style:'font-size: 15px;'}},
          ['图片',
            h('el-tooltip', {
                attrs: {content: "上传菜品图片只支持JPG和PNG格式，大小为5M以内的图片", placement: "top"},
              }, [
                h('span', {
                    attrs: {type: "text"},
                  }, [ h(
                  'i', {
                    attrs: {class: "fa fa-question-circle-o"}
                  }
                  )]
                )
              ]
            )
          ]
        );
      },
    },
    created() {
      for (let i = 0; i < this.$route.params.number; i++) {
        this.form.dishesData.push({
          product_name: "",
          levelid: this.$route.params.levelid,//品牌
          price: "",
          imgurl_1:'',
          imgurl_2:'',
          imgurl_3:'',
          material: '',
          productcodes: [
            {name: '',  providerid: ''}
          ],
        })
      }
      // getApi.getBrand(this.$route.params.levelid).then((res) => {
      //   this.brandList = res.data.data
      // })
    },
    mounted() {

    },
    updated() {

    }
  }
</script>

<style scoped lang="less">
 .p_b_22{
   padding-bottom: 22px;
 }
</style>
