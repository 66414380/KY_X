<template>
  <div>
    <div class="padding_b_10">
      <xo-nav-path :navList="navList"></xo-nav-path>
    </div>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="美团" name="mt">


          <el-form label-position="right" ref="form" :model="meiTuanDialog">

            <!--<div class="flex_r margin_t_10">-->

            <!--<div>绑定映射</div>-->
            <!--<div>-->
            <!--&lt;!&ndash;<img class="margin_l_10 margin_r_10" src="static/img/WX20171103-105446.png" alt="">&ndash;&gt;-->
            <!--</div>-->
            <!--<div>-->
            <!--<el-button type="text">复制绑定链接</el-button>-->
            <!--</div>-->
            <!--</div>-->
            <!--<div>-->
            <!--<el-button type="primary" size="small">点击去绑定美团外卖</el-button>-->
            <!--</div>-->

            <div v-show="showMt === false">

            <!--<el-form-item label-width="200px" label="授权门店ID" class="margin_b_10">-->
              <!--<el-input v-model="meiTuanDialog.store_name" class="input_width"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label-width="200px" label="" class="margin_b_10">
            <el-button type="primary" size="small" @click="bindData('mt')">点击去绑定美团外卖</el-button>
            </el-form-item>
            </div>

            <div v-show="showMt === true">
              <el-form-item label-width="200px" label="美团映射码" class="margin_b_10">
                <div>{{dataList[0]?dataList[0].wm_store_id:""}}</div>
              </el-form-item>

              <el-form-item label-width="200px" label="美团门店名称" class="margin_b_10">
                <div>{{dataList[0]?dataList[0].wm_store_name:""}}</div>
              </el-form-item>


              <el-form-item label-width="200px" label="" class="margin_b_10">
              <el-button type="primary" size="small" @click="unBindData('mt')">解除绑定</el-button>
              </el-form-item>

              <xo-bind-page :send_message="send_message" :auth_accept="auth_accept" :dataList="dataList"></xo-bind-page>
            </div>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="饿了么" name="el">

          <el-form label-position="right" ref="eleDialog" :model="eleDialog">

            <div v-show="showEl === false">
              <el-form-item label-width="200px" label="授权门店ID"  prop="wm_store_id" :rules="{required: true, message: '请输入授权门店ID', trigger: 'blur'}">
                <el-input v-model="eleDialog.wm_store_id" class="input_width"></el-input>
              </el-form-item>

              <el-form-item label-width="200px" label="" class="margin_b_10">
                <el-button type="primary" size="small" @click="bindData('el')">点击授权饿了么外卖</el-button>
              </el-form-item>
            </div>



            <div v-show="showEl === true">
            <el-form-item label-width="200px" label="饿了么门店ID" class="margin_b_10">
              <div>{{dataList[0]?dataList[0].wm_store_id:""}}</div>
            </el-form-item>
              <el-form-item label-width="200px" label="饿了么门店名称" class="margin_b_10">
                <div>{{dataList[0]?dataList[0].wm_store_name:""}}</div>
              </el-form-item>
              <el-form-item label-width="200px" label="" class="margin_b_10">
                <el-button type="primary" size="small" @click="unBindData('el')">解除绑定</el-button>
              </el-form-item>


              <xo-bind-page :send_message="send_message" :auth_accept="auth_accept" :dataList="dataList"></xo-bind-page>
            </div>
          </el-form>



        </el-tab-pane>
        <el-tab-pane label="百度" name="bd">

          <div class="margin_b_10">绑定映射</div>

          <el-form label-position="right" ref="baiduDialog" :model="baiduDialog">
            <div v-show="showBd === false">
              <el-form-item label-width="200px" label="百度门店ID"  prop="wm_store_id" :rules="{required: true, message: '请输入百度门店ID', trigger: 'blur'}">
                <el-input v-model="baiduDialog.wm_store_id" class="input_width"></el-input>
              </el-form-item>
              <!--<el-form-item label-width="200px" label="百度门店名称" class="margin_b_10">-->
              <!--<el-input v-model="baiduDialog.input2" class="input_width"></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label-width="200px" label="合作方账号"  prop="source" :rules="{required: true, message: '请输入合作方账号', trigger: 'blur'}">
                <el-input v-model="baiduDialog.source" class="input_width"></el-input>
              </el-form-item>
              <el-form-item label-width="200px" label="合作方密钥"  prop="key" :rules="{required: true, message: '请输入合作方密钥', trigger: 'blur'}">
                <el-input v-model="baiduDialog.key" class="input_width"></el-input>
              </el-form-item>

              <el-form-item label-width="200px" label="" class="margin_b_10">
                <el-button type="primary" size="small" @click="bindData('bd')">点击绑定百度外卖</el-button>
              </el-form-item>
            </div>


            <div v-show="showBd === true">
              <el-form-item label-width="200px" label="百度门店ID" class="margin_b_10">
                <div>{{dataList[0]?dataList[0].wm_store_id:""}}</div>
              </el-form-item>
              <el-form-item label-width="200px" label="百度门店名称" class="margin_b_10">
                <div>{{dataList[0]?dataList[0].wm_store_name:""}}</div>
              </el-form-item>
              <el-form-item label-width="200px" label="" class="margin_b_10">
                <el-button type="primary" size="small" @click="unBindData('bd')">解除绑定</el-button>
              </el-form-item>

              <xo-bind-page :send_message="send_message" :auth_accept="auth_accept" :dataList="dataList"></xo-bind-page>
            </div>


          </el-form>

        </el-tab-pane>

      </el-tabs>



  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';
  import xoBindPage from './BindPage'
  import $ from 'jquery';
  import qs from 'qs'
  export default {
    components: {
      xoBindPage
    },
    data() {
      return {
        baiduDialog: {
          wm_store_id: '',
          source: '',
          key: '',
        },
        eleDialog: {
          wm_store_id: '',
        },
        meiTuanDialog:{
          store_name: '',
        },
        activeName: 'mt',
        auth_accept:false,
        send_message:false,
        dataList:[],
        showMt:'',
        showEl:'',
        showBd:'',
        navList: [{name: "门店管理", url: '/x2OperationScheme/storeManagement'},{name: "外卖平台映射", url: ''}],

        test:""
      }
    },
    watch: {},
    methods: {

      save(id,accept,message){
        //点击保留外卖映射弹窗的信息
        let auth_accept,send_message;
        if (accept === false){
          auth_accept = 0
        } else {
          auth_accept = 1
        }
        if (message === false){
          send_message = 0
        } else {
          send_message = 1
        }
        let params = {
          redirect: "x2.store.setWmData",
          id: id,
          auth_accept:auth_accept,
          send_message:send_message	,

        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.$message(res.errmsg);
          }
        })
      },
      unBindData(type){
        // this.$confirm('此操作将解除绑定, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //
        // }).catch(() => {
        //
        // });

        //解除绑定
        let  params = {
          redirect: "x2.store.unbindStore",
          storeId: this.$route.params.id,
          type:type,
        };

        this.ajax(params)

      },

      ajax(params){
        $.ajax({
          url:`${this.$jqUrl}/index.php?controller=admin&action=api&token=${this.$localStorage.get('token')}`,
          type:'POST',
          async:false,
          data:qs.stringify(params),
          timeout:5000,
          dataType:'json',
          success:(data)=>{
            if(data.errcode === 0){
              window.open(data.data,"_blank")
            } else {
              this.$message({
                message: data.errmsg,
                type: 'warning'
              });
            }

          },
          error:function(xhr,textStatus){
          }
        })
      },

      bindData(name){
        //绑定
        let params;
        switch (name){
          case "mt":
             params = {
              redirect: "x2.store.bindStore",
              store_id: this.$route.params.id,
              type:"mt",
               store_name:this.meiTuanDialog.store_name,
            };
            let tempWindow1 = window.open();
            oneTwoApi(params).then((res) => {
              if (res.errcode === 0) {
                //this.$message(res.errmsg);
                //this.getWmData('mt');
                tempWindow1.location = res.data;
              }
            });
            break;

          case "el":
          this.$refs['eleDialog'].validate((valid) => {
              if (valid) {
                params = {
                  redirect: "x2.store.bindStore",
                  store_id: this.$route.params.id,
                  type:"el",
                  wm_store_id:this.eleDialog.wm_store_id,
                };

                this.ajax(params)

              } else {
                console.log('error submit!!');
                return false;
              }
            });

            break;

          case "bd":
            this.$refs['baiduDialog'].validate((valid) => {
              if (valid) {
                params = {
                  redirect: "x2.store.bindStore",
                  store_id: this.$route.params.id,
                  type:"bd",
                  wm_store_id:this.baiduDialog.wm_store_id,
                  source:this.baiduDialog.source,
                  key:this.baiduDialog.key,
                };

                this.ajax(params)

              } else {
                console.log('error submit!!');
                return false;
              }
            });

            break;
        }

      },

      handleClick(event) {
        this.showMt = '';
        this.showEl = '';
        this.showBd = '';
        // this.dataList = [];
        switch (this.activeName){
          case "mt":
            this.getWmData('mt');
            break;

          case "el":
            this.getWmData('el');
            break;

          case "bd":
            this.getWmData('bd');
            break;

        }

      },

      getWmData(type){
        let params = {
          redirect: "x2.store.getWmData",
          storeId: this.$route.params.id,
          type:type

        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            if(res.data.length !== 0){
              res.data.forEach((item)=>{
                if(item.auth_accept === 0){
                  this.auth_accept = false
                } else {
                  this.auth_accept = true
                }
                if(item.send_message === 0){
                  this.send_message = false
                } else {
                  this.send_message = true
                }
              });

              if(res.data[0].wm_store_source === 'mt'){
                this.showMt = true;
              }
              if(res.data[0].wm_store_source === 'el'){
                this.showEl = true;
              }
              if(res.data[0].wm_store_source === 'bd'){
                this.showBd = true;
              }

            } else {
              this.showMt = false;
                this.showEl = false;
                this.showBd = false
            }

            this.dataList = res.data

          }
        })
      }

    },
    created() {
      this.getWmData('mt')

    },

    mounted() {

    },
    updated() {


    },
    destroyed(){

    }
  }
</script>

<style scoped>
.input_width {
  width: 400px;
}

</style>
