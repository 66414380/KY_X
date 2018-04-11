<template>
  <div v-show="getTreeArr['菜品餐盒']">

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree  :data='getBoxSettingTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>
      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">
        <div class="flex_es margin_b_10">
          <h3>
            {{levelName}}
          </h3>

          <div class="flex_a">
            <div class="margin_r_10">
              <el-input size="small" v-model="dishesName" placeholder="请输入餐盒名称"></el-input>
            </div>
            <el-button size="small" @click="search()">搜索</el-button>
            <el-button size="small" @click="option('新增')" v-show="getTreeArr['新增菜品餐盒']" :disabled="showAdd !== 4">+新增餐盒</el-button>

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
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="lunchboxname"
                           label="餐盒名称">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="price" label="价格">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="remark" label="备注">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="ERP餐盒" width="140">
            <template slot-scope="scope">

              <el-button size="small" type="primary" @click="link(scope.row.id)" v-if="scope.row.erpcode ===null">关联餐盒</el-button>

              <div >
                <span>{{scope.row.erpcode}}</span>
                <el-button size="small" @click="unlink(scope.row.id)" v-if="scope.row.erpcode !==null">解除关联</el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="200">
            <template slot-scope="scope">

              <el-button size="small" @click="option('查看',scope.row.id,scope.row.levelid)" >查看</el-button>
              <el-button size="small" @click="option('编辑',scope.row.id,scope.row.levelid)" :disabled="scope.row.erpcode !== null" v-show="getTreeArr['修改菜品餐盒']">编辑</el-button>
              <el-button size="small" type="danger" @click="del(scope.row.id)" v-show="getTreeArr['删除菜品餐盒']">删除</el-button>

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

        <el-form-item label="餐盒名称	:" prop="lunchboxname" :rules="{required: true, message: '请输入餐盒名称', trigger: 'blur'}">
          <el-input v-model="formEdit.lunchboxname" placeholder="请输入餐盒名称" :disabled="show"></el-input>
        </el-form-item>
        <el-form-item label="餐盒价格	:" prop="price" :rules="{required: true, validator: checkNumber, trigger: 'blur'}">
          <el-input v-model="formEdit.price" placeholder="请输入餐盒价格" :disabled="show"></el-input>
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

    <!--选择菜品-->
    <xo-dishes ref="dishes" name="餐盒名称" select="餐盒" :list="erpbox" :currentRow="currentRow" :id="id" :levelid="this.getBoxSettingLevelId()" @submitErp="submitErp"></xo-dishes>
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
        dialogFormVisible2:false,
        dishesName: '',
        dataLeft: [],
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "菜品管理", url: ''}, {name: "餐盒设置", url: ''}],
        levelName:'',
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        formEdit:{
          lunchboxname: '',
          remark: '',
          price:'',
          morecodes: [
            {code1: '', code2: ''}
          ],
        },
        showAdd:'',
        showName:'',
        show:true,
        options: [],
        erpbox:[],
        id:'',
        currentRow:{check:null}
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setBoxSettingTree','setBoxSettingLevelId']),
      ...mapGetters(['getBoxSettingTree','getBoxSettingLevelId']),
      submitErp(){
        this.currentRow.check = null;
        this.showResouce(this.p);
      },
      unlink(id){
        this.$confirm('此操作将解除关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.lunchbox.linkerp",
            lunboxid: id,
            erpfoodid:''
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.$message("操作成功");
              this.showResouce(this.p);
            }
          });
        }).catch(() => {
          //
        });
      },
      link(id){
        let params = {
          redirect: "x2a.lunchbox.erpbox",
          levelid:this.getBoxSettingLevelId(),

        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.id = id;
            this.erpbox = res.data;
            this.$refs.dishes.openDialog();
          }
        });


      },
      checkNumber(rule, value, callback){
        //可以是0 0.0 0.00
        let re = /^0{1}([.]([0-9][0-9]?)|[.][0-9][1-9])?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/;
        if (value === '') {
          callback(new Error('请输入价格'));
        }else {
          if(re.test(value)){
            callback()
          }else {
            callback(new Error('价格格式错误'));
          }
        }
      },
      search(){
        this.showResouce(this.p = {page: 1, size: 20, total: 0},this.dishesName);
      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p);
      },

      submitFrom(formName){

        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.showName === '新增'){
              let params = {
                redirect: "x2a.lunchbox.create",
                levelid:this.getBoxSettingLevelId(),
                lunchboxname:this.formEdit.lunchboxname,
                morecodes:window.JSON.stringify(this.formEdit.morecodes),
                remark:this.formEdit.remark,
                price:this.formEdit.price
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
                redirect: "x2a.lunchbox.update",
                id:this.formEdit.id,
                lunchboxname:this.formEdit.lunchboxname,
                morecodes:window.JSON.stringify(this.formEdit.morecodes),
                remark:this.formEdit.remark,
                price:this.formEdit.price
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
      showView(id,levelid){
        let params = {
          redirect: "x2a.lunchbox.view",
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
              lunchboxname: '',
              remark: '',
              price:'',
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
            redirect: "x2a.lunchbox.delete",
            levelid:this.getBoxSettingLevelId(),
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

            this.setBoxSettingTree({list:res.data.data});
            if (this.getBoxSettingLevelId() === '') {
              this.setBoxSettingLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p,this.dishesName);
            recur(res.data.data,true,this.getBoxSettingLevelId(),this)
          }
        });
      },
      showResouce(p,dishesName = ''){
        let params = {
          redirect: "x2a.lunchbox.index",
          levelid:this.getBoxSettingLevelId(),
          lunchboxname:dishesName,
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
      if(this.getBoxSettingTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce(this.p,this.dishesName);
        recur(this.getBoxSettingTree(),false,this.getBoxSettingLevelId(),this)
      }

    },
    mounted() {

      Hub.$on('showAdd', (e) => {
        this.setBoxSettingLevelId({levelId: e.levelid});
        recur(this.getBoxSettingTree(),false,this.getBoxSettingLevelId(),this);
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
