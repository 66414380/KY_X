<template>
  <div id="issuedRecord">
    <div class="contentMsg">
      <el-row>
        <el-col :span="24">
          <el-col :span="18" style="display: flex;align-items: center">
            <xo-nav-path :navList="navList"></xo-nav-path>
          </el-col>

        </el-col>
      </el-row>
    </div>

    <el-card :style="{height: (getBodyHeight - 78 )+'px'}">

  <el-row>
    <el-col :span="24" style="border-bottom: 1px solid gainsboro">
      <h3 style="margin-bottom: 10px;">食惠社设置</h3>
    </el-col>
    <el-col :span="24" >
      <el-form :model="form" label-width="100px" label-position="left">
        <el-form-item label="首页设置">
          <div class="flex_a">
            <!--<el-checkbox style="width: 150px" v-model="form.checked">选择活动方案</el-checkbox>-->
            <span class="margin_r_10">选择活动方案</span>
            <el-input style="width: 150px" size="mini" v-model="form.input" placeholder="填写活动方案编码"></el-input>
          </div>
        </el-form-item>

      </el-form>
    </el-col>

  </el-row>

  <div class="flex">
    <el-button type="success" @click="submitFrom()" >保存</el-button>
  </div>



    </el-card>
  </div>
</template>

<script>


  import {mapGetters, mapActions} from 'vuex'
  import {oneTwoApi} from '@/api/api.js'
  import Hub from '../../utility/commun'
  export default {
    data() {
      return {
        navList: [{name: "基础设置", url: ''},{name: "跳转管理", url: ''},{name: "食惠社设置", url: ''}],
        form: {
          checked: '',
          input: ''
        },

      }
    },

    methods: {
      submitFrom(){
        let formData = new FormData();
        formData.append("id", this.form.input);
        this.$http.post(`index.php?controller=shshome&action=set&token=${this.$localStorage.get('token')}`,formData).then((res)=>{
          if (res.data.errcode === 0) {
            this.$message('提交成功')
          }
        })
      },
    },
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    components: {
    },
    created(){
      this.$http.get(`index.php?controller=shshome&action=get&token=${this.$localStorage.get('token')}`).then((res)=>{
        if (res.data.errcode === 0) {
          this.form.input = res.data.data.id
        }
      })
    },
    mounted() {


    },
    updated(){

    },
    destroyed(){

    }
  }
</script>
<style scoped lang="less">
  div.cell {
    text-align: center;
  }

  .contentMsg {
    padding: 0 25px 10px 0;
  }
</style>
