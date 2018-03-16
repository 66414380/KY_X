<template>
  <div>

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
              <el-input size="small" v-model="dishesName" placeholder="请输入菜品组名称"></el-input>
            </div>
            <el-button size="small" @click="search()">搜索</el-button>
            <el-button size="small" @click="addCategory()">+新增菜品组</el-button>

          </div>
        </div>

        <el-table :data="tableData" border :height="tableHeight" style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                           width="100">
            <template slot-scope="scope">
              {{scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="dishesCode"
                           label="编码" width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="dishesGroup"
                           label="菜品组">

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="bank" label="所属品牌">

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="remarks" label="备注">

          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button size="small" @click="down()">下发</el-button>
              <el-button size="small" @click="edit('查看')">查看</el-button>
              <el-button size="small" @click="edit('编辑')">编辑</el-button>
              <el-button size="small" type="danger" @click="del()">删除</el-button>

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
      width="50%">

      <el-form ref="formRules" :model="formDown" label-width="140px">

        <el-form-item label="下发至多门店:">
          <el-button @click='openDialogStore()'>选择门店</el-button>
        </el-form-item>


        <el-form-item class="lable1" label="下发类型:">

          <el-radio class="radio margin_b_10" :label="1" v-model="formDown.radio1">覆盖式下发</el-radio>
          <el-radio class="radio margin_b_10" :label="2" v-model="formDown.radio1">更新式下发</el-radio>
          <el-radio class="radio margin_b_10" :label="3" v-model="formDown.radio1">删除式下发</el-radio>

        </el-form-item>


      <div class="margin_b_10">
        <el-table :data="dishesList" border style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" width="120" prop="type"
                           label="下发类型">

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="desc"
                           label="下发说明">

          </el-table-column>
        </el-table>
      </div>
        <el-form-item class="lable2" label="时间:">
          <el-radio class="radio margin_b_10" :label="1" v-model="formDown.radio2">立即生效</el-radio>
          <el-radio class="radio margin_b_10" :label="2" v-model="formDown.radio2">定时下发</el-radio>
          <div v-if="formDown.radio2 === 2">
            <el-date-picker
              v-model="formDown.time"
              type="datetime"
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
    <el-dialog title="选择门店" :visible.sync="dialogFormVisible1" @open="open">
      <div class="flex_ce">
        <div class="flex_a">
          <el-input size="small" placeholder="门店标签名称" class="margin_r_10"></el-input>
          <el-button size="small" @click="searchStore()">搜索</el-button>
        </div>
      </div>
      <div class="margin_t_10">
        <el-table :data="storeData1" border style="width: 100%;" @select-all="handleSelectionChange" ref="multipleTable">

          <el-table-column
            header-align="center" align="center"
            type="selection"
            label-class-name="mySelect"
            width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>


          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="门店标签名称">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code" label="门店标签编码">
          </el-table-column>
        </el-table>
      </div>
      <div class="margin_t_10">
        <el-button type="primary">确认</el-button>
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
      </div>
    </el-dialog>

    <!--编辑/查看-->
    <el-dialog :title="showName" :visible.sync="dialogFormVisible2">
      <el-form ref="formRules" :model="formEdit" label-width="100px">

        <el-form-item label="菜品组名称	:" prop="name" :rules="{required: true, message: '请输入菜品组名称', trigger: 'blur'}">
          <el-input v-model="formEdit.name" placeholder="请输入内容" :disabled="show"></el-input>
        </el-form-item>

        <!--<el-form-item label="所属品牌:" prop="bank" :rules="{type:'number',required: true, message: '请选择品牌', trigger: 'change'}">-->

          <!--<el-select v-model="form.bank" placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in options"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->

        <!--</el-form-item>-->

        <el-form-item label="菜品组备注	:">
          <el-input v-model="formEdit.remarks" placeholder="请输入内容" :disabled="show"></el-input>
        </el-form-item>

        <div v-for="(domain, index) in formEdit.thirdPartyCoding" class="flex_r">
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
            <div v-if="(formEdit.thirdPartyCoding.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(index)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <el-form-item label="包含菜品:" v-if="!show">
          <el-button @click='openDialogDishes()'>+添加菜品</el-button>
        </el-form-item>

        <div class="margin_b_10">
          <el-table :data="dishesList1" border style="width: 100%;">
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="菜品名称" >
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code" label="菜品编码" >
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
        <el-button type="primary" v-if="!show">保存</el-button>
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
      </div>
    </el-dialog>

    <!--菜品-->
    <el-dialog title="编辑菜品" :visible.sync="dialogFormVisible3">

      <div class="flex_sb">
        <div class=" flex_a">
          <el-checkbox v-model="selectedAll" @change="handleCheckAll1">全选</el-checkbox>
          <el-select v-model="bank" placeholder="请选择" class="margin_l_10">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select v-model="bank" placeholder="请选择" class="margin_l_10">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class=" flex_a margin_l_10">
          <div class="margin_r_10" >
            <el-input placeholder="菜品名称"></el-input>
          </div>
          <el-button type="primary" @click="">搜索</el-button>
        </div>
      </div>

      <div class="margin_t_10">
        <el-table :data="dishesData" border style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="code" label="菜品编码">
            <template slot-scope="scope">
              <div>
                <el-checkbox v-model="scope.row.select" @change="handleChecked1">{{scope.row.code}}</el-checkbox>
              </div>
            </template>

          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="名称">
          </el-table-column>

        </el-table>
      </div>
      <div class="margin_b_10 margin_t_10">
        <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
      </div>
      <div class="margin_t_10">
        <el-button type="primary">确认</el-button>
        <el-button @click="dialogFormVisible3 = false">取消</el-button>

      </div>

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
        levelName:'',
        dialogVisible: false,
        dialogFormVisible1:false,
        dialogFormVisible2:false,
        dialogFormVisible3:false,
        dishesName: '',
        dataLeft: [],
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "菜品管理", url: ''}, {name: "菜品组", url: ''}],
        value: '',

        selectedList: [],//选择了的数组
        formDown: {
          radio1: false,
          radio2: false,
          time:''
        },
        storeData1:[{select:false,id:1,name:'1',code:'222'},{select:false,id:2,name:'111',code:'222222'},],
        dishesList1:[
          {name:'1',code:'222'},{name:'122',code:'222'}
        ],
        dishesList: [
          {type: "覆盖式下发", desc: "指把已选的菜品，覆盖下发至选中的门店并把门店原有的菜品全部删除。"},
          {type: "更新式下发", desc: "指把已选的菜品，更新下发至选中的门店，如选中的门店中菜品列表有已选菜品中，则更新该道菜，如选中的门店中菜品列表没有已选的菜品，则添加该菜。"},
          {type: "删除式下发", desc: "指把已选的菜品，从选中的门店中删除。"},
        ],
        storeName: '',
        tableData: [{
          dishesCode: '837893',
          dishesGroup: '大',
          bank: '999',
          remarks: 1,
        }, {
          dishesCode: '837894',
          dishesGroup: '中',
          remarks: 122,

        }],
        p: {page: 1, size: 20, total: 0},
        formEdit:{
          name: '123',
          remarks: '45',
          bank:'',
          thirdPartyCoding: [
            {code1: '11', code2: '22'}
          ],
        },
        dishesData:[{
          code: '33',
          name:"11",

        }, {
          code: '11',
          name:"22",

        }],
        bank:'',
        options: [{
          id: 1,
          name: '黄金糕'
        }, {
          id: 2,
          name: '双皮奶'
        }],
        selectedAll:false,
        showName:'',
        show:true,

      }
    },
    watch: {},
    methods: {
      ...mapActions(['setDishesGroupTree','setDishesGroupLevelId']),
      ...mapGetters(['getDishesGroupTree','getDishesGroupLevelId']),
      open(){

      },
      handleCheckAll1(bool){
        if (bool.target.checked === true) {
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
        let count =0;
        this.dishesData.forEach((data) => {
          if (data.select === true) {
            count += data.select*1
          }
        });

        if(count === this.dishesData.length){
          this.selectedAll = true;

        }else {
          this.selectedAll = false;
        }

      },
      searchStore(){

      },
      openDialogStore(){
        this.dialogFormVisible1 = true
      },
      openDialogDishes(){
        this.selectedAll = false;
        this.dialogFormVisible3 = true;
        this.dishesData.forEach((data)=>{
          this.$set(data,'select',false)
        })
      },
      changeStoresStatus(){

      },
      close(){
        this.formDown= {
          radio1: false,
            radio2: false,
            time:''
        }
      },
      down() {
        this.dialogVisible = true
      },
      addCategory() {
        this.$router.push('/dishesManagement/dishesGroup/addDishesGroup')
      },
      handle() {
        console.log(this)

      },

      getPage(page) {
        this.p.page = page;
        //this.showResouce(this.p, this.levelId,this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        //this.showResouce(this.p, this.levelId,this.searchName);
      },


      getOneList() {

        //this.$router.push('/storeManage/storeList/seeTheStore')
        console.log(document.querySelectorAll('#all span input'))
      },

      edit(name) {
        this.showName = name;
        if(name === "编辑"){
          this.show = false
        }else {
          this.show = true
        }
        this.dialogFormVisible2 = true
      },
      del() {
        this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // getApi.delChannel(row.id).then((res) => {
          //   if (res.data.errcode === 0) {
          //     this.$message({
          //       type: 'info',
          //       message: '删除成功'
          //     });
          //     this.getChannelList(this.p = {page: 1, size: 20, total: 0});
          //   }
          //
          // })

        }).catch(() => {
          //
        });
      },

      removeDomain(index) {
        this.formEdit.thirdPartyCoding.splice(index, 1)
      },
      addDomain() {
        this.formEdit.thirdPartyCoding.push( {code1: '', code2: ''});
      },

      handleChecked(data) {
        let list =  this.storeData1.filter((item)=>{
          return item.select === true
        });
        if (list.length === this.storeData1.length) {
          list.forEach((item)=>{
            this.$refs.multipleTable.toggleRowSelection(item)
          })
        }else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        if(val.length === this.storeData1.length){
          this.storeData1.forEach((map) => {
            this.$set(map, 'select', true)
          });
        }else {
          this.storeData1.forEach((map) => {
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
            //this.showResouce(this.p,this.categoryName);
            recur(res.data.data,true,this.getDishesGroupLevelId(),this)
          }
        });
      },
      showResouce(p,categoryName = ''){
        let params = {
          redirect: "x2a.category.index",
          levelid:this.getDishesGroupLevelId(),
          categoryname:categoryName,
          page: p.page,
          pagesize:p.size

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
        this.showResouce(this.p,this.categoryName);
        recur(this.getDishesGroupTree(),false,this.getDishesGroupLevelId(),this)
      }


    },
    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setDishesGroupLevelId({levelId: e.levelid});
        recur(this.getDishesGroupTree(),false,this.getDishesGroupLevelId(),this);
        //this.showResouce(this.p={page: 1, size: this.p.size, total: 0},this.categoryName = '');
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
