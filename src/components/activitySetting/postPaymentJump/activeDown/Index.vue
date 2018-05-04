<template>
  <div id="newIssued">
    <div class="contentMsg">
      <xo-nav-path :navList="navList"></xo-nav-path>
    </div>
    <div class="contentMsg">
      <el-card :style="{ height: height + 'px'}" style="overflow: auto;">
        <el-row>
          <el-col :span="24" style="border-bottom: 1px solid gainsboro" class="margin_b_10">
            <h3 style="margin-bottom: 10px;">添加门店</h3>
          </el-col>
          <el-form ref="ruleForm" :model="form" label-width="120px" :rules="rules">

            <el-form-item label="方案名称:" prop="name" :rules="{type:'number',required: true, message: '请选择方案名称', trigger: 'change'}">
              <el-row>
                <el-col :span="16">
                  <!--<el-input class="input_width" v-model="form.name" placeholder="请输入方案名称"></el-input>-->

                  <el-select v-model="form.name" placeholder="请选择">
                    <el-option
                      v-for="item in jumpList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>

            <!-- 选择门店 -->
            <el-col :span="24">
              <el-form-item label="选择门店">
                <el-row>
                  <el-col :span="24">
                    <el-col :span="16">
                      <el-input v-model="storeName" placeholder="门店名称"></el-input>
                    </el-col>
                    <el-col :span="4" :offset="1">
                      <el-button type="primary" @click="search(storeName)">搜索</el-button>
                    </el-col>
                  </el-col>

                </el-row>
                <el-row class="margin_t_10">
                  <el-col :span="24">
                    <el-col class="flex_a">
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
                                   :props="{
                                      key: 'id',
                                      label: 'storename'
                                    }"
                                   :titles="['全部门店', '已选门店']"
                      ></el-transfer>
                    </el-col>

                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>

            <!-- 下发规则 -->
            <el-col :span="24">
              <el-form-item label="下发规则:">

                <el-col :span="6">
                  <el-radio class="radio" v-model="form.rule" label="1">替换</el-radio>
                  <el-popover
                    ref="popover1"
                    placement="top-start"
                    title="替换:"
                    width="200"
                    trigger="hover">
                    <p>指: 替换原有的</p>
                  </el-popover>
                  <el-button v-popover:popover1 style="border: none;position: relative" size="small"><i
                    class="fa fa-question-circle-o icon-style"></i></el-button>
                </el-col>

                <el-col :span="6">
                  <el-radio class="radio" v-model="form.rule" label="2">更新</el-radio>
                  <el-popover
                    ref="popover2"
                    placement="top-start"
                    title="更新:"
                    width="200"
                    trigger="hover">
                    <p>1、若下发账户和原来的配置均有支付宝，则用新账户替换原有的账户；</p>
                    <p>2、若下发账户中有支付宝，原来的配置无支付宝，则新增该账户；</p>
                    <p>3、若下发账户中无支付宝，原来的配置有支付宝，则保留原有的账户；</p>
                  </el-popover>
                  <el-button v-popover:popover2 style="border: none;position: relative" size="small"><i
                    class="fa fa-question-circle-o icon-style"></i></el-button>
                </el-col>
              </el-form-item>

            </el-col>

            <!-- 是否停用 -->
            <el-col :span="24">
              <el-form-item label="是否停用:">
                <el-checkbox v-model="form.checked">停用</el-checkbox>
                <el-popover
                  ref="popover3"
                  placement="top-start"
                  title="停用:"
                  width="200"
                  trigger="hover">
                  <p>指：停用选择的账号的支付方式通道</p>
                </el-popover>
                <el-button v-popover:popover3 style="border: none;position: relative" size="small"><i
                  class="fa fa-question-circle-o icon-style"></i></el-button>
              </el-form-item>

            </el-col>

            <!-- 执行时间 -->
            <el-col :span="24">
              <el-form-item label="执行时间">
                <el-radio class="radio" v-model="form.runTime" label="1">立即执行</el-radio>
                <el-radio class="radio" v-model="form.runTime" label="2">定时执行</el-radio>
              </el-form-item>
              <el-form-item v-if="form.runTime == '2'">
                <el-col :span="24">
                  <el-col :span="7">
                    <div class="block">
                      <el-date-picker
                        v-model="form.runTimeValue"
                        type="datetime"
                        placeholder="选择日期时间">
                      </el-date-picker>
                    </div>
                  </el-col>

                  <!--<el-col :span="10">-->
                    <!--<el-card>-->
                      <!--若执行失败，则在-->
                      <!--<el-input v-model="form.delayTime" placeholder="请输入执行的时间"></el-input>-->
                      <!--分钟后重新发起执行-->
                      <!--(为空则不发起）-->
                    <!--</el-card>-->
                  <!--</el-col>-->
                </el-col>
              </el-form-item>
            </el-col>

          </el-form>
          <el-col :span="24">
            <el-col :span="12" class="flex-jc">

                <el-button @click="$router.go(-1)">取消</el-button>

            </el-col>
            <el-col :span="12" class="flex-jc">
              <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-col>
          </el-col>
        </el-row>
      </el-card>
    </div>

  </div>
</template>
<script>

  import {mapGetters, mapActions} from 'vuex'
  import {oneTwoApi} from '@/api/api.js'
  import {getLeft,getLevel} from '../../../utility/communApi'
  import getApi from './activeDown.service'
  import getApi1 from '../postPaymentJump.service'
  import getApi2 from '../../../infrastructure/PermissionManagement/user/user.service'
  export default {
    data() {
      return {
        navList: [{name: "活动方案", url: '/activitySetting/downRecord'},{name: "新增下发", url: ''}],
        form: {
          name:'',
          data: [], // 已选门店key
          data2: [],
          value: '',
          rule: '1',
          runTime: '1',
          runTimeValue: '',
          delayTime: '',
          store: [],

          checked: false
        },
        height: 0,
        jumpList:[],
        allStore: [],
        selectStore: [],
        storeName: '',
        dataLeft:[],
        rules: {},
        defaultProps: {
          value:'id',
          children: 'child',
          label: 'levelname'
        },
      }
    },
    props: {

    },
    components: {

    },
    computed: {
      ...mapGetters([
        'getTopHeight',
      ]),
    },
    methods: {
      nodeClick(item) {
        this.search('',item.id)
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            getApi.jumpUseAdd(this.form, this.selectStore.join(',')).then((res) => {
              if (res.data.errcode === 0) {
                this.$message("提交成功");
                this.$router.go(-1);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleNodeClick(data) {
        console.log(data);
      },



      search(storeName = '',levelId = '') {


        getApi2.getBsList(levelId,storeName).then((res)=>{
          if (res.data.errcode === 0) {
            this.allStore = res.data.data.list;
          }
        })
      },

    },
    created(){
      getLevel().then((res) => {
        if (res.data.errcode === 0) {
          this.dataLeft = res.data.data
        }
      });



      getApi1.getJumpList({page: 1, size: 1000, total: 0},this.$route.params.id, '').then((res) => {

        if (res.data.errcode === 0) {
          this.jumpList = res.data.data.list;

        }
      })


    },
    mounted() {
      // 高度调整
      var totalH = window.innerHeight - this.getTopHeight;
      var topH = document.querySelector('.contentMsg').clientHeight;
      this.height = totalH - topH - 50;

    }
  }
</script>
<style scoped lang="less">
  .contentMsg {
    padding: 0 0 25px 0;
  }

  .selectedStore {
    padding-bottom: 10px;
    border-bottom: 1px solid gainsboro;
  }

  .cell {
    margin-top: 20px;
  }

  .cell-b {
    margin-bottom: 20px;
  }

  .icon-style {
    font-size: 22px;
    color: red;
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translateY(-70%) translateX(65%);
  }

  .plusBtn {
    border: none;
    color: red;
    font-size: 35px;
    padding: 0 9px 0 9px;
  }

  .minusBtn {
    border: none;
    color: deepskyblue;
    font-size: 35px;
    padding: 0 9px 0 9px;
  }

  .m-storeCode {
    font-size: 30px;
  }

  .flex_sc {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .el-transfer-panel__body {
    box-sizing: content-box;
  }

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
</style>

