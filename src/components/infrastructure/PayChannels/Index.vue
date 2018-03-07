<template>
  <div v-show="getTreeArr['列表']">

    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_sb">
        <div class="flex_1">
          <el-button size="small" @click="addPay('新增')" v-show="getTreeArr['新增']">新增</el-button>
        </div>
        <div class="flex_r">
          <el-input size="small" v-model="searchName" icon="search" placeholder="请输入内容">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button class="margin_l_10" size="small" @click="search()">搜索</el-button>
        </div>
      </div>

    </div>
    <el-table :data="paymentList" border :height="tableHeight">
      <el-table-column label-class-name="table_head" header-align="center" align="center" width="80" label="序号">
        <template slot-scope="scope">
          {{scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id"
                       label="支付通道编码"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="thirdCode"
                       label="第三方编码">

        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.thirdCode">{{item.code1}} {{item.code2}}</div>
        </template>
      </el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name"
                       label="支付通道名称"></el-table-column>
      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="channel"
                       label="基础支付通道"></el-table-column>

      <el-table-column label-class-name="table_head" header-align="center" align="center" prop="payment" label="基础支付方式" width="140">
        <template slot-scope="scope" >
          <div v-for="(item,index) in scope.row.payment" class="flex_r">
            <el-checkbox v-model="item.status" @change="(e)=>{
              return handleCheckedWay(e,item,scope.row.id)
            }">{{item.name}}
            </el-checkbox>

          </div>
        </template>
      </el-table-column>

      <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="140">
        <template slot-scope="scope">
          <el-button size="small" @click="editPay('编辑',scope.row)" v-show="getTreeArr['编辑']">编辑</el-button>
          <el-button size="small" type="danger" @click="del(scope.row)" v-show="getTreeArr['删除']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <footer>
      <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
    </footer>

    <!--弹窗新增/修改-->
    <el-dialog
      :title="name"
      :visible.sync="dialogVisible"
      @close="dialogClose"
      width="30%">
      <el-form ref="formRules" :model="form" label-width="140px">


        <el-form-item label="支付通道名称:" prop="name" :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
          <el-input v-model="form.name" placeholder="请输入内容"></el-input>
        </el-form-item>

        <!--<el-form-item label="支付方式编码:" prop="code" >-->
        <!--<el-input v-model="form.code" placeholder="请输入内容" disabled></el-input>-->
        <!--</el-form-item>-->

        <div v-for="(domain, index) in form.thirdCode" class="flex_r">
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
          <div class="flex_a" style="margin-bottom: 22px">
            <div class="m-storeCode margin_l_10" @click="addDomain()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(form.thirdCode.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <el-form-item label="对应基础支付通道:" prop="channelId"
                      :rules="{type:'number',required: true, message: '请选择支付通道', trigger: 'change'}">

          <el-select v-model="form.channelId" placeholder="请选择" @change="selectedChennel">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="" prop="paymentIds"
                      :rules="{type:'array',required: true, message: '请选择支付方式', trigger: 'change'}">
          <el-checkbox-group v-model="form.paymentIds">
            <div v-for="(item,index) in list">
              <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>

        <div class="margin_t_10">
          <el-button type="primary" @click="submitFrom('formRules')">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

  import {getScrollHeight} from '../../utility/getScrollHeight'
  import getApi from './payChannels.service'
  import ElButton from "element-ui/packages/button/src/button";

  import { mapActions,mapGetters } from 'vuex';
  export default {
    computed: {
      ...mapGetters([
        'getTreeArr'
      ]),
    },
    components: {},
    data() {
      return {
        list: [],

        form: {
          name: '',
          channelId: '',
          paymentIds: [],
          thirdCode: [
            {code1: '', code2: ''}
          ],
        },
        dialogVisible: false,
        tableHeight: 0,
        navList: [{name: "基础设置", url: ''}, {name: "支付通道", url: ''}],
        name: '',
        selectedAll: false,
        roleType: [],
        paymentList: [],
        p: {page: 1, size: 20, total: 0},
        searchName: '',
        options: []
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setTreeArr']),
      handleCheckedWay(e, item, id) {
        let status;
        if (item.status === true) {
          status = 1
        } else {
          status = 0
        }
        getApi.setChannelPayment(id, item.id, status).then((res) => {
          if (res.data.errcode === 0) {
            this.getChannelList(this.p, this.searchName);
          }
        })
      },
      selectedChennel(id) {
        this.options.forEach((item) => {
          if (item.id === id) {
            item.payment.forEach((item) => {
              if (item.is_open === 1) {
                this.$set(item, 'status', true)
              } else {
                this.$set(item, 'status', false)
              }
            });
            this.list = item.payment
          }
        })
      },
      search() {
        if (this.searchName === '') {
          this.getChannelList(this.p = {page: 1, size: 20, total: 0})
        } else {
          this.getChannelList(this.p = {page: 1, size: 20, total: 0}, this.searchName)
        }
      },
      getPage(page) {
        this.p.page = page;
        this.getChannelList(this.p, this.searchName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.getChannelList(this.p, this.searchName);
      },

      removeDomain(item) {
        var index = this.form.thirdCode.indexOf(item)
        if (index !== -1) {
          this.form.thirdCode.splice(index, 1)
        }
      },
      addDomain() {
        this.form.thirdCode.push({code1: '', code2: ''});
      },
      dialogClose() {
        this.form = {
          name: '',
          channelId: '',
          paymentIds: [],
          thirdCode: [
            {code1: '', code2: ''}
          ],
        };
        this.list = [];
        this.$refs['formRules'].resetFields();
      },
      submitFrom(formRules) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            if (this.name === "新增") {
              getApi.addCannel(this.form).then((res) => {
                if (res.data.errcode === 0) {
                  this.getChannelList(this.p = {page: 1, size: 20, total: 0});
                  this.dialogVisible = false
                }
              })
            } else {
              getApi.editChannel(this.form).then((res) => {
                if (res.data.errcode === 0) {
                  this.getChannelList(this.p);
                  this.dialogVisible = false
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      addPay(name) {
        getApi.getCommonChannelList().then((res) => {
          if (res.data.errcode === 0) {
            this.options = res.data.data.list
          }
        });
        this.name = name;
        this.dialogVisible = true
      },

      editPay(name, row) {
        this.name = name;
        getApi.getCommonChannelList().then((res) => {
          if (res.data.errcode === 0) {
            this.options = res.data.data.list;
            getApi.getChannelInfo(row.id).then((res) => {
              if (res.data.errcode === 0) {
                let list = [];
                res.data.data.payment.forEach((item) => {
                  list.push(item.id * 1)
                });

                res.data.data.paymentIds = list;
                this.form = res.data.data
              }
            });
          }
        });

        this.dialogVisible = true
      },
      del(row) {
        this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getApi.delChannel(row.id).then((res) => {
            if (res.data.errcode === 0) {
              this.$message({
                type: 'info',
                message: '删除成功'
              });
              this.getChannelList(this.p = {page: 1, size: 20, total: 0});
            }

          })

        }).catch(() => {
          //
        });


      },

      getChannelList(p, name = "") {
        getApi.getChannelList(p, name).then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.list.forEach((item) => {
              item.payment.forEach((item1) => {
                if (item1.select === 1) {
                  item1.status = true
                } else {
                  item1.status = false
                }
              })
            });
            this.paymentList = res.data.data.list;
            this.p.total = res.data.data.count
          } else {
            // this.$alert('请重新登录', '超时', {
            //   confirmButtonText: '确定',
            //   callback: action => {
            //     this.$router.push('/login')
            //   }
            // })
          }
        })
      }
    },
    created() {

      this.getChannelList(this.p);


    },
    mounted() {

    },
    destroyed(){

    },
    updated() {
      getScrollHeight().then((h) => {
        this.tableHeight = h;
      })
    },

  }
</script>

<style scoped lang="less">
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
