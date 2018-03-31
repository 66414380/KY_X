<template>
  <div>

    <el-tabs v-model="activeName2" @tab-click="handleClick">
      <!--<el-tab-pane label="加载页面" name="first">-->
      <!--<div class="flex_r" style="height: 500px">-->
      <!--<div class="flex_1">-->
      <!--<h2>内容设置</h2>-->
      <!--<h3>基本信息</h3>-->
      <!--<el-form ref="form1" :model="form1" label-width="100px">-->

      <!--<el-form-item label="加载图片：">-->
      <!--<el-upload-->
      <!--class="avatar-uploader"-->
      <!--:action="$updateUrl"-->
      <!--name='filename'-->
      <!--:show-file-list="false"-->
      <!--:on-success="handleAvatarSuccess1"-->
      <!--:before-upload="beforeAvatarUpload">-->
      <!--<img v-if="form1.load_img" :src="form1.load_img" class="avatar">-->
      <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
      <!--</el-upload>-->
      <!--<div>建议图片尺寸350*350px，格式为png,jpg,jprg,且小于500kb</div>-->
      <!--</el-form-item>-->

      <!--</el-form>-->

      <!--</div>-->

      <!--<div class="flex_1 margin_l_10">-->
      <!--<div class="margin_b_10">预览效果</div>-->
      <!--<img src="../../../assets/pageDesign/1.jpeg" alt="" style="height: 500px">-->
      <!--</div>-->
      <!--</div>-->

      <!--</el-tab-pane>-->
      <el-tab-pane label="发票信息" name="second">
        <div class="flex_r" >
          <div class="flex_1">
            <h2>内容设置</h2>
            <h3>基本信息</h3>
            <el-form ref="form2" :model="form2" label-width="100px">

              <el-form-item label="logo图片：">
                <el-upload
                  class="avatar-uploader"
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess2"
                  :before-upload="beforeAvatarUpload">
                  <img v-show="form2.log_img" :src="form2.log_img" style="display: block;width: 178px;height: 178px" ref="img">
                  <!--<i v-show="!form2.log_img" class="el-icon-plus avatar-uploader-icon"></i>-->
                  <div v-show="!form2.log_img" class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div>图片格式为png,jpg,jprg,且小于500kb</div>

              </el-form-item>

              <el-form-item label="主题选择：">

                <div class="margin_b_10" style="width: 178px;height: 30px"
                     :style="{'background-color':color}"></div>

                <el-color-picker v-model="color"></el-color-picker>
               <!-- <div class="flex_r">
                  <div v-for="(item,index) in colorList" @click="colorHandle(index)" class="pointer flex"
                       style="width: 30px;height: 30px" :style="{'background-color':item.color}">
                    <img src="../../../assets/selected.png" v-if="item.selected" alt="">

                  </div>
                </div>-->

              </el-form-item>

            </el-form>

          </div>

          <div class="flex_1 margin_l_10">
            <h2 class="margin_b_10">预览效果</h2>

            <div class="preview">
              <div class="top">
                <img src="../../../assets/pageDesign/top.png" alt="" >
              </div>
              <div class="flex top_sub">
                <img :src="form2.log_img" alt="" class="img_1">
                <img src="../../../assets/pageDesign/info.png" alt="" class="img_2">
              </div>
              <div class="body" >
               <!-- <div class="flex title">
                  填写发条信息
                </div>-->

                <div class="content">
                  <div class="content_top" :style="{'border-top':'2px solid' + color}">
                    <div class="text_1">
                      发票金额
                    </div>
                    <div class="flex_es text_2">
                      <span>开票时间</span>
                      <span>2017-11-28</span>
                    </div>
                  </div>

                  <div :style="{'color':color}" class="flex_a middle">
                    <i class="fa fa-star" aria-hidden="true"></i> 号发必填
                  </div>

                  <div class="context">
                    <div class="flex_r context_top">
                      <div class="flex_1 flex left" :style="{'border': '1px solid' + color}">
                        个人
                      </div>
                      <div class="flex_1 flex right">
                        企业
                      </div>
                    </div>
                    <div class="flex_a context_top" >
                      <span class="m_l" :style="{'color':color}"><i class="fa fa-star" aria-hidden="true"></i></span>
                      <span class="color m_l">请输入发票抬头</span>
                    </div>
                    <div class="flex_a context_top" >
                      <span class="m_l" :style="{'color':color}"><i class="fa fa-star" aria-hidden="true"></i></span>
                      <span class="color m_l">请输入邮箱</span>
                    </div>
                    <div class="flex_a context_top" >
                      <span class="m_l" :style="{'color':color}"><i class="fa fa-star" aria-hidden="true"></i></span>
                      <span class="color m_l">请输入纳税人识别号</span>
                    </div>
                    <div class="flex_a context_top" >
                      <span class="m_l" :style="{'color':color}"><i class="fa fa-star" aria-hidden="true"></i></span>
                      <span class="color m_l">请输入地址</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>


      </el-tab-pane>
      <el-tab-pane label="文字公告" name="third">
        <div class="flex_r" >
          <div class="flex_1">
            <h2>内容设置</h2>
            <h3>基本信息</h3>
            <el-form ref="form3" :model="form3" label-width="50px">
              <el-form-item label="" >
                <div class="flex_r margin_t_10">
                  <div @click="click3(1)" class="myButton margin_r_10" style="background-color: #ffffff;height: 100%;"
                       :style="{'color':selectEdit === 1?'red':'black','border-color':selectEdit === 1?'red':'#C3C4C3',}">
                    文字版
                  </div>

                  <div>
                    <el-input
                      class="margin_b_10"
                      placeholder="标题"
                      v-model="form3.title">
                    </el-input>
                    <el-input
                      class="margin_b_10"
                      type="textarea"
                      :rows="5"
                      placeholder="请在此输入公告"
                      v-model="form3.content">
                    </el-input>
                    <el-input
                      placeholder="日期"
                      v-model="form3.date">
                    </el-input>
                  </div>

                </div>
                <div class="flex_a margin_t_10">
                  <div @click="click3(2)" class="myButton margin_r_10" style="background-color: #ffffff;height: 100%;"
                       :style="{'color':selectEdit === 2?'red':'black','border-color':selectEdit === 2?'red':'#C3C4C3',}">
                    网页版
                  </div>
                  <el-input
                    placeholder="请在此输入链接"
                    v-model="form3.prompt_content">
                  </el-input>
                </div>
              </el-form-item>

              <el-form-item label="">
                <div>
                  *以上二选一
                </div>
              </el-form-item>

            </el-form>

          </div>

          <div class="flex_1 margin_l_10" >
            <h2 class="margin_b_10">预览效果</h2>
            <div style="position: relative">
              <img src="../../../assets/pageDesign/3.jpeg" alt="" style="height: 500px">
              <div class="title">
                {{form3.title}}
              </div>
              <textarea class="textarea" v-model="form3.content">
              </textarea>
              <div class="date">
                {{form3.date}}
              </div>
            </div>

          </div>
        </div>

      </el-tab-pane>

    </el-tabs>

    <el-button @click="submit()">提交</el-button>
    <el-button @click="reset()">重置</el-button>

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
        activeName2: 'second',
        selectEdit:1,
        color: '#3F9CCF',       // 默认颜色
        colorList: [
          {id: 0, color: '#3F9CCF', selected: false},
          {id: 1, color: '#3B6894', selected: false},
          {id: 2, color: '#C06A43', selected: false},
          {id: 3, color: '#EF716F', selected: false},
          {id: 4, color: '#916C96', selected: false},
          {id: 5, color: '#C69735', selected: false},
          {id: 6, color: '#989998', selected: false},
          {id: 7, color: '#000000', selected: false}
        ],
        form1: {
          load_img: '',
        },
        form2: {
          log_img: '',
          theme_color: ''
        },
        form3: {
          prompt_type: 1,
          content: '',
          title: '',
          date: '',
          prompt_content: 'http://',

        },

      }
    },
    watch: {},
    methods: {

      handleClick(tab, event) {
        //console.log(tab, event);
      },

      click3(id) {
        this.selectEdit = id
      },
      colorHandle(i) {
        this.colorList.forEach((item) => {
          if (item.id === i) {
            item.selected = true;
            this.form2.theme_color = item.color
          } else {
            item.selected = false
          }
        })
      },
      handleAvatarSuccess1(res, file) {
        this.form1.load_img = file.response.data.file_url;
      },
      handleAvatarSuccess2(res, file) {
        console.log(file)
        this.form2.log_img = file.response.data.file_url;
      },

      beforeAvatarUpload(file) {
        const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpeg';

        const isLt5 = file.size < 512000;
        let img;

        if (isJPG || isPNG) {
          img = true
        } else {
          img = false;
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
        }
        if (!isLt5) {
          this.$message.error('上传头像图片大小不能超过 500kb!');
        }

        // setTimeout(() => {
        //   if (this.$refs.img.clientHeight > 350 || this.$refs.img.clientWidth > 350) {
        //     this.$message.error('图片尺寸不能超过350px!');
        //     this.form2.log_img = ''
        //   }
        // }, 400);

        return img && isLt5;

      },

      submit() {
        if (this.selectEdit === 1) {
          let params = {
            redirect: "x1.invoice.updateDecorate",
            id: this.$route.params.id,
            log_img: this.form2.log_img,
            // theme_color: this.form2.theme_color,
            theme_color: this.color,
            title: this.form3.title,
            content: this.form3.content,
            date: this.form3.date,
            prompt_type: 1
          };

          console.log(params);
          oneTwoApi(params).then((res) => {
            if (res.errcode === 0) {
              this.$alert('提交成功', '', {
                confirmButtonText: '返回',
                callback: action => {
                  this.$router.go(-1)
                }
              });
            }
          })
        } else {
          let params = {
            redirect: "x1.invoice.updateDecorate",
            id: this.$route.params.id,
            log_img: this.form2.log_img,
            theme_color: this.color,
            prompt_content: this.form3.prompt_content,
            prompt_type: 2
          };
          oneTwoApi(params).then((res) => {
            if (res.errcode === 0) {
              this.$alert('提交成功', '', {
                confirmButtonText: '返回',
                callback: action => {
                  this.$router.go(-1)
                }
              });
            }
          })
        }
      },
      reset() {
        this.colorList.forEach((item) => {
          item.selected = false
        });

        this.color = '#3F9CCF';
        this.form2 = {
          log_img: '',
          theme_color: ''
        };
        this.form3 = {
          prompt_type: 1,
          content: '',
          title: '',
          date: '',
          prompt_content: 'http://',
        };

      }
    },
    created() {
      let params = {
        redirect: "x1.invoice.decorateInfo",
        id: this.$route.params.id
      };
      oneTwoApi(params).then((res) => {
        if (res.errcode === 0) {
          this.colorList.forEach((item)=>{
            if(item.color === res.data.theme_color){
              item.selected = true
            }
          });
          if(res.data.prompt_type === 1){
            this.selectEdit = 1;
            this.color = '#3F9CCF';
          }else {
            this.selectEdit = 2;
            this.color = '#3B6894';
          }

          if (res.data.theme_color == '' || res.data.theme_color == undefined){}else {this.color = res.data.theme_color;}


          this.form2.log_img = res.data.log_img;
          this.form2.theme_color = res.data.theme_color;
          this.form3.title = res.data.title;
          this.form3.content = res.data.content;
          this.form3.date = res.data.date;
          this.form3.prompt_type = res.data.prompt_type;
          this.form3.prompt_content = res.data.prompt_content?res.data.prompt_content:'http://';

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
  @border:1px solid #F3F3F3;
  .preview{
    width: 280px;
    .top{
      width: 100%;height: 47px;
      img{
      width: inherit
      }
    }
    .top_sub{
      height: 50px;position: relative;border-right: @border;border-left: @border;box-sizing: border-box;
      .img_1{
        width: 40px;height: 40px;border-radius: 40px;
      }
      .img_2{
        width: 30px;height: 30px;position: absolute;right: 5px;top: 10px;
      }
    }
    .body{
      box-shadow: inset 0 2px 1px 0 #ccc;border-bottom: @border;
      .title{
        height: 60px;font-size: 17px;
      }
      .content{
        margin:0 20px 20px 20px ;
        .content_top{
          border-bottom: @border;border-left: @border;border-right: @border;
          .text_1{
            padding: 10px;border-bottom: @border
          }
          .text_2{
            padding: 10px
          }
        }
        .middle{
          height: 40px
        }
        .context{
          width: inherit;border:@border;
          .context_top{
            height: 40px;border-bottom:@border;
            .left{
              margin: 6px;
            }
            .right{
              margin: 6px;border: @border;
            }
            .m_l{
              margin-left: 6px
            }
          }
        }

      }
    }
  }

    .color{
      color:#ACACAC
    }
  .title{
    position: absolute;
    top: 123px;
    text-align: center;
    left: 14px;
    width: 250px;
    font-size: 23px;
    overflow: hidden;
  }
  .textarea{
    position: absolute;
    left: 14px;
    top: 150px;
    width: 250px;
    height: 200px;
    border: none;
  }
  .date{
    position: absolute;
    bottom: 123px;
    text-align: right;
    left: 14px;
    width: 245px;
    font-size: 16px;
    overflow: hidden;
  }
</style>
