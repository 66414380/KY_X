<template>
  <div>
    <div class="flex_r">
      <el-card class="box-card">
        <div style="height: 40px;" class="margin_b_10 flex_sb">
          <h3 >增加营销入口</h3>
          <el-button  type="primary" size="small" @click="add()" :disabled="form.show1 && form.show2">点击增加</el-button>
        </div>

        <el-form ref="formRules" :model="form" label-width="100px">
          <div class="margin_b_10 body" v-if="form.show1">
            <div class="flex_sb title">
              <span>营销入口1</span>
              <el-button size="small" @click="del1()" :disabled="form.show2">删除</el-button>
            </div>
            <div class="margin_10">
              <el-form-item label="入口名称:" prop="name1" :rules="{required: true, message: '请输入规格名称', trigger: 'blur'}">
                <el-input v-model="form.name1" placeholder="请输入入口名称"></el-input>
              </el-form-item>
              <el-form-item label="提示语:">
                <el-input v-model="form.hint1" placeholder="请输入提示语" ></el-input>
              </el-form-item>
              <el-form-item label="跳转链接:" prop="url1" :rules="{required: true, message: '请输入规格名称', trigger: 'blur'}">
                <el-input v-model="form.url1" placeholder="例：http://www.baidu.com" ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="margin_b_10 body" v-if="form.show2">
            <div  class="flex_sb title">
              <span>营销入口2</span>
              <el-button size="small" @click="del2()">删除</el-button>
            </div>
            <div class="margin_10">
              <el-form-item label="入口名称:" prop="name2" :rules="{required: true, message: '请输入规格名称', trigger: 'blur'}">
                <el-input v-model="form.name2" placeholder="请输入入口名称"></el-input>
              </el-form-item>
              <el-form-item label="提示语:">
                <el-input v-model="form.hint2" placeholder="请输入提示语" ></el-input>
              </el-form-item>
              <el-form-item label="跳转链接:" prop="url2" :rules="{required: true, message: '请输入规格名称', trigger: 'blur'}">
                <el-input v-model="form.url2" placeholder="例：http://www.baidu.com" ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>


      </el-card>
      <div class="margin_l_10" style="position: relative">
        <img src="../../../../assets/u3324.jpg" alt="" style="width: 320px;height: 580px">
        <div style="position: absolute;top: 149px;left: 8px;width: 304px;height: 113px;">
          <div class="flex_a" style="padding-left:12px;">
            <span>付款方</span>
            <span class="call_r" >刘德华</span>
          </div>
          <div class="flex_a" style="padding-left:12px;padding-bottom: 15px;border-bottom: 1px dashed #D5D5D5;">
            <span >收款方</span>
            <span class="call_r" >款易测试店</span>
          </div>


          <div class="flex_a" style="padding:14px 0 0 12px">
            <span>发票金额</span>
            <span style="padding-left:12px;color: #8F1A12">￥37.00</span>
          </div>
          <div class="flex_a" style="padding-left:12px;">
            <span >开票时间</span>
            <span class="call_r" >2018.1.10</span>
          </div>

        </div>

        <div style="position: absolute;top: 292px;left: 8px;width: 304px;">
          <div class="flex_sb call" >
            <span>查看发票</span>
            <span class="call_r" >发票详情 <i class="fa fa-chevron-right" aria-hidden="true"></i> </span>
          </div>

          <div class="flex_sb call">
            <span>红包抽奖</span>
            <span class="call_r" > <i class="fa fa-chevron-right" aria-hidden="true"></i> </span>
          </div>
          <div class="flex_sb call">
            <span>公众号</span>
            <span class="call_r" > <i class="fa fa-chevron-right" aria-hidden="true"></i> </span>
          </div>
          <div class="flex_sb call" v-if="form.show1">
            <span v-if="form.name1 === ''">营销入口1</span>
            <span v-else>{{form.name1}}</span>
            <span class="call_r" > {{form.hint1}} <i class="fa fa-chevron-right" aria-hidden="true"></i> </span>
          </div>
          <div class="flex_sb call" v-if="form.show2">
            <span v-if="form.name2 === ''">营销入口2</span>
            <span v-else>{{form.name2}}</span>
            <span class="call_r" > {{form.hint2}} <i class="fa fa-chevron-right" aria-hidden="true"></i> </span>
          </div>
        </div>


      </div>
    </div>


<div class="margin_t_10">
  <el-button @click="submit('formRules')" type="primary">提交</el-button>
  <el-button @click="$router.go(-1)">取消</el-button>
</div>


  </div>
</template>

<script>


  import {oneTwoApi} from '@/api/api.js'

  import {mapActions, mapGetters} from 'vuex';

  export default {
    computed: {},
    components: {},
    data() {
      return {
        form:{

        }

      }
    },
    watch: {},
    methods: {
      del2(){
        this.form.show2 = false;
        this.form.name2 = '';
        this.form.url2 = '';
        this.form.hint2 = ''
      },
      del1(){
        this.form.show1 = false;
        this.form.name1 = '';
        this.form.url1 = '';
        this.form.hint1 = ''
      },
      add(){

        if(this.form.show1 === false && this.form.show2 === false){
          this.form.show1 = true;
          return
        }
        if(this.form.show1 === true && this.form.show2 === false){
          this.form.show2 = true
        }


      },

      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              redirect: "x1.invoice.marketingTemplate",
              id: this.$route.params.id,
              name1: this.form.name1,
              url1: this.form.url1,
              hint1: this.form.hint1,
              name2: this.form.name2,
              url2: this.form.url2,
              hint2: this.form.hint2,
            };
            oneTwoApi(params).then((res) => {
              if (res.errcode === 0) {
                this.$message("操作成功");
                this.$router.go(-1)
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    created() {
      let params = {
        redirect: "x1.invoice.marketingInfo",
        id: this.$route.params.id
      };
      oneTwoApi(params).then((res) => {
        if (res.errcode === 0) {
          if(res.data.length === 0){
            this.form = {
              id:this.$route.params.id,
              show1:false,
              name1:'',
              url1:'',
              hint1:'',
              show2:false,
              name2:'',
              url2:'',
              hint2:'',
            }
          } else {
            if(res.data.name1 !== '' || res.data.url1 !== '' || res.data.hint1 !== '' ){
              res.data.show1 = true
            }else {
              res.data.show1 = false
            }
            if(res.data.name2 !== '' || res.data.url2 !== '' || res.data.hint2 !== '' ){
              res.data.show2 = true
            }else {
              res.data.show2 = false
            }
            this.form = res.data;


          }


        }
      })

    },
    mounted() {

    },
    destroyed() {

    },
    updated() {

    }
  }
</script>

<style scoped lang="less">
  .box-card{
    width: 400px;
    height: max-content;
  }
  .body{
    width: 100%; border: 1px solid #D5D5D5;border-radius: 10px;box-sizing: border-box;
  }
  .title{
    padding: 10px;background-color: #D5D5D5;border-radius: 8px 8px 0 0;
  }

  .call{
    padding:0 12px;height: 45px;border-bottom: 1px dashed #D5D5D5;
  }
  .call_r{
    padding-left:12px;color: #B2B3B3
  }

  @border:1px solid #F3F3F3;
  .preview{

  }


</style>
