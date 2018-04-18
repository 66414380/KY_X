<template>
  <div class="scroll_of">
    <div class="bodyTop">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <el-upload
      class="upload-demo"
      :action="$updateXlsUrl"
      name="filename"
      :on-change="handleChange"
      :on-success="handleAvatarSuccessXls"
      :before-upload="beforeAvatarUploadXls"
      :on-remove="handleRemove"
      :file-list="fileList"
      :multiple="false"
    >
      <el-button size="small" type="primary">选取文件上传</el-button>

    </el-upload>


    <div class="margin_t_10">

      <el-button type="primary" @click="submitUploadXls()">提交</el-button>

    </div>


  </div>
</template>

<script>
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import Hub from '../../utility/commun'
  import {getLevel} from '../../utility/communApi'
  import {oneTwoApi} from '@/api/api.js'

  export default {

    data() {
      return {
        navList: [{name: "导入结算记录", url: ''}],
        fileList: [],
        fileurl: ''
      }
    },
    computed: {},
    methods: {

      submitUploadXls() {

        if (this.fileurl === '') {
          this.$message('需要上传XLS文件');
          return
        }

        let params = {
          redirect: "x1.withdraw.impot",
          fileurl: this.fileurl,

        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.$message("操作成功");
            this.fileurl = '';
            this.fileList = []
          }
        })


      },
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-1);
      },
      handleRemove(file, fileList) {
        this.fileurl = ''
      },
      beforeAvatarUploadXls(file) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 5MB!');
        }
        return isLt5M;
      },
      handleAvatarSuccessXls(res, file) {
        this.fileurl = file.response.data.file_url
      },
    },
    created() {

    },
    mounted() {

    },
    updated() {


    },
    destroyed() {

    },
  }
</script>
<style scoped>

  .bodyTop {
    padding-bottom: 10px;
  }
</style>
