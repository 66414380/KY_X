<template>
  <div>
    <div class="margin_b_10">
      <xo-nav-path :navList="navList"></xo-nav-path>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基础信息" name="first">
        <div class="m-seeAddStore"  v-show="getTreeArr['查看基础信息']">
          <div class="m-seeAddStore-basic">
            <el-row>
              <el-col :span="16">
                <el-form ref="form" :data="storeData" label-width="180px" class="myForm">
                  <el-form-item label="门店名称:">
                    <span>{{storeData.name}}</span>
                  </el-form-item>
                  <el-form-item label="门店编码:">
                    <span>{{storeData.code}}</span>
                  </el-form-item>
                  <el-form-item label="第三方编码:">
                    <div v-for="(item,index) in storeData.storeCode">
                      <span>{{item.code1}} -- {{item.code2}}</span>
                    </div>

                  </el-form-item>
                  <el-form-item label="">
                    <div v-for="(item,index) in storeData.thirdCode">
                      <span>{{item.code1}} -- {{item.code2}}</span>
                    </div>

                  </el-form-item>
                  <el-form-item label="所属门店标签:">
                    <div v-for="(item,index) in storeData.label">
                      {{item.name}}
                    </div>
                  </el-form-item>
                  <el-form-item label="公众号:">
                    <span>{{storeData.wx_id}}</span>
                  </el-form-item>
                  <el-form-item label="门店地址:">
                    <span>{{storeData.address}}</span>
                  </el-form-item>
                  <el-form-item label="门店电话:">
                    <span>{{storeData.tel}}</span>
                  </el-form-item>
                  <el-form-item label="营业时间:">
                    <span>{{storeData.openTimeStart}} -- {{storeData.openTimeEnd}}</span>
                  </el-form-item>
                  <el-form-item label="预结单提示语:">
                    <span>{{storeData.orderPrompting}}</span>
                  </el-form-item>
                  <!--<el-form-item label="支付成功后跳转的URL:">-->
                    <!--<el-input v-model="storeData.payJumpUrl" :disabled="true"></el-input>-->
                    <!--<span>（为空表现不跳转）</span>-->
                  <!--</el-form-item>-->
                  <el-form-item label="URL是否带门店编码:">
                    <el-radio-group v-model="storeData.urlCode">
                      <el-radio disabled :label="1">是</el-radio>
                      <el-radio disabled :label="0">否</el-radio>

                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">

              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收款账户" name="second">
        <div class="m-seeAddStore"  v-show="getTreeArr['查看收款账户']">
          <div class="m-seeAddStore-basic">
            <el-row>
              <el-col :span="16">
                <div>
                  <div class="m-seeAddStore-account">
                    <div class="m-seeAddStore-account-now">正在使用中的账户</div>

                    <div v-for="(item,index) in storeAccount.account" class="padding_l_10">
                      <!--<div class=""><img src="" alt=""></div>-->
                      <span>{{item.accountName}}</span>
                      <span>{{item.paymentName}}</span>
                      <span>{{item.paymentChannel}}</span>
                    </div>
                  </div>
                  <div class="m-seeAddStore-account margin_t_10">
                    <div class="m-seeAddStore-account-prepare">备用账户</div>

                    <div v-for="(item,index) in storeAccount.reserveAcc" class="padding_l_10">
                      <!--<div class=""><img src="" alt=""></div>-->
                      <span>{{item.accountName}}</span>
                      <span>{{item.paymentName}}</span>
                      <span>{{item.paymentChannel}}</span>
                    </div>

                  </div>
                </div>
              </el-col>
              <el-col :span="8">

              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
  import ElInput from "../../../../../node_modules/element-ui/packages/input/src/input.vue";
  import getApi from './seeTheStore.service';
  import { mapActions,mapGetters } from 'vuex';
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr'
      ]),
    },
    components: {
      ElInput

    },
    data() {
      return {
        form: {
          radio: 0,
          input: ''
        },
        storeData: {},
        storeAccount:{},
        navList: [{name: "门店管理", url: ''}, {name: "门店列表", url: '/storeManage/storeList'}, {name: "查看门店", url: ''}],
        activeName: 'first',

      }
    },
    methods: {
      editStoreBase() {
        this.$router.push('/storeManage/storeList/seeTheStore/editStoreBase')
      },
      editStoreAccount() {
        this.$router.push('/storeManage/storeList/seeTheStore/editStoreAccount')
      },

      handleClick(tab, event) {
        console.log(tab.name);
        if (tab.name === "first") {
          this.getFirst()
        }
        if (tab.name === "second") {
          this.getSecond()
        }
      },
      getSecond() {
        getApi.getSecond(this.$route.params.id).then((res) => {
          if (res.data.errcode === 0) {

            this.storeAccount = res.data.data
            console.log(this.storeAccount)
          } else {

          }

        })
      },
      getFirst() {
        getApi.getFirst(this.$route.params.id).then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.urlCode = res.data.data.urlWithCode * 1;
            this.storeData = res.data.data;
          } else {

          }

        })
      }
    },
    created() {
      this.getFirst()
    }
  }
</script>

<style scope lang="less">
  .myInput {
    width: 300px;
  }

  .m-tr {
    text-align: right;
  }

  .m-tl {
    text-align: left;
  }

  .m-padding-left {
    padding-left: 20px;
  }

  .m-seeAddStore-account {
    .m-seeAddStore-account-now {
      padding: 10px 0px;
      list-style-type: disc;
      font-weight: bold;
      box-sizing: border-box;
    }
    .m-seeAddStore-account-list {
      padding: 10px 0;
      padding-left: 70px;
      height: 50px;
      line-height: 30px;
      box-sizing: border-box;
      position: relative;
      .m-seeAddStore-account-list-img {
        position: absolute;
        left: 10px;
        top: 5px;
        width: 40px;
        height: 40px;
        background: #000;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .m-seeAddStore-account-prepare {
      list-style-type: disc;
      font-weight: bold;
    }
  }

  .partLine {
    border-bottom: 1px solid #787978
  }

  .cell_title {
    font-size: 18px;
  }

  .box-card {
    margin: 10px;
    width: 400px;
  }

</style>
