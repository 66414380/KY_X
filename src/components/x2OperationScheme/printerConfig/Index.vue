<template>
  <div v-show="getTreeArr['打印机列表']">
    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>

    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree :data='getPrintConfTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10" :style="{width:tableWidth + 'px'}">

        <div class="flex_a">
          <h3 class="margin_r_10">{{levelName}}</h3>
          <el-select size="small" clearable filterable v-model="storeData_id" placeholder="请选择" @change="handleStore">
            <el-option
              v-for="item in storeData"
              :key="item.base_store_id"
              :label="item.storename"
              :value="item.base_store_id">
            </el-option>
          </el-select>

        </div>

        <div :style="{height:(tableHeight - 30) + 'px'}">

          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="打印机列表" name="first">
              <el-button class="margin_b_10" type="primary" @click="addPrint('新增打印机',1)" v-show="getTreeArr['打印机新增']">
                新增打印机
              </el-button>

              <el-table :data="printData" border :height="tableHeight - 139">

                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="printername"
                                 label="打印机名称">
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="typelabel"
                                 label="打印机类型">
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sn"
                                 :render-header="header">
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code"
                                 label="打印机模板">
                  <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.templates">
                      {{item.templatename}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="linktime"
                                 label="上次联网时间">
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center"
                                 label="操作" width="340">
                  <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="edit('修改打印机',1,scope.row.id)"
                               v-show="getTreeArr['打印机修改']">修改打印机
                    </el-button>
                    <el-button size="small" type="danger" @click="del(scope.row.id)" v-show="getTreeArr['打印机删除']">
                      删除打印机
                    </el-button>
                    <el-button size="small" @click="conf(scope.row.id)" v-show="getTreeArr['打印机模板选择']">打印模板配置
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>


            </el-tab-pane>
            <el-tab-pane label="打印模板列表" name="second" disabled>

              <el-button class="margin_b_10" type="primary" @click="addPrint('新增打印模板',2)">新增打印模板</el-button>

              <el-table :data="printData" border :height="tableHeight - 139">

                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code"
                                 label="模板名称">
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code"
                                 label="模板下打印机">
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code"
                                 label="打印机小票类型">
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code"
                                 label="打印时机">
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code"
                                 label="最后编辑时间">
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code"
                                 label="编辑人">
                </el-table-column>
                <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code"
                                 label="操作">
                  <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="edit('修改',2,scope.row.id)">修改</el-button>
                    <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>

                  </template>
                </el-table-column>
              </el-table>


            </el-tab-pane>
          </el-tabs>
        </div>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>
    </div>

    <!--新增、修改-->
    <el-dialog
      :title="name"
      :visible.sync="dialogVisible1"
      @open="open1"
      @close="close1"
      width="560px">
      <el-form ref="formRules" :model="formPrint" label-width="100px">
        <el-form-item label="打印机编码:" v-if="name === '修改打印机'">
          <el-input v-model="formPrint.id" placeholder="请输入内容" disabled></el-input>
        </el-form-item>

        <el-form-item label="打印机类型:" prop="type"
                      :rules="{type:'number',required: true, message: '请选择打印机类型', trigger: 'change'}">
          <el-select v-model="formPrint.type" filterable placeholder="请选择">
            <el-option
              v-for="item in printType"
              :key="item.id"
              :label="item.type"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="打印机名称:" prop="printername" :rules="{required: true, message: '请输入打印机名称', trigger: 'blur'}">
          <el-input v-model="formPrint.printername" placeholder="请输入打印机名称"></el-input>
        </el-form-item>

        <el-form-item label="打印机编号:" prop="sn" :rules="{required: true, message: '请输入打印机编号', trigger: 'blur'}">
          <el-input v-model="formPrint.sn" placeholder="请输入打印机编号" :disabled="name === '修改打印机'"></el-input>
        </el-form-item>


        <div v-for="(domain, index) in formPrint.morecodes" class="flex_r">
          <el-form-item label="" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px;position: relative">
                    <el-input v-model="domain.code1" placeholder="请输入第三方名称"></el-input>
                    <div class="third" v-if="index === 0">
                      第三方编码
                      <el-tooltip content="指外部编码，例如需要该打印模板和其他 比如美团的打印机，则填写内容为： 名称：美团，编码（输入美团模板的编号）12334"
                                  placement="top">
                        <i class="fa fa-question-circle-o"></i>
                      </el-tooltip>
                    </div>
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
          <div class="flex_a" style="margin-bottom: 22px">
            <div class="m-storeCode margin_l_10" @click="addDomain()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(formPrint.morecodes.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <el-form-item label="配置模板:" prop="templateid" :rules="{type:'array',required: true, message: '请选择模板', trigger: 'change'}">
          <el-select multiple filterable v-model="formPrint.templateid" placeholder="请选择">
            <el-option
              v-for="item in confTemplateList"
              :key="item.id"
              :label="item.templatename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态:">
          <el-switch
            v-model="formPrint.status"
            >
          </el-switch>
        </el-form-item>
        <div class="margin_t_10">
          <el-button type="primary" @click="submitFrom('formRules')">确认</el-button>
          <el-button @click="dialogVisible1 = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      title="配置打印模板"
      :visible.sync="dialogVisible2"
      width="50%">
      <div>
        <span>模板名称</span>
        <el-checkbox v-model="checkedAll" @change="handleCheckAllChange">全选</el-checkbox>
      </div>

      <div class="width_100 flex_r margin_t_10">
        <div class="flex_1">
          <el-checkbox-group v-model="checked" @change="handleChecked">
            <div class="flex_d_c myPrintConfig">
              <el-checkbox v-for="(item,index) in confTemplateList" :label="item.id" :key="item.id">
                {{item.templatename}}
              </el-checkbox>
            </div>
          </el-checkbox-group>

        </div>
        <div class="flex_1">
          <div class="flex flex_d_c">
            <img src="../../../assets/u6264.png" alt="" style="width: 300px">
            <div class="margin_t_10">
              预览
            </div>
          </div>

        </div>
      </div>
      <div class="flex">
        <el-button size="small" type="primary" @click="saveConf()">保存</el-button>
      </div>

    </el-dialog>

    <el-dialog
      :title="name"
      :visible.sync="dialogVisible3"
      @open="open3"
      @close="close3"
      width="50%">
      <el-form ref="formRulesTemp" :model="formPrintTemp" label-width="140px">

        <el-form-item label="模板名称:" prop="name" :rules="{required: true, message: '请输入模板名称', trigger: 'blur'}">
          <el-input v-model="formPrintTemp.name" placeholder="请输入模板名称"></el-input>
        </el-form-item>

        <div v-for="(domain, index) in formPrintTemp.thirdCode" class="flex_r">
          <el-form-item label="" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px;position: relative">
                    <el-input v-model="domain.code1" placeholder="请输入第三方名称"></el-input>
                    <div class="third" v-if="index === 0">
                      第三方编码
                      <el-tooltip content="指外部编码，例如需要该打印模板和其他 比如美团的打印机，则填写内容为： 名称：美团，编码（输入美团模板的编号）12334"
                                  placement="top">
                        <i class="fa fa-question-circle-o"></i>
                      </el-tooltip>
                    </div>
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
          <div class="flex_a" style="margin-bottom: 22px">
            <div class="m-storeCode margin_l_10" @click="addDomain1()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(formPrintTemp.thirdCode.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain1(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <el-form-item label="打印时机:">
          <el-select v-model="formPrintTemp.printTime_id" placeholder="请选择">
            <el-option
              v-for="item in printTime"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="打印机小票类型:">
          <el-select v-model="formPrintTemp.printTicketType_id" placeholder="请选择">
            <el-option
              v-for="item in printTicketType"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="打印机小票类型:">
          <el-select v-model="formPrintTemp.printTicketType_id2" placeholder="请选择">
            <el-option
              v-for="item in printTicketType2"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <div class="flex_r">
          <div class="flex_1">
            <h3>模板内容</h3>
            <div class="margin_b_10" style="border-bottom: 1px solid #DFE6EC">必选</div>
            <el-form-item label="订单来源">
              <el-switch
                v-model="formPrintTemp.switch1"
                >
              </el-switch>
              <el-select v-model="formPrintTemp.fontSize1" clearable placeholder="字号选择" style="width: 130px;">
                <el-option
                  v-for="item in fontSize"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <div class="margin_b_10" style="border-bottom: 1px solid #DFE6EC">选填</div>
            <el-form-item label="店铺地址">
              <el-switch
                v-model="formPrintTemp.switch11"
                >
              </el-switch>
              <el-select v-model="formPrintTemp.fontSize11" clearable placeholder="字号选择" style="width: 130px;"
                         v-if="formPrintTemp.switch11">
                <el-option
                  v-for="item in fontSize"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="店铺电话">
              <el-switch
                v-model="formPrintTemp.switch12"
                >
              </el-switch>
              <el-select v-model="formPrintTemp.fontSize12" clearable placeholder="字号选择" style="width: 130px;"
                         v-if="formPrintTemp.switch12">
                <el-option
                  v-for="item in fontSize"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-switch
                v-model="formPrintTemp.switch13"
                >
              </el-switch>
              <el-select v-model="formPrintTemp.fontSize13" clearable placeholder="字号选择" style="width: 130px;"
                         v-if="formPrintTemp.switch13">
                <el-option
                  v-for="item in fontSize"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-switch
                v-model="formPrintTemp.switch14"
               >
              </el-switch>
              <el-select v-model="formPrintTemp.fontSize14" clearable placeholder="字号选择" style="width: 130px;"
                         v-if="formPrintTemp.switch14">
                <el-option
                  v-for="item in fontSize"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="折前金额">
              <el-switch
                v-model="formPrintTemp.switch15"
                >
              </el-switch>
              <el-select v-model="formPrintTemp.fontSize15" clearable placeholder="字号选择" style="width: 130px;"
                         v-if="formPrintTemp.switch15">
                <el-option
                  v-for="item in fontSize"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="折扣金额">
              <el-switch
                v-model="formPrintTemp.switch16"
                >
              </el-switch>
              <el-select v-model="formPrintTemp.fontSize16" clearable placeholder="字号选择" style="width: 130px;"
                         v-if="formPrintTemp.switch16">
                <el-option
                  v-for="item in fontSize"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="期望送达时间">
              <el-switch
                v-model="formPrintTemp.switch17"
                >
              </el-switch>
              <el-select v-model="formPrintTemp.fontSize17" clearable placeholder="字号选择" style="width: 130px;"
                         v-if="formPrintTemp.switch17">
                <el-option
                  v-for="item in fontSize"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客人备注">
              <el-switch
                v-model="formPrintTemp.switch18"
           >
              </el-switch>
              <el-select v-model="formPrintTemp.fontSize18" clearable placeholder="字号选择" style="width: 130px;"
                         v-if="formPrintTemp.switch18">
                <el-option
                  v-for="item in fontSize"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="flex_1">
            <img class="margin_l_10" src="../../../assets/printConfig.png" alt="" style="width: 320px">
          </div>
        </div>

        <el-form-item label="选择打印方式">
          <el-select v-model="formPrintTemp.printType2_id" clearable placeholder="请选择">
            <el-option
              v-for="item in printType2"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-checkbox label="全选"></el-checkbox>
          <div>
            <el-checkbox label="好吃的菜"></el-checkbox>
            <el-checkbox label="不好吃的菜"></el-checkbox>
            <el-checkbox label="一般好吃的菜"></el-checkbox>
            <el-checkbox label="饭"></el-checkbox>
          </div>

        </el-form-item>

        <el-form-item label="打印订单类型">
          <el-checkbox label="全部"></el-checkbox>
          <el-checkbox label="外卖配送"></el-checkbox>
          <el-checkbox label="外卖自提"></el-checkbox>

        </el-form-item>

        <el-form-item label="打印订单来源">
          <el-checkbox label="美团"></el-checkbox>
          <el-checkbox label="饿了么"></el-checkbox>
          <el-checkbox label="百度"></el-checkbox>

        </el-form-item>

        <el-form-item label="分单打印类型">
          <el-select v-model="formPrintTemp.printType3_id" clearable placeholder="请选择">
            <el-option
              v-for="item in printType3"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜品单独配置">
          <el-select v-model="formPrintTemp.conf_id" clearable placeholder="请选择">
            <el-option
              v-for="item in dishesConf"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>


      </el-form>
      <div class="margin_t_10">
        <el-button type="primary" @click="">测试打印</el-button>
        <el-button type="primary" @click="">提交</el-button>
        <el-button @click="">重置</el-button>

      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getLeft,recur} from '../../utility/communApi'
  import Hub from '../../utility/commun'
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';

  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components: {},
    data() {
      return {
        levelName: '',
        name: '',
        activeName: 'first',
        tableWidth: 0,
        tableHeight: 0,
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        navList: [{name: "聚合外卖管理", url: ''},{name: "门店管理", url: ''},{name: "打印机配置", url: ''}],
        printData: [],
        storeData: [],
        storeData_id: '',
        p: {page: 1, size: 20, total: 0},
        formPrint: {
          type: '',
          printername: '',
          sn: '',
          morecodes: [
            {code1: '', code2: ''}
          ],
          templateid: [],
          status: true,
        },
        formPrintTemp: {
          name: '',
          thirdCode: [
            {code1: '', code2: ''}
          ],
          printTime_id: '',
          printTicketType_id: '',
          printTicketType_id2: '',
          fontSize1: '',
          fontSize2: '',
          fontSize3: '',
          fontSize4: '',
          fontSize5: '',
          fontSize6: '',
          fontSize7: '',
          fontSize8: '',
          fontSize9: '',
          fontSize10: '',
          fontSize11: '',
          fontSize12: '',
          fontSize13: '',
          fontSize14: '',
          fontSize15: '',
          fontSize16: '',
          fontSize17: '',
          fontSize18: '',
          switch1: true,
          switch2: true,
          switch3: true,
          switch4: true,
          switch5: true,
          switch6: true,
          switch7: true,
          switch8: true,
          switch9: true,
          switch10: true,
          switch11: false,
          switch12: false,
          switch13: false,
          switch14: false,
          switch15: false,
          switch16: false,
          switch17: false,
          switch18: false,
          printType2_id: '',
          printType3_id: '',
          conf_id: ''
        },
        printType: [],
        confTemplateList: [],
        checkedAll: false,
        checked: [],

        printTime: [{id: 1, name: '外部外卖已受理'}, {id: 2, name: '外部外卖未受理'}, {id: 3, name: '退款单'}, {
          id: 4,
          name: '外卖平台营业报表'
        }],
        printTicketType: [{id: 1, name: '易联云-小票宽度80mm'}, {id: 2, name: '易联云-小票宽度58mm'}, {id: 3, name: '易联云-小票宽度80mm'}],
        printTicketType2: [{id: 1, name: '模板一 - 适用于存根 - 外卖'}, {id: 2, name: '模板二 - 适用于客联 - 外卖'}, {
          id: 3,
          name: '模板三 - 适用于后厨 - 外卖'
        }],
        fontSize: [{id: 0, name: '不选择的话默认2', disabled: true}, {id: 1, name: '2'}, {id: 2, name: '4'}, {
          id: 3,
          name: '6'
        }],
        printType2: [{id: 1, name: '分品类打印'}, {id: 2, name: '分厨房打印'}],
        printType3: [{id: 1, name: '不分单'}, {id: 2, name: '分单打印，数量不合并'}, {id: 3, name: '分单打印，数量合并'}],
        dishesConf: [{id: 1, name: '不分组'}, {id: 2, name: '分单标签 - 篮子'}, {id: 3, name: '分单标签 - 口袋'}, {
          id: 4,
          name: '分单标签 - 加菜'
        }, {id: 5, name: '分单标签 - 分组'}],
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setPrintConfLevelId','setPrintConfTree']),
      ...mapGetters(['getPrintConfLevelId','getPrintConfTree']),

      handleClick(event) {

      },
      getStoreTemplate() {
        //可选择打印机的模板
        let params1 = {
          redirect: "x2a.printer.storetemplate",
          storeid: this.storeData_id,
        };
        oneTwoApi(params1).then((res) => {
          if (res.errcode === 0) {
            this.confTemplateList = res.data
          }
        })
      },
      close1() {
        this.$refs['formRules'].resetFields();
        if (this.name === "新增打印机") {
          this.formPrint = {
            type: '',
            printername: '',
            sn: '',
            morecodes: [
              {code1: '', code2: ''}
            ],
            templateid: [],
            status: true,
          }
        }
      },
      open1() {

        this.getStoreTemplate()
      },
      submitFrom(formRules) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {

            if (this.name === "新增打印机") {
              //新增打印机
              let status;
              (this.formPrint.status === false) ? status = 0 : status = 1;

              let params = {
                redirect: "x2a.printer.create",
                storeid: this.storeData_id,
                type: this.formPrint.type,
                printername: this.formPrint.printername,
                sn: this.formPrint.sn,
                morecodes: window.JSON.stringify(this.formPrint.morecodes),
                templateid: this.formPrint.templateid.join(','),
                status: status,
              };
              oneTwoApi(params).then((res) => {
                if (res.errcode === 0) {
                  this.dialogVisible1 = false;
                  this.getPrintData(this.p = {page: 1, size: 20, total: 0})
                }
              })
            } else {
              this.updatePrint('修改打印机');
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleCheckAllChange(e) {
        let list = [];
        if (e.target.checked === true) {
          this.confTemplateList.forEach((item) => {
            list.push(item.id)
          });
          this.checked = list
        } else {
          this.checked = []
        }

      },
      handleChecked(e) {
        let length = e.length;
        this.checkedAll = length === this.confTemplateList.length;
      },

      updatePrint(Str){
        let status;
        (this.formPrint.status === false) ? status = 0 : status = 1;

        let params = {
          redirect: "x2a.printer.update",
          id: this.formPrint.id,
          storeid: this.storeData_id,
          type: this.formPrint.type,
          printername: this.formPrint.printername,
          sn: this.formPrint.sn,
          morecodes: window.JSON.stringify(this.formPrint.morecodes),
          templateid: Str === '打印模板配置'? this.checked.join(','):this.formPrint.templateid.join(','),
          status: status
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            Str === '打印模板配置'?this.dialogVisible2 = false:this.dialogVisible1 = false;
            this.getPrintData(this.p = {page: 1, size: 20, total: 0})
          }
        })
      },

      saveConf() {

        if(this.checked.length === 0){
          this.$message('必须选择打印模板')
        }else {
          this.updatePrint('打印模板配置');
        }
      },

      open3() {

      },
      close3() {

      },
      viewPrint(id) {
        let params = {
          redirect: "x2a.printer.view",
          id: id,
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            res.data.forEach((item) => {
              item.sn = item.sn + "";
              (item.status === 0) ? item.status = false : item.status = true;

              let list = [];
              item.templates.forEach((item1) => {
                list.push(item1.id)
              });
              item.templateid = list;
              this.checked = list;

              this.checkedAll = list.length === this.confTemplateList.length;
            });

            this.formPrint = res.data[0]
          }
        })
      },
      edit(name, Int, id) {
        this.name = name;
        if (Int === 1) {
          this.dialogVisible1 = true;

          this.viewPrint(id)


        } else {
          this.dialogVisible3 = true
        }

      },
      addPrint(name, Int) {
        this.name = name;
        if (Int === 1) {
          this.dialogVisible1 = true
        } else {
          this.dialogVisible3 = true
        }
      },
      async conf(id) {
        this.dialogVisible2 = true;
        await this.viewPrint(id);
        await this.getStoreTemplate()
      },
      showDishes() {
        this.dialogVisible3 = true
      },
      getPage(page) {
        this.p.page = page;
        this.getPrintData(this.p);
      },
      getPageSize(size) {
        this.p.size = size;
        this.getPrintData(this.p);
      },

      header(h) {
        return h(
          'span',
          {attrs:{style:'font-size: 15px;'}},
          ['打印机编号',
            h('el-tooltip', {
                attrs: {content: "打印机底部的编号，例如716800234", placement: "top"},
              }, [
                h('span', {
                    attrs: {type: "text"},
                  }, [ h(
                  'i', {
                    attrs: {class: "fa fa-question-circle-o"}
                  }
                  )]
                )
              ]
            )
          ]
        );
      },
      del(id) {
        this.$confirm(
          '确认删除？', '删除打印机', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          let params = {
            redirect: "x2a.printer.delete",
            id: id
          };
          oneTwoApi(params).then((res) => {
            if (res.errcode === 0) {
              this.getPrintData(this.p)
            }
          })

        }).catch(() => {
          //
        });

      },

      add() {

      },

      removeDomain(item) {
        var index = this.formPrint.morecodes.indexOf(item)
        if (index !== -1) {
          this.formPrint.morecodes.splice(index, 1)
        }
      },
      addDomain() {
        this.formPrint.morecodes.push({code1: '', code2: ''});
      },

      removeDomain1(item) {
        var index = this.formPrintTemp.thirdCode.indexOf(item)
        if (index !== -1) {
          this.formPrintTemp.thirdCode.splice(index, 1)
        }
      },
      addDomain1() {
        this.formPrintTemp.thirdCode.push({code1: '', code2: ''});
      },

      showLevel() {
        getLeft('x2').then((res) => {
          if (res.data.errcode === 0) {
            this.setPrintConfTree({list:res.data.data});
            if (this.getPrintConfLevelId() === '') {
              this.setPrintConfLevelId({levelId: res.data.data[0].id});
            }
            this.levelName = res.data.data[0].levelname;
            this.showResouce(res.data.data[0].id);
            recur(res.data.data,true,this.getPrintConfLevelId(),this)
          } else {

          }
        })

      },
      showResouce(levelId) {
        //获取门店列表
        let params = {
          redirect: "x2.store.index",
          levelid: levelId,
          storeName: '',
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            if (res.data.list.length !== 0) {
              this.storeData_id = res.data.list[0].base_store_id;
            }
            this.storeData = res.data.list;

          }
        })

      },
      handleStore() {
        this.getPrintData(this.p = {page: 1, size: this.p.size, total: 0})
      },
      getPrintData(p) {
        //获取打印机列表
        let params = {
          redirect: "x2a.printer.index",
          storeid: this.storeData_id,
          page: p.page,
          pagesize: p.size

        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.printData = res.data.list;
            this.p.total = res.data.count;

          }
        })
      }
    },
    created() {
      if(this.getPrintConfTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.getPrintConfLevelId());
        recur(this.getPrintConfTree(),false,this.getPrintConfLevelId(),this)
      }

      //获取打印机类型
      let params = {
        redirect: "x2a.printer.printtype",
      };
      oneTwoApi(params).then((res) => {
        if (res.errcode === 0) {
          this.printType = res.data
        }
      });
    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setPrintConfLevelId({levelId: e.levelid});
        this.showResouce(e.levelid);
        this.storeData_id = "";
        recur(this.getPrintConfTree(),false,this.getPrintConfLevelId(),this)
      });
      Hub.$emit('mountedOk', 'mountedOk');
      this.$nextTick(() => {
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })

      })
    },
    updated() {
      let bodyWidth = document.querySelector('.content div').clientWidth;
      let clientWidth = this.$refs.tree? this.$refs.tree.clientWidth : 0;
      this.tableWidth = bodyWidth - clientWidth;

    },
    destroyed() {
      Hub.$off("showAdd");
    }
  }
</script>

<style scoped lang="less">

  .third {
    position: absolute;
    top: 0;
    left: -100px;
  }

</style>
