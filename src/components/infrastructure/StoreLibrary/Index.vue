<template>
  <div  v-show="getTreeArr['列表']">
    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">
        <div>
          <el-button size="small" @click="batchAdd()" :disabled="!getShowStoreTree().showAdd" v-show="getTreeArr['批量新增']">新增门店</el-button>
          <el-button size="small" @click="delSelected()" v-show="getTreeArr['删除']">批量删除</el-button>
          <el-button size="small" @click="isSwitch()" v-show="getTreeArr['批量开启、关闭']">批量开启/关闭</el-button>
        </div>
        <div class="flex_a">
          <div class="margin_r_10">
            <el-input size="small" v-model="searchName" placeholder="请输入门店名称"></el-input>
          </div>
          <el-button size="small" @click="search()">搜索</el-button>
          <el-button size="small" type="primary" @click="importXls()">+导入门店</el-button>
        </div>
      </div>
    </div>

    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow: auto;" :style="{height:tableHeight + 'px'}">

        <tree :data='getStoreTreeList()' :count=0 style="width: max-content;"></tree>

      </div>

      <div class="padding_l_10 width_100" >
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
                           label="编码"
                           width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storename"
                           label="门店"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="status" label="状态"
                           width="80"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="220">
            <template slot-scope="scope">

              <el-popover
                ref="popover4"
                placement="right"
                width="400"
                @show="()=>{
                  return show(scope.row)
                }"
                trigger="click">
                <div class="padding_10">
                  <div>{{showAsideObj.storeName}}</div>
                  <div class="flex_r margin_t_10">
                    <div class="flex_1 flex_ce">地址：</div>
                    <div class="flex_2">{{showAsideObj.address}}</div>
                  </div>
                  <div class="flex_r margin_t_10">
                    <div class="flex_1 flex_ce">门店编码：</div>
                    <div class="flex_2">{{showAsideObj.id}}</div>
                  </div>

                  <div class="flex_r margin_t_10" v-for="(item,index) in showAsideObj.storeCodes">
                    <div class="flex_1 flex_ce">第三方编码：</div>
                    <div class="flex_2">{{item.name}}  {{item.providerid}}</div>
                  </div>
                  <div class="flex_r margin_t_10">
                    <div class="flex_1 flex_ce">所属组：</div>
                    <div class="flex_2">{{showAsideObj.levelname}}</div>
                  </div>
                  <div class="flex_r margin_t_10">
                    <div class="flex_1 flex_ce">门店电话：</div>
                    <div class="flex_2">{{showAsideObj.tel}}</div>
                  </div>

                  <div class="flex_r margin_t_10">
                    <el-button type="primary" @click="log(showAsideObj)"  v-show="getTreeArr['日志']">日志</el-button>

                  </div>
                </div>
              </el-popover>

              <el-button size="small" type="primary" v-popover:popover4 >查看</el-button>
              <el-button size="small" @click.stop="edit(scope.row)" v-show="getTreeArr['编辑']">编辑</el-button>
              <el-button size="small" type="danger" @click.stop="del(scope.row)" v-show="getTreeArr['删除部门']">删除</el-button>
              <!--<el-button size="small" type="primary">上传资料</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>

      </div>
    </div>
