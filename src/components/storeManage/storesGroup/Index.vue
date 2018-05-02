<template>
  <div v-show="getTreeArr['列表']">
    <div class="padding_b_10 flex_sb bodyTop">
      <xo-nav-path :navList="navList"></xo-nav-path>
      <el-button size="small" type="primary" @click="addGroup()" v-show="getTreeArr['新增']">新增门店标签</el-button>
    </div>
    <div>
      <el-table empty-text=" " :data="tableData" border :height="tableHeight" style="width: 100%">
        <el-table-column header-align="center" align="center" label="序号" width="65">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="id" label="门店标签编码">

        </el-table-column>
        <el-table-column header-align="center" align="center" prop="name" label="门店标签名称">

        </el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="240">
          <template slot-scope="scope">
            <div class="flex">

              <el-button size="small" type="primary" @click="showStore(scope.row)" v-show="getTreeArr['查看门店']">查看门店</el-button>
              <el-button size="small" @click="edit(scope.row)" v-show="getTreeArr['编辑']">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-show="getTreeArr['删除']">删除</el-button>
            </div>

          </template>
        </el-table-column>

      </el-table>
    </div>
    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>
    <!--查看门店-->
    <el-dialog
      title="查看门店"
      :visible.sync="dialogVisible"
      width="560px">
      <el-table :data="storeData" border>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号" width="100">
          <template slot-scope="scope">
            <div>{{scope.$index + 1}}</div>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code"
                         label="门店编码">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storeName"
                         label="门店名称">
        </el-table-column>
      </el-table>

      <div class="margin_t_10">
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--编辑-->
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible1"
      @open="myOpen"
      width="560px">
      <el-form ref="formRules" :model="formEdit" label-width="100px">

        <el-form-item label="标签名称	:" prop="name" :rules="{required: true, message: '请输入标签名称', trigger: 'blur'}">
          <el-input v-model="formEdit.name" placeholder="请输入内容"></el-input>
        </el-form-item>


        <div v-for="(domain, index) in formEdit.thirdCode" class="flex_r">
          <el-form-item :label="index === 0?'第三方编码':''">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.code1"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="m-rank">
            <div class="m-rank-child"></div>
          </div>
          <el-form-item label-width="0">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.code2"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="flex_sc">
            <div class="m-storeCode margin_l_10" @click="addDomain">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(formEdit.thirdCode.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <el-form-item label="包含门店:">
          <el-table :data="formEdit.store" border @select-all="handleSelectionChange" ref="multipleTable">
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
                             label="门店编码">
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storeName"
                             label="门店名称">
            </el-table-column>
          </el-table>
        </el-form-item>

        <div class="margin_t_10">
          <el-button type="primary" @click="update('formRules',formEdit)">确认</el-button>
          <el-button @click="dialogVisible1 = false">取消</el-button>
        </div>

      </el-form>

    </el-dialog>

  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {oneTwoApi} from '@/api/api.js'
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components: {},
    data() {
      return {
        formEdit: {},
        dialogVisible: false,
        dialogVisible1: false,
        tableHeight: 0,
        navList: [{name: "聚合支付管理", url: ''},{name: "门店管理", url: ''}, {name: "门店标签", url: ''}],
        tableData: [],//列表
        storeData: [],//查看门店
        p: {page: 1, size: 20, total: 0},
      }
    },
    methods: {
      ...mapActions(['setTreeArr']),
      getPage(page) {
        this.p.page = page;
        this.showResouce();
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce();
      },
      update(formRules, data) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            let list = [];
            data.store.forEach((item)=>{
              if(item.select === true){
                list.push(item.code)
              }
            });
            // 编辑门店标签
            let params = {
              redirect: "x1.store.editStoreLabel",
              id: data.id,
              name: data.name,
              thirdCode: window.JSON.stringify(data.thirdCode),
              storeIds: list.join(','),
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.dialogVisible1 = false;
                this.showResouce();
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      handleSelectionChange(val) {
        if(val.length === this.formEdit.store.length){
          this.formEdit.store.forEach((map) => {
            this.$set(map, 'select', true)
          });
        }else {
          this.formEdit.store.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },
      handleChecked() {
        let list =  this.formEdit.store.filter((item)=>{
          return item.select === true
        });
        this.$nextTick(()=>{
          if (list.length === this.formEdit.store.length) {
            list.forEach((item)=>{
              this.$refs.multipleTable.toggleRowSelection(item)
            })
          }else {
            this.$refs.multipleTable.clearSelection();
          }
        })
      },

      removeDomain(item) {
        var index = this.formEdit.thirdCode.indexOf(item)
        if (index !== -1) {
          this.formEdit.thirdCode.splice(index, 1)
        }
      },
      addDomain() {
        this.formEdit.thirdCode.push({
          code1: '',
          code2: ''
        });
      },
      edit(row) {
        // 获取门店标签详情
        let params = {
          redirect: "x1.store.storeLabelInfo",
          id: row.id,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            res.data.store.forEach((item)=>{
              item.select = true
            });
            this.formEdit = res.data;
            this.dialogVisible1 = true;
          }
        })
      },
      showStore(row) {
        this.dialogVisible = true;

        // 获取标签下的门店列表
        let params = {
          redirect: "x1.store.getStoreListByLabelId",
          id: row.id,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.storeData = res.data.list
          }
        })
      },
      handleEdit(index, row) {

      },
      handleDelete(index, row) {

        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          // 删除门店标签
          let params = {
            redirect: "x1.store.delStoreLabel",
            id: row.id,
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.$message({
                type: 'info',
                message: '删除成功'
              });
              this.showResouce()
            }
          })
        }).catch(() => {
          //
        });
      },

      myOpen() {
        this.handleChecked()

      },
      addGroup() {
        this.$router.push('/storeManage/storeGroup/addGroup')
      },
      showResouce() {

        // 获取门店标签列表
        let params = {
          redirect: "x1.store.storeLabelList",
          page: this.p.page,
          pagesize: this.p.size,

        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.tableData = res.data.list;
            this.p.total = res.data.count
          }
        })
      }
    },

    updated() {

    },
    created() {
      this.storeData.forEach((map) => {
        this.$set(map, 'select', true)
      });
      this.showResouce()

    },
    mounted() {
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    destroyed(){

    }
  }
</script>

<style scoped lang="less">

</style>
