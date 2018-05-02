<template>
  <div v-show="getTreeArr['菜品规格']">

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree  :data='getDishesSpecTree()' :count=0 style="width: max-content;"></xo-pub-tree>

      </div>

      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">
        <div class="flex_es margin_b_10">
          <h3>
            {{levelName}}
          </h3>

          <div class="flex_a">
            <div class="margin_r_10">
              <el-input size="small" v-model="dishesName" placeholder="请输入规格名称"></el-input>
            </div>
            <el-button size="small" @click="search()">搜索</el-button>
            <el-button size="small" @click="option('新增')" v-show="getTreeArr['新增菜品规格']" :disabled="showAdd !== 4">+新增规格</el-button>

          </div>
        </div>

        <el-table :data="tableData" border :height="tableHeight - 40" style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                           width="100">
            <template slot-scope="scope">
              {{scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id"
                           label="编码" width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="skuname"
                           label="规格名称">

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="remark" label="备注">
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="220">
            <template slot-scope="scope">

              <el-button size="small" @click="option('查看',scope.row.id,scope.row.levelid)">查看</el-button>
              <el-button size="small" @click="option('编辑',scope.row.id,scope.row.levelid)" v-show="getTreeArr['修改菜品规格']">编辑</el-button>
              <el-button size="small" type="danger" @click="del(scope.row.id)" v-show="getTreeArr['删除菜品规格']">删除</el-button>

            </template>
          </el-table-column>
        </el-table>


        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>


    </div>



    <!--编辑/查看-->
    <el-dialog :title="showName" :visible.sync="dialogFormVisible2" width="560px">
      <el-form ref="formRules" :model="formEdit" label-width="100px">

        <el-form-item label="规格名称	:" prop="skuname" :rules="{required: true, message: '请输入规格名称', trigger: 'blur'}">
          <el-input v-model="formEdit.skuname" placeholder="请输入规格名称" :disabled="show"></el-input>
        </el-form-item>
        <el-form-item label="备注:" >
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
  import getApi1 from '../../infrastructure/DishesLibrary/dishesLibrary.service'
  import {mapActions, mapGetters} from 'vuex';
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
        dialogFormVisible2:false,
        dishesName: '',
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "聚合外卖管理", url: ''},{name: "菜品列表", url: ''}, {name: "菜品规格", url: ''}],
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        formEdit:{
          skuname: '',
          remark: '',
          morecodes: [
            {code1: '', code2: ''}
          ],
        },
        showAdd:'',
        showName:'',
        show:true,
        options: [],
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setDishesSpecTree','setDishesSpecLevelId']),
      ...mapGetters(['getDishesSpecTree','getDishesSpecLevelId']),
      search(){
        this.showResouce(this.p = {page: 1, size: 20, total: 0},this.dishesName);
      },
      submitFrom(formName){

        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.showName === '新增'){
              let params = {
                redirect: "x2a.sku.create",
                levelid:this.getDishesSpecLevelId(),
                skuname:this.formEdit.skuname,
                morecodes:window.JSON.stringify(this.formEdit.morecodes),
                remark:this.formEdit.remark,
              };
              oneTwoApi(params).then((res) => {
                if(res.errcode === 0){
                  this.showResouce(this.p = {page: 1, size: 20, total: 0},this.dishesName = '');
                  this.$message("操作成功");
                  this.dialogFormVisible2 = false
                }
              })
            }else {
              let params = {
                redirect: "x2a.sku.update",
                id:this.formEdit.id,
                skuname:this.formEdit.skuname,
                morecodes:window.JSON.stringify(this.formEdit.morecodes),
                remark:this.formEdit.remark,
              };
              oneTwoApi(params).then((res) => {
                if(res.errcode === 0){
                  this.showResouce(this.p,this.dishesName);
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
        this.showResouce(this.p,this.dishesName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p,this.dishesName);
      },

      showView(id,levelid){
        let params = {
          redirect: "x2a.sku.view",
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
              skuname: '',
              remark: '',
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
      del(id) {
        this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.sku.delete",
            levelid:this.getDishesSpecLevelId(),
            id:id,

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
      },

      removeDomain(index) {
        this.formEdit.morecodes.splice(index, 1)
      },
      addDomain() {
        this.formEdit.morecodes.push( {code1: '', code2: ''});
      },
      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setDishesSpecTree({list:res.data.data});
            if (this.getDishesSpecLevelId() === '') {
              this.setDishesSpecLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p,this.dishesName);
            recur(res.data.data,true,this.getDishesSpecLevelId(),this)
          }
        });
      },
      showResouce(p,dishesName = ''){
        let params = {
          redirect: "x2a.sku.index",
          levelid:this.getDishesSpecLevelId(),
          skuname:dishesName,

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
      if(this.getDishesSpecTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.p,this.dishesName);
        recur(this.getDishesSpecTree(),false,this.getDishesSpecLevelId(),this)
      }
    },
    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setDishesSpecLevelId({levelId: e.levelid});
        recur(this.getDishesSpecTree(),false,this.getDishesSpecLevelId(),this);
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
    destroyed() {
      Hub.$off("showAdd");
    },
    render() {

    }
  }
</script>

<style scoped lang="less">
  .m-storeList {
    height: 50px;
    line-height: 50px;
  }
  .m-rank {
    width: 40px;
    .m-rank-child {
      height: 18px;
      border-bottom: 1px solid #000;
    }
  }

  .m-storeCode {
    font-size: 30px;
  }



</style>
