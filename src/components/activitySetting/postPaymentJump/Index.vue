<template>
  <div >

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">

        <div>
          <el-button size="small" @click="add('新增方案')" >新增方案</el-button>
          <el-button size="small"  @click="delSelected()">批量删除</el-button>
          <el-button size="small" @click="isSwitch()">批量开启/关闭</el-button>
        </div>

        <div class="flex_a">
          <div class="margin_r_10">
            <el-input size="small" v-model="jumpName" placeholder="请输入方案名称"></el-input>
          </div>
          <el-button size="small" @click="search()">搜索</el-button>

        </div>

      </div>

    </div>
    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree :data='getActivitySettingTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>


      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">

        <el-table :data="tableData" border :height="tableHeight" style="width: 100%;" @select-all="handleSelectionChange"
                  ref="multipleTable">

          <el-table-column header-align="center" align="center"
                           type="selection"
                           label-class-name="mySelect"
                           width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="方案名称" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="编码" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="statusFormate" min-width="100" label="状态">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="startTime" min-width="240" label="开始时间">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="endTime" min-width="240" label="截至时间">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="typeFormate" min-width="140" label="类型">
          </el-table-column>
          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" min-width="160" label="方案过期提醒状态">-->
          <!--</el-table-column>-->
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="280">
            <template slot-scope="scope">
              <el-button size="small" type="text" style="color:green;" @click="optionShow('修改方案',scope.row.id)">修改</el-button>
              <el-button size="small" type="text" style="color:blue;" @click="optionShow('查看方案',scope.row.id)">查看</el-button>
              <el-button size="small" type="text" style="color:red;" @click="del(scope.row.id)">删除</el-button>
              <!--<el-button size="small" type="text" style="color:burlywood;" @click="activeDown()">方案下发</el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
        </div>

      </div>


    <!--新增/编辑-->
    <el-dialog :title="showName" :visible.sync="dialogFormVisible" @open="open" @close="close" class="dialog">


      <el-form ref="formRules" :model="formEdit" label-width="140px">


          <el-form-item label="方案名称:" prop="name" :rules="{required: true, message: '请输入方案名称', trigger: 'blur'}">
            <el-input class="input_width" :disabled="show" v-model="formEdit.name" placeholder="请输入方案名称"></el-input>
          </el-form-item>

          <el-form-item label="方案编码:" v-if="showName !== '新增方案'">
            <el-input v-model="formEdit.id" placeholder="" disabled></el-input>
          </el-form-item>

          <div v-for="(domain, index) in formEdit.third_code" class="flex_r">
            <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
              <div>
                <el-row>
                  <el-col>
                    <div style="width:150px">
                      <el-input v-model="domain.code1" :disabled="show" placeholder="请输入第三方名称"></el-input>
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
                      <el-input v-model="domain.code2" :disabled="show" placeholder="请输入第三方编码"></el-input>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <div class="flex_sc">
              <div class="m-storeCode margin_l_10" @click="addDomain">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </div>
              <div v-if="(formEdit.third_code.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                   @click.prevent="removeDomain(index)">
                <i class="fa fa-minus-circle" aria-hidden="true"></i>
              </div>
            </div>
          </div>

          <el-form-item label="状态:" >
            <el-switch
              :disabled="show"
              v-model="formEdit.status"
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
          </el-form-item>

          <el-form-item label="方案起止时间:" >
            <div class="flex_r">
              <el-date-picker
                style="width:150px"
                :disabled="show"
                v-model="formEdit.start_time"
                type="datetime"
                placeholder="选择开始时间">
              </el-date-picker>
              <div class="m-rank">
                <div class="m-rank-child"></div>
              </div>
              <el-date-picker
                style="width:150px"
                :disabled="show"
                v-model="formEdit.end_time"
                type="datetime"
                placeholder="选择结束时间">
              </el-date-picker>
            </div>

          </el-form-item>


          <!--<el-form-item label="方案过期提醒设置:" >-->

            <!--<div class="flex_r">-->
              <!--<div>-->
                <!--<span>提醒</span>-->
                <!--<el-switch-->
                  <!--v-model="formEdit.status1"-->
                  <!--on-text=""-->
                  <!--off-text=""-->
                  <!--on-color="#13ce66"-->
                  <!--off-color="#ff4949">-->
                <!--</el-switch>-->
              <!--</div>-->

              <!--<div v-if="formEdit.status1 === true">-->
                <!--<div class="margin_l_10 ">-->
                  <!--<span>过期前</span>-->
                  <!--<input type="text" class="form_input">-->
                  <!--<span>小时提醒（发送模板消息）</span>-->
                <!--</div>-->

                <!--<div class="margin_l_10 ">-->
                  <!--<el-radio v-model="formEdit.radio" :label="0">{{radioName}}</el-radio><span>提醒一次</span>-->
                <!--</div>-->
                <!--<div class="margin_l_10 ">-->
                  <!--<el-radio v-model="formEdit.radio" :label="1">{{radioName}}</el-radio><span>提醒2次/间隔</span><input type="text" class="form_input"><span>小时</span>-->
                <!--</div>-->
                <!--<div class="margin_l_10 ">-->
                  <!--<el-radio v-model="formEdit.radio" :label="2">{{radioName}}</el-radio><span>提醒3次/间隔</span><input type="text" class="form_input"><span>小时</span>-->
                <!--</div>-->
              <!--</div>-->

            <!--</div>-->
          <!--</el-form-item>-->

        <el-form-item label="跳转设置:" >
          <el-radio-group v-model="formEdit.type">
            <div class="margin_b_10">
                <el-radio :disabled="show" :label="1" slot="reference"><span v-popover:popover>发自己餐厅的券</span></el-radio>
            </div>
            <div class="margin_b_10">
              <el-radio :disabled="show" :label="0">授权款易托管（默认）</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

      </el-form>

      <div class="margin_t_10">

        <el-button type="success" @click="submitFrom()"  :disabled="show">确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>

      </div>
    </el-dialog>


    <!--选择方案-->
    <el-dialog title="选择方案" :visible.sync="dialogVisible2" >
      <el-table :data="tableDataActivity" border  style="width: 100%;" >
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="序号" width="80">
          <template slot-scope="scope">
            <div>{{scope.$index + 1}}</div>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="方案名称" min-width="100">

        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="编码" width="80">

        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="起止时间" min-width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.start_time !== ''">起 {{scope.row.start_time}} </div>
            <div v-if="scope.row.end_time !== ''">截止 {{scope.row.end_time}} </div>
          </template>
        </el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="card_name" label="优惠券名称" min-width="100">

        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="选择" width="80">
          <template slot-scope="scope">
            <el-radio  v-model="radio" :label="scope.row.id">{{radioNull}}</el-radio>
          </template>
        </el-table-column>
      </el-table>
      <!--<xo-pagination :pageData=pActivity @page="getPage1" @pageSize="getPageSize1"></xo-pagination>-->
      <div class="margin_t_10">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="selectActivity()">确认</el-button>
      </div>
    </el-dialog>


    <!--批量开启/关闭-->
    <el-dialog
      title="开启/关闭"
      :visible.sync="dialogVisible1"
      width="50%" size="tiny">
      <el-switch
        v-model="storeStatusValue"
        on-color="#13ce66"
        off-color="#ff4949">
      </el-switch>
      <div class="margin_t_10">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="changeStoresStatus()">确认</el-button>
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
  import getApi from './postPaymentJump.service'
  import getApi2 from '../activitySetting/activitySetting.service'
  export default {

    components: {

    },
    computed: {
      ...mapGetters([
        'getTreeArr', 'getBodyHeight'
      ]),
    },
    data() {
      return {

        radioName:'',
        levelName: '',
        dialogFormVisible: false,
        dialogVisible1:false,
        dialogVisible2:false,
        storeStatusValue:false,
        showName: '',
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "跳转管理", url: ''},{name: "方案列表", url: ''}],
        show:false,
        jumpName: '',
        storeName: '',
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        pActivity: {page: 1, size: 1000, total: 0},
        formEdit:{
          name:'',
          third_code:[{code1:'',code2:''}],
          status:'',
          type:0,
          start_time:'',
          end_time:'',
          activity_id:''
        },
        tableDataActivity:[],
        radio:'',
        radioNull:''

      }
    },
    watch: {},
    methods: {
      ...mapActions(['setActivitySettingTree', 'setActivitySettingLevelId']),
      ...mapGetters(['getActivitySettingTree', 'getActivitySettingLevelId']),
      selectActivity(){
        if(this.radio === ''){
          this.$message.warning('请选择方案');
          return
        }
        this.dialogVisible2 = false

      },
      showTableDataActivity(){
        this.dialogVisible2 = true;
        this.formEdit.type = 1
      },
      //批量状态设置
      changeStoresStatus() {
        let storeStatusValue,list = [];
        if (this.storeStatusValue) {
          storeStatusValue = 1
        } else {
          storeStatusValue = 0
        }
        this.tableData.forEach((item) => {
          if (item.select) {
            list.push(item.id)
          }
        });
        getApi.batchStatus(list.join(","),this.storeStatusValue).then((res) => {
          if (res.data.errcode === 0) {
            this.showResouce(this.p);
            this.$message('操作成功');
            this.dialogVisible1 =false
          }
        });
      },
      isSwitch() {
        if(this.tableData.some((item) => {return item.select === true}) === true){
          this.dialogVisible1 = true
        } else {
          this.$message('请勾选方案');
        }
      },
      delSelected() {
        let list = [];
        this.tableData.forEach((item) => {
          if (item.select) {
            list.push(item.id)
          }
        });

        if(list.length === 0){
          this.$message('请勾选方案');
        }else {
          this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            getApi.batchDel(list.join(",")).then((res) => {
              if (res.data.errcode === 0) {
                this.showResouce(this.p);
                this.$message('操作成功');
              }
            });
          }).catch(() => {
            //
          });
        }


      },



      handleChecked(data) {
        let list = this.tableData.filter((item) => {
          return item.select === true
        });
        if (list.length === this.tableData.length) {
          list.forEach((item) => {
            this.$refs.multipleTable.toggleRowSelection(item)
          })

        } else {
          this.$refs.multipleTable.clearSelection();

        }

      },
      handleSelectionChange(val) {
        if (val.length === this.tableData.length) {
          this.tableData.forEach((map) => {
            this.$set(map, 'select', true)
          });
        } else {
          this.tableData.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },
      add(name){
        this.showName = name;
        this.dialogFormVisible = true;

        this.showResouce1(this.pActivity);
      },
      open() {

      },

      close(){

        this.show = false;
        this.radio = '';
        this.formEdit = {
          name:'',
            third_code:[{code1:'',code2:''}],
            status:'',
            type:0,
            start_time:'',
            end_time:'',
            activity_id:''
        }

      },


      openDialog() {
        this.dialogFormVisible = true;
      },

      submitFrom() {

        this.$refs['formRules1'].validate((valid) => {
          if (valid) {

            if(this.showName === '新增方案'){
              getApi.addActivity(this.getActivitySettingLevelId(), this.formEdit,this.formEdit1).then((res) => {
                if (res.data.errcode === 0) {
                  this.showResouce(this.p);
                  this.$message('操作成功');
                  this.dialogFormVisible = false
                }
              })
            }else {
              getApi.updateActivity(this.formEdit,this.formEdit1).then((res) => {
                if (res.data.errcode === 0) {
                  this.showResouce(this.p);
                  this.$message('操作成功');
                  this.dialogFormVisible = false
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
        this.showResouce(this.p, this.jumpName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p, this.jumpName);
      },

      getPage1(page) {
        this.pActivity.page = page;
        this.showResouce1(this.pActivity );
      },
      getPageSize1(size) {
        this.pActivity.size = size;
        this.showResouce1(this.pActivity );
      },

      del(id) {
        this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getApi.delActivity(id).then((res) => {
            if (res.data.errcode === 0) {
              this.showResouce(this.p);
              this.$message('操作成功');

            }
          });

        }).catch(() => {
          //
        });
      },
      search() {
        this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.jumpName);
      },

      optionShow(name, id) {
        this.showName = name;
        this.dialogFormVisible = true;
        getApi.getInfo(id).then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.status === 1 ? res.data.data.status = true:res.data.data.status = false;
            res.data.data.start_time === ''? res.data.data.start_time = '': res.data.data.start_time  = (res.data.data.start_time + '000') * 1;
            res.data.data.end_time === ''? res.data.data.end_time  = '': res.data.data.end_time  = (res.data.data.end_time + '000') * 1;
            this.formEdit = res.data.data;
            this.formEdit1.card_id = res.data.data.card_id;
            this.formEdit1.material_id = res.data.data.material_id
          }

        });

        (name === '查看方案')? this.show = true : this.show = false


      },
      activeDown() {
        this.$router.push('/activitySetting/activeDown')

      },

      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setActivitySettingTree({list: res.data.data});
            if (this.getActivitySettingLevelId() === '') {
              this.setActivitySettingLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce(this.p, this.jumpName);
            recur(res.data.data, true, this.getActivitySettingLevelId(), this)
          }
        });
      },

      showResouce(p,jumpName = ''){
        getApi.getJumpList(p,this.getActivitySettingLevelId(), jumpName).then((res) => {
          res.data.data.list.forEach((item)=>{
            item.select = false
          });
          if (res.data.errcode === 0) {
            this.tableData = res.data.data.list;
            this.p.total = res.data.data.count;
          }
        })
      },

      showResouce1(p,activityName = ''){
        getApi2.getActivityList(p,this.getActivitySettingLevelId(), activityName).then((res) => {

          if (res.data.errcode === 0) {
            this.tableDataActivity = res.data.data.list;
            this.pActivity.total = res.data.data.count;
          }
        })
      },


      removeDomain(index) {
        this.formEdit.third_code.splice(index, 1)
      },
      addDomain() {
        this.formEdit.third_code.push({code1: '', code2: ''});
      },


    },
    created() {
      if (this.getActivitySettingTree().length === 0) {
        this.showLevel()
      } else {
        this.showResouce(this.p);
        recur(this.getActivitySettingTree(), false, this.getActivitySettingLevelId(), this)
      }

    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setActivitySettingLevelId({levelId: e.levelid});
        recur(this.getActivitySettingTree(), false, this.getActivitySettingLevelId(), this);

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

<style scoped lang="less">
  .form_input{
    width: 32px;
    height: 20px;
    border: 1px solid #B2BFD0;
    border-radius: 5px;
    outline: none;
  }


  .input_width{
    width: 340px;
  }
  .t_a{
    text-align: center;
  }
  .item_name{
    width: 40px;
  }
  .button{
    border: 1px solid #B2BFD0;
    border-radius: 4px;
    width: 75px;
    height: 35px;
  }

.m_t_20{
  margin-top: 20px;
}


  .b_c{
    background-color: #eef1f6;
    color: #bbb;
  }


</style>
