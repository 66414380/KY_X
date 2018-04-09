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
                         v-model="scope.row.status"
                         on-color="#13ce66"
                         off-color="#ff4949">
              </el-switch>
            </template>

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="240">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click.stop="getOneList(scope.row.id)">查看</el-button>
              <el-button size="small" @click.stop="edit(scope.row.id)">编辑</el-button>
              <el-button size="small" type="danger" @click.stop="del(scope.row.id)" v-show="getTreeArr['删除']">删除</el-button>
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
      width="50%" size="tiny">
      <el-switch
        v-model="storeStatusValue"
        on-color="#13ce66"
        off-color="#ff4949">
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
      width="50%" size="tiny">
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
  </div>
</template>

<script>

  import {getScrollHeight} from '../../../utility/getScrollHeight'
  import getApi from './storeList.service';
  import {getLeft,recur} from '../../../utility/communApi'
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../../utility/commun'

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
        tableHeight: 0,
        tableWidth: 0,
        navList: [{name: "门店管理", url: ''}, {name: "门店列表", url: ''}],

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
        checkAll:false
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setX1StoreLevelId','setX1storeTree']),
      ...mapGetters(['getX1StoreLevelId','getX1storeTree']),
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
