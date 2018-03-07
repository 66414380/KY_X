<template>
  <div>
    <xo-nav-path :navList="navList"></xo-nav-path>
    <el-card :style="{height:getBodyHeight -77 +'px'}" style="overflow-y: scroll" class="margin_t_10">

      <div style="border-bottom: 1px solid gainsboro">
        <h3 style="margin-bottom: 10px;">{{title}}</h3>

      </div>


      <el-form ref="ruleForm" :model="form" label-width="120px" class="margin_t_10">
        <el-form-item label="接收人邮箱" prop="sendto" :rules="{validator: checkEmail,required: true, trigger: 'blur'}">
          <el-input v-model="form.sendto" placeholder="请输入接收人邮箱" style="width: 300px">
          </el-input>
        </el-form-item>

        <el-form-item label="选择门店">
          <div class="flex_r">
            <el-input v-model="storeName" placeholder="请输入门店名称" style="width: 300px">
            </el-input>
            <el-button type="primary" @click="search(storeName)" class="margin_l_10">搜索</el-button>
          </div>
          <div class="flex_r margin_t_10">
            <div class="margin_r_10 fr_body">
              <div class="fr flex_a">
                组织结构
              </div>
              <el-tree class="tree "
                       :data="dataLeft"
                       :props="defaultProps"
                       @node-click="nodeClick"
                       node-key="id"
                       default-expand-all
                       :highlight-current="true"
                       :expand-on-click-node="false">
              </el-tree>
            </div>
            <el-transfer v-model="selectStore" :data="allStore"
                         :props="{key: 'base_store_id',label: 'storename'}"
                         :titles="['全部门店', '已选门店']">
            </el-transfer>
          </div>
        </el-form-item>
        <el-form-item label="接收时间" prop="sendtime" :rules="{type:'date',required: true, message: '请选择时间', trigger: 'change'}">
          <el-time-picker
            v-model="form.sendtime"
            placeholder="选择时间">
          </el-time-picker>

          <el-popover
            ref="popover"
            placement="top-start"
            title="提示："
            width="300"
            trigger="hover">
            <p>您将在每天的该时间点接收门店前一天的外卖营业日报</p>
          </el-popover>
          <el-button v-popover:popover style="border: none;position: relative" size="small"><i
            class="fa fa-question-circle-o icon-style"></i></el-button>
        </el-form-item>
      </el-form>

      <div class="flex">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button type="primary" @click="reset('ruleForm')">重置</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>

    </el-card>
  </div>


</template>

<script>
  import { mapActions,mapGetters } from 'vuex';
  import {getLeft} from '../../../utility/communApi'
  import {oneTwoApi} from '@/api/api.js'
  export default {

    data() {
      return {
        navList:[{name:"基础设置",url:''},{name:"日报推送",url:'/report/dailyPush'},{name:'',url:''}],
        tableHeight:0,
        storeName:'',
        dataLeft:[],
        title:'',
        form:{
          sendto:'',
          sendtime:''
        },
        allStore: [],
        selectStore: [],
        defaultProps: {
          value:'id',
          children: 'child',
          label: 'levelname'
        },
      }
    },
    computed: {
      ...mapGetters([
        'getBodyHeight'
      ]),
    },
    components:{
    },
    methods: {
      checkEmail(rule, value, callback){
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value === '') {
          callback(new Error('请输入邮箱地址'));
        }else {
          if(re.test(value)){
            callback()
          }else {
            callback(new Error('请输入正确邮箱地址'));
          }
        }
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.selectStore.length === 0){
                  this.$message({
                    message: '已选门店框无门店，请选择门店！',
                    type: 'warning'
                  });
            }else {
              let params;
              if(this.$route.params.data === 'add'){
                 params = {
                  redirect: "x2a.reportmail.create",
                  storeid:this.selectStore.join(','),
                  sendto: this.form.sendto,
                  sendtime: new Date(this.form.sendtime).Format('hh:mm:ss')
                };

              }else {
                 params = {
                  redirect: "x2a.reportmail.update",
                  id:this.$route.params.data,
                  storeid:this.selectStore.join(','),
                  sendto: this.form.sendto,
                  sendtime: new Date(this.form.sendtime).Format('hh:mm:ss')
                };
              }
              oneTwoApi(params).then((res) => {
                if(res.errcode === 0){
                  this.$message('操作成功');
                  this.$router.go(-1)
                }
              });

            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      reset(formName){
        this.allStore = [];
        this.selectStore = [];
        this.storeName = '';
        this.$refs[formName].resetFields();
      },
      nodeClick(item) {
        this.search('',item.id)
      },
      search(storeName = '',levelId = '') {
        let params = {
          redirect: 'x2.store.index',
          levelId: levelId,
          storeName: storeName,
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.allStore = res.data.list;
          }
        })
      },


    },
    created(){
      if(this.$route.params.data === 'add'){
        this.title = "新增";
        this.navList[2].name = "新增"
      } else {
        this.title = "修改";
        this.navList[2].name = "修改";
        let params = {
          redirect: 'x2a.reportmail.view',
          id: this.$route.params.data,

        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.form.sendto = res.data[0].sendto;
            let [hh,mm,ss] = res.data[0].sendtime.split(':');
            this.form.sendtime = new Date(2018, 1, 1, hh, mm,ss);
            this.allStore = res.data[0].stores;
            let list = res.data[0].stores.map(item=>item.base_store_id);
            this.selectStore = list;
          }
        })
      }
      getLeft('x2').then((res) => {
        if (res.data.errcode === 0) {
          this.dataLeft = res.data.data
        }
      });
    },
    updated(){

    },
    mounted() {


    },
    destroyed(){

    }
  }
</script>

<style scoped>
  .fr {
    height: 36px;
    background: #fbfdff;
    border-top: 1px solid #d1dbe5;
    border-left: 1px solid #d1dbe5;
    border-right: 1px solid #d1dbe5;
    box-sizing: border-box;
    padding-left: 20px;
  }

  .fr_body {
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
  }

  .tree {
    width: 300px;
    height: 284px;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .icon-style {
    font-size: 22px;
    color: red;
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translateY(-70%) translateX(65%);
  }
</style>