<!--开启/关闭-->
    <el-dialog
      title="开启/关闭"
      :visible.sync="dialogVisible1"
      width="50%" size="tiny">
      <el-switch
        v-model="storeStatusValue"
        on-color="#13ce66"
        off-color="#ff4949">
      </el-switch>
      <div class="margin_t_10">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="changeStoresStatus()">确认</el-button>
      </div>
    </el-dialog>
    <!--修改-->
    <el-dialog
      title="修改"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="formRules" :model="formEdit" label-width="100px">
        <el-form-item label="编码:" prop="id" >
          <el-input v-model="formEdit.id" placeholder="请输入内容" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称:" prop="storename" :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
          <el-input v-model="formEdit.storename" placeholder="请输入内容"></el-input>
        </el-form-item>

        <div v-for="(domain, index) in formEdit.storecodes" class="flex_r">
          <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.name" placeholder="请输入第三方名称"></el-input>
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
                    <el-input v-model="domain.providerid" placeholder="请输入第三方编码"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="flex_a" style="margin-bottom: 22px">
            <div class="m-storeCode margin_l_10" @click="addDomain()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(formEdit.storecodes.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <div>
          请上传以下证件（图片大小不要超过5M）
        </div>

        <div class="margin_t_10">
          <div>营业执照</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload">
            <img v-if="formEdit.business_src" :src="formEdit.business_src" class="avatar">
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
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload">
            <img v-if="formEdit.businesscode_src" :src="formEdit.businesscode_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>开户许可证</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess3"
            :before-upload="beforeAvatarUpload">
            <img v-if="formEdit.account_src" :src="formEdit.account_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>税务登记证</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess4"
            :before-upload="beforeAvatarUpload">
            <img v-if="formEdit.tax_src" :src="formEdit.tax_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>法人证件正面照</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess5"
            :before-upload="beforeAvatarUpload">
            <img v-if="formEdit.legalman_1" :src="formEdit.legalman_1" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>法人证件反面照</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess6"
            :before-upload="beforeAvatarUpload">
            <img v-if="formEdit.legalman_2" :src="formEdit.legalman_2" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFrom('formRules',formEdit)">确认</el-button>
        </div>
      </el-form>
    </el-dialog>


    <!--新增门店-->
    <el-dialog
      title="新增门店"
      :visible.sync="dialogVisible2"
      width="50%" size="tiny">
      <div class="flex_f flex">
        <div class="margin_b_10">需要增加几家？</div>
        <div class="flex_a">
          <el-input v-model="number" style="width: 60px" min="1" max="100" type="number"></el-input>
          <span class="padding_l_10">家</span>
        </div>
        <div class="margin_t_10">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="goToAddStore()">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <!--日志-->
    <el-dialog
      title="日志"
      :visible.sync="dialogVisible3"
      width="50%" size="tiny">
      <div class="flex_f flex">

        <div v-for="(item,index) in logList">
         <div class="margin_b_10">{{item}}</div>
        </div>

        <div class="margin_t_10">
          <el-button type="primary" @click="dialogVisible3 = false">确认</el-button>
        </div>
      </div>
    </el-dialog>

    <!--导入门店-->
    <el-dialog
      title="导入门店"
      :visible.sync="dialogVisible4"
      @open="open4"
      @close="close4"
      width="50%" size="tiny">
      <div class="flex_f flex">

        <div>
          请按照我们提供的标准模板填写信息
          <a style="color: #52CBF8" :href="$xlsUrl">下载标准模板</a>
        </div>

        <div class="margin_t_10">文件中的成员将会被导入至</div>

        <div ref="tree" style="width: 100%;">
          <el-tree
            :data="dataLeft"
            :props="defaultProps"
            @node-click="nodeClick"
            node-key="id"
            default-expand-all
            :highlight-current="true"
            :expand-on-click-node="false"
          >
          </el-tree>
        </div>

        <div class="margin_t_10 width_100">
          <el-upload
            class="upload-demo"
            :action="$updateXlsUrl"
            name="filename"
            :on-change="handleChange"
            :on-success="handleAvatarSuccessXls"
            :before-upload="beforeAvatarUploadXls"
            :file-list="fileList"
            :multiple="false"
            >
            <el-button size="small" type="primary">选取文件上传</el-button>

          </el-upload>
          <div class="margin_t_10">
            <el-checkbox v-model="isOver">门店名称相同时，覆盖原的有信息</el-checkbox>
          </div>
        </div>
        <div class="margin_t_10">
          <el-button  @click="dialogVisible4 = false">取消</el-button>
          <el-button type="primary" @click="submitUploadXls">提交</el-button>

        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input.vue";

  import Hub from '../../utility/commun'
  import {getLevel,getArea,recur} from '../../utility/communApi'
  import tree from './tree.vue'
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import getApi from './storeLibrary.service'
  import ElCheckbox from "../../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
  import { mapActions,mapGetters } from 'vuex';
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components: {
      ElCheckbox,
      ElInput,
      tree,
    },
    data() {
      return {
        isOver:false,
        storeStatusValue: false,
        showAside: false,
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3:false,
        dialogVisible4:false,//导入文件窗口
        tableHeight: 0,
        navList: [{name: "门店库", url: ''}],
        brandid:'',
        storeGroup: 1,
        payValue: 2,
        searchName: '',
        storeData: [],
        defaultProps: {
          children: 'child',
          label: 'levelname'
        },
        showAsideObj: {},//侧滑内容
        formEdit: {},//编辑弹窗
        p: {page: 1, size: 20, total: 0},
        number: 1,
        logList:[],
        dataLeft:[],
        fileList: [],
        fileurl:'',
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setStoreTreeList','setShowStoreTree','setTreeArr']),
      ...mapGetters(['getStoreTreeList','getShowStoreTree']),
      open4(){
      },
      close4(){
        this.brandid = '';
        this.xlsFile = '';
        this.fileList = []
      },
      //批量状态设置
      changeStoresStatus() {

        let storeStatusValue,list= [];
        if (this.storeStatusValue) {
          storeStatusValue = 1
        } else {
          storeStatusValue = 0
        }
        this.storeData.forEach((item) => {
          if (item.select) {
            list.push(item.id)
          }
        });
        getApi.storesStatus(list.join(','), storeStatusValue).then((res) => {
          if(res.data.errcode === 0){
            this.$message('操作成功');
            this.getBsList(this.p,this.getShowStoreTree().levelid);
            this.dialogVisible1 = false;
          }
        })
      },
      isSwitch(){
        this.storeStatusValue = false;
        if(this.storeData.some((item) => {return item.select === true}) === true){
          this.dialogVisible1 = true
        }else {
          this.$message('请勾选门店');
        }
      },
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-1);
      },
      handleAvatarSuccessXls(res, file) {
        this.fileurl = file.response.data.file_url

      },
      beforeAvatarUploadXls(file) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 5MB!');
        }
        return isLt5M;
      },
      submitUploadXls() {
        if(this.brandid === ''){
          this.$message('请选择成员');
          return
        }
        if(this.fileurl === ''){
          this.$message('需要上传XLS文件');
          return
        }
        let over = '';
        if(this.isOver === false){
          over = 0
        }else {
          over = 1
        }
        getApi.updateXlsFile(this.brandid,this.fileurl,over).then((res)=>{

          if(res.data.errcode === 0){
            this.$message({
              type: 'info',
              message: '上传成功'
            });
            this.dialogVisible4 = false
          }

        })

      },
      nodeClick(data, data1, data2) {

        this.levelId = data.id;

        this.brandid = data.id;

      },
      importXls(){
        getLevel().then((res)=>{
          if(res.data.errcode === 0){
            this.dataLeft = res.data.data;
            this.dialogVisible4 = true
          }
        })
      },
      search(){
        if(this.searchName === ''){
          this.getBsList(this.p = {page: 1, size: 20, total: 0},this.getShowStoreTree().levelid)
        }else {
          this.getBsList(this.p = {page: 1, size: 20, total: 0},this.getShowStoreTree().levelid,this.searchName)
        }
      },
      log(data){
        getApi.log(data.id).then((res)=>{
          this.dialogVisible3 = true;
          this.logList = res.data.data
        })

      },
      delSelected() {
        let list = [];
        this.storeData.forEach((item) => {
          if (item.select) {
            list.push(item.id)
          }
        });
        if(list.length === 0){
          this.$message('请勾选门店');
        }else {
          this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            getApi.delBsOne(list.join(",")).then((res)=>{
              if(res.data.errcode === 0){
                this.$message({
                  type: 'info',
                  message: '删除成功'
                });
                this.getBsList(this.p,this.getShowStoreTree().levelid);
              }
            })
          }).catch(() => {
            //
          });
        }


      },
      submitFrom(formRules,formEdit){
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            getApi.updateBsOne(formEdit).then((res)=>{
              if(res.data.errcode === 0){
                this.getBsList(this.p,this.getShowStoreTree().levelid);
                this.dialogVisible = false
                this.dialogVisible1 = false
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      goToAddStore() {
        if(this.number < 1){
          this.$message('需要最少一家门店');
        }else {
          this.$router.push({path: `/storeManage/storeList/newAddStore/${this.number}/${this.getShowStoreTree().levelid}/${this.getShowStoreTree().type}`})
        }
      },
      getPage(page) {
        this.p.page = page;
        this.getBsList(this.p,this.getShowStoreTree().levelid,this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.getBsList(this.p,this.getShowStoreTree().levelid,this.searchName);
      },

     async show(row) {

      let province = '',city = '',area = '';
      await  getArea('').then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.forEach((item)=>{
              if(item.id === row.provinceid){
                province = item.address
              }
            })
          } else {
          }
        });
       await  getArea(row.provinceid).then((res) => {
         if (res.data.errcode === 0) {
           res.data.data.forEach((item)=>{
             if(item.id === row.cityid){
               city = item.address
             }
           })
         } else {
         }
       });
       await  getArea(row.cityid).then((res) => {
         if (res.data.errcode === 0) {
           res.data.data.forEach((item)=>{
             if(item.id === row.areaid){
               area = item.address
             }
           })
         } else {
         }
       });

        this.showAsideObj = {
          storeName: row.storename,
          storeCode: row.storecodeid,
          address:`${province} ${city} ${area} ${row.address}`,
          tel:row.tel,
          storeCodes:row.storecodes,
          levelname:row.levelname,
          id:row.id
        }

      },
      renderContent(h, {node, data, store}) {
        return (
          <span>
          <span>
          <span>{node.label}</span>
        </span>
        <span style = "padding-left: 10px;" >
          <el-button style = "font-size: 12px;"type = "text" on-click = {()=>this.addBig('新建大商户')}></el-button>

        </span>
        </span>);
      },

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

      addBig() {
        this.title = title
        this.dialogVisible = true
      },
      batchAdd() {
        this.dialogVisible2 = true
      },
      removeDomain(item) {
        var index = this.formEdit.storecodes.indexOf(item)
        if (index !== -1) {
          this.formEdit.storecodes.splice(index, 1)
        }
      },
      addDomain() {
        this.formEdit.storecodes.push( {name: '', providerid: ''});
      },

      rClick(row, event, column) {

      },

      edit(row) {
        getApi.getBsOne(row.id).then((res)=>{
          this.formEdit = res.data.data[0];
          this.dialogVisible = true
        })

      },
      editGroup(item) {
        this.item = item;
        this.dialogVisible = true
      },
      del(row) {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getApi.delBsOne(row.id).then((res) => {
            if (res.data.errcode === 0) {
              this.$message({
                type: 'info',
                message: '删除成功'
              });
              this.getBsList(this.p,this.getShowStoreTree().levelid);

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


      clickEvent() {
        let dom = document.querySelectorAll('.clickEvent');
        dom.forEach((map) => {
          map.addEventListener('click', function (event) {
            event.stopPropagation()
            event.preventDefault()
          })
        })
      },


      getBsList(p, levelId,storeName = ''){
        getApi.getBsList(p,levelId, storeName).then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.list.forEach((item)=>{
              if(item.status === 1){
                item.status = "开启"
              }else {
                item.status = "关闭"
              }
              item.select = false
            });
            this.storeData = res.data.data.list;
            this.p.total = res.data.data.count;
          } else {

          }

        })
      },
      handleAvatarSuccess1(res, file) {
        this.formEdit.business_src = file.response.data.file_url;
      },
      handleAvatarSuccess2(res, file) {
        this.formEdit.businesscode_src = file.response.data.file_url;
      },
      handleAvatarSuccess3(res, file) {
        this.formEdit.account_src = file.response.data.file_url;
      },
      handleAvatarSuccess4(res, file) {
        this.formEdit.tax_src = file.response.data.file_url;
      },
      handleAvatarSuccess5(res, file) {
        this.formEdit.legalman_1 = file.response.data.file_url;
      },
      handleAvatarSuccess6(res, file) {
        this.formEdit.legalman_2 = file.response.data.file_url;
      },
      beforeAvatarUpload(file) {
        const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5;
        let img

        if(isJPG || isPNG){
          img = true
        }else {
          img = false;
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return img && isLt5M;
      },

      showLevel() {
        getLevel().then((res) => {
          if (res.data.errcode === 0) {
            this.setShowStoreTree({obj:{levelid: res.data.data[0].id, type: '', showAdd: false}});
            this.setStoreTreeList({list:res.data.data});
            this.getBsList(this.p, this.getShowStoreTree().levelid);
            recur(res.data.data,true,this.getShowStoreTree().levelid,this);
          } else {

          }
        })
      },
    },

    created() {
      if(this.getStoreTreeList().length === 0){
        this.showLevel();
      }else {
        this.getBsList(this.p, this.getShowStoreTree().levelid);
      }
    },


    mounted() {
      //this.clickEvent()

      Hub.$on('treeEventEditDel', (e) => {
        this.showLevel();
      });
      Hub.$on('showPermissionTree', (e) => {
        this.setShowStoreTree({obj:e});
        recur(this.getStoreTreeList(),false,this.getShowStoreTree().levelid,this);
      });
      Hub.$on('getBsList', (e) => {
        this.getBsList(this.p = {page: 1, size: this.p.size, total: 0}, e.levelid,this.searchName = '')
      });
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
      Hub.$off("treeEventEditDel");
      Hub.$off("showPermissionTree");
      Hub.$off("getBsList");

    }
  }
</script>

<style lang="less" scoped>



  .myStore {
    position: absolute;
    top: 40%;
    right: 0;
    background: white;
    z-index: 100;
    border-radius: 10px;
    border: 1px solid #E5EBF4
  }

  /*不能有相同的class名*/
  .myStore-enter-active, .myStore-leave-active {
    transition: all .5s;
  }

  .myStore-enter, .myStore-leave-to {
    right: -280px;
  }
</style>
