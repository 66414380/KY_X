<template>
  <div>
    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">
        <div>
          <el-button size="small" @click="addStore()" v-show="getTreeArr['添加门店']">新增门店</el-button>
          <el-button size="small" @click="delSelected()" v-show="getTreeArr['删除']">批量删除</el-button>
          <el-button size="small" @click="isSwitch()" v-show="getTreeArr['批量开启、关闭']">批量开启/关闭</el-button>
          <!--<el-button size="small" @click="setUrl()" v-show="getTreeArr['设置url']">批量设置url</el-button>-->
        </div>

        <div class="flex_a">
          <div class="margin_r_10">
            <el-input size="small" v-model="storeName" placeholder="请输入门店名称"></el-input>
          </div>
          <el-button size="small" @click="search()">搜索</el-button>

        </div>
      </div>
    </div>

    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree :data='getX1storeTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10" :style="{width:tableWidth + 'px'}" v-show="getTreeArr['门店列表']">
        <el-table :data="storeData" border :height="tableHeight" @select-all="handleSelectionChange" ref="multipleTable">

          <el-table-column
            header-align="center" align="center"
            type="selection"
            label-class-name="mySelect"
            width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code"
                           label="编码"
                           width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storeName"
                           width="150"
                           label="门店"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center"
                           min-width="300" label="账户 -- 支付方式 -- 支付通道">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.account">
                <div>
                  {{item.accountName}} -- {{item.paymentName}} -- {{item.paymentChannel}}
                </div>

              </div>
            </template>

          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="支付" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.isOpenPay === 1">
                √
              </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="发票" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.isOpenInvoice === 1">
                √
              </div>
            </template>
          </el-table-column>

          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="payJumpUrl"-->
                           <!--label="支付后跳转url"-->
                           <!--width="320">-->
            <!--<template slot-scope="scope">-->
              <!--<div class="flex_a">-->
                <!--<el-input class="margin_r_10" v-model="scope.row.payJumpUrl" :disabled="scope.row.inputChecked"></el-input>-->
                <!--<el-button type="primary" :disabled="scope.row.inputChecked" @click="setOneUrl(scope.row)">确定</el-button>-->
              <!--</div>-->

            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="status" label="状态"
                           width="100">
            <template slot-scope="scope">
              <el-switch @change="()=>{
                return changeStatus(scope.row)
              }"
                         v-model="scope.row.status">
              </el-switch>
            </template>

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="340">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click.stop="getOneList(scope.row.id)">查看</el-button>
              <el-button size="small" @click.stop="edit(scope.row.id)">编辑</el-button>
              <el-button size="small" type="danger" @click.stop="del(scope.row.id)" v-show="getTreeArr['删除']">删除</el-button>
              <el-button size="small" @click.stop="invoiceEdit(scope.row.invoiceId,scope.row.id)">发票方案编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>

      </div>
    </div>
    <!--弹窗-->

    <el-dialog
      title="新建／修改组"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="formRules" :model="form" label-width="100px">
        <el-form-item label="编码:" prop="code" :rules="{required: true, message: '请输入编码', trigger: 'blur'}">
          <el-input v-model="form.code" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item label="名称:" prop="name" :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
          <el-input v-model="form.name" placeholder="请输入内容"></el-input>
        </el-form-item>

        <div v-for="(domain, index) in form.thirdPartyCoding" class="flex_r">
          <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key" :prop="'thirdPartyCoding.' + index + '.value'"
                        :rules="{required: true, message: '第三方编码不能为空', trigger: 'blur'}">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.value"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="m-rank">
            <div class="m-rank-child"></div>
          </div>
          <el-form-item label-width="0" :key="domain.key" :prop="'thirdPartyCoding.' + index + '.value1'"
                        :rules="{required: true, message: '第三方编码不能为空!', trigger: 'blur'}">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.value1"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="flex_a" style="margin-bottom: 22px">
            <div class="m-storeCode margin_l_10" @click="addDomain()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(form.thirdPartyCoding.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <el-form-item label="上级组:" v-if="isEdit">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <div class="margin_t_10">
          <el-button>取消</el-button>
          <el-button type="primary">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--批量开启/关闭-->
    <el-dialog
      title="开启/关闭"
      :visible.sync="dialogVisible1"
      width="400px" >
      <el-switch
        v-model="storeStatusValue">
      </el-switch>
      <div class="margin_t_10">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="changeStoresStatus()">确认</el-button>
      </div>
    </el-dialog>
    <!--新增门店-->
    <el-dialog
      title="新增门店"
      :visible.sync="dialogVisible2"
      @close="close2"
      width="400px" >
      <el-checkbox v-model="checkAll" @change="changeAll(checkAll)">全选</el-checkbox>
      <div class="margin_b_10" v-for="(item,index) in baseStore">
        <div>
          {{index}}
          <div class="padding_l_10" v-for="(item1,index1) in item">
           <el-checkbox v-model="item1.OK" @change="changeOne">{{item1.storename}}</el-checkbox>
          </div>
        </div>
      </div>
      <div class="margin_t_10">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="add()">确认</el-button>
      </div>
    </el-dialog>

    <!--发票方案编辑-->
    <el-dialog title="发票方案编辑" :visible.sync="dialogVisible3" @open="open1" @close="close1" width="660px">


        <el-form ref="clientForm" :model="clientForm" label-width="180px">
          <el-form-item label="方案名称:" prop="name" :rules="{required: true, message: '请输入方案名称', trigger: 'blur'}">
            <el-input v-model="clientForm.name" style="width: 200px;" placeholder="请输入方案名称"></el-input>
          </el-form-item>

          <div v-for="(domain, index) in clientForm.third_code" class="flex_r">
            <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
              <div>
                <el-row>
                  <el-col>
                    <div style="width:150px">
                      <el-input v-model="domain.code1" placeholder="请输入第三方名称"></el-input>
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
                      <el-input v-model="domain.code2" placeholder="请输入第三方编码"></el-input>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <div class="flex_sc">
              <div class="m-storeCode margin_l_10" @click="addDomain1">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </div>
              <div v-if="(clientForm.third_code.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                   @click.prevent="removeDomain1(index)">
                <i class="fa fa-minus-circle" aria-hidden="true"></i>
              </div>
            </div>
          </div>

          <el-form-item  label="状态">
            <el-switch
              v-model="clientForm.status">
            </el-switch>
          </el-form-item>
        </el-form>

        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >
          <el-tab-pane label="电子发票" name="first">
            <el-form ref="clientForm_first" :model="clientForm_first" label-width="180px">

              <el-form-item label-width="50px" label="">
                <div>授权标识(百望电子提供针对不同税号企业的授权应用标识)</div>
                <el-input v-model="clientForm_first.token1"></el-input>
              </el-form-item>
            </el-form>


            <div>

              <xo-form :clientFormData="clientForm_first3" showName="修改" :purchaserList="clientForm_first3.purchasers" ref="xoClientFormEdit" myRef="xoClientFormEdit" :showIncrement="showIncrement"></xo-form>

              <div class="flex margin_t_10" >

                <!--<el-button type="primary" @click="submitFrom('clientForm','xoClientFormEdit',0)">保存并跳转页面设计</el-button>-->
                <el-button type="primary" @click="submitFrom('clientForm','xoClientFormEdit',2)">保存</el-button>
                <el-button @click="dialogVisible3 = false">取消</el-button>
              </div>
            </div>

          </el-tab-pane>
          <el-tab-pane label="纸质发票" name="second">
            <el-form :model="clientForm_second" label-width="180px">
              <el-form-item label-width="50px" label="">

                <div class="flex_a">
                  <el-switch
                    v-model="clientForm_second.auto_log">
                  </el-switch>

                  <div class="margin_l_10 margin_r_10 t_a">
                    自动记录开票方信息，再次开票免输入:
                  </div>
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover"
                    content="备注：客人开过一次发票后，系统将自动记录该开票信息，客人再次开票时，可免输入开票信息">
                    <i class="fa fa-info-circle" aria-hidden="true" slot="reference" style="font-size: 15px;"></i>
                  </el-popover>
                </div>

                <div class="flex_a">
                  <el-switch
                    v-model="clientForm_second.code_lacation">
                  </el-switch>

                  <div class="margin_l_10 margin_r_10 t_a">
                    二维码打印在预结单小票:
                  </div>
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover"
                    content="备注：发票二维码与支付二维码均在预结单（指顾客付款前供顾客核实的消费清单）小票上打印（二码合一）顾客第一次扫码完成支付，第二次扫进入自助开电子发票页面">
                    <i class="fa fa-info-circle" aria-hidden="true" slot="reference" style="font-size: 15px;"></i>
                  </el-popover>
                </div>
              </el-form-item>


              <el-form-item label-width="50px" label="">
                <h3 class="margin_b_10">购买方信息 <span style="color: #8c939d;font-size: 14px">(红色按钮为必填项，灰色按钮选填、可自行决定)</span></h3>

                <div class="flex_r f_f margin_b_10">
                  <xo-button v-for="(item,index) in clientForm_second.purchasers" :key="item.id" :id="item.id"
                             showName="修改" :name="item.name" marginRight="10px" marginBottom="10px" backgroundColor="#ffffff"
                             :isBool="item.select"
                             @click="buyInfo"></xo-button>
                </div>



              </el-form-item>
            </el-form>
            <div class="flex">
              <el-button type="primary" @click="submitFrom('clientForm','',2)">保存</el-button>
              <el-button @click="dialogVisible3 = false">取消</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>



    </el-dialog>

  </div>
