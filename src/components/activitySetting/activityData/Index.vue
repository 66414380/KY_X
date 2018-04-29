<template>
  <div class="scroll_of" v-show="getTreeArr['列表']">
    <div class="bodyTop">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>


    </div>
      <el-table :data="tableData" border :height="tableHeight">
        <el-table-column header-align="center" align="center" prop="user_name" label="序号" width="80">
          <template slot-scope="scope">
            <div>{{scope.$index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="nick_name" label="领取人微信名称" >
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="stores_str" label="领取人头像">
          <template slot-scope="scope">
            <div class="flex margin_10">
              <img style="width: 100px;height: 100px" :src="scope.row.avatar_url"/>
            </div>

          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="add_time" label="领取时间" >
        </el-table-column>
        <el-table-column header-align="center" align="center" label="填空题答案" >
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.anser1">
              <span class="flex_a" style="width: 120px;margin: 0 auto"> {{index + 1 }}. {{item}}</span>
            </div>

          </template>
        </el-table-column>

        <el-table-column header-align="center" align="center" label="选择题答案" >
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.anser2">
              <span class="flex_a" style="width: 120px;margin: 0 auto"> {{index + 1 }}. {{item}}</span>
            </div>

          </template>
        </el-table-column>
      </el-table>

    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import { mapActions,mapGetters } from 'vuex';
  import Hub from '../../utility/commun'
  import {oneTwoApi} from '@/api/api.js';
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components:{
    },
    data() {
      return {
        width:0,
        tableHeight:0,
        navList:[{name:"活动参与数据",url:''}],
        tableData: [],
        p: {page: 1, size: 20, total: 0},

      }
    },

    methods: {

      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p)
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p)
      },


      showResouce(p){
        let formData = new FormData();
        formData.append("page", p.page);
        formData.append("pagesize", p.size);
        this.$http.post(`index.php?controller=activity&action=activityReceive&token=${this.$localStorage.get('token')}`,formData).then((res)=>{
          if(res.data.errcode === 0){
            res.data.data.list.forEach((item)=>{
              item.anser2.forEach((item1,i)=>{
                if(typeof item1 === "object"){
                  item.anser2.splice(i,1,item1.join(','))
                }
              })
            });


            this.tableData = res.data.data.list;
            this.p.total = res.data.data.count;
          }
        })

      },

    },
    created(){
      this.showResouce(this.p)
    },
    updated(){

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
<style scoped>

  .bodyTop{
    padding-bottom: 10px;
  }
</style>
