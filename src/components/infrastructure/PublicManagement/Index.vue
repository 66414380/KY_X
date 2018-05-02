<template>
  <div>
    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>

    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">

        <!--<el-tree-->
          <!--:data="dataLeft"-->
          <!--:props="defaultProps"-->
          <!--@node-click="nodeClick"-->
          <!--node-key="id"-->
          <!--default-expand-all-->
          <!--:highlight-current="true"-->
          <!--:expand-on-click-node="false"-->
          <!--:filter-node-method="filterNode"-->
          <!--ref="tree2"-->
        <!--&gt;-->
        <!--</el-tree>-->


        <public-tree :data='getPublicTree()' :count=0 :type=5 style="width: max-content;"></public-tree>
      </div>

      <div class="padding_l_10 width_100" v-show="getTreeArr['列表']">
        <el-table :data="storeData" border>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号" width="70">
            <template slot-scope="scope">
              <div>{{scope.$index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="authorizer_appid" label="APPID">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="nick_name"
                           label="公众号名称">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="updated_at"
                           label="上次授权时间">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="op_manage"
                           label="操作人">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="edit(scope.row)">修改</el-button>

              <el-button size="mini" type="primary" @click="conf(scope.row)">模板消息配置</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="margin_10">
          <el-button type="primary" @click="auth()" :disabled="showAdd !== 4">公众号授权</el-button>
        </div>
        <el-dialog
          title="公众号"
          :visible.sync="dialogVisible"
          width="400px">
          <el-form ref="formRules" :model="form" label-width="100px">
            <el-form-item label="公众号:">
              <el-input v-model="form.code" disabled></el-input>
            </el-form-item>


            <el-form-item label="修改授权:" prop="name">
              <el-button type="primary" @click="auth()">公众号授权</el-button>
            </el-form-item>


            <div class="margin_t_10">
              <!--<el-button type="primary">提交</el-button>-->
              <!--<el-button>重置</el-button>-->
            </div>
          </el-form>
        </el-dialog>
        <footer>
          <!--<xo-pagination></xo-pagination>-->
        </footer>

      </div>
    </div>


  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {getLevel,recur} from '../../utility/communApi'
  import getApi from './publicManagement.service'
  import publicTree from './publicTree'
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components: {
      publicTree,
    },
    data() {
      return {
        showAside: false,
        dialogVisible: false,
        tableHeight: 0,

        navList: [{name: "基础设置", url: ''}, {name: "公众号管理", url: ''}],
        name: '',
        storeName: '',
        storeData: [],
        defaultProps: {
          children: 'child',
          label: 'levelname'
        },
        form: {
          code: '',
        },
        showAdd:'',
      }
    },
    watch: {

    },
    methods: {
      ...mapActions(['setPublicLevelId','setPublicTree']),
      ...mapGetters(['getPublicLevelId','getPublicTree']),
      filterNode(value, data) {

        // if (!value) return true;
         return data.type !== value;
      },

      auth(){
        getApi.threeAuthorize(this.getPublicLevelId()).then((res)=>{
          window.location.href = res.data.data
        })
      },
      nodeClick(data, data1, data2) {

        this.setPublicLevelId({levelId:data.id});
        this.showResouce(data.id)

      },
      edit(row) {
        this.form.code = row.nick_name;
        this.dialogVisible = true
      },
      conf(row){
        this.$router.push({path: `/infrastructure/PublicManagement/TemplateMessageConf/${row.id}`})
      },

      showResouce(id){
        getApi.getGzhInfo(id).then((res)=>{
          if(res.data.errcode === 0){
            this.storeData = res.data.data
          }
        })
      },

      showLevel(){
        getLevel().then((res) => {
          if(res.data.errcode === 0){

            if (this.getPublicLevelId() === '') {
              this.setPublicLevelId({levelId: res.data.data[0].id});
            }

            this.setPublicTree({list:res.data.data});
            recur(res.data.data,true,this.getPublicLevelId(),this);

          }
        });
      }

    },
    created() {
      if(this.getPublicTree().length === 0){
        this.showLevel();
      }else {
        this.showResouce(this.getPublicLevelId());
        recur(this.getPublicTree(),false,this.getPublicLevelId(),this);
      }
    },
    mounted() {
      Hub.$on('showAddPub', (e) => {
        this.levelName = e.levelName;
        //this.type = e.type;
        this.setPublicLevelId({levelId: e.levelid});
        this.showResouce(e.levelid);
        recur(this.getPublicTree(),false,this.getPublicLevelId(),this);
      });
      Hub.$emit('mountedOk','mountedOk');
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    destroyed(){
      Hub.$off("showAddPub");
    },
    updated() {

    },
  }
</script>

<style lang="less" scoped>

  .myStore {
    position: absolute;
    top: 40%;
    right: 0;
    background: white;
    z-index: 100;
    border-radius: 10px;
    border: 1px solid #E5EBF4
  }

  /*不能有相同的class名*/
  .myStore-enter-active, .myStore-leave-active {
    transition: all .5s;
  }

  .myStore-enter, .myStore-leave-to {
    right: -280px;
  }
</style>
