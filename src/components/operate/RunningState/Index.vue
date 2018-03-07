<template>
  <div v-show="getTreeArr['列表']">
    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">
        <div>

        </div>

        <div class="flex_a">
          <div class="margin_r_10">
            <el-input size="small" v-model="searchName" placeholder="请输入内容"></el-input>
          </div>
          <el-button size="small" @click="search()">搜索</el-button>
        </div>
      </div>
    </div>

    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree :data='getRunningStateTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10 width_100"  >
        <el-table :data="storeData" border :height="tableHeight">
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="NO" label="序号"
                           type="index" width="100">
            <template slot-scope="scope">

              <el-checkbox v-model="scope.row.NO">{{scope.$index + 1 }}</el-checkbox>

            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id"
                           label="编码"
                           width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storename"
                           label="门店"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="service"
                           width="120" label="款易服务"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="打印机状态" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="printStatus(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="客户端状态" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="clientStatus(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" label="POS端状态"-->
                           <!--width="120">-->
            <!--<template slot-scope="scope">-->
              <!--<el-button type="text" @click="posStatus(scope.row)">查看</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="设置" width="100">
          <template slot-scope="scope">
          <el-button type="text" @click="operation(scope.row.id)">操作</el-button>
          </template>
          </el-table-column>
        </el-table>
        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>

      </div>
    </div>
    <!--弹窗打印机状态-->
    <el-dialog
      title="打印机状态"
      :visible.sync="dialogVisible"
      width="50%">
      <el-table :data="printList" border>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                         type="index" width="70">
          <template slot-scope="scope">
            {{scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="printerid"
                         label="打印机ID">

        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="printerip"
                         label="IP地址">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="printertype"
                         label="型号">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="printerstatus"
                         label="状态">
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--弹窗客户端状态-->
    <el-dialog
      title="客户端状态"
      :visible.sync="dialogVisible2"
      width="50%">
      <el-table :data="clientList" border>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                         type="index" width="70">
          <template slot-scope="scope">
            {{scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="clientserver"
                         label="服务版本">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="installdata"
                         label="安装日期">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="installlocation"
                         label="安装位置">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="linkstatus"
                         label="状态">
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--弹窗POS状态-->
    <el-dialog
      title="客户端状态"
      :visible.sync="dialogVisible3"
      width="50%">
      <el-table :data="POSList" border>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                         type="index" width="70">
          <template slot-scope="scope">
            {{scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="posid" label="POS ID">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="posip" label="IP地址">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="poslocation"
                         label="位置">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="poststatus"
                         label="状态">
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--设置状态-->
    <el-dialog
      title="设置"
      :visible.sync="dialogVisible4"
      width="70%">
      <el-table :data="setList" border>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                         type="index" width="70">
          <template slot-scope="scope">
            {{scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="printerid" width="120"
                         label="打印机ID">
        </el-table-column>
        <el-table-column label-class-name="table_head" :render-header="headerPrint" header-align="center" align="center"
                         width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="submit(scope.row.storeid,scope.row.appid,scope.row.printerid,'testPrinter')">打印</el-button>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="installlocation" label="客户端">
        </el-table-column>
        <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="service" width="200"-->
                         <!--label="款易服务" class-name="myRunningStateCell">-->
          <!--<template slot-scope="scope" >-->
            <!--<div class="flex width_100">-->
              <!--<div class="flex_1" style="border-right: 1px solid #DFE6EC;padding: 4px;">-->
                <!--<div>X1</div>-->
                <!--<el-switch-->
                  <!--v-model="value2"-->
                  <!--on-color="#13ce66"-->
                  <!--off-color="#ff4949">-->
                <!--</el-switch>-->
              <!--</div>-->
              <!--<div class="flex_1">-->
                <!--<div>X2</div>-->
                <!--<el-switch-->
                  <!--v-model="value2"-->
                  <!--on-color="#13ce66"-->
                  <!--off-color="#ff4949">-->
                <!--</el-switch>-->
              <!--</div>-->
            <!--</div>-->

          <!--</template>-->

        <!--</el-table-column>-->


        <el-table-column label-class-name="table_head" :render-header="headerUpdate" header-align="center"
                         align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="submit(scope.row.storeid,scope.row.appid,scope.row.printerid,'refreshService')">更新</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

  import {getScrollHeight} from '../../utility/getScrollHeight'
  import getApi from './runningState.service'
  import {getLevel,recur} from '../../utility/communApi'
  import Hub from '../../utility/commun'
  import { mapActions,mapGetters } from 'vuex';
  export default {
    components: {},
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    data() {
      return {
        value2:false,
        printList: [

        ],
        clientList: [

        ],
        POSList: [

        ],
        setList: [

        ],
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        tableHeight: 0,
        tableWidth: 0,
        navList: [{name: "终端状态", url: ''}],

        searchName: '',
        storeData: [],
        p: {page: 1, size: 20, total: 0},
        defaultProps: {
          children: 'child',
          label: 'levelname'
        },
      }
    },
    watch: {

    },

    methods: {
      ...mapActions(['setRunningStateLevelId','setRunningStateTree']),
      ...mapGetters(['getRunningStateLevelId','getRunningStateTree']),
      search() {

        if (this.searchName === '') {
          this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.getRunningStateLevelId())
        } else {
           this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.getRunningStateLevelId(),this.searchName)
          // this.p = {page: 1, size: 20, total: 0}
          // getApi.getService({page: 1, size: 20, total: 0},this.levelId, this.searchName).then((res) => {

          //   if (res.data.errcode === 0) {
          //     res.data.data.list.forEach((item) => {
          //       if (item.status === 1) {
          //         item.status = "开启"
          //       } else {
          //         item.status = "关闭"
          //       }
          //       item.select = false
          //     });
          //     this.storeData = res.data.data.list;
          //     //this.p.total = res.data.data.count
          //   } else {
          //
          //   }
          // })
        }
      },


      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p, this.getRunningStateLevelId(),this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p, this.getRunningStateLevelId(),this.searchName);
      },
      headerUpdate(h) {
        return h(
          'div',
          {},
          [
            h('el-button', {
                attrs: {size: "mini"},
                'class': {},
                on: {
                  click: () => {
                    if(this.setList.length !== 0){
                      let storeid = this.setList[0].storeid;
                      let paramsList = [];
                      this.setList.forEach((item)=>{
                        paramsList.push({"printerid":item.printerid,"appid":item.appid})
                      });
                      let data = {"action":"refreshService","params":paramsList};
                      getApi.sendcmd(storeid,window.JSON.stringify(data)).then((res)=>{
                        if(res.data.errcode === 0){
                          this.$message(res.data.data);
                        }
                      })
                    }
                  },

                }
              }, ['更新']
            )
          ]
        );
      },


      headerPrint(h) {
        return h(
          'div',
          {},
          [
            h('el-button', {
                attrs: {size: "mini"},
                'class': {},
                on: {
                  click: () => {
                    if(this.setList.length !== 0){
                      let storeid = this.setList[0].storeid;
                      let paramsList = [];
                      this.setList.forEach((item)=>{
                        paramsList.push({"printerid":item.printerid,"appid":item.appid})
                      });
                      let data = {"action":"testPrinter","params":paramsList};
                      getApi.sendcmd(storeid,window.JSON.stringify(data)).then((res)=>{
                        if(res.data.errcode === 0){
                          this.$message(res.data.data);
                        }
                      })
                    }
                  },

                }
              }, ['测试打印']
            )
          ]
        );
      },
      submit(storeid,appid,printerid,name) {
        let data = {"action":name,"params":[{"printerid":printerid,"appid":appid}]};
        getApi.sendcmd(storeid,window.JSON.stringify(data)).then((res)=>{
          if(res.data.errcode === 0){
            this.$message(res.data.data);
          }

        })

      },

      printStatus(row) {
        this.printList = row.storeprinters !== "" ? row.storeprinters: [];
        this.dialogVisible = true
      },
      clientStatus(row) {
        this.clientList = row.storeclients !== "" ? row.storeclients: [];
        this.dialogVisible2 = true
      },
      posStatus(row) {
        this.POSList = row.storeposs !== "" ? row.storeposs: [];
        this.dialogVisible3 = true
      },
      operation(id) {
        getApi.opration(id).then((res)=>{
          if(res.data.errcode === 0){
            this.setList = res.data.data;
            this.dialogVisible4 = true
          }
        })



      },

      editGroup(item) {
        this.item = item;
        this.dialogVisible = true
      },
      del() {

      },

      showResouce(p,id,storename = '') {
        getApi.getService(p,id,storename).then((res) => {
          this.storeData = res.data.data.list;
          this.p.total = res.data.data.count
        })
      },
      showLevel(){
        getLevel().then((res) => {
          if (res.data.errcode === 0) {
            this.setRunningStateTree({list:res.data.data});
            if(this.getRunningStateLevelId() === ''){
              this.setRunningStateLevelId({levelId:res.data.data[0].id});
            }

            recur(res.data.data,true,this.getRunningStateLevelId(),this);
          }
        });
      },
    },


    created() {
      if(this.getRunningStateTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.p,this.getRunningStateLevelId());
      }
    },
    mounted() {
      Hub.$on('showAdd', (e) => {
        this.showResouce(this.p = {page: 1, size: this.p.size, total: 0}, e.levelid,this.searchName = '');
        this.setRunningStateLevelId({levelId:e.levelid});
        recur(this.getRunningStateTree(),false,this.getRunningStateLevelId(),this);

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
      Hub.$off("showAdd");
    }
  }
</script>

<style lang="less" scoped>

</style>
