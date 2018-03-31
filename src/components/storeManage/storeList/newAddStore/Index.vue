<template>
  <div>

    <div class="margin_b_10">
      <xo-nav-path :navList="navList"></xo-nav-path>
    </div>

    <el-dialog
      title="上传图片"
      :visible.sync="dialogVisible"
      width="50%" size="tiny">
      <div class="flex_f flex">

        <div>
          请上传以下证件（图片大小不要超过5M）
        </div>

        <div class="margin_t_10">
          <div>营业执照</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name='filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgList.business_src" :src="imgList.business_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>
            组织机构代码
          </div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name='filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgList.businesscode_src" :src="imgList.businesscode_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>开户许可证</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name='filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess3"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgList.account_src" :src="imgList.account_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>税务登记证</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name='filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess4"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgList.tax_src" :src="imgList.tax_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>法人证件正面照</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name='filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess5"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgList.legalman_1" :src="imgList.legalman_1" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>法人证件反面照</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name='filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess6"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgList.legalman_2" :src="imgList.legalman_2" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>


        <div class="margin_t_10">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateImg()">确认</el-button>
        </div>
      </div>

    </el-dialog>

    <div class="margin_t_10 width_100">
      <el-form ref="formRules" :model="form">
        <el-table :data="form.storeData" border :height="tableHeight" style="width: 100%;">
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="门店名称" width="200">
          <template slot-scope="scope">
            <el-form-item label="" :prop="'storeData.' + scope.$index + '.storename'" :rules="{required: true, message: '请输入门店名称', trigger: 'blur'}">
              <el-input v-model="scope.row.storename" placeholder="请输入门店名称" class="m_t_22">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center" label="第三方编码" width="420">
          <template slot-scope="scope">
            <div v-for="(domain, index) in scope.row.storecodes" class="flex_r padding_10">
              <div style="width:150px">
                <el-input  v-model="domain.name" placeholder="请输入第三方名称">
                </el-input>
              </div>
              <div class="m-rank">
                <div class="m-rank-child"></div>
              </div>
              <div style="width:150px">
                <el-input  v-model="domain.providerid"  placeholder="请输入第三方编码">
                </el-input>
              </div>
              <div class="flex_sb" style="width:80px">
                <div class="m-storeCode margin_l_10" @click="addDomain(scope.row.storecodes)">
                  <i class="fa fa-plus-circle" aria-hidden="true"></i>
                </div>
                <div v-if="(scope.row.storecodes.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                     @click.prevent="removeDomain(scope.row.storecodes,index)">
                  <i class="fa fa-minus-circle" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center" label="所属品牌" width="200">
          <template slot-scope="scope">
            <el-form-item label="" :prop="'storeData.' + scope.$index + '.brand'" :rules="{type:'number',required: true, message: '请选择品牌', trigger: 'change'}">
              <el-select v-model="scope.row.brand"  disabled placeholder="请选择" class="m_t_22">
                <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :label="item.levelname"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

          </template>
        </el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center" label="门店地址" width="600">
          <template slot-scope="scope">
            <div class="flex_a">
              <el-form-item label="" :prop="'storeData.' + scope.$index + '.provinceid'" :rules="{type:'number',required: true, message: '请选择省', trigger: 'change'}">
                <el-select @change="myChange(scope.row)" v-model="scope.row.provinceid" clearable filterable @visible-change="canSelectProvider" placeholder="请选择省" class="m_t_22">
                  <el-option v-for="item in provinceList" :key="item.id" :label="item.address" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div class="margin_l_10">
                <el-form-item label="" :prop="'storeData.' + scope.$index + '.cityid'" :rules="{type:'number',required: true, message: '请选择市', trigger: 'change'}">
                  <el-select @change="myChange(scope.row)" v-model="scope.row.cityid" clearable filterable @visible-change="canSelectCity" placeholder="请选择市" class="m_t_22">
                    <el-option v-for="item in scope.row.cityList" :key="item.id" :label="item.address"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="margin_l_10">
                  <el-select v-model="scope.row.areaid" @change="myChange(scope.row)" clearable filterable placeholder="请选择区">
                    <el-option v-for="item in scope.row.areaList" :key="item.id" :label="item.address"
                               :value="item.id">
                    </el-option>
                  </el-select>
              </div>
              <div class="margin_l_10">
                <el-form-item label="" :prop="'storeData.' + scope.$index + '.address'" :rules="{required: true, message: '请输入详细地址', trigger: 'blur'}">
                  <el-input v-model="scope.row.address" placeholder="请输入详细地址" class="m_t_22">
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="门店电话" width="200">
          <template slot-scope="scope">
            <el-form-item label="" :prop="'storeData.' + scope.$index + '.tel'" :rules="{required: true, message: '请输入门店电话', trigger: 'blur'}">
              <el-input v-model="scope.row.tel" placeholder="请输入门店电话" class="m_t_22">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="140">
          <template slot-scope="scope">

            <!--<i v-if="storeData.length === scope.$index+1" class="el-icon-plus m-storeCode" aria-hidden="true"-->
            <!--@click="addRow()"></i>-->
            <el-button @click="addRow(scope.row,scope.$index)">上传资料</el-button>
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
  import getApi from "./newAddStore.service"
  import ElButton from "../../../../../node_modules/element-ui/packages/button/src/button.vue";
  import {getLeft,getArea} from '../../../utility/communApi'
  export default {
    components: {
      ElButton
    },

    data() {
      return {
        tableHeight: 0,
        navList: [{name: "门店库", url: '/infrastructure/StoreLibrary'},{name: "新增门店", url: ''}],
        brandList: [],
        value: '',
        provinceList: [],
        imgList: {
          business_src: '',
          businesscode_src: '',
          account_src: '',
          tax_src: '',
          legalman_1: '',
          legalman_2: '',
        },
        form:{storeData: []},
        va: "",
        dialogVisible: false,
        imageUrl: '',
        index: '',
        selectProvider:false,
        selectCity:false
      }
    },
    watch: {},
    methods: {
      addRow(row, index) {
        this.imgList = {
          business_src: (this.form.storeData[index].business_src)?this.form.storeData[index].business_src:'',
          businesscode_src: (this.form.storeData[index].businesscode_src)?this.form.storeData[index].businesscode_src:'',
          account_src: (this.form.storeData[index].account_src)?this.form.storeData[index].account_src:'',
          tax_src: (this.form.storeData[index].tax_src)?this.form.storeData[index].tax_src:'',
          legalman_1: (this.form.storeData[index].legalman_1)?this.form.storeData[index].legalman_1:'',
          legalman_2: (this.form.storeData[index].legalman_2)?this.form.storeData[index].legalman_2:'',
        };

        this.index = index;
        this.dialogVisible = true

      },
      updateImg() {
        this.form.storeData[this.index].business_src = this.imgList.business_src;
        this.form.storeData[this.index].businesscode_src = this.imgList.businesscode_src;
        this.form.storeData[this.index].account_src = this.imgList.account_src;
        this.form.storeData[this.index].tax_src = this.imgList.tax_src;
        this.form.storeData[this.index].legalman_1 = this.imgList.legalman_1;
        this.form.storeData[this.index].legalman_2 = this.imgList.legalman_2;

        this.dialogVisible = false
      },

      beforeAvatarUpload(file) {
        const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5;
        let img;

        if(isJPG || isPNG){
          img = true
        }else {
          img = false;
          this.$message.error('上传证件图片只能是 JPG,PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传证件图片大小不能超过 5MB!');
        }
        return img && isLt5M;
      },
      canSelectProvider(e){
        (e === true)? this.selectProvider = true: this.selectProvider = false
      },
      canSelectCity(e){
        (e === true)? this.selectCity = true: this.selectCity = false
      },


      submitFrom(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.storeData.forEach((item) => {
              delete item.areaList;
              delete item.cityList;
            });
            getApi.addStore(this.$route.params.levelid,this.$route.params.type,this.form.storeData).then((res)=>{
              if(res.data.errcode === 0){
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
            this.$message({
              message: '请填写所需选项',
              type: 'warning'
            });
            return false;
          }
        });
      },
      myChange(map) {
        if (this.selectProvider === true) {
          getArea(map.provinceid).then((res) => {
            this.$set(map, "cityid", '');
            this.$set(map, "areaid", '');
            this.$set(map, "cityList", res.data.data);
            this.$set(map, "areaList", []);
          })
        }
        if (this.selectCity === true) {
          getArea(map.cityid).then((res) => {
            this.$set(map, "areaid", '');
            this.$set(map, "areaList", res.data.data);
          })
        }
      },
      removeDomain(list, i) {
        list.splice(i, 1)
      },
      addDomain(list) {
        list.push({name: '', providerid: ''});
      },

      getOneList() {
        //this.$router.push('/storeManage/storeList/seeTheStore')
        console.log(document.querySelectorAll('#all span input'))
      },
      edit() {

      },
      del() {

      },
      handleAvatarSuccess1(res, file) {
        this.imgList.business_src = file.response.data.file_url;
      },
      handleAvatarSuccess2(res, file) {
        this.imgList.businesscode_src = file.response.data.file_url;
      },
      handleAvatarSuccess3(res, file) {
        this.imgList.account_src = file.response.data.file_url;
      },
      handleAvatarSuccess4(res, file) {
        this.imgList.tax_src = file.response.data.file_url;
      },
      handleAvatarSuccess5(res, file) {
        this.imgList.legalman_1 = file.response.data.file_url;
      },
      handleAvatarSuccess6(res, file) {
        this.imgList.legalman_2 = file.response.data.file_url;
      },
    },
    created() {
      for (let i = 0; i < this.$route.params.number; i++) {
        this.form.storeData.push({
          storename: "",
          brand: '',
          provinceid: "",
          cityid: "",
          areaid: "",
          address: "",
          tel: "",
          storecodes: [
            {name: '', providerid: ''}
          ],
          business_src: '',
          businesscode_src: '',
          account_src: '',
          tax_src: '',
          legalman_1: '',
          legalman_2: '',
        })

      }

      getArea('').then((res) => {
        if (res.data.errcode === 0) {
          this.provinceList = res.data.data
        } else {

        }
      });

      getApi.getBrand(this.$route.params.levelid).then((res)=>{
        this.brandList = res.data.data;
        this.form.storeData.forEach((item)=>{
          item.brand = res.data.data[0].id
        })


      })
    },
    mounted() {

    },
    updated() {

    }
  }
</script>

<style scoped lang="less">
  .m_t_22{
    margin-top: 22px;
  }
</style>
