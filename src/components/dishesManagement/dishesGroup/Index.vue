<template>
  <div v-show="getTreeArr['菜品组']">

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree  :data='getDishesGroupTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">
        <div class="flex_es margin_b_10">
          <h3>
            {{levelName}}

          </h3>

          <div class="flex_a">
            <div class="margin_r_10">
              <el-input size="small" v-model="pgroupname" placeholder="请输入菜品组名称"></el-input>
            </div>
            <el-button size="small" @click="search()">搜索</el-button>
            <el-button size="small" @click="addCategory()" v-show="getTreeArr['新增菜品组']" :disabled="showAdd !== 4">+新增菜品组</el-button>

          </div>
        </div>

        <el-table :data="tableData" border :height="tableHeight" style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                           width="100">
            <template slot-scope="scope">
              {{scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="编码" width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="pgroupname" label="菜品组">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="remark" label="备注">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button size="small" @click="down(scope.row.id)">下发</el-button>
              <el-button size="small" @click="edit('查看',scope.row.id)">查看</el-button>
              <el-button size="small" @click="edit('编辑',scope.row.id)" v-show="getTreeArr['修改菜品组']">编辑</el-button>
              <el-button size="small" type="danger" @click="del(scope.row.id)" v-show="getTreeArr['删除菜品组']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>


        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>


    </div>

    <!--下发-->
    <el-dialog
      title="下发"
      :visible.sync="dialogVisible"
      @close="close"
      width="560px">

      <el-form ref="formRules" :model="formDown" label-width="140px">

        <el-form-item label="下发至多门店:">
          <el-table :data="formDown.storeSelected" border style="width: 100%;">
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" label="门店标签名称">
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="门店标签编码">
            </el-table-column>
          </el-table>

        </el-form-item>

        <el-form-item label="">
          <el-button @click='openDialogStore()'>选择门店标签</el-button>
        </el-form-item>
        <el-form-item class="lable1" label="下发类型:">

          <el-radio class="radio margin_b_10" :label="1" v-model="formDown.radio1">覆盖式下发</el-radio>
          <el-radio class="radio margin_b_10" :label="2" v-model="formDown.radio1">更新式下发</el-radio>
          <el-radio class="radio margin_b_10" :label="3" v-model="formDown.radio1">删除式下发</el-radio>

        </el-form-item>


      <div class="margin_b_10">
        <el-table :data="downList" border style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" width="120" prop="type"
                           label="下发类型">

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="desc"
                           label="下发说明">

          </el-table-column>
        </el-table>
      </div>
        <el-form-item class="lable2" label="时间:">
          <el-radio class="radio margin_b_10" :label="0" v-model="formDown.radio2">立即生效</el-radio>
          <el-radio class="radio margin_b_10" :label="1" v-model="formDown.radio2">定时下发</el-radio>
          <div v-if="formDown.radio2 === 1">
            <el-date-picker
              v-model="formDown.time"
              type="datetime"
              :picker-options="pickerOptions0"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>

        </el-form-item>

      </el-form>

      <div class="margin_t_10">
        <el-button type="primary" @click="changeStoresStatus()">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>


    <!--选择门店-->
    <el-dialog title="选择门店" :visible.sync="dialogFormVisible1" @open="open" width="560px">
      <div class="flex_sb">
        <span>提示：点击门店标签名称可查看该门店标签里的门店及外卖平台</span>
        <div class="flex_a">
          <el-input size="small" placeholder="请输入门店标签名称" class="margin_r_10" v-model="storeName"></el-input>
          <el-button size="small" @click="searchStore()">搜索</el-button>
        </div>
      </div>
      <div class="margin_t_10">
        <el-table :data="storeData" border style="width: 100%;" @select-all="handleSelectionChange" ref="multipleTable" height="400">

          <el-table-column
            header-align="center" align="center"
            type="selection"
            label-class-name="mySelect"
            width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>


          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" label="门店标签名称">

            <template slot-scope="scope">
              <div @click="showStore(scope.row.id)" class="pointer">
                {{scope.row.sgroupname}}
              </div>
            </template>

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="门店标签编码">
          </el-table-column>
        </el-table>
      </div>
      <div class="margin_t_10">
        <el-button type="primary" @click="submit()">确认</el-button>
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
      </div>
    </el-dialog>

    <!--编辑/查看-->
    <el-dialog :title="showName" :visible.sync="dialogFormVisible2" width="560px">
      <el-form ref="formRules" :model="formEdit" label-width="100px">

        <el-form-item label="菜品组名称	:" prop="pgroupname" :rules="{required: true, message: '请输入菜品组名称', trigger: 'blur'}">
          <el-input v-model="formEdit.pgroupname" placeholder="请输入名称" :disabled="show"></el-input>
        </el-form-item>
        <el-form-item label="菜品组备注	:">
          <el-input v-model="formEdit.remark" placeholder="请输入备注" :disabled="show"></el-input>
        </el-form-item>
        <div v-for="(domain, index) in formEdit.morecodes" class="flex_r">
          <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.code1" placeholder="请输入第三方名称" :disabled="show"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="m-rank">
            <div class="m-rank-child"></div>
          </div>
          <el-form-item label-width="0" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.code2" placeholder="请输入第三方编码" :disabled="show"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="flex_sc">
            <div class="m-storeCode margin_l_10" @click="addDomain">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(formEdit.morecodes.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(index)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <el-form-item label="包含菜品:" v-if="!show">
          <el-button @click='openDialogDishes()'>+添加菜品</el-button>
        </el-form-item>

        <div class="margin_b_10">
          <el-table :data="dishesList" border style="width: 100%;">
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="productname" label="菜品名称" >
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="菜品编码" >
            </el-table-column>
            <!--<el-table-column label-class-name="table_head" header-align="center" align="center" label="操作">-->
              <!--<template slot-scope="scope">-->
                <!--<el-button size="small" type="danger" @click="del()">删除</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </div>

      </el-form>

      <div class="margin_t_10">
        <el-button type="primary" v-if="!show" @click="submitFrom('formRules')">保存</el-button>
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
      </div>
    </el-dialog>

    <!--菜品-->
    <el-dialog title="编辑菜品" :visible.sync="dialogFormVisible3" width="560px">

      <div class="flex_sb">
        <div class=" flex_a">
          <el-checkbox v-model="selectedAll" @change="handleCheckAll1">全选</el-checkbox>

        </div>
        <div class=" flex_a margin_l_10">
          <div class="margin_r_10" >
            <el-input placeholder="菜品名称" v-model="dishesName"></el-input>
          </div>
          <el-button type="primary" @click="searchDishes()">搜索</el-button>
        </div>
      </div>

      <div class="margin_t_10">
        <el-table :data="dishesData" border style="width: 100%;" height="400">
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="菜品编码">
            <template slot-scope="scope">
              <div>
                <el-checkbox v-model="scope.row.select" @change="handleChecked1">{{scope.row.x0_productid}}</el-checkbox>
              </div>
            </template>

          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="productname" label="名称">
          </el-table-column>

        </el-table>
      </div>
      <div class="margin_b_10 margin_t_10">
        <!--<xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>-->
      </div>
      <div class="margin_t_10">
        <el-button type="primary" @click="addDishes()">确认</el-button>
        <el-button @click="dialogFormVisible3 = false">取消</el-button>
      </div>

    </el-dialog>


    <el-dialog title="查看门店" :visible.sync="dialogFormVisible" @close="close1">
      <el-table :data="storeDataShow" border>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storename" label="门店">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="mt" label="美团">
          <template slot-scope="scope">
            <div v-if="scope.row.mt === 1">√</div>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="el" label="饿了么">
          <template slot-scope="scope">
            <div v-if="scope.row.el === 1">√</div>
          </template>
        </el-table-column>

      </el-table>

    </el-dialog>
  </div>
</template>

<script>

  import {recur} from '../../utility/communApi'
  import Hub from '../../utility/commun'
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import getApi1 from '../../infrastructure/DishesLibrary/dishesLibrary.service'
  import {oneTwoApi} from '@/api/api.js';

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
        pickerOptions0: {

          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() +  3600 * 24 * 1000 * 7;
          }
        },
        showAdd:'',
        levelName:'',
        dialogVisible: false,
        dialogFormVisible:false,
        dialogFormVisible1:false,
        dialogFormVisible2:false,
        dialogFormVisible3:false,
        dishesName:'',
        dataLeft: [],
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "聚合外卖管理", url: ''},{name: "菜品列表", url: ''}, {name: "菜品组", url: ''}],
        pgroupname:'',
        formDown: {
          radio1: '',
          radio2: '',
          time:'',
          storeSelected:[],
        },
        storeData:[],

        downList: [
          {type: "覆盖式下发", desc: "指把已选的菜品，覆盖下发至选中的门店并把门店原有的菜品全部删除。"},
          {type: "更新式下发", desc: "指把已选的菜品，更新下发至选中的门店，如选中的门店中菜品列表有已选菜品中，则更新该道菜，如选中的门店中菜品列表没有已选的菜品，则添加该菜。"},
          {type: "删除式下发", desc: "指把已选的菜品，从选中的门店中删除。"},
        ],
        storeName: '',
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        formEdit:{
          pgroupname: '',
          remark: '',
          morecodes: [{code1: '', code2: ''}],
        },
        dishesList:[],
        dishesData:[],
        dishesId:'',
        storeDataShow: [],
        selectedAll:false,
        showName:'',
        show:true,

      }
    },
    watch: {},
    methods: {
      ...mapActions(['setDishesGroupTree','setDishesGroupLevelId']),
      ...mapGetters(['getDishesGroupTree','getDishesGroupLevelId']),
      close1(){
        this.storeDataShow = []
      },
      showStore(id){
        this.dialogFormVisible = true;
        let params = {
          redirect: "x2a.sgroup.view",
          levelid: this.getDishesGroupLevelId(),
          id: id,
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.storeDataShow = res.data[0].stores
          }
        })
      },
      submit(){
       let list =  this.storeData.filter((item) =>{
          return item.select === true
        })

        if(list.length === 0){
          this.$message.warning("最少选择一个门店标签");
        }else {
         this.formDown.storeSelected = list;
          this.dialogFormVisible1 = false
        }
      },
      addDishes(){
        let list = [];
        list = this.dishesData.filter((item)=>{
          return item.select
        });

        if(list.length === 0){
          this.$message.warning("最少选择一个菜品");
        } else {
          this.dishesList = list;
          this.dialogFormVisible3 = false
        }

      },
      submitFrom(formRules) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            let list = [];
            this.dishesList.forEach((item)=>{
              list.push(item.x0_productid)
            });

            if(list.length === 0){
              this.$message("最少选择一个菜品");
            }else {
              let params = {
                redirect: "x2a.pgroup.update",
                id:this.formEdit.id,
                pgroupname:this.formEdit.pgroupname,
                morecodes: window.JSON.stringify(this.formEdit.morecodes),
                remark:this.formEdit.remark,
                productids:list.join(',')
              };
              oneTwoApi(params).then((res) => {
                if(res.errcode === 0){
                  this.$message("操作成功");
                  this.dialogFormVisible2 = false;
                  this.showResouce(this.p,this.pgroupname);
                }
              })
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      open(){

      },
      searchDishes(){
        let params = {
          redirect: "x2a.product.index",
          levelid:this.getDishesGroupLevelId(),
          productname:this.dishesName,
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.dialogFormVisible = true;
            this.selectedAll = false;
            res.data.list.forEach((item)=>{
              this.$set(item,'select',false)
            });
            this.dishesData = res.data.list;

          }
        })
      },
      search(){
        this.showResouce(this.p = {page: 1, size: 20, total: 0},this.pgroupname);
      },
      handleCheckAll1(bool){
        if (bool === true) {
          this.dishesData.forEach((data) => {
            data.select = true
          })
        } else {
          this.dishesData.forEach((data) => {
            data.select = false
          })
        }
      },
      handleChecked1(){
        let list =  this.dishesData.filter((item)=>{
          return item.select === true
        });
        (list.length === this.dishesData.length)? this.selectedAll = true:this.selectedAll = false;
      },


      getSgroup(sgroupname = ''){
        let params = {
          redirect: "x2a.sgroup.index",
          levelid:this.getDishesGroupLevelId(),
          sgroupname:sgroupname,
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            res.data.list.forEach((item)=>{
              item.select = false
            });
            this.storeData = res.data.list
          }
        })
      },
      searchStore(){

        this.getSgroup(this.storeName)


      },
      openDialogStore(){
        this.dialogFormVisible1 = true;
        this.getSgroup()
      },
      openDialogDishes(){
        this.selectedAll = false;
        let params = {
          redirect: "x2a.product.index",
          levelid:this.getDishesGroupLevelId(),
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.dialogFormVisible3 = true;
            res.data.list.forEach((item)=>{
              this.$set(item,'select',false)
            });
            this.dishesData = res.data.list;
          }
        })
      },
      changeStoresStatus(){
        if(this.formDown.storeSelected.length === 0){
          this.$message.warning("最少选择一个门店标签");
          return
        }

        let list = [];
        this.formDown.storeSelected.forEach((item)=>{
          list.push(item.id)
        })
        if(this.formDown.radio1 === ''){
          this.$message.warning("请选择下发类型");
          return
        }
        if(this.formDown.radio2 === ''){
          this.$message.warning("请选择生效时间");
          return
        }
        if(this.formDown.radio2 === 1 && this.formDown.time === ''){
          this.$message.warning("请选择时间");
          return
        }
        // console.log(this.formDown.time * 1)
        // console.log(Date.now())
        // if(this.formDown.time * 1 < Date.now()){
        //   this.$message.warning("请选择正确时间");
        //   return
        // }

        //菜品组下发
        let params = {
          redirect: "x2a.pgroup.publish",
          pgroupid:this.dishesId,
          sgroupid:list.join(','),
          plantype:this.formDown.radio1,
          timetype:this.formDown.radio2 === 0?0: new Date(this.formDown.time * 1).format("yyyy-MM-dd hh:mm:ss")
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.$message("操作成功");
            this.dialogVisible = false;

          }
        })

      },
      close(){
        this.dishesId = '';
        this.formDown= {
          radio1: '',
            radio2: '',
            time:'',
          storeSelected:[]
        }
      },
      down(id) {
        this.dialogVisible = true;
        this.dishesId = id

      },
      addCategory() {
        this.$router.push({path:`/dishesManagement/dishesGroup/addDishesGroup/${this.getDishesGroupLevelId()}`})
      },

      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p,this.pgroupname);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p,this.pgroupname);
      },

      edit(name,id) {
        this.showName = name;
        (name === "编辑") ? this.show = false : this.show = true;

        let params = {
          redirect: "x2a.pgroup.view",
          id:id,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.formEdit = res.data[0];
            if(res.data[0].morecodes === null){
              res.data[0].morecodes = [{code1: '', code2: ''}]
            }
            this.dishesList = res.data[0].products;
            this.dialogFormVisible2 = true;
          }
        })


      },
      del(id) {
        this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.pgroup.delete",
            id:id,
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.$message("操作成功");
              this.showResouce(this.p,this.pgroupname);
            }
          })

        }).catch(() => {
          //
        });
      },

      removeDomain(index) {
        this.formEdit.morecodes.splice(index, 1)
      },
      addDomain() {
        this.formEdit.morecodes.push( {code1: '', code2: ''});
      },

      handleChecked() {
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
      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setDishesGroupTree({list:res.data.data});
            if (this.getDishesGroupLevelId() === '') {
              this.setDishesGroupLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p,this.pgroupname);
            recur(res.data.data,true,this.getDishesGroupLevelId(),this)
          }
        });
      },
      showResouce(p,pgroupname = ''){
        let params = {
          redirect: "x2a.pgroup.index",
          levelid:this.getDishesGroupLevelId(),
          pgroupname:pgroupname,
          page: p.page,
          pagesize:p.size,
          // noPage:''
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.tableData = res.data.list;
            this.p.total = res.data.count;
          }
        })
      },
    },
    created() {
      if(this.getDishesGroupTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.p,this.pgroupname);
        recur(this.getDishesGroupTree(),false,this.getDishesGroupLevelId(),this)
      }

    },
    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setDishesGroupLevelId({levelId: e.levelid});
        recur(this.getDishesGroupTree(),false,this.getDishesGroupLevelId(),this);
        this.showResouce(this.p={page: 1, size: this.p.size, total: 0},this.pgroupname = '');
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
    destroyed() {
      Hub.$off("showAdd");

    },

  }
</script>

<style scoped lang="less">



</style>
