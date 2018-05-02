<template>
  <div v-show="getTreeArr['外卖映射列表']">
    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">
        <div>
          <span>选择来源平台</span>
          <el-select v-model="type" placeholder="选择来源平台" size="small">
            <el-option
              v-for="item in planList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>

          <span class="margin_l_10">推送状态</span>
          <el-select v-model="status_id" placeholder="选择来源平台" size="small">
            <el-option
              v-for="item in statusListAll"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>

        </div>
        <div class="flex_a">
          <div class="margin_r_10">
            <el-input size="small" v-model="storeName" placeholder="请输入门店名称"></el-input>
          </div>
          <el-button size="small" @click="search()">搜索</el-button>

        </div>
      </div>

      <el-button class="margin_t_10" size="small" @click="batch()" v-show="getTreeArr['修改推送状态']">批量设置推送状态</el-button>
    </div>

    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree :data='getPushStateTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10" :style="{width:tableWidth + 'px'}">
        <el-table :data="storeData" border :height="tableHeight" @select-all="handleSelectionChange"
                  ref="multipleTable">
          <el-table-column header-align="center" align="center"
                           type="selection"
                           label-class-name="mySelect"
                           width="80">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="base_store_id" label="门店编码">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="base_store_name" label="门店名称">
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="来源平台" prop="sourceName">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="推送状态" width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.push_status" placeholder="选择来源平台" size="small"
                         @change="handlStatus(scope.row.id,scope.row.push_status)" @visible-change="canSelect" v-show="getTreeArr['修改推送状态']">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>

            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="外卖门店编码" width="200" prop="wm_store_id">
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="外卖门店名称" width="200" prop="wm_store_name">
          </el-table-column>
        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>

    </div>


    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="400px"  @close="close" @open="open">

      <el-radio-group v-model="radio2" @change="handleAll">
        <el-radio :label="1">配置中</el-radio>
        <el-radio :label="2">推送中</el-radio>
        <el-radio :label="3">未配置</el-radio>
      </el-radio-group>

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
        planList: [{id: 'all', name: '全部'}, {id: 'mt', name: '美团'}, {id: 'el', name: '饿了么'}, {id: 'bd', name: '百度'}],
        type: 'all',
        statusList: [{id: 1, name: '配置中'}, {id: 2, name: '推送中'}, {id: 3, name: '未配置'}],
        statusListAll: [{id: 'all', name: '全部'}, {id: 1, name: '配置中'}, {id: 2, name: '推送中'}, {id: 3, name: '未配置'}],
        status_id: 'all',
        tableWidth: 0,
        tableHeight: 0,
        dialogVisible: false,

        radio2: '',
        navList: [{name: "聚合外卖管理", url: ''},{name: "门店管理", url: ''},{name: "推送状态", url: ''}],
        selectOne:false,
        storeName: '',

        storeData: [],
        p: {page: 1, size: 20, total: 0},

      }
    },
    watch: {},
    methods: {
      ...mapActions(['setPushStateLevelId', 'setPushStateTree']),
      ...mapGetters(['getPushStateLevelId', 'getPushStateTree']),
      batch() {
        if (this.storeData.some((item) => {return item.select === true}) === true) {
          this.dialogVisible = true
        } else {
          this.$message('请选择门店');
        }
      },
      close() {
      },
      open(){
        this.radio2 = '';

      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p, this.getPushStateLevelId(), this.type, this.status_id);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p, this.getPushStateLevelId(), this.type, this.status_id);
      },


      search() {
        this.showResouce(this.p = {
          page: 1,
          size: 20,
          total: 0
        }, this.getPushStateLevelId(), this.type, this.status_id, this.storeName)
      },
      changePushStatus(id, status) {
        let params = {
          redirect: "x2.waimai.changePushStatus",
          Ids: id,
          status: status,
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.$message(res.errmsg);
            this.dialogVisible = false;
            this.showResouce(this.p, this.getPushStateLevelId(), this.type, this.status_id, this.storeName)

          }
        })
      },
      handleAll(e) {
        if(this.radio2 !== ''){
          let list = [];
          this.storeData.forEach((item) => {
            if (item.select) {
              list.push(item.id)
            }
          });
          let ids = list.join(',');
          this.changePushStatus(ids, e)
        }


      },
      canSelect(e){
        (e === true)? this.selectOne = true: this.selectOne = false
      },
      handlStatus(id, status) {
        if(this.selectOne === true){
          this.changePushStatus(id, status)
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
            this.setPushStateTree({list: res.data.data});
            if (this.getPushStateLevelId() === '') {
              this.setPushStateLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p, this.getPushStateLevelId(), this.type, this.status_id);
            recur(res.data.data,true,this.getPushStateLevelId(),this)
          } else {

          }
        })

      },

      showResouce(p, levelId, type, status, search = "") {
        //外卖门店映射列表
        let params = {
          redirect: "x2.waimai.index",
          levelid: levelId,
          type: type,
          status: status,
          search: search,
          page: p.page,
          pagesize: p.size,
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            res.data.list.forEach((item) => {
              item.select = false;
              switch (item.wm_store_source) {
                case 'mt':
                  item.sourceName = "美团";
                  break;
                case 'el':
                  item.sourceName = "饿了么";
                  break;
                case 'bd':
                  item.sourceName = "百度";
                  break;
              }
            });
            this.storeData = res.data.list;
            this.p.total = res.data.count;
          }
        })
      },
    },
    created() {
      if (this.getPushStateTree().length === 0) {
        this.showLevel()
      } else {
        this.showResouce(this.p, this.getPushStateLevelId(), this.type, this.status_id);
      }
    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.showResouce(this.p = {page: 1, size: this.p.size, total: 0}, e.levelid, this.type, this.status_id,this.storeName = '');
        this.setPushStateLevelId({levelId: e.levelid});
        recur(this.getPushStateTree(),false,this.getPushStateLevelId(),this)
      });
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(() => {
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    updated() {
      let bodyWidth = document.querySelector('.content div').clientWidth;
      let clientWidth = this.$refs.tree ? this.$refs.tree.clientWidth : 0;
      this.tableWidth = bodyWidth - clientWidth;
    },
    destroyed() {
      Hub.$off("showAdd");
    }
  }
</script>

<style scoped>


</style>
