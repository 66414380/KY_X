<template>
  <div>

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">
        <div>


        </div>

        <div class="flex_a">
          <div class="margin_r_10">
            <el-input size="small" v-model="dishesName" placeholder="请输入规格名称"></el-input>
          </div>
          <el-button size="small" @click="search()">搜索</el-button>
          <el-button size="small" @click="option('新增')">+新增属性</el-button>

        </div>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <public-tree :data='dataLeft' :count=0></public-tree>
      </div>

      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">


        <el-table :data="storeData" border :height="tableHeight" style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号"
                           width="100">
            <template slot-scope="scope">
              {{scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="dishesCode"
                           label="编码" width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="dishesGroup"
                           label="属性名称">

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="remarks" label="属性值">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="remarks" label="备注">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="bank" label="所属品牌">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="200">
            <template slot-scope="scope">

              <el-button size="small" @click="option('查看')">查看</el-button>
              <el-button size="small" @click="option('编辑')">编辑</el-button>
              <el-button size="small" type="danger" @click="del()">删除</el-button>

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

        <el-form-item label="品牌:">
          <el-select v-model="formEdit.bank" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="属性名称	:" prop="name" :rules="{required: true, message: '请输入属性名称', trigger: 'blur'}">
          <el-input v-model="formEdit.name" placeholder="请输入属性名称" :disabled="show"></el-input>
        </el-form-item>


        <div v-for="(domain, index) in formEdit.attr" class="flex_r">
          <el-form-item :label="index === 0?'属性值':''" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:339px">
                    <el-input v-model="domain.code1" placeholder="请输入属性值，例如微辣，中辣，重辣" :disabled="show"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>


          <div class="flex_sc">
            <div class="m-storeCode margin_l_10" @click="addDomainAttr">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(formEdit.attr.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomainAttr(index)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

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


      </el-form>

      <div class="margin_t_10">
        <el-button type="primary" v-if="!show">保存</el-button>
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  import {getLeft, getArr} from '../../utility/communApi'
  import Hub from '../../utility/commun'
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import publicTree from '../../infrastructure/PublicManagement/publicTree'
  import {mapActions, mapGetters} from 'vuex';

  export default {
    components: {
      publicTree
    },
    data() {
      return {
        dialogFormVisible2:false,
        dishesName: '',
        dataLeft: [],
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "菜品管理", url: ''}, {name: "菜品属性", url: ''}],

        storeName: '',
        storeData: [{
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
          attr: [
            {code1: '11'}
          ],
          thirdPartyCoding: [
            {code1: '11', code2: '22'}
          ],
        },

        showName:'',
        show:true,
        options: [{
          id: 1,
          name: '黄金糕'
        }, {
          id: 2,
          name: '双皮奶'
        }],
      }
    },
    watch: {},
    methods: {



      getPage(page) {
        this.p.page = page;
        //this.showResouce(this.p, this.levelId,this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        //this.showResouce(this.p, this.levelId,this.searchName);
      },



      option(name) {
        this.showName = name;
        if(name === "编辑" ||name === "新增"){
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



      recur(data) {
        data.forEach((map) => {
          if (map.id === this.$localStorage.get_s('publicLevelId')) {
            this.type = map.type
          }
          if (map.child) {
            this.$set(map, "show", true);
            this.$set(map, "selected", false);
            this.recur(map.child)
          }
        })
      },
      recurSelected(data, levelId) {
        data.forEach((map) => {
          if (map.id === levelId) {
            this.$set(map, "selected", true);
          } else {
            this.$set(map, "selected", false);
          }
          if (map.child) {
            this.recurSelected(map.child, levelId)
          }
        })
      },
      removeDomain(index) {
        this.formEdit.thirdPartyCoding.splice(index, 1)
      },
      addDomain() {
        this.formEdit.thirdPartyCoding.push( {code1: '', code2: ''});
      },
      removeDomainAttr(index) {
        this.formEdit.attr.splice(index, 1)
      },
      addDomainAttr() {
        this.formEdit.attr.push( {code1: ''});
      },

    },
    created() {
      getLeft('x1').then((res) => {
        if (res.data.errcode === 0) {
          //this.showResouce(this.$localStorage.get_s('publicLevelId')?this.$localStorage.get_s('publicLevelId'):res.data.data[0].id);
          this.levelName = res.data.data[0].levelname
          this.dataLeft = res.data.data;
          this.recur(this.dataLeft);
          this.recurSelected(this.dataLeft, this.$localStorage.get_s('publicLevelId') ? this.$localStorage.get_s('publicLevelId') : res.data.data[0].id)
        }
      });


    },
    mounted() {
      Hub.$on('showAddPub', (e) => {
        this.levelName = e.levelName;
        this.type = e.type;
        this.$localStorage.set_s('publicLevelId', e.levelid);
        //this.showResouce(e.levelid);
        this.recurSelected(this.dataLeft, e.levelid)
      });

      Hub.$on('arr', (e) => {
        this.setTreeArr({obj: getArr(e)})
      });
    },
    updated() {
      let bodyWidth = document.querySelector('.content div').clientWidth;
      this.tableWidth = bodyWidth - this.$refs.tree.clientWidth;

      this.$nextTick(() => {
        getScrollHeight().then((h) => {
          this.tableHeight = h;
        })

      })

    },
    destroyed() {
      Hub.$off("showAddPub");
      Hub.$off("arr");
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