</template>

<script>

  import {getScrollHeight} from '../../../utility/getScrollHeight'
  import getApi from './storeList.service';
  import {getLeft,recur} from '../../../utility/communApi'
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../../utility/commun'
  import {oneTwoApi} from '@/api/api.js';
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components: {
    },
    data() {
      return {
        storeStatusValue: false,
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        tableHeight: 0,
        tableWidth: 0,
        navList: [{name: "聚合支付管理", url: ''},{name: "门店管理", url: ''}, {name: "门店列表", url: ''}],

        storeName: '',
        storeData: [],
        defaultProps: {
          children: 'child',
          label: 'levelname'
        },

        form: {
          name: '',
          code: '',
          thirdPartyCoding: [
            {value: '', value1: ''}
          ],
        },

        isEdit: true,
        value: "",
        options: [{
          value: 1,
          label: '民生银行'
        }, {
          value: 2,
          label: '易极付'
        }],
        p: {page: 1, size: 20, total: 0},
        baseStore: {},//点击新增时的门店
        totalSelect:0,//点击新增时的门店的选择总数
        checkAll:false,
        activeName: 'first',
        clientForm: {
          name: '',
          third_code: [
            {code1: '', code2: ''}
          ],
          status: true,
          type:1
        },
        clientForm_first: {
        token1:'',
        },
        //修改
        clientForm_first3:{
          auto_log: true,
          code_lacation:false,
          purchasers: [],
          code_number:'',
          sale_name:'',
          address:'',
          tel:'',
          account:'',
          drawer:'',
          tax_rate:'',
          service_name:'',
          payee:'',
          reviewer:'',
          card_package_allow:false,
          alipay_allow:false,
          other_pay_allow:false,
          merchant_abbreviation:"",
          logo_url:""
        },
        clientForm_second:{
          auto_log: true,
          code_lacation:false,
          purchasers: []
        },
        showIncrement:{check:false},
        storeId:''
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setX1StoreLevelId','setX1storeTree']),
      ...mapGetters(['getX1StoreLevelId','getX1storeTree']),
     async submitFrom(formRules,formRules2,Int){
        let a, b;
        await this.$refs[formRules].validate((valid) => {
          if (valid) {
            a = true
          } else {
            console.log('error submit!!');
            a = false
          }
        });

        if(formRules2 === 'xoClientFormEdit'){
          await  this.$refs.xoClientFormEdit.$refs["xoClientFormEdit"].validate((valid) => {
            if (valid) {
              b = true
            } else {
              console.log('error submit!!');
              b = false
            }
          });
        }
       if(formRules2 === ''){
         b = true
       }

       if (a === true && b === true) {
         let list = [],status,auto_log,code_lacation,card_package_allow,alipay_allow,other_pay_allow;
         (this.clientForm.status === true)? status = 1: status = 0;
         if(this.clientForm.type === 1){
           this.clientForm_first3.purchasers.forEach((item) => {
             if (item.selectF === true) {
               list.push(item.id)
             }
           });
           (this.clientForm_first3.auto_log === true)? auto_log = 1: auto_log = 0;
           (this.clientForm_first3.code_lacation === true)? code_lacation = 1: code_lacation = 0;
           (this.clientForm_first3.card_package_allow === true)? card_package_allow = 1: card_package_allow = 0;
           (this.clientForm_first3.alipay_allow === true)? alipay_allow = 1: alipay_allow = 0;
           (this.clientForm_first3.other_pay_allow === true)? other_pay_allow = 1: other_pay_allow = 0;

         }else {
           this.clientForm_second.purchasers.forEach((item) => {
             if (item.select === true) {
               list.push(item.id)
             }
           });
           (this.clientForm_second.auto_log === true)? auto_log = 1: auto_log = 0;
           (this.clientForm_second.code_lacation === true)? code_lacation = 1: code_lacation = 0;
         }

         // 单门店方案配置
         let params = {
           redirect: "x1.invoice.setStoreInvoiceScheme",
           id: this.storeId,
           name: this.clientForm.name,
           type:this.clientForm.type,
           third_code: window.JSON.stringify(this.clientForm.third_code),
           status: status,
           token1:this.clientForm_first.token1,
           auto_log: auto_log,
           code_lacation:code_lacation,
           purchasers: list.join(','),
           code_number:this.clientForm_first3.code_number,
           sale_name:this.clientForm_first3.sale_name,
           address:this.clientForm_first3.address,
           tel:this.clientForm_first3.tel,
           account:this.clientForm_first3.account,
           drawer:this.clientForm_first3.drawer,
           tax_rate:this.clientForm_first3.tax_rate,
           service_name:this.clientForm_first3.service_name,
           payee:this.clientForm_first3.payee,
           reviewer:this.clientForm_first3.reviewer,
           card_package_allow:card_package_allow,
           alipay_allow:alipay_allow,
           other_pay_allow:other_pay_allow,
           merchant_abbreviation:this.clientForm_first3.merchant_abbreviation,
           logo_url:this.clientForm_first3.logo_url,
         };
         oneTwoApi(params).then((res) => {
           if(res.errcode === 0){
               this.dialogVisible3 = false;
             this.showResouce(this.p, this.getX1StoreLevelId(),this.searchName);
           }
         })
       }

      },
      removeDomain1(index) {
        this.clientForm.third_code.splice(index, 1)
      },
      addDomain1() {
        this.clientForm.third_code.push({code1: '', code2: ''});
      },
      buyInfo(id, bool) {
          this.clientForm_second.purchasers.forEach((item) => {
            if (item.id === id) {
              item.select = bool
            }
          })
      },
      handleClick(tab, event) {
        if (tab.name === 'first') {
          this.clientForm.type = 1
        }else {
          this.clientForm.type = 2
        }
      },
      close1(){
        this.showIncrement = {check:false};
        this.$refs['clientForm'].resetFields();
        this.$refs['clientForm_first'].resetFields();
        this.storeId = '';
        this.$refs.xoClientFormEdit.$refs['xoClientFormEdit'].resetFields();
      },
      open1() {

      },
      invoiceEdit(invoiceId,id){
        this.dialogVisible3 = true;
        this.storeId = id;
        // 发票方案详情
        let params = {
          redirect: "x1.invoice.getInvoiceInfo",
          id: invoiceId,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            (res.data.status === 1) ? res.data.status = true: res.data.status = false;

            (res.data.auto_log === 1) ? res.data.auto_log = true: res.data.auto_log = false;
            (res.data.code_lacation === 1) ? res.data.code_lacation = true: res.data.code_lacation = false;
            (res.data.card_package_allow === 1) ? res.data.card_package_allow = true: res.data.card_package_allow = false;
            (res.data.other_pay_allow === 1) ? res.data.other_pay_allow = true: res.data.other_pay_allow = false;
            (res.data.alipay_allow === 1) ? res.data.alipay_allow = true: res.data.alipay_allow = false;
            res.data.purchasers.forEach((item) => {
              if (item.select === 1) {
                item.selectF = true;
                item.select = true
              } else {
                item.selectF = false;
                item.select = false
              }
            });
            this.clientForm.id = res.data.id;
            this.clientForm.name = res.data.name;
            this.clientForm.third_code = res.data.third_code;
            this.clientForm.status = res.data.status;
            if(res.data.type === 1){
              this.activeName = 'first';
              this.clientForm.type = 1;
              this.clientForm_first3.auto_log = res.data.auto_log;
              this.clientForm_first3.code_lacation = res.data.code_lacation;
              this.clientForm_first3.card_package_allow = res.data.card_package_allow;
              this.clientForm_first3.other_pay_allow = res.data.other_pay_allow;
              this.clientForm_first3.alipay_allow = res.data.alipay_allow;
            }else {
              this.activeName = 'second';
              this.clientForm.type = 2;
              this.clientForm_second.auto_log = res.data.auto_log;
              this.clientForm_second.code_lacation = res.data.code_lacation;
            }
            this.clientForm_first.token1 = res.data.token1;
            this.clientForm_first3.id = res.data.id;
            this.clientForm_first3.code_number = res.data.sale.code_number?res.data.sale.code_number:'';
            this.clientForm_first3.sale_name = res.data.sale.name?res.data.sale.name:'';
            this.clientForm_first3.address = res.data.sale.address?res.data.sale.address:'';
            this.clientForm_first3.tel = res.data.sale.tel?res.data.sale.tel:'';
            this.clientForm_first3.account = res.data.sale.account?res.data.sale.account:'';
            this.clientForm_first3.drawer = res.data.sale.drawer?res.data.sale.drawer:'';
            this.clientForm_first3.tax_rate = res.data.sale.tax_rate?res.data.sale.tax_rate + '':'';
            this.clientForm_first3.service_name = res.data.sale.service_name?res.data.sale.service_name:'';
            this.clientForm_first3.payee = res.data.sale.payee?res.data.sale.payee:'';
            this.clientForm_first3.reviewer = res.data.sale.reviewer?res.data.sale.reviewer:'';

            this.clientForm_first3.purchasers = res.data.purchasers;
            this.clientForm_second.purchasers = res.data.purchasers;

            this.clientForm_first3.merchant_abbreviation = res.data.merchant_abbreviation;
            this.clientForm_first3.logo_url = res.data.logo_url
          }
        })
      },
      changeOne(){
        let i = 0;
        for(let map in this.baseStore){
          this.baseStore[map].forEach((item)=>{
            if(item.OK === true){
              i++
            }
          })
        }
        (i === this.totalSelect)? this.checkAll = true: this.checkAll = false
      },
      changeAll(bool){
        if(bool){
          for(let map in this.baseStore){
            this.baseStore[map].forEach((item)=>{
              item.OK = true
            })
          }
        }else {
          for(let map in this.baseStore){
            this.baseStore[map].forEach((item)=>{
              item.OK = false
            })
          }
        }
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



      close2(){
        for(let map in this.baseStore){
          this.baseStore[map].forEach((item)=>{
            item.OK = false
          })
        }
      },
      search(){
        this.showResouce(this.p = {page: 1, size: 20, total: 0},this.getX1StoreLevelId(),this.storeName);
      },
      //设置url
      setOneUrl(row){
        console.log(row);
        getApi.urlStatus(row.id,row.payJumpUrl).then((res)=>{
          if(res.data.errcode === 0){
            this.$message('操作成功');
            row.inputChecked = true;
          }
        })
      },
      add(){
        let list = [];
        for(let map in this.baseStore){
          this.baseStore[map].forEach((item)=>{
            if(item.OK){
              list.push(item.id)
            }
          })
        }
        if(list.length === 0){
          this.$message('请选择门店');
        }else {
          getApi.addStore(list.join(',')).then((res)=>{

            this.dialogVisible2 = false
            this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.getX1StoreLevelId(),this.storeName = '');
          })
        }

      },
      addStore() {
        if(this.getX1StoreLevelId() === ""){
          this.$message('请选择门店所属部门');
        }else {
          this.dialogVisible2 = true;
          this.totalSelect = 0;
          this.checkAll = false;
          getApi.getBaseStore(this.getX1StoreLevelId()).then((res)=>{
            if(res.data.errcode === 0){
              for(let map in res.data.data){
                res.data.data[map].forEach((item)=>{
                  this.totalSelect++;
                  item.OK = false
                })
              }
              console.log(this.totalSelect)
              this.baseStore = res.data.data
            }
          })
        }
      },

      isSwitch() {
        if(this.storeData.some((item) => {return item.select === true}) === true){
          this.dialogVisible1 = true
        } else {
          this.$message('请勾选门店');
        }
      },
      //状态设置
      changeStatus(data) {
        let storeStatusValue;
        if (data.status) {
          storeStatusValue = 1
        } else {
          storeStatusValue = 0
        }
        getApi.storesStatus(data.id, storeStatusValue).then((res) => {

          if(res.data.errcode === 0){
            this.$message('操作成功');
            this.showResouce(this.p, this.getX1StoreLevelId());
          }

        })
      },
      //批量状态设置
      changeStoresStatus() {
        let storeStatusValue,list = [];
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
              this.showResouce(this.p, this.getX1StoreLevelId());
              this.dialogVisible1 = false
            }
          })
      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p, this.getX1StoreLevelId(),this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p, this.getX1StoreLevelId(),this.searchName);
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
            getApi.del(list.join(",")).then((res)=>{

              this.$message({
                type: 'info',
                message: '删除成功'
              });
              this.showResouce(this.p, this.getX1StoreLevelId());
            })


          }).catch(() => {
            //
          });
        }


      },

      setUrl() {
        this.storeData.forEach((data) => {
          data.inputChecked = false
        })
      },

      batchAdd() {
        this.$router.push('/storeManage/storeList/newAddStore')
      },
      removeDomain(item) {
        var index = this.form.thirdPartyCoding.indexOf(item)
        if (index !== -1) {
          this.form.thirdPartyCoding.splice(index, 1)
        }
      },
      addDomain() {
        this.form.thirdPartyCoding.push({
          value: '',
          key: Date.now()
        });
      },

      getOneList(id) {
        this.$router.push({path: `/storeManage/storeList/seeTheStore/${id}`})
      },
      edit(id) {
        this.$router.push({path: `/storeManage/storeList/editStoreAccount/${id}`})
      },
      editGroup(item) {
        this.item = item;
        this.dialogVisible = true
      },
      del(id) {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getApi.del(id).then((res) => {

            if (res) {

            }
            this.$message({
              type: 'info',
              message: '删除成功'
            });
            this.showResouce(this.p, this.getX1StoreLevelId())

          })

        }).catch(() => {
          //
        });

      },
      showResouce(p,levelId,storeName = "") {
        getApi.getList(p,levelId, storeName).then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.list.forEach((data) => {
              data.inputChecked = true;
              data.select = false;
              (data.status === 1)? data.status = true: data.status = false
            });
            this.storeData = res.data.data.list;
            this.p.total = res.data.data.count;
          } else {

          }
        })
      },


      showLevel() {
        getLeft('x1').then((res) => {
          this.setX1storeTree({list:res.data.data});
          if(this.getX1StoreLevelId() === ''){
            this.setX1StoreLevelId({levelId:res.data.data[0].id});
          }
          this.showResouce(this.p, this.getX1StoreLevelId());
          recur(res.data.data,true,this.getX1StoreLevelId(),this);

        });
      }
    },
    created() {
      if(this.getX1storeTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.p,this.getX1StoreLevelId());
      }
    },
    mounted() {
      Hub.$on('showAdd', (e) => {
        this.showResouce(this.p = {page: 1, size: this.p.size, total: 0}, e.levelid,this.storeName = '');
        this.setX1StoreLevelId({levelId:e.levelid});
        recur(this.getX1storeTree(),false,this.getX1StoreLevelId(),this);

      });

      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    destroyed(){
      Hub.$off("showAdd");
    },
    updated() {
      let bodyWidth = document.querySelector('.content div').clientWidth;
      let clientWidth = this.$refs.tree? this.$refs.tree.clientWidth : 0;
      this.tableWidth = bodyWidth - clientWidth;

    },
  }
</script>

<style lang="less" scoped>
  .m-rank {
    width: 40px;
    .m-rank-child {
      height: 18px;
      border-bottom: 1px solid #000;
    }
  }

  .m-storeCode {
    font-size: 30px;
  }


</style>
