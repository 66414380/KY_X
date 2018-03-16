<template>
  <div >

    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_sb">
        <div class="flex_1">
          <el-button size="small" @click="handle('新增')" >新增模板消息</el-button>

        </div>
        <div class="flex_r">

        </div>
      </div>

    </div>
    <el-table :data="storeData" border :height="tableHeight"  >
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="type" width="100" label="业务类型">
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="template_id" label="消息模板ID" >
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="title" width="120" label="消息模板类型">
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="status" label="状态" width="100">
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="260">
        <template slot-scope="scope">
          <el-button  type="text" @click="show(scope.row.id)" >预览</el-button>
          <el-button  type="text" @click="handleStatus(scope.row)" >{{scope.row.handleStatus}}</el-button>
          <el-button size="small" type="primary" @click="handle('修改',scope.row)" >修改</el-button>
          <el-button  type="text" @click="handleUrl(scope.row.id)" >设置跳转链接</el-button>
          <!--<el-button size="small" @click="del(scope.row.id,scope.row.status)" >删除</el-button>-->

        </template>
      </el-table-column>
    </el-table>


    <footer>
    </footer>

    <!--弹窗新增/修改-->
    <el-dialog
      :title="name"
      :visible.sync="dialogVisible"
      @open="dialogOpen"
      @close="dialogClose"
      width="30%" >
      <el-form ref="formRules" :model="form" label-width="120px">
        <el-form-item label="业务类型" prop="type" :rules="{type:'number',required: true, message: '请选择业务类型', trigger: 'change'}">
          <el-select v-model="form.type" placeholder="请选择" class="form_width">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="消息模板ID">
          <el-input v-model="form.template_id" disabled class="form_width"></el-input>
        </el-form-item>

        <el-form-item label="消息模板类型" prop="title" :rules="{required: true, message: '请选择消息模板类型', trigger: 'change'}">
          <el-select v-model="form.title" placeholder="请选择消息模板类型" @change="handleTemplate" @visible-change="canSelect" class="form_width">
            <el-option
              v-for="item in templateList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>


        <div class="flex_r">
          <div>
            <el-form-item v-for="(item,index) in form.data" :key="item.value" :label="item.name"
                          :prop="'data.' + index + '.value'"
                          :rules="{required: true, message: '必填项', trigger: 'change'}">

              <div class="flex_r">
                <el-select v-model="item.value" placeholder="请选择">
                  <el-option
                    v-for="item1 in messageTemplateList"
                    :key="item1.id"
                    :label="item1.name"
                    :value="item1.id">
                  </el-option>
                </el-select>

                <el-color-picker class="margin_l_10" v-model="item.color">
                </el-color-picker>
              </div>
              <!--<el-form-item label="" :prop="'data.' + index + '.custom'" :rules="{required: true, message: 'xx', trigger: 'blue'}">-->
              <!--</el-form-item>-->
              <el-input class="margin_t_10 " v-if="item.value==='custom'" v-model="item.custom"  style="width: 193px"></el-input>

            </el-form-item>
          </div>

          <el-card class="margin_l_10 flex_1" style="width: 240px;height: 325px" v-if="form.template_id !== ''">
            <h3 class="margin_b_10">内容预览</h3>
            <div class="margin_b_10" v-for="(item,index) in form.data" :key="item.value">
              <span>{{item.name}}:</span>
              <span :style="{'color':item.color}" v-if="item.value !== 'custom'" v-for="(item1,index) in messageTemplateList">
                <span v-if="item.value === item1.id">{{item1.preview_name}}</span>
              </span>
              <span :style="{'color':item.color}" v-if="item.value === 'custom'">{{item.custom}}</span>
            </div>
          </el-card>
        </div>


        <!--<el-form-item label="状态:">-->

          <!--<el-switch-->
            <!--v-model="form.status"-->
            <!--on-color="#13ce66"-->
            <!--off-color="#ff4949">-->
          <!--</el-switch>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="跳转地址">-->
          <!--<el-input v-model="form.url" class="form_width"></el-input>-->
        <!--</el-form-item>-->

        <div class="margin_t_10">
          <el-button type="primary" @click="submitFrom('formRules')">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      title=""
      :visible.sync="dialogVisible2"
      width="30%" size="tiny" @close="closePreview">
      <el-input
        type="textarea"
        :rows="8"
        placeholder="请输入内容"
        v-model="previewList">
      </el-input>
    </el-dialog>

    <el-dialog
      title=""
      :visible.sync="dialogVisible3"
      width="30%" size="tiny" @close="closeUrl">


      <el-form :model="urlObj">
        <el-form-item label="">
          <div class="flex_a">
            <el-radio-group v-model="urlObj.radio2">
              <el-radio :label="1">跳转h5</el-radio>
              <el-radio :label="2">跳转小程序</el-radio>
            </el-radio-group>
            <div class="margin_l_10">(二选一)</div>
          </div>

        </el-form-item>

        <el-form-item label="" v-if="urlObj.radio2 === '' || urlObj.radio2 === 1">
          <el-input v-model="urlObj.url" class="form_width" placeholder="请输入网址">
          </el-input>
        </el-form-item>

        <el-form-item label="小程序APPID" v-if="urlObj.radio2 === 2">
          <el-input v-model="urlObj.wx_appid" class="form_width" placeholder="请输入网址">
          </el-input>
        </el-form-item>

        <el-form-item label="页面路径" v-if="urlObj.radio2 === 2">
          <el-input v-model="urlObj.pagepath" class="form_width" placeholder="请输入网址">
          </el-input>
        </el-form-item>

      </el-form>
      <div class="margin_t_10">
        <el-button type="primary" @click="submitFrom3()">确认</el-button>
        <el-button @click="dialogVisible3 = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {getScrollHeight} from '../../../utility/getScrollHeight'

  import {oneTwoApi} from '@/api/api.js'
  import { mapActions,mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters([
        'getTreeArr'
      ]),
    },
    components: {

    },
    data() {
      return {
        typeList:[],
        roleList: [],
        form: {
          type: '',
          template_id:'',
          title:'',
          status: true,
          data:[],
          url:''
        },
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3:false,
        urlObj:{id:'',url:'',radio2:'',pagepath:'',wx_appid:''},
        tableHeight: 0,
        navList: [{name: "基础设置", url: ''}, {name: "公众号管理", url: '/infrastructure/PublicManagement'}, {name: "模板消息配置", url: ''}],
        name: '',
        templateList:[],
        selectOK:false,
        templateDataTemp:{},
        storeData: [],
        previewList:'',
        messageTemplateList:[]

      }
    },
    watch: {},
    methods: {
      submitFrom3(){
        let params;
        if(this.urlObj.radio2 === 1){
           params = {
            redirect: "x1.privateTemplate.setJumpUrl",
            id:this.urlObj.id,
            url:this.urlObj.url,
          };
        }else {
          params = {
            redirect: "x1.privateTemplate.setJumpUrl",
            id: this.urlObj.id,
            wx_appid: this.urlObj.wx_appid,
            pagepath: this.urlObj.pagepath,
          }
        };

        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.$message('操作成功');
            this.dialogVisible3 = false;
          }
        })
      },
      handleStatus(data){
        if(data.status === "开启"){
          this.$confirm(
            '该模板消息正在使用中，如关闭则顾客在微信中会收不到相应的模板消息提醒哦～', '关闭', {
              confirmButtonText: '确定关闭',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            this.updateStatus(data.id,0)
          }).catch(() => {
            //
          });
        } else {
          this.updateStatus(data.id,1)
        }
      },
      updateStatus(id,status){
        let params = {
          redirect: "x1.privateTemplate.updateStatus",
          id: id,
          status:status
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.$message('操作成功');
            this.showResouce(this.$route.params.id)
          }
        })
      },
      submitFrom(formRules) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            let title,status,redirect;
            this.templateList.forEach((item)=>{
              if(item.id === this.form.template_id){
                title = item.name
              }
            });
            status =  this.form.status === true ? this.form.status = 1 : this.form.status = 0;

            if(this.name === '新增'){
              redirect = 'x1.privateTemplate.add'
            } else {
              redirect = 'x1.privateTemplate.update'
            }

            let params = {
              redirect: redirect,
              id:this.form.id,
              wx_id: this.$route.params.id,
              type:this.form.type,
              status:status,
              title:title,
              data:window.JSON.stringify(this.form.data),
              template_id:this.form.template_id,
              url:this.form.url,
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.$message('操作成功');
                this.dialogVisible = false;
                this.showResouce(this.$route.params.id)
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      canSelect(e){
        (e === true)?this.selectOK = true:this.selectOK = false
      },
      handleTemplate(e){
        if(e !== ""){
          if(this.selectOK === true){
            this.form.template_id = e;
            this.form.data= [];
            this.templateDataTemp[e].forEach((item)=>{
              this.form.data.push({key:item.value,value: "", name: item.name, color: "#20a0ff", custom: ""})
            })
          }
        }
      },
      closeUrl(){
        this.urlObj = {id:'',url:'',radio2:'',pagepath:'',wx_appid:''}
      },
      closePreview(){
        this.previewList = ''
      },
      show(id){
        this.dialogVisible2 = true;
        //预览模板
        let params = {
          redirect: "x1.privateTemplate.preview",
          id:id
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.previewList = res.data.preview

          }
        })
      },
      handleUrl(id){
        this.dialogVisible3 = true;
        //模板详情
        let params = {
          redirect: "x1.privateTemplate.getInfo",
          id: id,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            if(res.data.url === '' && res.data.wx_appid === ''){
              this.urlObj.radio2 = 1
            }else {
              if(res.data.url === ''){
                this.urlObj.radio2 = 2
              }else {
                this.urlObj.radio2 = 1
              }

            }
            this.urlObj.url = res.data.url;
            this.urlObj.id = res.data.id;
            this.urlObj.wx_appid = res.data.wx_appid;
            this.urlObj.pagepath = res.data.pagepath
          }
        })
      },
      dialogOpen() {
        //获取业务类型列表
        let params = {
          redirect: "x1.privateTemplate.getTypeList"
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.typeList = res.data;

          }
        })

        //获取所有消息模板
        let params1 = {
          redirect: "x1.privateTemplate.getTemplateList",
          wx_id:this.$route.params.id
        };
        oneTwoApi(params1).then((res) => {
          if(res.errcode === 0){
            this.templateList = res.data.type;
            this.templateDataTemp = res.data.list;
          }
        });
        //获取当前所有内容选项
        let params2 = {
          redirect: "x1.privateTemplate.getMessageTemplateList"
        };
        oneTwoApi(params2).then((res) => {
          if(res.errcode === 0){
            this.messageTemplateList = res.data;

          }
        })
      },
      dialogClose(){
        this.form = {
          type: '',
          template_id:'',
          title:'',
          status: true,
          data:[],
          url:''
        };
        this.previewList = '';
        this.$refs['formRules'].resetFields();
      },

      delTemplate(id){
        //删除模板
        let params = {
          redirect: "x1.privateTemplate.del",
          id: id,
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.$message({
              type: 'info',
              message: '删除成功'
            });
            this.showResouce(this.$route.params.id)
          }
        })
      },

      del(id,status){
        if(status === '开启'){
          this.$confirm(
            '该模板消息正在使用中，如删除顾客在微信中会收不到模板消息提醒哦～', '删除', {
              confirmButtonText: '删除',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

            this.delTemplate(id)

          }).catch(() => {
            //
          });
        }else {
          this.$confirm(
            '确认是否删除？', '删除', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

            this.delTemplate(id)

          }).catch(() => {
            //
          });
        }
      },

      handle(name,row) {
        this.name = name;
        this.dialogVisible = true;

        if(name === '修改'){
          //模板详情
          let params = {
            redirect: "x1.privateTemplate.getInfo",
            id: row.id,

          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              res.data.status = (res.data.status === 1)? res.data.status = true:res.data.status = false;
              this.form = res.data;

            }
          })
        }
      },


      showResouce(id) {
        //获取消息模板列表
        let params = {
          redirect: "x1.privateTemplate.getList",
          id: id,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.storeData = res.data;
            res.data.forEach((item)=>{
              if(item.status === "开启"){
                item.handleStatus = "关闭"
              }else {
                item.handleStatus = "开启"
              }
            })
          }
        })


      }
    },
    created() {
      this.showResouce(this.$route.params.id)

    },
    mounted() {

    },
    updated() {
      getScrollHeight().then((h) => {
        this.tableHeight = h;
      })
    },
    destroyed(){

    }
  }
</script>

<style scoped lang="less">
  .form_width{
    width: 260px;
  }


</style>
