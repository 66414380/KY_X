<style lang="less" scoped>
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

  .height_0 {
    height: 0;
  }

  .heightTran {
    overflow: hidden;
    transition: all .3s
  }

  .tree-node:hover {
    background: #e4e8f1;
  }

  .add {
    font-size: 5px;
    margin-left: 2px;
  }
</style>

<template>
  <div>
    <!--点击款易弹窗-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="formRules" :model="form" label-width="100px">
        <el-form-item label="名称:" prop="levelname" :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
          <el-input v-model="form.levelname" placeholder="请输入名称"></el-input>
        </el-form-item>

        <div v-for="(domain, index) in form.levelcodes" class="flex_r">
          <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.name" placeholder="请输入第三方名称"></el-input>
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
                    <el-input v-model="domain.providerid" placeholder="请输入第三方编码"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="flex_a" style="margin-bottom: 22px">
            <div class="m-storeCode margin_l_10" @click="addDomain()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(form.levelcodes.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <div>
          请上传以下证件（图片大小不要超过5M）
        </div>

        <div class="margin_t_10">
          <div>营业执照</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.business_src" :src="form.business_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>
            组织机构代码
          </div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.businesscode_src" :src="form.businesscode_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>开户许可证</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess3"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.account_src" :src="form.account_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>税务登记证</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess4"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.tax_src" :src="form.tax_src" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>法人证件正面照</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess5"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.legalman_1" :src="form.legalman_1" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <div>法人证件反面照</div>
          <el-upload
            class="avatar-uploader"
            :action="$updateUrl"
            name = 'filename'
            :show-file-list="false"
            :on-success="handleAvatarSuccess6"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.legalman_2" :src="form.legalman_2" class="avatar">
            <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
          </el-upload>
        </div>
        <div class="margin_t_10">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFrom('formRules')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--子部门-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible1"
      width="50%">
      <el-form ref="formRules" :model="form" label-width="100px">
        <el-form-item label="名称:" prop="levelname" :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
          <el-input v-model="form.levelname" placeholder="请输入内容"></el-input>
        </el-form-item>

        <div v-for="(domain, index) in form.levelcodes" class="flex_r">
          <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
            <div>
              <el-row>
                <el-col>
                  <div style="width:150px">
                    <el-input v-model="domain.name" placeholder="请输入第三方名称"></el-input>
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
                    <el-input v-model="domain.providerid" placeholder="请输入第三方编码"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <div class="flex_a" style="margin-bottom: 22px">
            <div class="m-storeCode margin_l_10" @click="addDomain()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div v-if="(form.levelcodes.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                 @click.prevent="removeDomain(domain)">
              <i class="fa fa-minus-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div class="margin_t_10">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="submitFrom('formRules')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>

    <div v-for='(item,index) in data' style="line-height: 36px;min-width: 200px">
      <div class="tree-node" :style="{'padding-left':  count *  20  + 'px','background':(item.selected)?'#edf7ff':''}">
        <!--<i @click.stop.self='item.show=!item.show' v-if='item.child && item.child.length != 0'-->
        <!--:style="{transform:(item.show)?'rotate(90deg)':'rotate(0deg)'}"-->
        <!--class="el-icon-caret-right pointer heightTran "></i>-->

        <span :style="{display:(item.child && item.child.length !== 0)?'none':'inline-block'}"
              style="vertical-align: middle;width: 25px"></span>
        <span @click.stop.self='item.show=!item.show' v-if='item.child && item.child.length !== 0'
              :style="{transform:(item.show)?'rotate(90deg)':'rotate(0deg)'}" style="margin-right: 8px;"
              class="el-tree-node__expand-icon"></span>

        <span @click.stop.self="test(item)" class="pointer el-tree-node__label">{{item.levelname}}</span>

        <i slot="reference" class="el-icon-plus pointer add" v-if="item.type === 1" @click="addBig(item,'新增大商户')"></i>

        <el-popover placement="right" width="200" trigger="click">
          <el-button size="mini" type="text" @click="addBig(item,'新增集团')" v-if="item.type === 2">新增集团</el-button>
          <el-button size="mini" type="text" @click="addBig(item,'新增品牌')" v-if="item.type === 3">新增品牌</el-button>
          <el-button size="mini" type="text" @click="addBig(item,'添加子部门')" v-if="item.type === 4">添加子部门</el-button>

          <el-button size="mini" type="text" @click="edit(item,'修改')">修改</el-button>

          <el-button size="mini" type="text" @click="del(item,'删除')">删除</el-button>
          <i slot="reference" class="el-icon-plus pointer add" v-if="item.type === 2 || item.type === 3 || item.type === 4 || item.type === 5"></i>
        </el-popover>

      </div>
      <transition
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
        v-on:enter-cancelled="enterCancelled"

        v-on:before-leave="beforeLeave"
        v-on:leave="leave"
        v-on:after-leave="afterLeave"
        v-on:leave-cancelled="leaveCancelled"
      >
        <trees :data='item.child' v-if="item.show" :count='count +1' class="heightTran"></trees>
      </transition>
    </div>
  </div>
</template>

<script>

  import Hub from '../../utility/commun'
  import getApi from './storeLibrary.service'
  let id = 1;
  export default {
    name: 'trees',
    props: ['data', 'count'],
    watch: {

    },

    data() {
      return {
        tree:null,
        title: '',
        myHeight: '',
        styleObject: {
          height: 0
        },
        isEdit: true,
        value: "",
        item: {},
        dialogVisible: false,
        dialogVisible1: false,
        options: [{
          value: 1,
          label: '民生银行'
        }, {
          value: 2,
          label: '易极付'
        }],
        form: {
          levelname: '',
          levelcodes: [
            {name: '', providerid: ''}
          ],
          business_src:'',
          business_src_url:'',
          businesscode_src:'',
          businesscode_src_url:'',
          account_src:'',
          account_src_url:'',
          tax_src:'',
          tax_src_url:'',
          legalman_1:'',
          legalman_1_url:'',
          legalman_2:'',
          legalman_2_url:'',

        },
        id:'',//组织id
        levelname:'',
      }
    },
    methods: {
      submitFrom(formRules) {
        this.$refs[formRules].validate((valid) => {
          if (valid) {
            this.form.id = this.id;
            if(this.title === '新增大商户' || this.title === '新增集团' || this.title === '新增品牌' || this.title === '添加子部门'){

              getApi.addLevel(this.form).then((res)=>{
                console.log(res)
                if(res.data.errcode === 0){
                  Hub.$emit('treeEventEditDel','Ok');
                }
              });
            }

            if(this.title === '修改'){
              getApi.updateLevel(this.form).then((res)=>{
                Hub.$emit('treeEventEditDel','Ok');
                if(res.data.errcode === 0){
                }
              });
            }
            this.dialogVisible = false
            this.dialogVisible1 = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      handleAvatarSuccess1(res, file) {
        this.form.business_src_url = file.response.data.file_url;
        this.form.business_src = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccess2(res, file) {
        this.form.businesscode_src_url = file.response.data.file_url;
        this.form.businesscode_src = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccess3(res, file) {
        this.form.account_src_url = file.response.data.file_url;
        this.form.account_src = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccess4(res, file) {
        this.form.tax_src_url = file.response.data.file_url;
        this.form.tax_src = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccess5(res, file) {
        this.form.legalman_1_url = file.response.data.file_url;
        this.form.legalman_1 = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccess6(res, file) {
        this.form.legalman_2_url = file.response.data.file_url;
        this.form.legalman_2 = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5;
        let img

        if(isJPG || isPNG){
           img = true
        }else {
          img = false;
          this.$message.error('上传证件图片只能是 JPG,PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传证件图片大小不能超过 5MB!');
        }
        return img && isLt5M;
      },

      addBig(item,title) {
        this.form= {
          levelname: '',
          levelcodes: [
            {name: '', providerid: ''}
          ],
          business_src:'',
          business_src_url:'',
          businesscode_src:'',
          businesscode_src_url:'',
          account_src:'',
          account_src_url:'',
          tax_src:'',
          tax_src_url:'',
          legalman_1:'',
          legalman_1_url:'',
          legalman_2:'',
          legalman_2_url:'',
        };

        this.id = item.id;
        this.title = title;
        if(item.type >3){
          this.dialogVisible1 = true
        } else {
          this.dialogVisible = true
        }
      },
      edit(item, name) {
        this.id = item.id;
        this.title = "修改";

        getApi.getOneLevel(item).then((res)=>{
          console.log(res)
          if(res.data.data.levelcodes.length === 0){
            res.data.data.levelcodes.push({name: '', providerid: ''})
          }
          this.form = res.data.data;

          if(item.type >3){
            this.dialogVisible1 = true
          }else {
            this.dialogVisible = true
          }

        })
      },
      del(item){
       let id = item.id;
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getApi.delLevel(id).then((res) => {
            console.log(res)

            if (res.data.errcode === 0) {
              Hub.$emit('treeEventEditDel','Ok');
              this.$message({
                type: 'info',
                message: '删除成功'
              });
            }

          })
        }).catch(() => {
          //
        });
      },

      test(item) {
        this.levelname = item.levelname;

        Hub.$emit('getBsList',{levelid:item.id,storename:item.levelname});
        if(item.type === 5 ||item.type === 4){
          Hub.$emit('showPermissionTree',{levelid:item.id,type:item.type,showAdd:true});
        }else {
          Hub.$emit('showPermissionTree',{levelid:item.id,type:item.type,showAdd:false});
        }
//        item.show = !item.show
      },
      removeDomain(item) {
        let index = this.form.levelcodes.indexOf(item)
        if (index !== -1) {
          this.form.levelcodes.splice(index, 1)
        }
      },
      addDomain() {
        this.form.levelcodes.push({name: '', providerid: ''});
      },


      beforeEnter: function (el) {
        el.style.height = '0';
      },
      enter: function (el) {
        if (el.scrollHeight !== 0) {
          el.style.height = el.scrollHeight + 'px';
        } else {
          el.style.height = '';
        }
      },
      afterEnter: function (el) {
        el.style.height = '';
      },
      enterCancelled: function (el) {

      },
      beforeLeave: function (el) {
        el.style.height = el.scrollHeight + 'px';
      },

      leave: function (el) {
        if (el.scrollHeight !== 0) {
          el.style.height = 0;
        }
      },
      afterLeave: function (el) {
        el.style.height = '';
      },

      leaveCancelled: function (el) {

      },
    },
    created() {

    },
    mounted() {
    },
    destroyed(){
    }
  }
</script>
