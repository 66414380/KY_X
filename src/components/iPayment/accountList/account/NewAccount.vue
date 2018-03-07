<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">

      <!-- 商户名称 -->
      <el-form-item label="商户名称:" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>

      <!-- 支付方式 -->
      <el-form-item label="支付方式:" prop="method">
        <el-select v-model="ruleForm.method" placeholder="请选择">
          <el-option
            v-for="item in ruleForm.option1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 支付通道 -->
      <el-form-item label="支付通道:" prop="aisle">
        <el-select v-model="ruleForm.aisle" placeholder="请选择">
          <el-option
            v-for="item in ruleForm.option2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 开户类型 -->
      <el-form-item label="开户类型:">
        <el-radio class="radio" v-model="ruleForm.radio" label="1">企业用户</el-radio>
        <el-radio class="radio" v-model="ruleForm.radio" label="2">个体工商户</el-radio>
      </el-form-item>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 15px;"><span style="font-weight: bold;font-size: 16px">证件上传</span>（支持格式：JPG、PNG，图片大小不超过2M）</span>
        </div>

        <!-- 营业执照 -->
        <el-form-item label="营业执照:">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="ruleForm.fileList1"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <!-- 组织机构代码证 -->
        <el-form-item label="组织机构代码证:">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="ruleForm.fileList2"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <!-- 开户许可证 -->
        <el-form-item label="组织机构代码证:">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="ruleForm.fileList3"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <!-- 税务登记证 -->
        <el-form-item label="税务登记证:">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="ruleForm.fileList4"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <!-- 法人证件正面 -->
        <el-form-item label="法人证件正面:">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="ruleForm.fileList5"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <!-- 组织机构代码证 -->
        <el-form-item label="组织机构代码证:">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="ruleForm.fileList6"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <!--<el-button @click="resetForm('ruleForm')"> 取消 </el-button>-->
          <router-link to="/iPayment/accountList"><el-button> 取消 </el-button></router-link>
          <el-button type="primary" @click="submitForm('ruleForm')"> 保存 </el-button>
        </el-form-item>
      </el-card>

    </el-form>


  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          name: '测试用',  // 商户名称
          option1: [{     // 支付方式
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
          method: '',    // 支付方式


          option2: [{     // 支付通道
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
          aisle: '',    // 支付通道
          radio: "1",    // 开户类型

          fileList1: [{  // 营业执照
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }, {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }],

          fileList2: [{  // 组织机构代码证
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }],

          fileList3: [{  // 开户许可证
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }],

          fileList4: [{  // 税务登记证
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }],

          fileList5: [{  // 法人证件正面
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }],

          fileList6: [{  // 法人证件反面
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }],


        },
        rules: {
          name: [   // 商户名称
            {required: true, message: '请输入支付方式', trigger: 'blur'},
          ],
          method: [ // 支付方式
            {required: true, message: '请选择活动区域', trigger: 'blur'}
          ],
          aisle: [  // 支付通道
            {required: true, message: '请选择活动区域', trigger: 'blur'}
          ],
          type: [   // 开户类型
            {required: true, message: '请选择活动区域', trigger: 'blur'}
          ]
        },

      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(this.ruleForm.fileList2);
        // console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var flag = true;

            if (this.ruleForm.fileList1.length == 0 || this.ruleForm.fileList2.length == 0 || this.ruleForm.fileList3.length == 0 || this.ruleForm.fileList4.length == 0 || this.ruleForm.fileList5.length == 0 || this.ruleForm.fileList6.length == 0){
               flag = false;
            }

            if (flag){
              this.$message({
                message: "提交成功",
                type: "success"
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    mounted(){
      // 在这里获取已上传的图片
    }
  }
</script>
<style>

</style>
