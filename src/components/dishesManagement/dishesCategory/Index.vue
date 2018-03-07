<template>
  <div v-show="getTreeArr['菜品品类']">

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree  :data='getDishesCategoryTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>







      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">

        <div class="flex_es margin_b_10">
            <h3>
              {{levelName}}
            </h3>

          <div class="flex_a">
            <div class="margin_r_10">
              <el-input size="small" v-model="categoryName" placeholder="请输入菜品品类"></el-input>
            </div>
            <el-button size="small" @click="search()">搜索</el-button>
            <el-button size="small" @click="option('新增')" v-show="getTreeArr['新增菜品品类']" :disabled="showAdd !== 4">+新增品类</el-button>
          </div>
        </div>


        <el-table :data="tableData" border :height="tableHeight - 40" style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                           width="100">
            <template slot-scope="scope">
              {{scope.$index + 1 }}
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sequence" width="120"
                           label="排序"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="categoryname" label="菜品品类"
                           width="120"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="品类编码"
                           width="120"></el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center"
                           label="第三方编码" >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.morecodes">
                <span>{{item.code1}} -- {{item.code2}}</span>
              </div>
            </template>


          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="200">
            <template slot-scope="scope">

              <el-button size="small" @click="option('查看',scope.row.id,scope.row.levelid)">查看</el-button>
              <el-button size="small" @click="option('编辑',scope.row.id,scope.row.levelid)" v-show="getTreeArr['修改菜品品类']">编辑</el-button>
              <el-button size="small" type="danger" @click="del(scope.row.id)" v-show="getTreeArr['删除菜品品类']">删除</el-button>

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
        <el-form-item label="品类编码:" v-if="showName !== '新增'">
          <el-input v-model="formEdit.id" placeholder="" disabled></el-input>
        </el-form-item>
        <el-form-item label="品类名称	:" prop="categoryname" :rules="{required: true, message: '请输入品类名称', trigger: 'blur'}">
          <el-input v-model="formEdit.categoryname" placeholder="请输入品类名称" :disabled="show"></el-input>
        </el-form-item>

        <el-form-item label="排序:" prop="sequence" :rules="{required: true, validator: checkNumber, trigger: 'blur'}">
          <el-input v-model="formEdit.sequence" placeholder="请输入排序" :disabled="show"></el-input>
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


      </el-form>

      <div class="margin_t_10">
        <el-button type="primary" v-if="!show" @click="submitFrom('formRules')">保存</el-button>
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
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
        dialogFormVisible2:false,
        showName:'',
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "菜品管理", url: ''}, {name: "菜品品类", url: ''}],
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
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setDishesCategoryTree','setDishesCategoryLevelId']),
      ...mapGetters(['getDishesCategoryTree','getDishesCategoryLevelId']),
      checkNumber(rule, value, callback){
        let re = /^[1-9]\d*$/;
        if (value === '') {
          callback(new Error('请输入排序'));
        }else {
          if(re.test(value)){
            callback()
          }else {
            callback(new Error('排序格式错误'));
          }
        }
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
                levelid:this.getDishesCategoryLevelId(),
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
