<template>
  <div >

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <!--<xo-pub-tree  :data='getDishesCategoryTree()' :count=0 style="width: max-content;"></xo-pub-tree>-->
      </div>


      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">

        <div class="flex_es margin_b_10">
          <div class="flex_a">
            <h3>
              品牌
            </h3>
            <el-select v-model="bankId" clearable filterable placeholder="请选择品牌" size="small">
              <el-option
                v-for="item in bankList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>


          <div class="flex_a">
            <div class="margin_r_10">
              <el-input size="small" v-model="categoryName" placeholder="请输入门店标签"></el-input>
            </div>
            <el-button size="small" @click="search()">搜索</el-button>
            <el-button size="small" @click="option('新增')" :disabled="showAdd !== 4">+新增门店标签</el-button>
          </div>
        </div>


        <el-table :data="tableData" border :height="tableHeight - 40" style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                           width="100">
            <template slot-scope="scope">
              {{scope.$index + 1 }}
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sequence" label="标签编码"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="categoryname" label="标签名称"
                           ></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="所属品牌"
                           ></el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="220">
            <template slot-scope="scope">

              <el-button size="small" @click="option('查看',scope.row.id,scope.row.levelid)">查看门店</el-button>
              <el-button size="small" @click="option('编辑',scope.row.id,scope.row.levelid)" >编辑</el-button>
              <el-button size="small" type="danger" @click="del(scope.row.id)" >删除</el-button>

            </template>
          </el-table-column>
        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>


    </div>

    <!--编辑/查看-->
    <el-dialog :title="showName" :visible.sync="dialogFormVisible2">
      <el-form ref="formRules" :model="formEdit" label-width="100px">
        <el-form-item label="选择品牌:" v-if="showName !== '新增'">
          <el-select v-model="bankId" clearable filterable placeholder="请选择品牌" size="small">
            <el-option
              v-for="item in bankList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标签编码:" v-if="showName !== '新增'">
          <el-input v-model="formEdit.id" placeholder="" disabled></el-input>
        </el-form-item>
        <el-form-item label="标签名称:" prop="categoryname" :rules="{required: true, message: '请输入品类名称', trigger: 'blur'}">
          <el-input v-model="formEdit.categoryname" placeholder="请输入品类名称" :disabled="show"></el-input>
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

        <el-form-item label="门店:">
          <el-button @click='openDialog()'>添加门店</el-button>
        </el-form-item>


      </el-form>

      <div class="margin_t_10">
        <el-button type="primary" v-if="!show" @click="submitFrom('formRules')">保存</el-button>
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择门店" :visible.sync="dialogFormVisible">

      <div class="flex_a">
        <div>所在地</div>
        <div class="margin_l_10">
          <el-select v-model="value1" placeholder="请选择">
            <el-option v-for="item in bankList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>

        <div class="margin_l_10">
          <el-select v-model="value1" placeholder="请选择">
            <el-option v-for="item in bankList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="margin_l_10 flex_1" >
          <el-input placeholder="门店名称/编码"></el-input>
        </div>
      </div>

      <div class="margin_t_10">
        <el-table :data="storeData" border style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storeName" label="门店"></el-table-column>

          <el-table-column :render-header="selectMt" label-class-name="table_head" header-align="center" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.mt" @change="handleCheckedMt"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :render-header="selectEl"  label-class-name="table_head" header-align="center" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.el"  @change="handleCheckedEl"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :render-header="selectBd" label-class-name="table_head" header-align="center" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.bd" @change="handleCheckedBd"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="margin_t_10">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary">确认</el-button>

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
        levelName:'',
        dialogFormVisible:false,
        dialogFormVisible2:false,
        showName:'',
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "门店管理", url: ''}, {name: "门店标签", url: ''}],
        bankList:[{value: 1, label: '饿了么门店1'}, {value: 2, label: '饿了么门店2'}],
        bankId:'',
        show:true,
        categoryName: '',
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        formEdit:{
          categoryname: '',
          sequence: '',
          morecodes: [
            {code1: '', code2: ''}
          ],
        },
        showAdd:'',
        storeData: [{
          storeName: '炳胜（马场店）',
          mt:false,
          el:true,
          bd:false
        }, {
          storeName: '炳胜（马场店）',
          mt:false,
          el:true,
          bd:false
        }, {
          storeName: '炳胜（马场店）',
          mt:false,
          el:true,
          bd:false
        }, {
          storeName: '炳胜（马场店）',
          mt:false,
          el:true,
          bd:false

        }],
        value1:'',

      }
    },
    watch: {},
    methods: {
      ...mapActions(['setDishesCategoryTree','setDishesCategoryLevelId']),
      ...mapGetters(['getDishesCategoryTree','getDishesCategoryLevelId']),
      handleCheckedMt() {
        let list =  this.storeData.filter((item)=>{
          return item.mt === true
        });
        if(list.length === this.storeData.length){
          this.$nextTick(()=>{
            let all = document.querySelector('#mt span');
            all.classList.add('is-checked');
            let allInput = document.querySelector('#mt span input');
            allInput.checked = true
          })
        }else {
          this.$nextTick(()=>{
            let all = document.querySelector('#mt span');
            all.classList.remove('is-checked');
            let allInput = document.querySelector('#mt span input');
            allInput.checked = false
          })
        }

      },
      handleCheckedEl() {
        let list =  this.storeData.filter((item)=>{
          return item.el === true
        });
        if(list.length === this.storeData.length){
          this.$nextTick(()=>{
            let all = document.querySelector('#el span');
            all.classList.add('is-checked');
            let allInput = document.querySelector('#el span input');
            allInput.checked = true
          })
        }else {
          this.$nextTick(()=>{
            let all = document.querySelector('#el span');
            all.classList.remove('is-checked');
            let allInput = document.querySelector('#el span input');
            allInput.checked = false
          })
        }

      },
      handleCheckedBd() {
        let list =  this.storeData.filter((item)=>{
          return item.bd === true
        });
        if(list.length === this.storeData.length){
          this.$nextTick(()=>{
            let all = document.querySelector('#bd span');
            all.classList.add('is-checked');
            let allInput = document.querySelector('#bd span input');
            allInput.checked = true
          })
        }else {
          this.$nextTick(()=>{
            let all = document.querySelector('#bd span');
            all.classList.remove('is-checked');
            let allInput = document.querySelector('#bd span input');
            allInput.checked = false
          })
        }

      },
      selectMt(h) {
        return h(
          'div',
          {},
          [
            h('el-checkbox', {
                attrs: {id: "mt"},
                'class': {
                },
                on: {
                  change: this.handleCheckMt,
                  input: (event)=> {
                    // console.log(this)
                    // console.log(event)
                  }
                }
              }, ['美团']
            )
          ]
        );

      },
      selectEl(h) {
        return h(
          'div',
          {},
          [
            h('el-checkbox', {
                attrs: {id: "el"},
                'class': {
                },
                on: {
                  change: this.handleCheckEl,
                  input: (event)=> {
                    // console.log(this)
                    // console.log(event)
                  }
                }
              }, ['饿了么']
            )
          ]
        );

      },
      selectBd(h) {
        return h(
          'div',
          {},
          [
            h('el-checkbox', {
                attrs: {id: "bd"},
                'class': {
                },
                on: {
                  change: this.handleCheckBd,
                  input: (event)=> {
                    // console.log(this)
                    // console.log(event)
                  }
                }
              }, ['百度']
            )
          ]
        );

      },
      handleCheckEl(bool) {
        if (bool.target.checked === true) {
          this.storeData.forEach((data) => {
            data.el = true
          })
        } else {
          this.storeData.forEach((data) => {
            data.el = false
          })
        }
      },
      handleCheckMt(bool) {
        if (bool.target.checked === true) {
          this.storeData.forEach((data) => {
            data.mt = true
          })
        } else {
          this.storeData.forEach((data) => {
            data.mt = false
          })
        }
      },
      handleCheckBd(bool) {
        if (bool.target.checked === true) {
          this.storeData.forEach((data) => {
            data.bd = true
          })
        } else {
          this.storeData.forEach((data) => {
            data.bd = false
          })
        }
      },
      openDialog() {
        this.dialogFormVisible = true;
      },

      submitFrom(formName){

        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.showName === '新增'){
              let params = {
                redirect: "x2a.category.create",
                levelid:this.getDishesCategoryLevelId(),
                categoryname:this.formEdit.categoryname,
                morecodes:window.JSON.stringify(this.formEdit.morecodes),
                sequence:this.formEdit.sequence,
              };
              oneTwoApi(params).then((res) => {
                if(res.errcode === 0){
                  this.showResouce(this.p = {page: 1, size: 20, total: 0},this.categoryName = '');
                  this.$message("操作成功");
                  this.dialogFormVisible2 = false
                }
              })
            }else {
              let params = {
                redirect: "x2a.category.update",
                id:this.formEdit.id,
                categoryname:this.formEdit.categoryname,
                morecodes:window.JSON.stringify(this.formEdit.morecodes),
                sequence:this.formEdit.sequence,
              };
              oneTwoApi(params).then((res) => {
                if(res.errcode === 0){
                  this.showResouce(this.p,this.categoryName);
                  this.$message("操作成功");
                  this.dialogFormVisible2 = false
                }
              })
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p,this.categoryName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p,this.categoryName);
      },

      del(id) {
        this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.category.delete",
            levelid:this.getDishesCategoryLevelId(),
            id:id,

          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.showResouce(this.p,this.categoryName);
              this.$message("操作成功");

            }
          })

        }).catch(() => {
          //
        });
      },
      search() {
        this.showResouce(this.p = {page: 1, size: 20, total: 0},this.categoryName);
      },
      showView(id,levelid){
        let params = {
          redirect: "x2a.category.view",
          levelid:levelid,
          id:id,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.formEdit = res.data[0]
          }
        })
      },
      option(name,id,levelid) {
        this.showName = name;
        switch (name){
          case "新增":
            this.formEdit = {
              categoryname: '',
              sequence: '',
              morecodes: [
                {code1: '', code2: ''}
              ],
            };
            this.show = false;
            break;
          case "编辑":
            this.showView(id,levelid);
            this.show = false;
            break;
          case "查看":
            this.showView(id,levelid);
            this.show = true;
            break;
        }

        this.dialogFormVisible2 = true
      },
      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setDishesCategoryTree({list:res.data.data});
            if (this.getDishesCategoryLevelId() === '') {
              this.setDishesCategoryLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p,this.categoryName);
            recur(res.data.data,true,this.getDishesCategoryLevelId(),this)
          }
        });
      },
      showResouce(p,categoryName = ''){
        let params = {
          redirect: "x2a.category.index",
          levelid:this.getDishesCategoryLevelId(),
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
      removeDomain(index) {
        this.formEdit.morecodes.splice(index, 1)
      },
      addDomain() {
        this.formEdit.morecodes.push( {code1: '', code2: ''});
      },
    },
    created() {
      if(this.getDishesCategoryTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.p,this.categoryName);
        recur(this.getDishesCategoryTree(),false,this.getDishesCategoryLevelId(),this)
      }


    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setDishesCategoryLevelId({levelId: e.levelid});
        recur(this.getDishesCategoryTree(),false,this.getDishesCategoryLevelId(),this);
        this.showResouce(this.p={page: 1, size: this.p.size, total: 0},this.categoryName = '');
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


</style>
