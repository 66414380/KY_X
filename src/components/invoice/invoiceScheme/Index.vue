<template>
  <div v-show="getTreeArr['列表']">

    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_sb">
        <div class="flex_1">
          <el-button size="small" @click="add('新增方案')" v-show="getTreeArr['新增方案']">+新增方案</el-button>
        </div>
        <div class="flex_r">
          <el-input size="small" v-model="searchName" icon="search" placeholder="请输入名称">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button class="margin_l_10" size="small" @click="search()">搜索</el-button>
        </div>
      </div>

    </div>
    <el-table :data="invoiceList" border :height="tableHeight">
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="编码"
                       width="100">
      </el-table-column>

      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="名称">
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="type" label="发票类型">
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="service" label="发票服务商">
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="status" label="状态" width="80">
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" label="在用门店" width="100">
        <template slot-scope="scope">
          <el-button size="small" @click="show(scope.row)" v-show="getTreeArr['查看门店']" >查看门店</el-button>
        </template>
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="420">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="edit('修改',scope.row)" v-show="getTreeArr['修改']">修改</el-button>
          <el-button size="small" @click="edit('查看',scope.row)" v-show="getTreeArr['详情']">查看</el-button>
          <el-button size="small" @click="down(scope.row)" v-show="getTreeArr['下发']">下发</el-button>
          <el-button size="small" type="danger" @click="del(scope.row)" v-show="getTreeArr['删除']">删除</el-button>

          <el-button size="small" @click="conf(scope.row.id)" >营销模板配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

    <!--查看门店-->
    <el-dialog title="查看门店" :visible.sync="dialogFormVisible" width="560px">
      <el-table :data="storeData" border style="width: 100%;">
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code" label="序号" width="80">
          <template slot-scope="scope">
            <div>
              {{scope.$index + 1}}
            </div>
          </template>
        </el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="门店编码">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="store_name"
                         label="门店名称">
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--新增/修改方案-->
    <el-dialog :title="showName" :visible.sync="dialogFormVisible1" @open="open1" @close="close1" width="660px">

    <div v-show="showFrist">
      <el-form ref="clientForm" :model="clientForm" label-width="180px">
        <el-form-item label="方案名称:" prop="name" :rules="{required: true, message: '请输入方案名称', trigger: 'blur'}">
          <el-input v-model="clientForm.name" style="width: 200px;" :disabled="showName === '查看'" placeholder="请输入方案名称"></el-input>
        </el-form-item>

        <div v-for="(domain, index) in clientForm.third_code" class="flex_r">
          <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.code1" placeholder="请输入第三方名称" :disabled="showName === '查看'"></el-input>
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
                    <el-input v-model="domain.code2" placeholder="请输入第三方编码" :disabled="showName === '查看'"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="flex_sc">
            <div class="m-storeCode margin_l_10" @click="addDomain">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(clientForm.third_code.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(index)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <el-form-item  label="状态">
          <el-switch
            :disabled="showName === '查看'"
            v-model="clientForm.status"
          >
          </el-switch>
        </el-form-item>
      </el-form>

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >
        <el-tab-pane label="电子发票" name="first" :disabled="showName === '查看'">
          <el-form ref="clientForm_first" :model="clientForm_first" label-width="180px">
            <!--<el-form-item label-width="50px" label="">-->
              <!--<el-switch-->
                <!--v-model="clientForm_first.value2"-->
                <!--on-color="#13ce66"-->
                <!--off-color="#ff4949">-->
              <!--</el-switch>-->
              <!--<span>开启</span>-->
            <!--</el-form-item>-->
            <!--<el-form-item label-width="180px" label="请选择发票服务商" prop="radio2" :rules="[{type:'number',required: true, message: '请选择发票服务商', trigger: 'change'}]">-->
              <!--<el-radio-group v-model="clientForm_first.radio2" hidden>-->
                <!--<el-radio :label="item.id" v-for="(item,index) in serviceList" :key="item.id">{{item.name}}</el-radio>-->
              <!--</el-radio-group>-->
              <!--<div class="flex_r f_f margin_b_10">-->
                <!--<xo-button v-for="(item,index) in serviceList" :key="item.id" :id="item.id"-->
                           <!--showName="OK" :name="item.name" marginRight="10px" marginBottom="0" backgroundColor="#ffffff"-->
                           <!--:isBool="item.select"-->
                           <!--@click="serviceHandle"></xo-button>-->
              <!--</div>-->
            <!--</el-form-item>-->
            <el-form-item label-width="50px" label="">
              <div>授权标识(百望电子提供针对不同税号企业的授权应用标识)</div>
              <el-input v-model="clientForm_first.token1" :disabled="showName === '查看'"></el-input>
            </el-form-item>
          </el-form>

            <div class="flex">
              <el-button type="danger" @click="config2('clientForm','clientForm_first')" v-show="showName === '新增方案'">下一步</el-button>
            </div>

            <div v-show="showName !== '新增方案'">

              <xo-form :clientFormData="clientForm_first3" :showName="showName" :purchaserList="clientForm_first3.purchasers" ref="xoClientFormEdit" myRef="xoClientFormEdit" :showIncrement="showIncrement"></xo-form>

              <div class="flex margin_t_10" v-if="showName !== '查看'">
                <el-button  @click="showFrist = true" v-if="showName === '新增方案'">返回</el-button>
                <el-button type="primary" @click="submitFrom('clientForm','xoClientFormEdit',0)">保存并跳转页面设计</el-button>
                <el-button type="primary" @click="submitFrom('clientForm','xoClientFormEdit',2)">保存</el-button>
              </div>
            </div>

        </el-tab-pane>
        <el-tab-pane label="纸质发票" name="second" :disabled="showName === '查看'">
          <el-form :model="clientForm_second" label-width="180px">
            <el-form-item label-width="50px" label="">

              <div class="flex_a">
                <el-switch
                  v-model="clientForm_second.auto_log"
                  :disabled="showName === '查看'">
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
                  v-model="clientForm_second.code_lacation"
                 :disabled="showName === '查看'">
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

              <div class="flex_r f_f margin_b_10" v-if="showName === '查看' || showName === '修改'">
                <xo-button v-for="(item,index) in clientForm_second.purchasers" :key="item.id" :id="item.id"
                           :showName="showName" :name="item.name" marginRight="10px" marginBottom="10px" backgroundColor="#ffffff"
                           :isBool="item.select"
                           @click="buyInfo"></xo-button>
              </div>

              <div class="flex_r f_f margin_b_10" v-if="showName === '新增方案'">
                <xo-button v-for="(item,index) in purchaserList" :key="item.id" :id="item.id" :showName="showName"
                           :name="item.name" marginRight="10px" marginBottom="10px" backgroundColor="#ffffff" :isBool="item.select"
                           @click="buyInfo"></xo-button>
              </div>

            </el-form-item>
          </el-form>
          <div class="flex" v-if="showName !== '查看'">
            <el-button type="primary" @click="submitFrom('clientForm','',2)">保存</el-button>
            <el-button @click="dialogFormVisible1 = false">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-show="!showFrist">

      <xo-form :clientFormData="clientForm_first2" :showName="showName" :purchaserList="purchaserList" ref="xoClientFormAdd" myRef="xoClientFormAdd" :showIncrement="showIncrement"></xo-form>

        <div class="flex margin_t_10" v-if="showName !== '查看'">
          <el-button  @click="showFrist = true">返回</el-button>
          <el-button type="primary" @click="submitFrom('clientForm','xoClientFormAdd',1)">保存并跳转页面设计</el-button>
          <el-button type="primary" @click="submitFrom('clientForm','xoClientFormAdd',2)">保存</el-button>
        </div>

      </div>

    </el-dialog>

    <!--下发-->
    <el-dialog title="" :visible.sync="dialogFormVisible2" @open="open2" @close="close2" width="560px">
      <el-radio-group v-model="storeRadio" @change="changeRadio">
        <el-radio :label="1">门店标签</el-radio>
        <el-radio :label="2">门店</el-radio>
      </el-radio-group>

      <div class="flex_a margin_t_10" v-if="storeRadio === 1">
        <el-input size="small" placeholder="门店标签名称" class="margin_r_10" style="width: 200px" v-model="inputArea0"></el-input>
        <el-button size="small" @click="searchStore()">搜索</el-button>
      </div>

      <div class="flex_a margin_t_10" v-if="storeRadio === 2">
        <div class="margin_l_10">
          <el-select v-model="providerId" filterable placeholder="请选择省" @change="myChange(providerId,'provider')">
            <el-option v-for="item in providerList" :key="item.id" :label="item.address" :value="item.id"></el-option>
          </el-select>
        </div>

        <div class="margin_l_10">
          <el-select v-model="cityId" filterable placeholder="请选择市" @change="myChange(cityId,'city')">
            <el-option v-for="item in cityList" :key="item.id" :label="item.address" :value="item.id"></el-option>
          </el-select>
        </div>

        <div class="margin_l_10">
          <el-select v-model="areaId" filterable placeholder="请选择区">
            <el-option v-for="item in areaList" :key="item.id" :label="item.address" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="margin_l_10 flex_a">
          <el-input placeholder="请输入门店名称" v-model="inputArea" icon="search" class="margin_r_10"></el-input>
          <el-button @click="searchStore1()">搜索</el-button>
        </div>
      </div>

      <div class="margin_t_10" v-if="storeRadio === 1">
        <el-table :data="storeData0" border style="width: 100%;" @select-all="handleSelectionChange0"
                  ref="multipleTable0">
          <el-table-column
            header-align="center" align="center"
            type="selection"
            label-class-name="mySelect"
            width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked0">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="门店标签编码">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name"
                           label="门店标签名称">
          </el-table-column>
        </el-table>

        <div class="flex margin_t_10">
          <el-button type="primary" @click="submitFrom0()">确定</el-button>
          <el-button @click="dialogFormVisible2 = false">取消</el-button>
        </div>
      </div>

      <div class="margin_t_10" v-if="storeRadio === 2">
        <el-table :data="storeData1" border style="width: 100%;" @select-all="handleSelectionChange"
                  ref="multipleTable">
          <el-table-column
            header-align="center" align="center"
            type="selection"
            label-class-name="mySelect"
            width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="门店编码">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="门店名称">
          </el-table-column>
        </el-table>

        <div class="flex margin_t_10">
          <el-button type="primary" @click="submitFrom1()">确定</el-button>
          <el-button @click="dialogFormVisible2 = false">取消</el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>

  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {oneTwoApi} from '@/api/api.js'
  import {getArea} from '../../utility/communApi'
  import {mapActions, mapGetters} from 'vuex';

  import Hub from '../../utility/commun'
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
        serviceList:[],
        showOption:false,
        showFrist:true,
        storeRadio: 1,
        activeName: 'first',
        showName: '',
        purchaserList: [],
        clientForm: {
          name: '',
          third_code: [
            {code1: '', code2: ''}
          ],
          status: true,
          type:1
        },
        clientForm_first:{
          token1:'',
        },
        //新增
        clientForm_first2:{
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

        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        invoiceList: [],
        storeData0: [],
        storeData1: [],
        tableHeight: 0,
        navList: [{name: "聚合支付管理", url: ''},{name: "发票管理", url: ''},{name: "发票方案", url: ''}],
        name: '',
        id: '',
        roleType: [],
        storeData: [],
        p: {page: 1, size: 20, total: 0},
        searchName: '',
        providerId: '',
        providerList: [],
        cityId: '',
        cityList: [],
        areaId: '',
        areaList: [],
        inputArea0: '',
        inputArea: '',
        showIncrement:{check:false},

      }
    },
    watch: {},
    methods: {
      ...mapActions(['setTreeArr']),
      conf(id){
        this.$router.push({path: `/invoice/invoiceScheme/confInvoice/${id}`})
      },
      serviceHandle(id, bool){
        this.serviceList.forEach((item)=>{
          if (item.id === id) {
            item.select = true;
            this.clientForm_first.radio2 = id
          }else {
            item.select = false
          }
        })

      },

      async config2(clientForm,clientForm_first){

        let a, b;
        await this.$refs[clientForm].validate((valid) => {
          if (valid) {
            a = true
          } else {
            console.log('error submit!!');
            a = false
          }
        });

        await  this.$refs[clientForm_first].validate((valid) => {
          if (valid) {
            b = true
          } else {
            console.log('error submit!!');
            b = false
          }
        });

        if (a === true && b === true) {

          console.log(3)
          this.showFrist = false;

        }


        // this.$refs[clientForm].validate((valid) => {
        //   if (valid) {
        //     this.showFrist = false;
        //     if (this.showName === "新增方案") {
        //
        //     } else {
        //
        //     }
        //   } else {
        //     console.log('error submit!!');
        //     return false;
        //   }
        // });


      },
      changeRadio(e) {
        this.inputArea0 = '';
        this.inputArea = '';
        this.getStoreData()
      },
      handleChecked0(data) {
        let list = this.storeData0.filter((item) => {
          return item.select === true
        });

        if (list.length === this.storeData0.length) {
          list.forEach((item) => {
            this.$refs.multipleTable0.toggleRowSelection(item)
          })
        } else {
          this.$refs.multipleTable0.clearSelection();
        }
      },
      handleSelectionChange0(val) {
        if (val.length === this.storeData0.length) {
          this.storeData0.forEach((map) => {
            this.$set(map, 'select', true)
          });
        } else {
          this.storeData0.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },
      handleChecked(data) {
        let list = this.storeData1.filter((item) => {
          return item.select === true
        });
        if (list.length === this.storeData1.length) {
          list.forEach((item) => {
            this.$refs.multipleTable.toggleRowSelection(item)
          })
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        if (val.length === this.storeData1.length) {
          this.storeData1.forEach((map) => {
            this.$set(map, 'select', true)
          });
        } else {
          this.storeData1.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },
      searchStore() {
        // 获取门店标签列表
        let params = {
          redirect: "x1.store.storeLabelList",
          name: this.inputArea0,
          page: 1,
          pagesize: 1000,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            res.data.list.forEach((map) => {
              this.$set(map, 'select', false)
            });
            this.storeData0 = res.data.list;
          }
        })
      },
      searchStore1() {
        // 标签添加门店时搜索
        let params = {
          redirect: "x1.store.searchStore",
          areaId: this.areaId,
          storeName: this.inputArea,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            res.data.forEach((map) => {
              this.$set(map, 'select', false)
            });
            this.storeData1 = res.data;
          }
        })

      },
      submitFrom0() {
        let list = [];
        this.storeData0.forEach((item) => {
          if (item.select) {
            list.push(item.stores)
          }
        });
        if (list.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择门店标签'
          });
          return
        }

        // 下发方案
        let params = {
          redirect: "x1.invoice.issuedInvoice",
          id: this.id,
          store_id: list.join(','),
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.dialogFormVisible2 = false
          }
        })

      },
      submitFrom1() {
        let list = [];
        this.storeData1.forEach((item) => {
          if (item.select) {
            list.push(item.id)
          }
        });
        if (list.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择门店'
          });
          return
        }
        // 下发方案
        let params = {
          redirect: "x1.invoice.issuedInvoice",
          id: this.id,
          store_id: list.join(','),
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.dialogFormVisible2 = false
          }
        })

      },
      down(row) {
        this.id = row.id;
        this.dialogFormVisible2 = true;

        this.getStoreData()

      },

      getStoreData(){
        if(this.storeRadio === 1){
          // 获取门店标签列表
          let params = {
            redirect: "x1.store.storeLabelList",
            name: '',
            page: 1,
            pagesize: 1000,
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              res.data.list.forEach((map) => {
                this.$set(map, 'select', false)
              });
              this.storeData0 = res.data.list;
            }
          })
        }else {
          // 标签添加门店时搜索
          let params = {
            redirect: "x1.store.searchStore",
            areaId: '',
            storeName: '',
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              res.data.forEach((map) => {
                this.$set(map, 'select', false)
              });
              this.storeData1 = res.data;
            }
          })
        }
      },

      handleClick(tab, event) {
        if (tab.name === 'first') {
          this.clientForm.type = 1
        }else {
          this.clientForm.type = 2
        }
      },
      open2() {
        this.providerId = '';
        this.cityId = '';
        this.cityList = [];
        this.areaId = '';
        this.areaList = [];
        this.inputArea0 = '';
        this.inputArea = '';
        this.storeData0 = [];
        this.storeData1 = [];
      },
      close2() {
        this.providerId = '';
        this.cityId = '';
        this.cityList = [];
        this.areaId = '';
        this.areaList = [];
        this.inputArea0 = '';
        this.inputArea = '';
        this.storeData0 = [];
        this.storeData1 = [];
      },
      close1(){
        this.showIncrement = {check:false};
        this.$refs['clientForm'].resetFields();
        this.$refs['clientForm_first'].resetFields();
        this.$refs.xoClientFormAdd.$refs['xoClientFormAdd'].resetFields();
        this.$refs.xoClientFormEdit.$refs['xoClientFormEdit'].resetFields();
      },
      open1() {
        this.showFrist = true;

        if (this.showName === "新增方案") {
          this.activeName = 'first';
          this.clientForm = {
            name: '',
            third_code: [
              {code1: '', code2: ''}
            ],
            status: true,
            type:1
          };
          this.clientForm_second = {
            auto_log: true,
            code_lacation:false,
            purchasers: []
          };

          this.clientForm_first = {
            token1:'',
          };
          this.clientForm_first2 ={
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
          };
          this.serviceList = [{id:1,name:'百望',select:false},{id:2,name:'航天',select:false}];
        }

      },
     async submitFrom(formRules,formRules2,Int) {

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

        if(formRules2 === 'xoClientFormAdd'){
          await  this.$refs.xoClientFormAdd.$refs["xoClientFormAdd"].validate((valid) => {
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
          let list = [],status ,auto_log,code_lacation,card_package_allow,alipay_allow,other_pay_allow;
          (this.clientForm.status === true)? status = 1: status = 0;
          if (this.showName === "新增方案") {

            if(this.clientForm.type === 1){
              this.purchaserList.forEach((item) => {
                if (item.selectF === true) {
                  list.push(item.id)
                }
              });
              (this.clientForm_first2.auto_log === true)? auto_log = 1: auto_log = 0;
              (this.clientForm_first2.code_lacation === true)? code_lacation = 1: code_lacation = 0;
              (this.clientForm_first2.card_package_allow === true)? card_package_allow = 1: card_package_allow = 0;
              (this.clientForm_first2.alipay_allow === true)? alipay_allow = 1: alipay_allow = 0;
              (this.clientForm_first2.other_pay_allow === true)? other_pay_allow = 1: other_pay_allow = 0;
            }else {
              this.purchaserList.forEach((item) => {
                if (item.select === true) {
                  list.push(item.id)
                }
              });
              (this.clientForm_second.auto_log === true)? auto_log = 1: auto_log = 0;
              (this.clientForm_second.code_lacation === true)? code_lacation = 1: code_lacation = 0
            }
            // 新增方案
            let params = {
              redirect: "x1.invoice.add",
              name: this.clientForm.name,
              type:this.clientForm.type,
              third_code: window.JSON.stringify(this.clientForm.third_code),
              status: status,

              auto_log: auto_log,
              code_lacation:code_lacation,
              purchasers: list.join(','),
              token1:this.clientForm_first.token1,
              code_number:this.clientForm_first2.code_number,
              sale_name:this.clientForm_first2.sale_name,
              address:this.clientForm_first2.address,
              tel:this.clientForm_first2.tel,
              account:this.clientForm_first2.account,
              drawer:this.clientForm_first2.drawer,
              tax_rate:this.clientForm_first2.tax_rate,
              service_name:this.clientForm_first2.service_name,
              payee:this.clientForm_first2.payee,
              reviewer:this.clientForm_first2.reviewer,
              card_package_allow:card_package_allow,
              alipay_allow:alipay_allow,
              other_pay_allow:other_pay_allow,
              merchant_abbreviation:this.clientForm_first2.merchant_abbreviation,
              logo_url:this.clientForm_first2.logo_url,
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                if(Int === 1){
                  this.$router.push({path: `/invoice/pageDesign/${res.data.id}`})
                }
                if(Int === 2){
                  this.dialogFormVisible1 = false;
                  this.getProgrammeList(this.p = {page: 1, size: 20, total: 0})
                }
              }
            })
          } else {

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

            // 修改方案
            let params = {
              redirect: "x1.invoice.update",
              id: this.clientForm.id,
              name: this.clientForm.name,
              type:this.clientForm.type,
              third_code: window.JSON.stringify(this.clientForm.third_code),
              status: status,
              auto_log: auto_log,
              code_lacation:code_lacation,
              purchasers: list.join(','),

              token1:this.clientForm_first.token1,
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
                if(Int === 0){
                  this.$router.push({path: `/invoice/pageDesign/${this.clientForm.id}`})
                }
                if(Int === 2){
                  this.dialogFormVisible1 = false;
                  this.getProgrammeList(this.p)
                }
              }
            })

          }

        }

      },
      buyInfo(id, bool) {
        if (this.showName === "新增方案") {
          this.purchaserList.forEach((item) => {
            if (item.id === id) {
              item.select = bool
            }
          })
        } else {
          this.clientForm_second.purchasers.forEach((item) => {
            if (item.id === id) {
              item.select = bool
            }
          })
        }

      },

      show(row) {
        this.dialogFormVisible = true;
        // 查看正在使用门店列表
        let params = {
          redirect: "x1.invoice.getUseStoreList",
          id: row.id,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.storeData = res.data
          }
        })
      },
      search() {
        if (this.searchName === '') {
          this.getProgrammeList(this.p = {page: 1, size: 20, total: 0})
        } else {
          this.getProgrammeList(this.p = {page: 1, size: 20, total: 0}, this.searchName)
        }
      },
      removeDomain(index) {
        this.clientForm.third_code.splice(index, 1)
      },
      addDomain() {
        this.clientForm.third_code.push({code1: '', code2: ''});
      },

      getPage(page) {
        this.p.page = page;
        this.getProgrammeList(this.p, this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.getProgrammeList(this.p, this.searchName);
      },


      add(name) {
        this.showName = name;
        this.dialogFormVisible1 = true;

        // 获取销售方列表
        let params = {
          redirect: "x1.invoice.getPurchaserList"
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            res.data.forEach((item) => {
              if (item.select === 0) {
                item.select = false;//纸质
                item.selectF = false//电子
              } else {
                item.select = true;
                item.selectF = true
              }
            });
            this.purchaserList = res.data;
          }
        })
      },

      edit(name, row) {
        this.showName = name;
        this.dialogFormVisible1 = true;

        // 发票方案详情
        let params = {
          redirect: "x1.invoice.getInvoiceInfo",
          id: row.id,
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
      del(row) {
        console.log(row)
        if (row.status === "关闭") {
          this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            // 删除方案
            let params = {
              redirect: "x1.invoice.del",
              id: row.id,
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.$message({
                  type: 'info',
                  message: '删除成功'
                });

                this.getProgrammeList(this.p);
              }
            })
          }).catch(() => {
            //
          });
        } else {
          this.$message({
            type: 'info',
            message: '此方案正在使用，不能删除！如须删除，请先禁用后删除。'
          });
        }


      },

      getProgrammeList(p, name = "") {
        // 发票方案列表
        let params = {
          redirect: "x1.invoice.programmeList",
          name: name,
          page: p.page,
          pagesize: p.size,

        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            res.data.list.forEach((data) => {
              data.select = false;
            });
            this.invoiceList = res.data.list;
            this.p.total = res.data.count;
          }
        })

      },

      myChange(id, name) {
        if (name === "provider") {
          this.cityId = "";
          this.areaId = "";
          this.areaList = [];
          getArea(id).then((res) => {
            this.cityList = res.data.data
          })
        }
        if (name === "city" && this.cityId !== "") {
          this.areaId = "";
          this.areaList = [];
          getArea(id).then((res) => {
            this.areaList = res.data.data
          })
        }
      },

    },
    created() {

      this.getProgrammeList(this.p);

      getArea('').then((res) => {
        if (res.data.errcode === 0) {
          this.providerList = res.data.data
        } else {

        }
      })
    },
    mounted() {
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    destroyed() {

    },
    updated() {

    }
  }
</script>

<style scoped lang="less">


</style>

