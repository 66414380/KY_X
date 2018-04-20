<template>
  <div >

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">

        <div>
          <el-button size="small" @click="add('新增方案')" >新增方案</el-button>
          <el-button size="small"  >批量删除</el-button>
          <el-button size="small" >批量开启/关闭</el-button>
        </div>

        <div class="flex_a">
          <div class="margin_r_10">
            <el-input size="small" v-model="sgroupname" placeholder="请输入方案名称"></el-input>
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
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="方案名称" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="编码" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="状态" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" min-width="100" label="查看门店">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" min-width="140" label="方案起止时间">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" min-width="140" label="优惠券名称">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" min-width="160" label="方案过期倒计时">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" min-width="160" label="方案过期提醒状态">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="280">
            <template slot-scope="scope">
              <el-button size="small" type="text" style="color:green;" @click="optionShow('查看',scope.row.id)">修改</el-button>
              <el-button size="small" type="text" style="color:blue;" @click="optionShow('查看',scope.row.id)">查看</el-button>
              <el-button size="small" type="text" style="color:red;" @click="del(scope.row.id)">删除</el-button>
              <el-button size="small" type="text" style="color:burlywood;" @click="activeDown()">方案下发</el-button>
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
      <el-form ref="formRules" :model="formEdit" label-width="140px" v-if="showFormSwitch">


        <el-form-item label="方案名称:" prop="name" :rules="{required: true, message: '请输入方案名称', trigger: 'blur'}">
          <el-input class="input_width" v-model="formEdit.name" placeholder="请输入方案名称"></el-input>
        </el-form-item>

        <el-form-item label="方案编码:" v-if="showName !== '新增方案'">
          <el-input v-model="formEdit.id" placeholder="" disabled></el-input>
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

        <el-form-item label="状态:" >
          <el-switch
            v-model="formEdit.status"
            on-color="#13ce66"
            off-color="#ff4949">
          </el-switch>
        </el-form-item>

        <el-form-item label="方案起止时间:" >
          <div class="flex_r">
          <el-date-picker
            style="width:150px"
            v-model="formEdit.startTime"
            type="datetime"
            placeholder="选择开始时间">
          </el-date-picker>
          <div class="m-rank">
            <div class="m-rank-child"></div>
          </div>
          <el-date-picker
            style="width:150px"
            v-model="formEdit.endTime"
            type="datetime"
            placeholder="选择结束时间">
          </el-date-picker>
          </div>

        </el-form-item>


        <el-form-item label="方案过期提醒设置:" >

          <div class="flex_r">
            <div>
              <span>提醒</span>
              <el-switch
                v-model="formEdit.status1"
                on-text=""
                off-text=""
                on-color="#13ce66"
                off-color="#ff4949">
              </el-switch>
            </div>

            <div v-if="formEdit.status1 === true">
              <div class="margin_l_10 ">
                <span>过期前</span>
                <input type="text" class="form_input">
                <span>小时提醒（发送模板消息）</span>
              </div>

              <div class="margin_l_10 ">
                <el-radio class="radio" v-model="formEdit.radio" :label="0">{{radioName}}</el-radio><span>提醒一次</span>
              </div>
              <div class="margin_l_10 ">
                <el-radio class="radio" v-model="formEdit.radio" :label="1">{{radioName}}</el-radio><span>提醒2次/间隔</span><input type="text" class="form_input"><span>小时</span>
              </div>
              <div class="margin_l_10 ">
                <el-radio class="radio" v-model="formEdit.radio" :label="2">{{radioName}}</el-radio><span>提醒3次/间隔</span><input type="text" class="form_input"><span>小时</span>
              </div>
            </div>

          </div>
        </el-form-item>

        <el-form-item label="模板消息设置:" >

          <div class="margin_b_10">
            <span class="form_width">过期时间</span>
            <el-switch
              v-model="formEdit.status2"
              on-text=""
              off-text=""
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
          </div>
          <div class="margin_b_10">
            <span class="form_width">购买成功提醒</span>
            <el-switch
              v-model="formEdit.status3"
              on-text=""
              off-text=""
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
          </div>
          <div class="margin_b_10">
            <span class="form_width">赠送成功提醒</span>
            <el-switch
              v-model="formEdit.status4"
              on-text=""
              off-text=""
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
          </div>
          <div class="margin_b_10">
            <span class="form_width">退款中提醒</span>
            <el-switch
              v-model="formEdit.status5"
              on-text=""
              off-text=""
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
          </div>
          <div class="margin_b_10">
            <span class="form_width">退款完成提醒</span>
            <el-switch
              v-model="formEdit.status6"
              on-text=""
              off-text=""
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
          </div>

        </el-form-item>


      </el-form>

      <div  v-else>

        <div class="flex_a margin_b_10">
          <span class="form1_width margin_r_10" >活动卡券编码:</span>
          <el-input class="input_width" v-model="formEdit1.codeName" placeholder="请输入编码"></el-input>
        </div>

        <div class="flex_a margin_b_10">
          <span class="form1_width margin_r_10" >活动卡券编码:</span>
          <el-input class="input_width" v-model="formEdit1.codeName1" placeholder="请输入编码"></el-input>
        </div>

        <div class="flex_r margin_b_10">
          <div class="form2_width margin_r_10" >
            <div>
              <div class="t_a" >设置领取规则</div>
              <div class="t_a">（可选择多个）</div>
            </div>

          </div>
          <div>
            <el-checkbox-group v-model="formEdit1.checkList">
              <div class="margin_b_10">
                <el-checkbox label="0">每XX小时限领一次</el-checkbox>
              </div>
             <div class="margin_b_10">
               <el-checkbox label="1">每人限领X次</el-checkbox>
             </div>
             <div class="margin_b_10">
               <el-checkbox label="2">每次限领X张</el-checkbox>
             </div>


            </el-checkbox-group>
          </div>
        </div>

        <div class="flex_r margin_b_10">
          <div class="form2_width margin_r_10" >
            <div>
              <div class="t_a">设置领取形式</div>
              <div class="t_a">（只能选择一个）</div>
            </div>

          </div>
          <div>
            <el-radio-group v-model="formEdit1.radio">
              <div class="margin_b_10">
                <el-radio label="0">直接领取</el-radio>
              </div>
              <div class="margin_b_10">
                <el-radio label="1">答题后领取</el-radio>
              </div>
            </el-radio-group>
          </div>
        </div>


        <el-card class="box_header">
          <div slot="header" class="">
            <span >答题设置</span>
          </div>
          <div class="flex_sa">
            <div class="button flex pointer" @click="buttonClick(1)" :style="{'background-color':(buttonInt === 1)?'#E8EEF5':''}">答题首页</div>
            <div class="button flex pointer" @click="buttonClick(2)" :style="{'background-color':(buttonInt === 2)?'#E8EEF5':''}">答题须知</div>
            <div class="flex_a">
              <div class="button flex pointer" @click="buttonClick(3)" :style="{'background-color':(buttonInt === 3)?'#E8EEF5':''}">题目</div>

              <el-popover
                ref="popover"
                placement="bottom"
                width="400"
                trigger="click">
                <div class="pop_top flex">
                  选择类型页
                </div>



              </el-popover>
              <div class="m-storeCode margin_l_10" v-popover:popover>
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </div>
            </div>
            <div class="button flex pointer" @click="buttonClick(4)" :style="{'background-color':(buttonInt === 4)?'#E8EEF5':''}">领取界面</div>
            <div class="button flex pointer" @click="buttonClick(5)" :style="{'background-color':(buttonInt === 5)?'#E8EEF5':''}">分享页面</div>
          </div>


          <div class="flex_r" v-if="buttonInt === 1">
            <div class="margin_t_10 margin_r_10">
              <div class="t_a">效果图</div>
              <div class="big_image ">

                <img  src="">
              </div>
            </div>

            <div class="flex_r f_f">
              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_1" :src="formEdit1.imgurl_1" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题须知按钮</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_2" :src="formEdit1.imgurl_2" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">背景图</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_3" :src="formEdit1.imgurl_3" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">开始答题按钮</div>
              </div>
            </div>
          </div>

          <div class="flex_r" v-if="buttonInt === 2">
            <div class="margin_t_10 margin_r_10">
              <div class="t_a">效果图</div>
              <div class="big_image ">

                <img  src="">
              </div>
            </div>

            <div class="flex_r f_f">
              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_1" :src="formEdit1.imgurl_1" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题须知框</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_2" :src="formEdit1.imgurl_2" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题须知详情</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_3" :src="formEdit1.imgurl_3" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题须知按钮</div>
              </div>
            </div>
          </div>

          <div class="flex_r" v-if="buttonInt === 3">
            <div class="margin_t_10 margin_r_10">
              <div class="t_a">效果图</div>
              <div class="big_image ">

                <img  src="">
              </div>
            </div>

            <div class="flex_r f_f">
              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_1" :src="formEdit1.imgurl_1" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题元素1</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_2" :src="formEdit1.imgurl_2" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题元素2</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_3" :src="formEdit1.imgurl_3" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题元素3</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_4" :src="formEdit1.imgurl_4" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题元素4</div>
              </div>
            </div>
          </div>

          <div class="flex_r" v-if="buttonInt === 4">
            <div class="margin_t_10 margin_r_10">
              <div class="t_a">效果图</div>
              <div class="big_image ">

                <img  src="">
              </div>
            </div>

            <div class="flex_r f_f">
              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_1" :src="formEdit1.imgurl_1" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题完成</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_2" :src="formEdit1.imgurl_2" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题须知详情</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_3" :src="formEdit1.imgurl_3" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题须知按钮</div>
              </div>
            </div>
          </div>

          <div class="flex_r" v-if="buttonInt === 5">
            <div class="margin_t_10 margin_r_10">
              <div class="t_a">效果图</div>
              <div class="big_image ">

                <img  src="">
              </div>
            </div>

            <div class="flex_r f_f">
              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_1" :src="formEdit1.imgurl_1" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题元素1</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_2" :src="formEdit1.imgurl_2" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题元素2</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_3" :src="formEdit1.imgurl_3" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题元素3</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formEdit1.imgurl_4" :src="formEdit1.imgurl_4" class="small_image">
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题元素4</div>
              </div>
            </div>
          </div>

        </el-card>

      </div>
      <div class="margin_t_10">
        <el-button type="primary" @click="submitFrom('formRules')" v-if="!showFormSwitch">方案下发</el-button>
        <el-button type="success" @click="submitFrom('formRules')" v-if="!showFormSwitch">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="success" @click="next()" v-if="showFormSwitch">下一步</el-button>
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

  export default {
    components: {},
    computed: {
      ...mapGetters([
        'getTreeArr', 'getBodyHeight'
      ]),
    },
    data() {
      return {
        buttonInt:1,
        showFormSwitch:true,
        radioName:'',
        levelName: '',
        dialogFormVisible: false,
        showName: '',
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "方案管理", url: ''},{name: "方案列表", url: ''}],

        sgroupname: '',
        storeName: '',
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        formEdit: {
          name: '',
          morecodes: [
            {code1: '', code2: ''}
          ],
          status: true,
          startTime:'',
          endTime:'',
          status1:false,
          status2:false,
          status3:false,
          status4:false,
          status5:false,
          status6:false,
          radio:''
        },

        formEdit1: {
          codeName:'',
          codeName1:'',
          checkList:[],
          radio:'',
          imgurl_1:'',
          imgurl_2:'',
          imgurl_3:'',
          imgurl_4:''
        },
        showAdd: '',
        storeData: [],
        storeDataShow: []
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setActivitySettingTree', 'setActivitySettingLevelId']),
      ...mapGetters(['getActivitySettingTree', 'getActivitySettingLevelId']),
      next(){
        this.showFormSwitch = false
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
        this.dialogFormVisible = true
      },
      open() {

      },

      close(){
        this.showFormSwitch = true
      },


      openDialog() {
        this.dialogFormVisible = true;
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
                levelid: this.getActivitySettingLevelId(),
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
                levelid: this.getActivitySettingLevelId(),
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
            levelid: this.getActivitySettingLevelId(),
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
          levelid: this.getActivitySettingLevelId(),
          id: id,
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.storeDataShow = res.data[0].stores
          }
        })
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
            this.showResouce(this.p, this.sgroupname);
            recur(res.data.data, true, this.getActivitySettingLevelId(), this)
          }
        });
      },

      showResouce(p, sgroupname = '') {
        let params = {
          redirect: "x2a.sgroup.index",
          levelid: this.getActivitySettingLevelId(),
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

      handleAvatarSuccess1(res, file) {
        this.formEdit1.img1 = file.response.data.file_url;
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
          this.$message.error('上传图片只能是 JPG,PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return img && isLt5M;
      },

      buttonClick(int){
        this.buttonInt = int
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

<style scoped>
  .form_input{
    width: 20px;
    height: 20px;
    border-bottom: 1px solid #B2BFD0;
    border-top:none;
    border-left:none;
    border-right:none;
    outline:none;
  }
  .form_width{
    width: 120px;
    display: inline-block;
  }

  .form1_width{
    width: 140px;
    text-align: right;
  }
  .form2_width{
    width: 140px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }

  .input_width{
    width: 340px;
  }
  .t_a{
    text-align: center;
  }

  .button{
    border: 1px solid #B2BFD0;
    border-radius: 4px;
    width: 75px;
    height: 35px;
  }
  .big_image{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    width: 200px;
    height: 270px;
  }

  .small_image{
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 100px;

  }

  .pop_top{
    width: 100%;
    height: 40px;
    background-color: #E9EFF5;
  }

</style>
