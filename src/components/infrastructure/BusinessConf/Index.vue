<template>
  <div v-show="getTreeArr['列表']">
    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

    </div>

    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow: auto" :style="{height:tableHeight + 'px'}">

        <public-tree :data='getBusinessConfTree()' :count=0 :type=4 style="width: max-content;"></public-tree>
      </div>

      <div>
        <div class="flex_sb padding_b_10">
          <h3 class=" margin_l_10">
            {{levelName}}
          </h3>
          <div class="flex_a">
            <el-input class="margin_r_10" size="small" v-model="storeName" placeholder="请输入品牌编码/名称搜索"></el-input>
            <el-button size="small" @click="search()">搜索</el-button>
          </div>
        </div>

        <div class="padding_l_10" :style="{width:tableWidth + 'px'}">
          <el-table :data="storeData" border :height="tableHeight -40">
            <el-table-column header-align="center" align="center" label-class-name="mySelect" label="序号" width="100">
              <template slot-scope="scope">
                <div>{{scope.$index + 1 }}</div>
              </template>
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id"
                             label="品牌编码">
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="levelname"
                             label="品牌名称">
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="100">
              <template slot-scope="scope">
                <div v-show="getTreeArr['修改']" @click.prevent="handleSwitch(scope.row.id,scope.row.is_pay_invoice)">
                  <el-switch
                    v-model="scope.row.is_pay_invoice"
                    on-color="#13ce66"
                    off-color="#ff4949">
                  </el-switch>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <footer>
            <!--<xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>-->
          </footer>
        </div>

      </div>


    </div>


  </div>
</template>

<script>
  import {getLevel,recur} from '../../utility/communApi'
  import Hub from '../../utility/commun'
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';
  import publicTree from '../../infrastructure/PublicManagement/publicTree'

  export default {
    components: {
      publicTree
    },
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    data() {
      return {
        name: '',
        tableWidth: 0,
        tableHeight: 0,
        levelId:'',
        navList: [{name: "商户配置", url: ''}],
        storeName: '',
        storeData: [],
        p: {page: 1, size: 20, total: 0},
        levelName:''
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setBusinessConfLevelId','setBusinessConfTree']),
      ...mapGetters(['getBusinessConfLevelId','getBusinessConfTree']),
      handleSwitch(id,is_pay_invoice){
        if(is_pay_invoice === true){
          this.$confirm('确定要关闭该品牌的发票pro 版吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updatePayInvoice(id,0)
          }).catch(() => {

          });
        }else {
          this.$confirm('确定要开启该品牌的发票pro 版吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updatePayInvoice(id,1)
          }).catch(() => {

          });
        }
      },
      updatePayInvoice(id,Int){
        let formData = new FormData();
        formData.append("id", id);
        formData.append("is_pay_invoice", Int);
        this.$http.post(`index.php?controller=level&action=updatePayInvoice&token=${this.$localStorage.get('token')}`,formData).then((res)=>{
          if(res.data.errcode === 0){
            this.showResouce(this.levelId);
          }
        })
      },

      getPage(page) {
        this.p.page = page;
        // this.showResouce(this.p, this.levelId, this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        // this.showResouce(this.p, this.levelId, this.searchName);
      },


      search() {
        // this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.getBusinessConfLevelId(), this.storeName)

      },

      showLevel() {
        getLevel().then((res) => {
          if (res.data.errcode === 0) {
            this.setBusinessConfTree({list:res.data.data});

            if (this.getBusinessConfLevelId() === '') {
              this.setBusinessConfLevelId({levelId: res.data.data[0].id});
            }
            this.levelId = res.data.data[0].id;
            this.name = res.data.data[0].levelname;
            this.showResouce(res.data.data[0].id);
            recur(res.data.data,true,this.getBusinessConfLevelId(),this);
          } else {

          }
        })

      },
      showResouce(id) {
        this.$http.get(`index.php?controller=level&action=brandList&token=${this.$localStorage.get('token')}&id=${id}`).then((res)=>{
          res.data.data.forEach((item)=>{
            (item.is_pay_invoice === 0) ? item.is_pay_invoice = false : item.is_pay_invoice = true
          });
          this.storeData = res.data.data
        })

      },
    },
    created() {
      if(this.getBusinessConfTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.getBusinessConfLevelId());
        recur(this.getBusinessConfTree(),false,this.getBusinessConfLevelId(),this);
      }
    },

    mounted() {
      Hub.$on('showAddPub', (e) => {
        this.storeData = [];

        this.levelId = e.levelid;
        this.showResouce(e.levelid);
        this.setBusinessConfLevelId({levelId: e.levelid});
        recur(this.getBusinessConfTree(),false,this.getBusinessConfLevelId(),this);
      });
      Hub.$emit('mountedOk', 'mountedOk');
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
      Hub.$off("showAddPub");
    }
  }
</script>

<style scoped>


</style>
