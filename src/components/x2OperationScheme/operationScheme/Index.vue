<template>
  <div >

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree  :data='getOperationSchemeTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">

        <div class="flex_es margin_b_10">

          <div class="flex_a">
            <h3 class="margin_r_10">{{levelName}}</h3>
            <el-select size="small" clearable filterable v-model="storeData_id" placeholder="请选择" @change="handleStore" @visible-change="canSelect">
              <el-option
                v-for="item in storeData"
                :key="item.base_store_id"
                :label="item.storename"
                :value="item.base_store_id">
              </el-option>
            </el-select>
            <div v-if="!canEdit" class="margin_l_10">
              <el-button size="small" @click="edit()" >进入编辑状态</el-button>
              <el-button size="small" @click="del()" >同步至其他门店及外卖平台</el-button>
            </div>
            <div v-if="canEdit" class="margin_l_10">
              <el-button size="small" @click="save()" >保存并退出编辑状态</el-button>
            </div>

          </div>

          <div class="flex_a">
            <div class="margin_r_10">
              <el-input size="small" v-model="dishname" placeholder="请输入菜品名称"></el-input>
            </div>
            <el-button size="small" @click="search()">搜索</el-button>
          </div>
        </div>
        <el-form ref="formRules" :model="form">
        <el-table :data="form.tableData" border :height="tableHeight - 40" style="width: 100%;" @select-all="handleSelectionChange" ref="multipleTable" @cell-dblclick="test">
          <el-table-column
            header-align="center" align="center"
            type="selection"
            label-class-name="mySelect"
            width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sequence" label="排序">
            <template slot-scope="scope">
            <div class="flex" v-if="!canEdit">

              {{scope.row.sequence}}
            </div>

            <el-form-item v-if="canEdit" label="" :prop="'tableData.' + scope.$index + '.sequence'" :rules="{required: true, validator: (rule, value, callback) => {
                return checkNumber_1(rule, value, callback,'请输入排序','排序格式错误')
                }, trigger: 'blur'}">
              <el-input v-model="scope.row.sequence" ></el-input>
            </el-form-item>

            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="菜品编码"
                           width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="dishname" label="名称"
                           width="120"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center"
                           label="第三方编码" width="180">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.morecodes">
                <span>{{item.code1}} -- {{item.code2}}</span>
              </div>
            </template>


          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="categoryname" label="所属品类"
                           width="120"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="price" label="参考价格"
                           width="120"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="status" label="菜品图片"
                           width="140">
            <template slot-scope="scope">
              <div style="margin-top: 7px" v-if="scope.row.image">
                  <el-popover
                    placement="top"
                    width="200"
                    trigger="hover"
                  >
                    <img  :src="scope.row.image" alt=""  style="width: 200px;height: 200px">
                    <img slot="reference" :src="scope.row.image" alt=""  style="width: 100px;height: 100px">
                  </el-popover>
              </div>
              <div class="noImg" v-else>
              </div>
            </template>


          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="description" label="菜品详情"
                           width="120"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center"  label="菜品规格"
                           width="180">

            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.skus">
                <span>{{item.skuname}}   ￥{{item.price}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品属性"
                           width="240">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.property">

                <div class="flex">
                  <div class="margin_r_10">{{item.attr}}</div>
                  <div v-for="(item,index) in item.list">
                    <span class="margin_r_10"> {{item.value}}</span>
                  </div>
                </div>

              </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="餐盒" width="240">
            <template slot-scope="scope">
              <div v-if="scope.row.lunchboxes !== null">
                <div v-for="(item,index) in scope.row.lunchboxes">
                  <span>{{item.lunchboxname}} X{{item.count}} ￥{{item.price}} </span>
                </div>
                 <div style="border-top: 1px solid #BECBD9">餐盒总价：￥{{scope.row.totalBoxPrice}}</div>
              </div>

            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="status" label="平台信息"
                           width="340">

            <template slot-scope="scope">
              <div class="flex_r">
                <div class="flex_1" v-for="(item,index) in scope.row.plat">
                  <div>
                    {{item.value}}
                  </div>
                  <div class="margin_b_10">
                    {{item.value1}}
                  </div>
                  <div v-for="(item1,index) in item.value2">
                    {{item1.value}} {{item1.value1}}
                  </div>

                </div>
              </div>

            </template>

          </el-table-column>

          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" label="上下架操作" width="120">-->
            <!--<template slot-scope="scope">-->

              <!--<div  @click.prevent="handleSwitch(scope.row.id,scope.row.is_pay_invoice)">-->
                <!--<el-switch-->
                  <!--v-model="scope.row.is_pay_invoice"-->
                  <!--on-color="#13ce66"-->
                  <!--off-color="#ff4949">-->
                <!--</el-switch>-->
              <!--</div>-->
            <!--</template>-->
          <!--</el-table-column>-->

          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" label="更新记录" width="240">-->
            <!--<template slot-scope="scope">-->
                <!--<div class="flex_f">-->
                  <!--<span>黄秀 2017-12-06-11:11</span>-->
                  <!--<el-button type="text" @click="dialogVisible2 = true">查看历史</el-button>-->
                <!--</div>-->
            <!--</template>-->
          <!--</el-table-column>-->


        </el-table>
        </el-form>
        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>


    </div>
    <el-dialog title="" :visible.sync="dialogVisible2">
      a
    </el-dialog>

  </div>
</template>

<script>


  import {recur} from '../../utility/communApi'
  import Hub from '../../utility/commun'
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';

  import getApi1 from '../../infrastructure/DishesLibrary/dishesLibrary.service'
  export default {
    components: {

    },
    computed:{
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    data() {
      return {
        canEdit:false,
        dialogVisible2: false,
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "运营方案", url: ''}],
        levelName:'',
        form:{tableData: []},
        p: {page: 1, size: 20, total: 0},
        showAdd:'',
        baseDishes: {},
        storeData:[],
        storeData_id:'',
        dishname:'',
        selectOne:false,
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setOperationSchemeTree','setOperationSchemeLevelId']),
      ...mapGetters(['getOperationSchemeTree','getOperationSchemeLevelId']),
      test(row, column, cell, event){
        console.log(row)
        console.log(column)

        console.log(cell)

        console.log(event)

      },
      checkNumber_1(rule, value, callback,str1,str2){
        let re = /^[1-9]\d*$/;
        if (value === '') {
          callback(new Error(str1));
        }else {
          if(re.test(value)){
            callback()
          }else {
            callback(new Error(str2));
          }
        }
      },
      handleSwitch(id,is_pay_invoice){
        if(is_pay_invoice === true){
          this.$confirm('是否保存？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updatePayInvoice(id,0)
          }).catch(() => {

          });
        }else {
          // this.$confirm('是否保存？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   this.updatePayInvoice(id,1)
          // }).catch(() => {
          //
          // });
        }
      },


      close2() {
        this.baseDishes = {};

      },
      getPage(page) {
        this.p.page = page;
        this.getSchemeData(this.p);
      },
      getPageSize(size) {
        this.p.size = size;
        this.getSchemeData(this.p);
      },
      save(){
        this.canEdit = false
      },
      edit() {
        this.canEdit = true

      },
      del() {

      },
      search() {
        this.getSchemeData(this.p = {page: 1, size: 20, total: 0})
      },
      handleStore() {
        if(this.selectOne === true) {
          this.getSchemeData(this.p = {page: 1, size: this.p.size, total: 0})
        }
      },
      getSchemeData(p) {
        //获取运营方案列表
        let params = {
          redirect: "x2a.dish.index",
          base_store_id:this.storeData_id,
          dishname: this.dishname,
          page: p.page,
          pagesize: p.size

        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.form.tableData = res.data.list;
            this.p.total = res.data.count;

          }
        })

      },

      showResouce(){
        //获取门店列表
        let params = {
          redirect: "x2.store.index",
          levelId: this.getOperationSchemeLevelId(),
          storeName: '',
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            if (res.data.list.length !== 0) {
              this.storeData_id = res.data.list[0].base_store_id;
            }
            this.storeData = res.data.list;

             this.getSchemeData(this.p = {page: 1, size: this.p.size, total: 0})
          }
        })


      },
      handleSelectionChange(val) {
        if(val.length === this.form.tableData.length){
          this.form.tableData.forEach((map) => {
            this.$set(map, 'select', true)
          });
        }else {
          this.form.tableData.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },

      handleChecked() {
        let list =  this.form.tableData.filter((item)=>{
          return item.select === true
        });

        if (list.length === this.form.tableData.length) {
          list.forEach((item)=>{
            this.$refs.multipleTable.toggleRowSelection(item)
          })
        }else {
          this.$refs.multipleTable.clearSelection();
        }

      },
      canSelect(e){
        (e === true)? this.selectOne = true: this.selectOne = false
      },
      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setOperationSchemeTree({list:res.data.data});
            if (this.getOperationSchemeLevelId() === '') {
              this.setOperationSchemeLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce();
            recur(res.data.data,true,this.getOperationSchemeLevelId(),this)
          }
        });
      },
    },
    created() {
      if(this.getOperationSchemeTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce();
        recur(this.getOperationSchemeTree(),false,this.getOperationSchemeLevelId(),this)
      }
    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setOperationSchemeLevelId({levelId: e.levelid});
        recur(this.getOperationSchemeTree(),false,this.getOperationSchemeLevelId(),this);
        this.storeData_id = "";
        this.showResouce();
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
      this.tableWidth = bodyWidth - this.$refs.tree.clientWidth;



    },
    destroyed(){
      Hub.$off("showAdd");
    }
  }
</script>

<style scoped>
.noImg{
  margin: 7px 0;width: 100px;height: 100px;border: 1px dashed #d9d9d9;
}

</style>
