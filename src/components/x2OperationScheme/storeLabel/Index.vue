<template>
  <div>

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree :data='getStoreLabelTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>


      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">

        <div class="flex_es margin_b_10">
          <div class="flex_a">
            <h3>
              {{levelName}}
            </h3>

          </div>


          <div class="flex_a">
            <div class="margin_r_10">
              <el-input size="small" v-model="sgroupname" placeholder="请输入门店标签"></el-input>
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

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id"
                           label="标签编码"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname"
                           label="标签名称"
          ></el-table-column>


          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="220">
            <template slot-scope="scope">

              <el-button size="small" @click="optionShow('查看',scope.row.id)">查看门店</el-button>
              <el-button size="small" @click="option('编辑',scope.row.id)">编辑</el-button>
              <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>

            </template>
          </el-table-column>
        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>


    </div>

    <!--编辑-->
    <el-dialog :title="showName" :visible.sync="dialogFormVisible2" @open="open" @close="close">
      <el-form ref="formRules" :model="formEdit" label-width="100px">

        <el-form-item label="标签编码:" v-if="showName !== '新增'">
          <el-input v-model="formEdit.id" placeholder="" disabled></el-input>
        </el-form-item>
        <el-form-item label="标签名称:" prop="sgroupname" :rules="{required: true, message: '请输入品类名称', trigger: 'blur'}">
          <el-input v-model="formEdit.sgroupname" placeholder="请输入品类名称"></el-input>
        </el-form-item>

        <div v-for="(domain, index) in formEdit.morecodes" class="flex_r">
          <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.code1" placeholder="请输入第三方名称"></el-input>
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
                    <el-input v-model="domain.code2" placeholder="请输入第三方编码"></el-input>
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
          <el-table :data="formEdit.stores" border>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storename"
                             label="门店">
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="mt" label="美团">
              <template slot-scope="scope">

                <el-checkbox v-model="scope.row.mt"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="el" label="饿了么">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.el"></el-checkbox>
              </template>
            </el-table-column>

          </el-table>


        </el-form-item>
        <el-form-item label="">
          <el-button @click='openDialog()'>添加门店</el-button>
        </el-form-item>
      </el-form>

      <div class="margin_t_10">
        <el-button type="primary" @click="submitFrom('formRules')">保存</el-button>
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
      </div>
    </el-dialog>


    <el-dialog title="选择门店" :visible.sync="dialogFormVisible">

      <div class="flex_a">
        <div></div>
        <div class="margin_l_10">

        </div>

        <div class="margin_l_10">

        </div>
        <div class="margin_r_10 flex_1">
          <el-input size="small" placeholder="门店名称/编码" v-model="storeName"></el-input>

        </div>
        <el-button size="small" @click="searchStore()">搜索</el-button>
      </div>

      <div class="margin_t_10">
        <el-table :data="storeData" border style="width: 100%;">
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storename"
                           label="门店"></el-table-column>

          <el-table-column :render-header="selectMt" label-class-name="table_head" header-align="center" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.mt" @change="handleCheckedMt"></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column :render-header="selectEl" label-class-name="table_head" header-align="center" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.el" @change="handleCheckedEl"></el-checkbox>
            </template>
          </el-table-column>
          <!--<el-table-column :render-header="selectBd" label-class-name="table_head" header-align="center" align="center">-->
          <!--<template slot-scope="scope">-->
          <!--<el-checkbox v-model="scope.row.bd" @change="handleCheckedBd"></el-checkbox>-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </div>
      <div class="margin_t_10">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitStore()">确认</el-button>

      </div>

    </el-dialog>

    <el-dialog title="查看门店" :visible.sync="dialogFormVisible1">
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
  import {oneTwoApi} from '@/api/api.js';
  import getApi1 from '../../infrastructure/DishesLibrary/dishesLibrary.service'

  export default {
    components: {},
    computed: {
      ...mapGetters([
        'getTreeArr', 'getBodyHeight'
      ]),
    },
    data() {
      return {
        levelName: '',
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        showName: '',
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "门店管理", url: ''}, {name: "门店标签", url: ''}],

        sgroupname: '',
        storeName: '',
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        formEdit: {
          sgroupname: '',
          sequence: '',
          morecodes: [
            {code1: '', code2: ''}
          ],
          stores: []
        },
        showAdd: '',
        storeData: [],
        storeDataShow: []
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setStoreLabelTree', 'setStoreLabelLevelId']),
      ...mapGetters(['getStoreLabelTree', 'getStoreLabelLevelId']),
      open() {

      },


      closeCheck(){
        let all = document.querySelector('#mt');
        all.checked = false;
        let all1 = document.querySelector('#el');
        all1.checked = false
      },

      close() {
        this.storeName = '';
        this.$nextTick(() => {
          this.closeCheck()

        });

      },
      handleCheckedMt() {
        let list = this.storeData.filter((item) => {
          return item.mt === true
        });
        if (list.length === this.storeData.length) {
          this.$nextTick(() => {
            let all = document.querySelector('#mt');
            all.checked = true
          })
        } else {
          this.$nextTick(() => {
            let all = document.querySelector('#mt');
            all.checked = false
          })
        }

      },
      handleCheckedEl() {
        let list = this.storeData.filter((item) => {
          return item.el === true
        });
        if (list.length === this.storeData.length) {
          this.$nextTick(() => {
            let all = document.querySelector('#el');
            all.checked = true
          })
        } else {
          this.$nextTick(() => {
            let all = document.querySelector('#el');
            all.checked = false
          })
        }

      },
      handleCheckedBd() {
        let list = this.storeData.filter((item) => {
          return item.bd === true
        });
        if (list.length === this.storeData.length) {
          this.$nextTick(() => {
            let all = document.querySelector('#bd span');
            all.classList.add('is-checked');
            let allInput = document.querySelector('#bd span input');
            allInput.checked = true
          })
        } else {
          this.$nextTick(() => {
            let all = document.querySelector('#bd span');
            all.classList.remove('is-checked');
            let allInput = document.querySelector('#bd span input');
            allInput.checked = false
          })
        }

      },

      selectMt(h) {
        return h('label', {}, [
            h('input', {
              attrs: {id: "mt",  type: "checkbox",},
              class: {myCheckBox:true},
              style: {
                display: 'none'

              },
                on: {
                  click: (event) => {
                    if (event.target.checked === true) {
                      this.storeData.forEach((data) => {
                        data.mt = true
                      })
                    } else {
                      this.storeData.forEach((data) => {
                        data.mt = false
                      })
                    }
                  }
                }
              }
            ), h('label',{attrs: {for: "mt"}}),h('span',{'class': {pointer:true}},['美团'])
          ]
        );

      },
      selectEl(h) {
        return h('label', {}, [
            h('input', {
                attrs: {id: "el", type: "checkbox",},
                class: {myCheckBox:true},
                style: {
                  display: 'none'

                },
                on: {
                  click: (event) => {
                    if (event.target.checked === true) {
                      this.storeData.forEach((data) => {
                        data.el = true
                      })
                    } else {
                      this.storeData.forEach((data) => {
                        data.el = false
                      })
                    }
                  }
                }
              }
            ), h('label',{attrs: {for: "el"}}),h('span',{'class': {pointer:true}},['饿了么'])
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
                'class': {},
                on: {

                  input: (event) => {
                    if (event.target.checked === true) {
                      this.storeData.forEach((data) => {
                        data.bd = true
                      })
                    } else {
                      this.storeData.forEach((data) => {
                        data.bd = false
                      })
                    }
                  }
                }
              }, ['百度']
            )
          ]
        );

      },




      submitStore() {
        let list = [];
        list = this.storeData.filter((item) => {
          return item.mt || item.el
        });
        if (list.length === 0) {
          this.$message({
            message: '最少选择一间门店',
            type: 'warning'
          });
          return
        }
        this.dialogFormVisible = false;
        this.formEdit.stores = list

      },
      openDialog() {
        this.dialogFormVisible = true;
      },
      searchStore() {

        let params = {
          redirect: "x2.store.index",
          levelid: this.getStoreLabelLevelId(),
          storeName: this.storeName,
          noPage: 1
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            res.data.list.forEach((item) => {
              item.mt = false;
              item.el = false
            });
            this.storeData = res.data.list;
          }
          this.$nextTick(() => {
            this.closeCheck()
          })
        })
      },
      submitFrom(formName) {
        let list = [], storeSgroups = [];
        this.formEdit.stores.forEach((item) => {
          (item.mt === true) ? item.mt = 1 : item.mt = 0;
          (item.el === true) ? item.el = 1 : item.el = 0;
          storeSgroups.push({base_store_id: item.base_store_id, mt: item.mt, el: item.el})
        });

        list = storeSgroups.filter((item) => {
          return item.mt !== 0 || item.el !== 0
        });
        if (list.length === 0) {
          this.$message({
            message: '最少选择一间门店',
            type: 'warning'
          });
          return
        }
        console.log(list)
        console.log(storeSgroups)

        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.showName === '新增') {
              let params = {
                redirect: "x2a.sgroup.create",
                levelid: this.getStoreLabelLevelId(),
                sgroupname: this.formEdit.sgroupname,
                morecodes: window.JSON.stringify(this.formEdit.morecodes),
                remark: '',
                storeSgroups: window.JSON.stringify(list)
              };
              oneTwoApi(params).then((res) => {
                if (res.errcode === 0) {
                  this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.sgroupname = '');
                  this.$message("操作成功");
                  this.dialogFormVisible2 = false
                }
              })
            } else {
              let params = {
                redirect: "x2a.sgroup.update",
                levelid: this.getStoreLabelLevelId(),
                id: this.formEdit.id,
                sgroupname: this.formEdit.sgroupname,
                morecodes: window.JSON.stringify(this.formEdit.morecodes),
                remark: '',
                storeSgroups: window.JSON.stringify(list)

              };
              oneTwoApi(params).then((res) => {
                if (res.errcode === 0) {
                  this.showResouce(this.p, this.sgroupname);
                  this.$message("操作成功");
                  this.dialogFormVisible2 = false
                }
              })
            }

          } else {
            console.log('error submit!!');
            //return false;
          }
        });

      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p, this.sgroupname);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p, this.sgroupname);
      },

      del(id) {
        this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.sgroup.delete",
            levelid: this.getStoreLabelLevelId(),
            id: id,

          };
          oneTwoApi(params).then((res) => {
            if (res.errcode === 0) {
              this.showResouce(this.p, this.sgroupname);
              this.$message("操作成功");

            }
          })

        }).catch(() => {
          //
        });
      },
      search() {
        this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.sgroupname);
      },

      optionShow(name, id) {
        this.dialogFormVisible1 = true;
        let params = {
          redirect: "x2a.sgroup.view",
          levelid: this.getStoreLabelLevelId(),
          id: id,
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.storeDataShow = res.data[0].stores
          }
        })
      },
      option(name, id) {
        this.showName = name;
        switch (name) {
          case "新增":

            this.formEdit = {
              sgroupname: '',
              sequence: '',
              morecodes: [
                {code1: '', code2: ''}
              ],
              stores: []
            };

            break;
          case "编辑":
            let params = {
              redirect: "x2a.sgroup.view",
              levelid: this.getStoreLabelLevelId(),
              id: id,
            };
            oneTwoApi(params).then((res) => {
              if (res.errcode === 0) {

                res.data[0].stores.forEach((item) => {
                  (item.mt === 1) ? item.mt = true : item.mt = false;
                  (item.el === 1) ? item.el = true : item.el = false;
                })


                this.formEdit = res.data[0]
              }
            })

            break;
        }

        this.dialogFormVisible2 = true;
        //x2门店
        let params = {
          redirect: "x2.store.index",
          levelid: this.getStoreLabelLevelId(),
          storeName: '',
          noPage: 1
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            res.data.list.forEach((item) => {
              item.mt = false;
              item.el = false
            });
            this.storeData = res.data.list

          }
        })
      },

      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setStoreLabelTree({list: res.data.data});
            if (this.getStoreLabelLevelId() === '') {
              this.setStoreLabelLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p, this.sgroupname);
            recur(res.data.data, true, this.getStoreLabelLevelId(), this)
          }
        });
      },

      showResouce(p, sgroupname = '') {
        console.log(123)
        let params = {
          redirect: "x2a.sgroup.index",
          levelid: this.getStoreLabelLevelId(),
          sgroupname: sgroupname,
          page: p.page,
          pagesize: p.size,
          // noPage:''
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.tableData = res.data.list;
            this.p.total = res.data.count;
          }
        })
      },
      removeDomain(index) {
        this.formEdit.morecodes.splice(index, 1)
      },
      addDomain() {
        this.formEdit.morecodes.push({code1: '', code2: ''});
      },
    },
    created() {
      if (this.getStoreLabelTree().length === 0) {
        this.showLevel()
      } else {
        this.showResouce(this.p);
        recur(this.getStoreLabelTree(), false, this.getStoreLabelLevelId(), this)
      }


    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setStoreLabelLevelId({levelId: e.levelid});
        recur(this.getStoreLabelTree(), false, this.getStoreLabelLevelId(), this);

        this.showResouce(this.p = {page: 1, size: this.p.size, total: 0});
      });
      Hub.$emit('mountedOk', 'mountedOk');
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

    }
  }
</script>

<style scoped>


</style>
