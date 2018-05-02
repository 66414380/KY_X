<template>
  <div v-show="getTreeArr['门店列表']">
    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">
        <div>
          <el-button size="small" @click="addStore()">批量新增</el-button>

          <el-button size="small" @click="isSwitch()">批量开启/关闭</el-button>

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
      <div ref="tree" style="min-width: 200px;overflow: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree :data='getX2storeTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10" :style="{width:tableWidth + 'px'}">
        <el-table :data="storeData" border :height="tableHeight" @select-all="handleSelectionChange"
                  ref="multipleTable">
          <el-table-column header-align="center" align="center"
                           type="selection"
                           label-class-name="mySelect"
                           width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="base_store_id"
                           label="门店编码"
                           width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storename"
                           width="160" label="门店名称"></el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="第三方编码" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.wmData">
                {{index}} -- {{item.wm_store_id}}
              </div>
            </template>

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="营业状态"
                           width="120">
            <template slot-scope="scope">

              <div v-for="(item,index) in scope.row.wmData">
                <el-switch
                  @change="(e)=>{
                    return handleStatus(e,item.base_store_id,item.wm_store_source)
                  }"
                  v-model="item.poi_status"
                  >
                </el-switch>
              </div>

            </template>
          </el-table-column>

          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" label="在售菜品"-->
          <!--width="120">-->
          <!--<template slot-scope="scope">-->
          <!--<el-button size="small" type="text" @click="showDishes()">点击查看</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="getOne(scope.row.base_store_id)">外卖平台映射</el-button>
              <el-button size="small" type="danger" @click.stop="del(scope.row.base_store_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>

    </div>

    <!--在买菜品-->
    <el-dialog
      title="在买菜品"
      :visible.sync="dialogVisible3"
      width="50%" size="tiny">
      <el-table :data="dishesList" border style="width: 100%;">
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                         width="100">
          <template slot-scope="scope">
            <div>
              {{scope.$index + 1}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code" label="编码"
        >
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="名称"
        >
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--批量开启/关闭-->
    <el-dialog
      title="开启/关闭"
      :visible.sync="dialogVisible1"
      width="400px" >
      <el-switch
        v-model="storeStatusValue"
        >
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
      <div class="margin_b_10" v-for="(item,index) in baseStore">
        <div>
          {{index}}
          <div class="padding_l_10" v-for="(item1,index1) in item">
            <el-checkbox v-model="item1.OK">{{item1.storename}}</el-checkbox>
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
  import {getLeft,recur} from '../../utility/communApi'
  import Hub from '../../utility/commun'
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';

  export default {
    components: {},
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    data() {
      return {
        dialogVisible2: false,
        storeStatusValue: false,

        tableWidth: 0,
        tableHeight: 0,
        dialogVisible1: false,
        dialogVisible3: false,

        navList: [{name: "聚合外卖管理", url: ''},{name: "门店管理", url: ''},{name: "门店列表", url: ''}],
        storeName: '',
        dishesList: [
          {code: '123', name: '炳胜（马场店）'},
          {code: '456', name: '炳胜（马场店）'}
        ],
        storeData: [],
        p: {page: 1, size: 20, total: 0},
        baseStore: {},//点击新增时的门店
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setX2StoreLevelId','setX2storeTree']),
      ...mapGetters(['getX2StoreLevelId','getX2storeTree']),
      handleStatus(e,storeId,type){
        let is_open;
        if(e === false){
          is_open = 0
        } else {
          is_open = 1
        }
        let params = {
          redirect: "x2.store.changeStoreStatus",
          storeId: storeId,
          type:type,
          is_open:is_open
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.$message(res.errmsg);
            this.showResouce(this.p, this.getX2StoreLevelId(), this.storeName = '');
          }
        });
      },
      add() {
        let list = [];
        for (let map in this.baseStore) {
          this.baseStore[map].forEach((item) => {
            if (item.OK) {
              list.push(item.id)
            }
          })
        }
        if (list.length === 0) {
          this.$message('请选择门店');
        } else {


          let params = {
            redirect: "x2.store.addStore",
            storeIds: list.join(','),

          };
          oneTwoApi(params).then((res) => {
            if (res.errcode === 0) {
              this.dialogVisible2 = false;
              this.$message(res.errmsg);
              this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.getX2StoreLevelId(), this.storeName = '');
            }
          });

        }

      },
      close2() {
        for (let map in this.baseStore) {
          this.baseStore[map].forEach((item) => {
            item.OK = false
          })
        }
      },
      addStore() {
        if (this.getX2StoreLevelId() === "") {
          this.$message('请选择门店所属部门');
        } else {
          this.dialogVisible2 = true;


          //添加门店时候，读取基础库
          let params = {
            redirect: "x2.store.getBaseStore",
            levelId: this.getX2StoreLevelId(),

          };
          oneTwoApi(params).then((res) => {
            if (res.errcode === 0) {
              for (let map in res.data) {
                res.data[map].forEach((item) => {
                  item.OK = false
                })
              }
              this.baseStore = res.data
            }
          });

        }
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      getOne(id) {
        this.$router.push({path: `/x2OperationScheme/storeManagement/takeOut/${id}`})

      },
      showDishes() {
        this.dialogVisible3 = true
      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p, this.getX2StoreLevelId(), this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p, this.getX2StoreLevelId(), this.searchName);
      },

      del(base_store_id) {
        this.$confirm(
          '删除后对应的外卖平台门店也将关闭、客人无法下单。确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          //删除门店接口
          let params = {
            redirect: "x2.store.delStore",
            storeId: base_store_id,
          };
          oneTwoApi(params).then((res) => {
            if (res.errcode === 0) {
              this.$message({
                type: 'info',
                message: '删除成功'
              });
              this.showResouce(this.p, this.getX2StoreLevelId())
            }
          })

        }).catch(() => {
          //
        });

      },
      search() {
        this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.getX2StoreLevelId(),this.storeName)

      },

      //批量状态设置
      changeStoresStatus() {
        let storeStatusValue,list = [];
        if (this.storeStatusValue) {
          storeStatusValue = 1
        } else {
          storeStatusValue = 0
        }
        //批量修改状态
        this.storeData.forEach((item) => {
          if (item.select) {
            list.push(item.base_store_id)
          }
        });
        let params = {
          redirect: "x2.store.batchChange",
          storeIds: list.join(','),
          is_open: storeStatusValue,

        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.$message('操作成功');
            this.showResouce(this.p, this.getX2StoreLevelId());
            this.dialogVisible1 = false
          }
        })
      },
      isSwitch() {
        if (this.storeData.some((item) => {return item.select === true}) === true) {
          this.dialogVisible1 = true
        } else {
          this.$message('请勾选门店');
        }
      },

      handleChecked(data) {
        let list = this.storeData.filter((item) => {
          return item.select === true
        });
        if (list.length === this.storeData.length) {
          list.forEach((item) => {
            this.$refs.multipleTable.toggleRowSelection(item)
          })

        } else {
          this.$refs.multipleTable.clearSelection();

        }

      },
      handleSelectionChange(val) {
        if (val.length === this.storeData.length) {
          this.storeData.forEach((map) => {
            this.$set(map, 'select', true)
          });
        } else {
          this.storeData.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },

      showLevel() {
        getLeft('x2').then((res) => {
          if (res.data.errcode === 0) {
            this.setX2storeTree({list:res.data.data});
            if (this.getX2StoreLevelId() === '') {
              this.setX2StoreLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p, this.getX2StoreLevelId());
            recur(res.data.data,true,this.getX2StoreLevelId(),this)
          } else {

          }
        })

      },
      showResouce(p, levelId, storeName = "") {
        //获取门店列表
        let params = {
          redirect: "x2.store.index",
          levelid: levelId,
          storeName: storeName,
          page: p.page,
          pagesize: p.size,
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            if(res.data.list.length !== 0){
              res.data.list.forEach((item)=>{
                item.select = false;
                for (let i in item.wmData) {
                 if(item.wmData[i].poi_status === 0) {
                   item.wmData[i].poi_status = false
                 }else {
                   item.wmData[i].poi_status = true
                 }
                }
              })
            }
            this.storeData = res.data.list;
            this.p.total = res.data.count;
          }
        })
      },
    },
    created() {
      if(this.getX2storeTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.p,this.getX2StoreLevelId());
      }
    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.showResouce(this.p = {page: 1, size: this.p.size, total: 0}, e.levelid,this.storeName = '');
        this.setX2StoreLevelId({levelId: e.levelid});
        recur(this.getX2storeTree(),false,this.getX2StoreLevelId(),this)
      });
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
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

<style scoped>


</style>
