<template>
  <div v-show="getTreeArr['外卖菜品列表']">

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree  :data='getStoreDishesManageTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">

        <div class="flex_es margin_b_10">

          <div class="flex_a">
            <h3 class="margin_r_10">
              {{levelName}}
            </h3>
            <el-button size="small" @click="addDishes()" v-show="getTreeArr['新增外卖菜品']" :disabled="showAdd !== 4">批量新增</el-button>
            <el-button size="small" @click="edit()" v-show="getTreeArr['修改外卖菜品']">批量编辑</el-button>
            <el-button size="small" @click="del()" v-show="getTreeArr['删除外卖菜品']">批量删除</el-button>
            <!--<el-button size="small" @click="issued()">批量下发</el-button>-->
            <!--<el-button size="small" @click="erpUp()" :disabled="showAdd !== 4">从收银系统上新增菜品</el-button>-->

          </div>

          <div class="flex_a">
            <div class="margin_r_10">
              <el-input size="small" v-model="dishesName" placeholder="请输入菜品名称"></el-input>
            </div>
            <el-button size="small" @click="search()">搜索</el-button>
          </div>
        </div>

        <el-table :data="tableData" border :height="tableHeight - 40" style="width: 100%;" @select-all="handleSelectionChange" ref="multipleTable">
          <el-table-column
            header-align="center" align="center"
            type="selection"
            label-class-name="mySelect"
            width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sequence"
                           label="排序"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="菜品编码"
                           width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="productname" label="名称"
                           width="120"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center"
                           label="第三方编码" width="180">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.morecodes">
                <span>{{item.code1}} -- {{item.code2}}</span>
              </div>
            </template>


          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="CategoryName" label="所属品类"
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
              <div v-if="scope.row.lunchboxes.length !== 0">
                <div v-for="(item,index) in scope.row.lunchboxes">
                  <span>{{item.lunchboxname}} X{{item.count}} ￥{{item.price}} </span>
                </div>
                 <div style="border-top: 1px solid #BECBD9">餐盒总价：￥{{scope.row.totalBoxPrice}}</div>
              </div>

            </template>
          </el-table-column>
          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="status" label="平台信息"-->
                           <!--width="340">-->

            <!--<template slot-scope="scope">-->
              <!--<div class="flex_r">-->
                <!--<div class="flex_1" v-for="(item,index) in scope.row.plat">-->
                  <!--<div>-->
                    <!--{{item.value}}-->
                  <!--</div>-->
                  <!--<div class="margin_b_10">-->
                    <!--{{item.value1}}-->
                  <!--</div>-->
                  <!--<div v-for="(item1,index) in item.value2">-->
                    <!--{{item1.value}} {{item1.value1}}-->
                  <!--</div>-->

                <!--</div>-->
              <!--</div>-->

            <!--</template>-->

          <!--</el-table-column>-->
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="收银系统菜品" width="160">
            <template slot-scope="scope">


              <div v-if="!scope.row.canEditErp">
                <span class="margin_r_10" >{{scope.row.erpcode}}</span>
                <el-button size="small" type="text" @click="erpcodeEdit(scope.row)">编辑</el-button>
              </div>
              <div v-else>
                <el-input size="small" v-model="scope.row.erpcode" placeholder="请输入编码"></el-input>
                <el-button size="small" type="text" @click="erpcodeSave(scope.row.x0_productid,scope.row.erpcode)">保存</el-button>
              </div>

              <el-button size="small" type="primary" @click="link(scope.row.x0_productid)" v-if="scope.row.erpcode ===null">关联菜品</el-button>



                <el-button size="small" @click="unlink(scope.row.x0_productid)" v-if="scope.row.erpcode !==null && !scope.row.canEditErp">解除关联</el-button>



            </template>
          </el-table-column>

        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>


    </div>
    <!--选择菜品-->
    <xo-dishes ref="dishes" name="名称" select="菜品" :list="erpList" :currentRow="currentRow" :id="id" :levelid="this.getStoreDishesManageLevelId()" @submitErp="submitErp"></xo-dishes>
    <!--新增菜品-->
    <el-dialog
      title="新增菜品"
      :visible.sync="dialogVisible2"
      @close="close2"
      width="400px" >
      <el-checkbox v-model="checkAll" @change="changeAll(checkAll)">全选</el-checkbox>
      <div class="margin_b_10" v-for="(item,index) in baseDishes">
        <div>
          {{index}}
          <div class="padding_l_10" v-for="(item1,index1) in item">
            <el-checkbox v-model="item1.OK" @change="changeOne">{{item1.product_name}}</el-checkbox>
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


  import {recur} from '../../utility/communApi'
  import Hub from '../../utility/commun'
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';
  import getApi from './dishesManageList.service'
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
        totalSelect:0,//点击新增时的门店的选择总数
        checkAll:false,
        dialogVisible2: false,
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "聚合外卖管理", url: ''},{name: "菜品列表", url: ''},{name: "菜品列表", url: ''}],
        levelName:'',
        dishesName: '',
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        showAdd:'',
        baseDishes: {},
        erpList:[],
        id:'',
        currentRow:{check:null}
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setStoreDishesManageTree','setStoreDishesManageLevelId']),
      ...mapGetters(['getStoreDishesManageTree','getStoreDishesManageLevelId']),
      changeOne(){
        let i = 0;
        for(let map in this.baseDishes){
          this.baseDishes[map].forEach((item)=>{
            if(item.OK === true){
              i++
            }
          })
        }
        (i === this.totalSelect)? this.checkAll = true: this.checkAll = false
      },
      changeAll(bool){
        if(bool){
          for(let map in this.baseDishes){
            this.baseDishes[map].forEach((item)=>{
              item.OK = true
            })
          }
        }else {
          for(let map in this.baseDishes){
            this.baseDishes[map].forEach((item)=>{
              item.OK = false
            })
          }
        }
      },
      erpcodeSave(id,erpcode){
        console.log(erpcode)

        if( erpcode !== null && erpcode.length > 10){
          this.$message.warning('不能超过10个字符');
          return
        }
        let params = {
          redirect: "x2a.product.linkerp",
          x0_productid: id,
          erpfoodid:erpcode
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.$message("操作成功");
            this.showResouce(this.p,this.dishesName);
          }
        });
      },
      erpcodeEdit(row){
        row.canEditErp = !row.canEditErp
      },
      erpUp(){
        let params = {
          redirect: "x2a.product.erpcreate",
          levelid: this.getStoreDishesManageLevelId(),
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.$message("新增菜品成功");
            this.showResouce(this.p,this.dishesName);
          }
        });
      },
      submitErp(){
        this.currentRow.check = null;
        this.showResouce(this.p,this.dishesName);
      },
      unlink(id){
        this.$confirm('此操作将解除关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.product.linkerp",
            x0_productid: id,
            erpfoodid:''
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.$message("操作成功");
              this.showResouce(this.p,this.dishesName);
            }
          });
        }).catch(() => {
          //
        });
      },
      link(id){
        let params = {
          redirect: "x2a.product.erpdish",
          levelid:this.getStoreDishesManageLevelId(),

        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.id = id;
            this.erpList = res.data;
            this.$refs.dishes.openDialog();
          }
        });


      },
      add() {
        let list = [];
        for (let map in this.baseDishes) {
          this.baseDishes[map].forEach((item) => {
            if (item.OK) {
              list.push(item.id)
            }
          })
        }
        if (list.length === 0) {
          this.$message('请选择菜品');
        } else {
          let params = {
            redirect: "x2a.product.create",
            levelid:this.getStoreDishesManageLevelId(),
            x0_productids: list.join(',')
          };
          oneTwoApi(params).then((res) => {
            if (res.errcode === 0) {
              this.dialogVisible2 = false;
              this.$message('操作成功');
              this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.dishesName = '');
            }
          });

        }

      },
      addDishes() {
        if (this.getStoreDishesManageLevelId() === "") {
          this.$message('请选择菜品');
        } else {
          this.dialogVisible2 = true;
          this.totalSelect = 0;
          this.checkAll = false;
          getApi.getDishes(this.getStoreDishesManageLevelId()).then((res) => {
            if (res.data.errcode === 0) {
              for (let map in res.data.data) {
                res.data.data[map].forEach((item) => {
                  this.totalSelect++;
                  item.OK = false
                })
              }
              this.baseDishes = res.data.data
            }
          })

        }
      },
      close2() {
        this.baseDishes = {};

      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p,this.dishesName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p,this.dishesName);
      },

      edit() {
        let list = [];
        this.tableData.forEach((item)=>{
          if(item.select === true){
            list.push(item.x0_productid)
          }
        });
        if(list.length === 0){
          this.$message('请勾选菜品');
        }else {
          this.$router.push({path:`/dishesManagement/storeDishesManage/editDishes/${this.getStoreDishesManageLevelId()}/${list.join(',')}`})
        }
      },
      del() {
        let list = [];
        this.tableData.forEach((item)=>{
          if(item.select === true){
            list.push(item.x0_productid)
          }
        });
        if(list.length === 0){
          this.$message('请勾选菜品');
        }else {

          this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {
              redirect: "x2a.product.delete",
              levelid:this.getStoreDishesManageLevelId(),
              x0_productids:list.join(','),
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.showResouce(this.p,this.dishesName);
                this.$message("操作成功");
              }
            })

          }).catch(() => {
            //
          });

        }
      },
      search() {
        this.showResouce(this.p = {page: 1, size: 20, total: 0},this.dishesName);
      },

      issued() {

      },

      handleSelectionChange(val) {
        if(val.length === this.tableData.length){
          this.tableData.forEach((map) => {
            this.$set(map, 'select', true)
          });
        }else {
          this.tableData.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },

      handleChecked(data) {
        let list =  this.tableData.filter((item)=>{
          return item.select === true
        });

        if (list.length === this.tableData.length) {
          list.forEach((item)=>{
            this.$refs.multipleTable.toggleRowSelection(item)
          })
        }else {
          this.$refs.multipleTable.clearSelection();
        }

      },

      showResouce(p,productName = ''){
        let params = {
          redirect: "x2a.product.index",
          levelid:this.getStoreDishesManageLevelId(),
          productname:productName,
          page: p.page,
          pagesize:p.size

        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            res.data.list.forEach((item)=>{
              item.canEditErp = false;
              item.select = false;
              item.totalBoxPrice = 0;
              item.lunchboxes.forEach((item1)=>{
                item.totalBoxPrice += item1.totalprice * 1
              });
              item.totalBoxPrice = item.totalBoxPrice.toFixed(2)
            });
            this.tableData = res.data.list;
            this.p.total = res.data.count;
          }
        })
      },

      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setStoreDishesManageTree({list:res.data.data});
            if (this.getStoreDishesManageLevelId() === '') {
              this.setStoreDishesManageLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p,this.dishesName);
            recur(res.data.data,true,this.getStoreDishesManageLevelId(),this)
          }
        });
      },
    },
    created() {
      if(this.getStoreDishesManageTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.p,this.dishesName);
        recur(this.getStoreDishesManageTree(),false,this.getStoreDishesManageLevelId(),this)
      }
    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setStoreDishesManageLevelId({levelId: e.levelid});
        recur(this.getStoreDishesManageTree(),false,this.getStoreDishesManageLevelId(),this);
        this.showResouce(this.p={page: 1, size: this.p.size, total: 0},this.dishesName = '');
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
