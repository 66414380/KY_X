<template>

  <div>
    <div class="margin_b_10">
      <xo-nav-path :navList="navList"></xo-nav-path>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基础信息" name="first">
        <div class="m-seeAddStore"  v-show="getTreeArr['编辑基础信息']">
          <div class="m-seeAddStore-basic">
            <el-row>
              <el-col :span="16">
                <el-form ref="form" :data="storeData" label-width="180px">
                  <el-form-item label="门店名称:">
                    <span>{{storeData.name}}</span>
                  </el-form-item>
                  <el-form-item label="门店编码:">
                    <span>{{storeData.code}}</span>
                  </el-form-item>
                  <el-form-item label="门店地址:">
                    <span>{{storeData.address}}</span>
                  </el-form-item>
                  <el-form-item label="门店电话:">
                    <span>{{storeData.tel}}</span>
                  </el-form-item>
                  <el-form-item label="第三方编码:">
                    <div v-for="(item,index) in storeData.storeCode">
                      <span>{{item.code1}} -- {{item.code2}}</span>

                    </div>
                    <span class="padding_l_10" style="color: red">此处为基础设置中门店库里设置的第三方编码，不可修改</span>
                  </el-form-item>

                  <el-form-item label="">

                    <div v-for="(domain, index) in storeData.thirdCode" class="flex_r margin_b_10">

                      <div style="width:150px">
                        <el-input v-model="domain.code1" style="width: 150px;"
                                  placeholder="请输入第三方名称"></el-input>
                      </div>
                      <div class="m-rank">
                        <div class="m-rank-child"></div>
                      </div>
                      <div style="width:150px">
                        <el-input v-model="domain.code2" style="width: 150px;"
                                  placeholder="请输入第三方编码"></el-input>
                      </div>
                      <div class="flex_sb" style="width:80px">
                        <div class="m-storeCode margin_l_10" @click="addDomainThird()">
                          <i class="fa fa-plus-circle" aria-hidden="true"></i>
                        </div>
                        <div v-if="index !== 0" class="m-storeCode margin_l_10"
                             @click.prevent="removeDomainThird(index)">
                          <i class="fa fa-minus-circle" aria-hidden="true"></i>
                        </div>
                      </div>

                    </div>

                  </el-form-item>
                  <el-form-item label="所属门店标签:">
                    <el-select v-model="storeData.storeLabelId" multiple filterable placeholder="请选择">
                      <el-option
                        v-for="(item,index) in storeGroup"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <!--<el-form-item label="公众号:">-->
                  <!--<el-select v-model="storeData.wx_id" placeholder="请选择">-->
                  <!--<el-option-->
                  <!--v-for="item in form.options"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                  <!--</el-option>-->
                  <!--</el-select>-->
                  <!--</el-form-item>-->
                  <el-form-item label="营业时间:">


                    <el-time-select
                      v-model="storeData.openTimeStart"
                      :picker-options="{
                        start: '00:00',
                        step: '00:15',
                        end: '24:00'
                      }"
                      placeholder="开始时间">
                    </el-time-select>

                    <!--<el-time-picker-->
                      <!--v-model="storeData.openTimeStart"-->
                      <!--:picker-options="{-->
                      <!--selectableRange: '00:00:00 - 24:00:00'-->
                      <!--}"-->
                      <!--placeholder="开始时间">-->
                    <!--</el-time-picker>-->


                    --
                    <el-time-select
                      v-model="storeData.openTimeEnd"
                      :picker-options="{
                       start: '00:00',
                       step: '00:15',
                       end: '24:00'
                      }"
                      placeholder="结束时间">
                    </el-time-select>

                    <!--<el-time-picker-->
                      <!--v-model="storeData.openTimeEnd"-->
                      <!--:picker-options="{-->
                      <!--selectableRange: '00:00:00 - 24:00:00'-->
                      <!--}"-->
                      <!--placeholder="结束时间">-->
                    <!--</el-time-picker>-->



                  </el-form-item>
                  <el-form-item label="预结单提示语:">
                    <el-input v-model="storeData.orderPrompting"></el-input>
                  </el-form-item>
                  <el-form-item label="支付成功后跳转的URL:">
                    <el-input v-model="storeData.payJumpUrl"></el-input>
                    <span>（为空表现不跳转）</span>
                  </el-form-item>
                  <el-form-item label="URL是否带门店编码:">
                    <el-radio-group v-model="storeData.urlCode">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>

                    </el-radio-group>
                  </el-form-item>
                </el-form>

                <div class="flex">
                  <el-button type="primary" @click="editStoreBase()">保存</el-button>
                  <el-button @click="$router.go(-1)">取消</el-button>

                </div>
              </el-col>
              <el-col :span="8">

              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收款账户" name="second" >
        <div class="m-seeAddStore" v-show="getTreeArr['编辑收款账户']">
          <div class="m-seeAddStore-basic">
            <el-row>
              <el-col :span="24">

                <el-form ref="formRules" :model="formAccount" label-width="0px">
                  <div class="cell_title margin_b_10">
                    正在使用中的账户
                  </div>
                  <div class="flex_r margin_b_10" v-for="(item,index) in formAccount.account">

                    <el-form-item label="" :prop="'account.' + index + '.paymentId'"
                                  :rules="{ type:'number', required: true, message: '请选择支付方式', trigger: 'change' }">
                      <div class="margin_r_10 ">
                        <el-select @change="changePayment(item,1)" class="select_w" v-model="item.paymentId" filterable
                                   placeholder="请选择支付方式">
                          <el-option
                            v-for="item in getWayInfo"
                            :key="item.id"
                            :label="item.memo"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                    <el-form-item label="" :prop="'account.' + index + '.paymentChannelId'"
                                  :rules="{type:'number',  required: true, message: '请选择通道', trigger: 'change' }">

                      <div class="margin_r_10 ">
                        <el-select @change="changePayment(item)" class="select_w" v-model="item.paymentChannelId" filterable
                                   placeholder="请选择通道列表">
                          <el-option
                            v-for="item1 in item.getChannelList"
                            :key="item1.id"
                            :label="item1.memo"
                            :value="item1.id">
                          </el-option>
                        </el-select>
                      </div>
                    </el-form-item>

                    <el-form-item label="" :prop="'account.' + index + '.accountId'"
                                  :rules="{type:'number',  required: true, message: '请选择账户', trigger: 'change' }">
                      <div class="margin_r_10 ">
                        <el-select class="select_w" v-model="item.accountId" placeholder="请选择账户列表" filterable>
                          <el-option
                            v-for="item1 in item.getCanUseAccountList"
                            :key="item1.id"
                            :label="item1.name"
                            :value="item1.id">
                          </el-option>
                        </el-select>
                      </div>
                    </el-form-item>

                    <div class="flex height_100">
                      <div class="m-storeCode flex pointer" @click="addDomain()">
                        <i class="fa fa-plus-circle" aria-hidden="true"></i>
                      </div>
                      <div class="m-storeCode flex margin_l_10 pointer" v-if="index !== 0" @click="removeDomain(index)">
                        <i class="fa fa-minus-circle" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>


                  <div class="cell_title margin_b_10">
                    备用账户
                  </div>

                  <div class="flex_r margin_b_10" v-for="(item,index) in formAccount.reserveAcc">

                    <el-form-item label="">
                      <div class="margin_r_10 ">
                        <el-select @change="changePayment(item,1)" class="select_w" v-model="item.paymentId" filterable
                                   placeholder="请选择支付方式">
                          <el-option
                            v-for="item in getWayInfo"
                            :key="item.id"
                            :label="item.memo"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                    <el-form-item label="">
                      <div class="margin_r_10 ">
                        <el-select @change="changePayment(item)" class="select_w" v-model="item.paymentChannelId" filterable
                                   placeholder="请选择通道列表">
                          <el-option
                            v-for="item1 in item.getChannelList"
                            :key="item1.id"
                            :label="item1.memo"
                            :value="item1.id">
                          </el-option>
                        </el-select>
                      </div>
                    </el-form-item>

                    <el-form-item label="">
                      <div class="margin_r_10 ">
                        <el-select class="select_w" v-model="item.accountId" placeholder="请选择账户列表" filterable>
                          <el-option
                            v-for="item1 in item.getCanUseAccountList"
                            :key="item1.id"
                            :label="item1.name"
                            :value="item1.id">
                          </el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                    <div class="flex height_100">
                      <div class="m-storeCode flex pointer" @click="subAddDomain()">
                        <i class="fa fa-plus-circle" aria-hidden="true"></i>
                      </div>
                      <div class="m-storeCode flex margin_l_10 pointer" v-if="index !== 0"
                           @click="subRemoveDomain(index)">
                        <i class="fa fa-minus-circle" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>


                  <div class="flex">
                    <el-button type="primary" @click="saveEditStoreAccount('formRules')">保存</el-button>
                    <el-button @click="$router.go(-1)">取消</el-button>

                  </div>
                </el-form>

              </el-col>

            </el-row>
          </div>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>

  import getApi from './editStoreAccount.service';
  import {getWayInfo,getChannelInfo} from '../../../../utility/communApi'
  import { mapActions,mapGetters } from 'vuex';
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr'
      ]),
    },
    components: {},
    data() {
      return {
        showConfig: false,
        activeName2: 'electronicInvoice',
        form: {
          radio: 0,
          input: '',
          time1: '',
          time2: '',
          value: '',
          options: [{
            value: '',
            label: ''
          }],
        },
        navList: [{name: "门店管理", url: ''}, {name: "门店列表", url: '/storeManage/storeList'}, {name: "查看门店", url: ''}],
        activeName: 'first',


        formAccount: {
          account: [
//            {paymentId: '', paymentChannelId: '', accountId: ''},
          ],
          reserveAcc: [
//            {paymentId: '', paymentChannelId: '', accountId: ''},
          ]
        },

        storeData: {},
        storeGroup: [],
        storeAccount: {},
        getWayInfo: [],//支付方式列表

        getCanUseAccountList: [],//获取符合要求的账户列表

      }
    },
    watch: {},
    methods: {
      changePayment(item,Int) {
        if(Int === 1){
          item.paymentChannelId = "";
          item.accountId = "";
          item.getCanUseAccountList = [];
          getChannelInfo(item.paymentId).then((res) => {
            this.$set(item,"getChannelList",res.data.data);
          })
        }

        if (item.paymentId !== "" && item.paymentChannelId !== "") {
          getApi.getCanUseAccountList(item.paymentId, item.paymentChannelId).then((res) => {
            item.accountId = '';
            item.getCanUseAccountList = res.data.data
          })
        }
      },

      editStoreBase() {
        getApi.editStore(this.storeData).then((res) => {
          if (res.data.errcode === 0) {
            this.$alert('添加成功', '', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.go(-1)
              }
            })
          }
        })
      },

      saveEditStoreAccount(formRules) {
        this.formAccount.account.forEach((item) => {
          delete item.getCanUseAccountList;
          delete item.getChannelList
        })
        this.formAccount.reserveAcc.forEach((item) => {
          delete item.getCanUseAccountList;
          delete item.getChannelList
        })

        for(let item of this.formAccount.account){
         delete item.accountName;
          delete item.paymentChannel;
          delete item.paymentName

        }
        for(let item of this.formAccount.reserveAcc){
          delete item.accountName;
          delete item.paymentChannel;
          delete item.paymentName
        }

        this.$refs[formRules].validate((valid) => {
          if (valid) {
            getApi.editStoreAccount(this.$route.params.id, this.formAccount).then((res) => {
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


      async handleClick(tab, event) {
        if (tab.name === 'first') {
          this.getFirst()
          this.formAccount = {
            account: [],
            reserveAcc: [],
          }
        }
        if (tab.name === 'second') {
          let list = {};
          await getApi.getStoreAccount(this.$route.params.id).then((res) => {
            if(res.data.errcode === 0){
              if(res.data.data.account.length === 0){
                res.data.data.account.push({
                  paymentId: '',
                  paymentChannelId: '',
                  accountId: '',
                  getChannelList:[],
                  getCanUseAccountList: []
                });
              }
              if(res.data.data.reserveAcc.length === 0){
                res.data.data.reserveAcc.push({
                  paymentId: '',
                  paymentChannelId: '',
                  accountId: '',
                  getChannelList:[],
                  getCanUseAccountList: []
                })
              }
              list = res.data.data
            }
          });

          if(list.account.length !== 0){
            for (let item of list.account) {
              if(item.paymentId !== ''){
               await getChannelInfo(item.paymentId).then((res1) => {
                 item.getChannelList = res1.data.data
                });
                await  getApi.getCanUseAccountList(item.paymentId, item.paymentChannelId).then((res1) => {
                  item.getCanUseAccountList = res1.data.data
                })
              }
            }
          }
          if(list.reserveAcc.length !== 0){
            for (let item of list.reserveAcc) {
              if(item.paymentId !== ''){
                await getChannelInfo(item.paymentId).then((res1) => {
                  item.getChannelList = res1.data.data
                });
                await getApi.getCanUseAccountList(item.paymentId, item.paymentChannelId).then((res2) => {
                  item.getCanUseAccountList = res2.data.data
                })
              }
            }
          }
          this.formAccount = list
        }
      },


      addDomain() {
        this.formAccount.account.push({paymentId: '', paymentChannelId: '', accountId: '', getCanUseAccountList: []})
      },
      removeDomain(i) {
        this.formAccount.account.splice(i, 1)
      },
      addDomainThird() {
        this.storeData.thirdCode.push({"code1": "", "code2": ""})
      },
      removeDomainThird(i) {
        this.storeData.thirdCode.splice(i, 1)
      },
      subAddDomain() {
        this.formAccount.reserveAcc.push({paymentId: '', paymentChannelId: '', accountId: '', getCanUseAccountList: []})
      },
      subRemoveDomain(i) {
        this.formAccount.reserveAcc.splice(i, 1)
      },
      getFirst() {
        getApi.getFirst(this.$route.params.id).then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.urlCode = res.data.data.urlWithCode * 1;

            if (res.data.data.thirdCode.length === 0) {
              res.data.data.thirdCode.push({"code1": "", "code2": ""})
            }
            let list = [];
            res.data.data.label.forEach((item)=>{
              list.push(item.id)
            });
            res.data.data.storeLabelId = list;

            this.storeData = res.data.data;
          } else {

          }

        })
      }
    },
    created() {

      this.getFirst();
      getApi.getList().then((res) => {
        this.storeGroup = res.data.data.list;
      });

      getWayInfo().then((res) => {
        this.getWayInfo = res.data.data
      })

    }
  }
</script>

<style scope lang="less">


  .select_w {
    width: 150px;
  }


  .cell_title {
    font-size: 18px;
  }


</style>
