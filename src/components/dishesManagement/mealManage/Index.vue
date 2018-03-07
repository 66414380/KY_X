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
          <el-button size="small" @click="option('新增')">+新增套餐</el-button>

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
                           label="套餐编号" width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="dishesGroup"
                           label="套餐名称">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="bank" label="所属品牌">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="remarks" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                on-color="#13ce66"
                off-color="#ff4949">
              </el-switch>
            </template>
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
        <el-form-item label="图片:">
            <el-upload
              class="avatar-uploader margin_r_10"
              :action="$updateUrl"
              name='filename'
              :show-file-list="false"
              :on-success="(res, file,list)=>{
                  return handleAvatarSuccess1(res, file,list,scope.row)
                }"
              :before-upload="beforeAvatarUpload">
              <img v-if="formEdit.imgurl_1" :src="formEdit.imgurl_1" class="avatar">
              <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
            </el-upload>
        </el-form-item>

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
        <el-form-item label="所属品类:">
          <el-select v-model="formEdit.bank" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="套餐名称	:" prop="name" :rules="{required: true, message: '请输入套餐名称', trigger: 'blur'}">
          <el-input v-model="formEdit.name" placeholder="请输入套餐名称" :disabled="show"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格	:" >
          <el-input v-model="formEdit.price" placeholder="请输入套餐价格" :disabled="show"></el-input>
        </el-form-item>
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
        <el-form-item label="详情:" >
          <el-input type="textarea" v-model="formEdit.textarea" placeholder="请输入套餐价格" :disabled="show"></el-input>
        </el-form-item>

        <el-form-item label="选择菜品:" >
          <el-button type="primary" @click="addGroup()">添加分组</el-button>
        </el-form-item>

        <el-card v-for="(item, index) in formEdit.group" :key="item.name" class="margin_b_10">
          <div class="flex_r margin_b_10">
            <div class="flex_a flex_1">
              <div>
                分组名称：
              </div>
              <el-input v-model="item.name" placeholder="例：主食" :disabled="show" style="width: 170px"></el-input>
            </div>
            <div class="flex_a flex_1">
              <div>
                消费者可选数量：
              </div>
              <el-input v-model="item.number" placeholder="" :disabled="show" style="width: 50px"></el-input>
            </div>
            <i class="el-icon-delete2 flex_a pointer" style="font-size: 18px;" @click="delGroup(index)"></i>
          </div>

          <el-table :data="item.list" border style="width: 100%;">
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name"
                             label="菜品名称" ></el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="price"
                             label="金额" ></el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="number"
                             label="数量" >
              <template slot-scope="scope">
                <el-input v-model="scope.row.number" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column label-class-name="table_head" header-align="center" align="center" prop="select"
                             label="是否为必选" >
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.select"></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" >
              <template slot-scope="scope">
                <i class="el-icon-delete2 pointer" style="font-size: 18px;" @click="delItem(item)"></i>
              </template>
            </el-table-column>
          </el-table>

          <el-button type="primary" @click="addDishes()" class="margin_t_10">添加菜品</el-button>

        </el-card>

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
        navList: [{name: "菜品管理", url: ''}, {name: "套餐管理", url: ''}],

        storeName: '',
        storeData: [{
          dishesCode: '837893',
          dishesGroup: '大',
          status: false,
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
          price:'',
          bank:'',
          imgurl_1:'',
          textarea:'',
          thirdPartyCoding: [
            {code1: '11', code2: '22'}
          ],
          group:[
            {name:'',number:'',list:[{name:'',number:'',select:false}]}
            ]
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
      addGroup(){
        this.formEdit.group.push({name:'',number:'',list:[{name:'',number:'',price:'',selected:false}]});
      },
      delGroup(index){
        this.formEdit.group.splice(index, 1)
      },
      delItem(){

      },
      addDishes(){

      },
      beforeAvatarUpload(file) {
        const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5;
        let img;

        if (isJPG || isPNG) {
          img = true
        } else {
          img = false;
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return img && isLt5M;
      },
      handleAvatarSuccess1(res, file,list,item) {
        item.imgurl_1 = file.response.data.file_url;
      },


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
