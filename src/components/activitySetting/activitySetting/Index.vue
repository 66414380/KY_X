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
    <!--题目列表-->
    <el-dialog :visible.sync="visiblePopList" title="选择类型页" size="tiny">
      <div class="flex_a margin_t_10" v-for="(item,index) in formEdit1.subject">

        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 0">题目一</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 1">题目二</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 2">题目三</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 3">题目四</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 4">题目五</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 5">题目六</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 6">题目七</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 7">题目八</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 8">题目九</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 9">题目十</div>

        <div class="button flex margin_l_10" :style="{'background-color':(item.subject_type === 1)?'#E8EEF5':''}">填空题</div>
        <div class="button flex margin_l_10" :style="{'background-color':(item.subject_type === 2 || item.subject_type === 3)?'#E8EEF5':''}">选择题</div>

        <div class="flex_a margin_r_10" style="width: 72px">
          <div  class="m-storeCode margin_l_10"
                @click.prevent="removeSubjectList(index)">
            <i class="fa fa-minus-circle" aria-hidden="true" style="color: red"></i>
          </div>
          <div class="m-storeCode margin_l_10">
            <i class="fa fa-plus-circle" aria-hidden="true" style="color: green" v-if="formEdit1.subject.length === index + 1" @click="popAddSubject('增加题目')"></i>
          </div>
        </div>

        <el-button size="small" class="margin_l_10" type="text" @click="showOneSubject(item,index)">查看</el-button>

      </div>
    </el-dialog>

    <!--增加题目-->
    <el-dialog :title="subjectTitle" :visible.sync="visiblePop" size="tiny">
      <div class="margin_b_10">

      </div>
      <div class="pop_top ">
        <div class="pop_cell">
          <el-radio v-model="subjectAddList.subject_type" :label="1"><span class="pop_box">填空题</span></el-radio>
        </div>
      </div>

      <div class="pop_top ">
        <div class="pop_cell">
          <el-radio v-model="subjectAddList.subject_type" :label="2"><span class="pop_box">单选题</span></el-radio>

          <span class="pop_box"> 设置<input type="number" min="2" max="9" class="form_input" v-model.number="subjectAddList.single_election" @change="changNumber(subjectAddList)">选一</span>
        </div>
      </div>

      <div class="pop_top ">
        <div class="pop_cell">
          <el-radio v-model="subjectAddList.subject_type" :label="3"><span class="pop_box">多选题</span></el-radio>

          <span class="pop_box"> 设置<input type="number" min="2" max="9" class="form_input" v-model.number="subjectAddList.multi_selection" @change="changNumberMult(subjectAddList)">
            选<input type="number" min="1" max="8" class="form_input" v-model.number="subjectAddList.select_num" @change="changNumberMult1(subjectAddList)"></span>
        </div>
      </div>
      <div class="flex">
        <el-button size="small" class="margin_l_10" style="color: red;border-color: red;" @click="subjectOff()">取消</el-button>
        <el-button size="small" class="margin_l_10" style="color: #34D066;border-color: #34D066;" @click="subjectAdd()">确定</el-button>
      </div>
    </el-dialog>

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
                <el-radio v-model="formEdit.radio" :label="0">{{radioName}}</el-radio><span>提醒一次</span>
              </div>
              <div class="margin_l_10 ">
                <el-radio v-model="formEdit.radio" :label="1">{{radioName}}</el-radio><span>提醒2次/间隔</span><input type="text" class="form_input"><span>小时</span>
              </div>
              <div class="margin_l_10 ">
                <el-radio v-model="formEdit.radio" :label="2">{{radioName}}</el-radio><span>提醒3次/间隔</span><input type="text" class="form_input"><span>小时</span>
              </div>
            </div>

          </div>
        </el-form-item>

        <el-form-item label="专属访问信息:" >
          <div class="flex_r">
            <div>
              <div class="flex_a">
              <span style="width: 120px">首页网址</span> <el-input v-model="formEdit.url" placeholder="" size="small"></el-input>
              </div>
              <div class="flex_a">
                <span style="width: 120px">appID</span> <el-input v-model="formEdit.appId" placeholder="" size="small"></el-input>
              </div>
              <div class="flex_a">
                <span style="width: 120px">小程序路径</span> <el-input v-model="formEdit.path" placeholder="" size="small"></el-input>
              </div>
            </div>

            <div class="margin_l_10 flex_sc">
              <span class="margin_r_10" style="width: 110px;text-align: right">小程序码</span>
              <el-upload
                class="avatar-uploader margin_r_10"
                :action="$updateUrl"
                name='filename'
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
                :before-upload="beforeAvatarUpload">
                <img v-if="formEdit1.imgurl_1" :src="formEdit1.imgurl_appId" class="small_image">
                <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
              </el-upload>

              <div class="flex_f flex_sb" style="height: 100px">
                  <div class="flex_a">
                    <el-input v-model="formEdit.url" placeholder="" size="small"></el-input>
                    <el-button size="small" class="margin_l_10" style="color: #34D066;border-color: #34D066;" >确定</el-button>
                  </div>
                <a class="width_100" :href="formEdit.businessImg" :download="formEdit.businessImg">
                  <el-button size="small" class="width_100" style="color: #20a0ff;border-color: #20a0ff;" >下载</el-button>

                </a>


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
          <span class="form1_width margin_r_10" >活动卡面编码:</span>
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
                <el-checkbox label="0">{{radioName}}</el-checkbox><span>每<input type="text" class="form_input">小时限领一次</span>
              </div>
             <div class="margin_b_10">
               <el-checkbox label="1">{{radioName}}</el-checkbox><span>每人限领<input type="text" class="form_input">次</span>
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


              <div class="m-storeCode margin_l_10" @click="popAddSubject('增加题目')" v-if="formEdit1.subject.length === 0">
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

                <img class="width_100 height_100" v-if="formEdit1.imgurl_1_2" :src="formEdit1.imgurl_1_2">
                <img class="imgurl_1_1"  v-if="formEdit1.imgurl_1_1" :src="formEdit1.imgurl_1_1">
                <img class="imgurl_1_3" v-if="formEdit1.imgurl_1_3" :src="formEdit1.imgurl_1_3">
              </div>
            </div>

            <div class="flex_r f_f">
              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_1_1"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_1_1" class="small_image flex">
                    <img :src="formEdit1.imgurl_1_1" class="width_100">
                  </div>
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
                  :on-success="handleAvatarSuccess_1_2"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_1_2" class="small_image flex">
                    <img :src="formEdit1.imgurl_1_2" class="height_100">
                  </div>
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
                  :on-success="handleAvatarSuccess_1_3"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_1_3" class="small_image flex">
                    <img :src="formEdit1.imgurl_1_3" class="width_100">
                  </div>
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
                <div class="width_100 height_100 flex" v-if="formEdit1.imgurl_2_1" style="background-color: rgba(0,0,0,0.8)">
                  <img :src="formEdit1.imgurl_2_1" style="width: 85%">
                </div>
                <img class="imgurl_1_1"  v-if="formEdit1.imgurl_2_2" :src="formEdit1.imgurl_2_2">
                <img class="imgurl_2_3" v-if="formEdit1.imgurl_2_3" :src="formEdit1.imgurl_2_3">
              </div>
            </div>

            <div class="flex_r f_f">
              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_2_1"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_2_1" class="small_image flex">
                    <img :src="formEdit1.imgurl_2_1" class="height_100">
                  </div>
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
                  :on-success="handleAvatarSuccess_2_2"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_2_2" class="small_image flex">
                    <img :src="formEdit1.imgurl_2_2" class="width_100">
                  </div>
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
                  :on-success="handleAvatarSuccess_2_3"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_2_3" class="small_image flex">
                    <img :src="formEdit1.imgurl_2_3" class="width_100">
                  </div>
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">答题须知按钮</div>
              </div>
            </div>
          </div>

          <div v-if="buttonInt === 3">

            <div v-for="(item,index) in formEdit1.subject">

              <div class="flex_r" v-if="index === subjectIndex">
                <div class="margin_t_10 margin_r_10">
                  <div class="t_a">效果图</div>
                  <div class="big_image ">
                    <img class="width_100 height_100" v-if="item.subject_background_url" :src="item.subject_background_url">
                    <!--问题-->
                    <img :class="[item.subject_type === 1?'imgurl_issue1':'imgurl_issue']"  v-if="item.subject_problem" :src="item.subject_problem">
                    <!--按钮-->
                    <img class="imgurl_3_2_2s1" v-if="item.subject_button" :src="item.subject_button">



                    <div v-if="item.option.length === 2 && item.subject_type !== 1" class="subject_center flex_a">
                        <img class=" height_100" style="width: 50%" v-if="item.option[0].img" :src="item.option[0].img">
                        <img class=" height_100" style="width: 50%" v-if="item.option[1].img" :src="item.option[1].img">

                      </div>
                    <div v-if="item.option.length === 3 && item.subject_type !== 1" class="subject_center flex_a">
                      <img class="height_100" style="width: 33.33%" v-if="item.option[0].img" :src="item.option[0].img">
                      <img class="height_100" style="width: 33.33%" v-if="item.option[1].img" :src="item.option[1].img">
                      <img class="height_100" style="width: 33.33%" v-if="item.option[2].img" :src="item.option[2].img">
                    </div>
                    <div v-if="item.option.length === 4 && item.subject_type !== 1" class="subject_center flex_f">
                      <div style="height: 50%" class="width_100 flex_a">
                        <div style="width: 50%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[0].img" :src="item.option[0].img">
                        </div>
                        <div style="width: 50%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[1].img" :src="item.option[1].img">
                        </div>
                      </div>

                      <div style="height: 50%" class="width_100 flex_a">
                        <div style="width: 50%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[2].img" :src="item.option[2].img">
                        </div>
                        <div style="width: 50%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[3].img" :src="item.option[3].img">
                        </div>
                      </div>
                    </div>
                    <div v-if="item.option.length > 4 && item.subject_type !== 1" class="subject_center flex_f">
                      <div style="height: 33.33%" class="width_100 flex_a">
                        <div style="width: 33.33%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[0].img" :src="item.option[0].img">
                        </div>
                        <div style="width: 33.33%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[1].img" :src="item.option[1].img">
                        </div>
                        <div style="width: 33.33%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[2].img" :src="item.option[2].img">
                        </div>
                      </div>

                      <div style="height: 33.33%" class="width_100 flex_a">
                        <div style="width: 33.33%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[3].img" :src="item.option[3].img">
                        </div>
                        <div style="width: 33.33%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[4].img" :src="item.option[4].img">
                        </div>
                        <div style="width: 33.33%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[5].img" :src="item.option[5].img">
                        </div>
                      </div>

                      <div style="height: 33.33%" class="width_100 flex_a">
                        <div style="width: 33.33%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[6].img" :src="item.option[6].img">
                        </div>
                        <div style="width: 33.33%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[7].img" :src="item.option[7].img">
                        </div>
                        <div style="width: 33.33%" class="height_100">
                          <img class="height_100 width_100" v-if="item.option[8].img" :src="item.option[8].img">
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="flex_r f_f">
                  <div class="margin_t_10 margin_r_10">
                    <el-upload
                      class="avatar-uploader "
                      :action="$updateUrl"
                      name='filename'
                      :show-file-list="false"
                      :on-success="(res, file)=>{
                      return handleAvatarSuccess_background(res, file,item)
                      }"
                      :before-upload="beforeAvatarUpload">
                      <div v-if="item.subject_background_url" class="small_image flex">
                        <img :src="item.subject_background_url" class="height_100">
                      </div>
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
                      :on-success="(res, file)=>{
                      return handleAvatarSuccess_subject_problem(res, file,item)
                      }"
                      :before-upload="beforeAvatarUpload">
                      <div v-if="item.subject_problem" class="small_image flex">
                        <img :src="item.subject_problem" class="width_100">
                      </div>
                      <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                    </el-upload>
                    <div class="t_a">问题</div>
                  </div>

                  <div class="margin_t_10 margin_r_10">
                    <el-upload
                      class="avatar-uploader "
                      :action="$updateUrl"
                      name='filename'
                      :show-file-list="false"
                      :on-success="(res, file)=>{
                      return handleAvatarSuccess_subject_button(res, file,item)
                      }"
                      :before-upload="beforeAvatarUpload">
                      <div v-if="item.subject_button" class="small_image flex">
                        <img :src="item.subject_button" class="width_100">
                      </div>
                      <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                    </el-upload>
                    <div class="t_a">按钮</div>
                  </div>

                  <div v-if="item.subject_type !== 1" class="margin_t_10 margin_r_10" v-for="(item1,index1) in item.option">
                    <el-upload
                      class="avatar-uploader "
                      :action="$updateUrl"
                      name='filename'
                      :show-file-list="false"
                      :on-success="(res, file)=>{
                          return handleAvatarSuccess_option(res, file,item1)
                      }"
                      :before-upload="beforeAvatarUpload">
                      <div v-if="item1.img" class="small_image flex">
                        <img :src="item1.img" class="height_100">
                      </div>
                      <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                    </el-upload>
                    <div class="t_a">回答{{index1 + 1}}</div>
                  </div>


                </div>

                <div v-if="item.subject_type === 1" class="reg">
                  <div class="margin_b_10" style="text-align: center;font-size: 18px">规则说明</div>
                  <div class="margin_b_10"><span>1.最多输入<input type="number" class="form_input" v-model.number="item.subject_rule.max" @change="changeNumberMax(item)" />(33)个字</span></div>
                  <div class="margin_b_10"><span>2.最小输入<input type="number" class="form_input" v-model.number="item.subject_rule.min" @change="changeNumberMin(item)"/>(0-33)个字</span></div>
                  <div class="margin_b_10">3.不可全部为标点</div>
                  <div class="margin_b_10">4.不可全部为表情</div>
                </div>
              </div>

            </div>


          </div>

          <div class="flex_r" v-if="buttonInt === 4">
            <div class="margin_t_10 margin_r_10">
              <div class="t_a">效果图</div>
              <div class="big_image ">
                <img class="imgurl_4_1"  v-if="formEdit1.imgurl_4_1" :src="formEdit1.imgurl_4_1">
                <div class="width_100 height_100 flex" v-if="formEdit1.imgurl_4_2" style="background-color: rgba(0,0,0,0.8)">
                  <img :src="formEdit1.imgurl_4_2" style="width: 85%">
                </div>
                <img class="imgurl_4_3" v-if="formEdit1.imgurl_4_3" :src="formEdit1.imgurl_4_3">
              </div>
            </div>

            <div class="flex_r f_f">
              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_4_1"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_4_1" class="small_image flex">
                    <img :src="formEdit1.imgurl_4_1" class="width_100">
                  </div>
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">领取完成</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_4_2"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_4_2" class="small_image flex">
                    <img :src="formEdit1.imgurl_4_2" class="height_100">
                  </div>
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">领取详情</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_4_3"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_4_3" class="small_image flex">
                    <img :src="formEdit1.imgurl_4_3" class="width_100">
                  </div>
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">领取按钮</div>
              </div>
            </div>
          </div>

          <div class="flex_r" v-if="buttonInt === 5">
            <div class="margin_t_10 margin_r_10">
              <div class="t_a">效果图</div>
              <div class="big_image ">
                <img class="imgurl_5_1"  v-if="formEdit1.imgurl_5_1" :src="formEdit1.imgurl_5_1">
                <div class="width_100 height_100 flex" v-if="formEdit1.imgurl_5_2" style="background-color: rgba(0,0,0,0.8)">
                  <img :src="formEdit1.imgurl_5_2" style="width: 85%">
                </div>
                <img class="imgurl_5_3"  v-if="formEdit1.imgurl_5_3" :src="formEdit1.imgurl_5_3">
                <img class="imgurl_5_4" v-if="formEdit1.imgurl_5_4" :src="formEdit1.imgurl_5_4">
              </div>
            </div>

            <div class="flex_r f_f">
              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_5_1"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_5_1" class="small_image flex">
                    <img :src="formEdit1.imgurl_5_1" class="width_100">
                  </div>
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">分享元素1</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_5_2"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_5_2" class="small_image flex">
                    <img :src="formEdit1.imgurl_5_2" class="height_100">
                  </div>                       <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">分享元素2</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_5_3"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_5_3" class="small_image flex">
                    <img :src="formEdit1.imgurl_5_3" class="width_100">
                  </div>
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">分享元素3</div>
              </div>

              <div class="margin_t_10 margin_r_10">
                <el-upload
                  class="avatar-uploader "
                  :action="$updateUrl"
                  name='filename'
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_5_4"
                  :before-upload="beforeAvatarUpload">
                  <div v-if="formEdit1.imgurl_5_4" class="small_image flex">
                    <img :src="formEdit1.imgurl_5_4" class="width_100">
                  </div>
                  <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="t_a">分享元素4</div>
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
        num:'',
        subjectIndex:'',
        subjectTitle:'',
        visiblePop: false,
        visiblePopList: false,
        buttonInt:3,
        showFormSwitch:false,
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
          url:'',
          appId:'',
          path:'',
          imgurl_appId:'',
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
          imgurl_1_1:'',
          imgurl_1_2:'',
          imgurl_1_3:'',
          imgurl_2_1:'',
          imgurl_2_2:'',
          imgurl_2_3:'',
          imgurl_4_1:'',
          imgurl_4_2:'',
          imgurl_4_3:'',
          imgurl_5_1:'',
          imgurl_5_2:'',
          imgurl_5_3:'',
          imgurl_5_4:'',

          subject:[],

          radioSelect:''
        },

        subjectAddList:{ //增加题目
          subject_type:'',//1填空，2单选 ，3多选
          subject_problem:'',//问题url
          subject_button:'',//按钮url
          single_election:'',//__单选__
          subject_background_url:'',//背景图
          select_num:'',//选中数量
          option:[],//__图片数量（单选，多选)__
          multi_selection:'',//__多选 题目数__
          subject_rule:{max:'',min:''}
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
      changNumber(item){
        if(item.single_election > 9){
          this.$message.warning('输入超出范围');
          item.single_election = ''
        }
      },
      changNumberMult(item){
        if(item.multi_selection > 9){
          this.$message.warning('输入超出范围');
          item.multi_selection = ''
        }
      },
      changNumberMult1(item){
        if(item.select_num > 8){
          this.$message.warning('输入超出范围');
          item.select_num = ''
        }
      },
      changeNumberMax(item){
        if(item.subject_rule.max > 33){
          this.$message.warning('输入超出范围');
          item.subject_rule.max = ''
        }
        if(item.subject_rule.max !== '' && item.subject_rule.min !== ''){
          if(item.subject_rule.max <item.subject_rule.min){
            this.$message.warning('最大输入数不能小于最小输入数');
            item.subject_rule.max = '';
            item.subject_rule.min = ''
          }
        }
      },
      changeNumberMin(item){
        if(item.subject_rule.min <= 0 || item.subject_rule.min > 33 ){
          this.$message.warning('输入超出范围');
          item.subject_rule.min = ''
        }
        if(item.subject_rule.max !== '' && item.subject_rule.min !== ''){
          if(item.subject_rule.max <item.subject_rule.min){
            this.$message.warning('最大输入数不能小于最小输入数');
            item.subject_rule.max = '';
            item.subject_rule.min = ''
          }
        }
      },
      removeSubjectList(i){
        this.formEdit1.subject.splice(i,1)
      },
      editOneSubject(item,i,name){
        this.visiblePop = true;
        this.subjectIndex = i;
        this.subjectTitle = name;
        this.subjectAddList = item
      },
      popAddSubject(name){
        this.subjectTitle = name;
        this.visiblePop = true;
      },
      showOneSubject(item,i){
        this.subjectIndex = i;
        this.num = item.option.length


      },
      subjectOff(){
        this.visiblePop = false;
        this.subjectAddList = {
          subject_type:'',
          subject_problem:'',
          subject_button:'',
          single_election:'',
          select_num:'',
          subject_background_url:'',
          option:[],
          multi_selection:'',
          subject_rule:{max:'',min:''}
        }
      },
      subjectAdd(){
        if(this.subjectAddList.subject_type === ''){
          this.$message.warning('请选择题目类型');
          return
        }
        if(this.subjectAddList.subject_type === 2 && this.subjectAddList.single_election === '' ){
          this.$message.warning('请填写数量');
          return
        }
        if(this.subjectAddList.subject_type === 2 && this.subjectAddList.single_election <= 1 ){
          this.$message.warning('单选数量要大于2');
          return
        }

        if(this.subjectAddList.subject_type === 3 && (this.subjectAddList.multi_selection === '' || this.subjectAddList.select_num === '')){
          this.$message.warning('请填写数量');
          return
        }
        if(this.subjectAddList.subject_type === 3 && (this.subjectAddList.multi_selection <= this.subjectAddList.select_num )){
          this.$message.warning('填写总选择数不能小于选择数');
          return
        }

        let num = '',optionList = [];
        if(this.subjectAddList.subject_type === 2){
          num = this.subjectAddList.single_election
        }
        if(this.subjectAddList.subject_type === 3){
          num = this.subjectAddList.multi_selection
        }

        for(let i=0;i<num;i++){
          optionList.push({img:''})
        }

        if( this.subjectTitle === '增加题目'){

          this.formEdit1.subject.push({
            subject_type:this.subjectAddList.subject_type,
            single_election:this.subjectAddList.single_election,
            subject_problem:'',
            subject_button:'',
            subject_background_url:'',
            option:optionList,
            multi_selection:this.subjectAddList.multi_selection,
            select_num:this.subjectAddList.select_num,
            subject_rule:{max:'',min:''}
          });
        } else {
          this.formEdit1.subject.splice(this.subjectIndex,1,{
            subject_type:this.subjectAddList.subject_type,
            single_election:this.subjectAddList.single_election,
            subject_problem:this.subjectAddList.subject_problem,
            subject_button:this.subjectAddList.subject_button,
            subject_background_url:this.subjectAddList.subject_background_url,
            option:optionList,
            multi_selection:this.subjectAddList.multi_selection,
            select_num:this.subjectAddList.select_num,
            subject_rule:{max:this.subjectAddList.subject_rule.max,min:this.subjectAddList.subject_rule.min}
          })
        }
        this.visiblePop = false;
        this.subjectAddList = {
          subject_type:'',
          single_election:'',
          multi_selection:''
        }

      },
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
        this.formEdit1.imgurl_1 = file.response.data.file_url;
      },


      handleAvatarSuccess_background(res, file,item){
        item.subject_background_url = file.response.data.file_url;
      },
      handleAvatarSuccess_subject_problem(res, file,item){
        item.subject_problem = file.response.data.file_url;
      },
      handleAvatarSuccess_subject_button(res, file,item){
        item.subject_button = file.response.data.file_url;
      },
      handleAvatarSuccess_option(res, file,item){
        item.img = file.response.data.file_url;
      },

      handleAvatarSuccess_1_1(res, file) {
        this.formEdit1.imgurl_1_1 = file.response.data.file_url;
      },

      handleAvatarSuccess_1_2(res, file) {
        this.formEdit1.imgurl_1_2 = file.response.data.file_url;
      },

      handleAvatarSuccess_1_3(res, file) {
        this.formEdit1.imgurl_1_3 = file.response.data.file_url;
      },
      handleAvatarSuccess_2_1(res, file) {
        this.formEdit1.imgurl_2_1 = file.response.data.file_url;
      },
      handleAvatarSuccess_2_2(res, file) {
        this.formEdit1.imgurl_2_2 = file.response.data.file_url;
      },
      handleAvatarSuccess_2_3(res, file) {
        this.formEdit1.imgurl_2_3 = file.response.data.file_url;
      },

      handleAvatarSuccess_4_1(res, file) {
        this.formEdit1.imgurl_4_1 = file.response.data.file_url;
      },
      handleAvatarSuccess_4_2(res, file) {
        this.formEdit1.imgurl_4_2 = file.response.data.file_url;
      },
      handleAvatarSuccess_4_3(res, file) {
        this.formEdit1.imgurl_4_3 = file.response.data.file_url;
      },
      handleAvatarSuccess_5_1(res, file) {
        this.formEdit1.imgurl_5_1 = file.response.data.file_url;
      },
      handleAvatarSuccess_5_2(res, file) {
        this.formEdit1.imgurl_5_2 = file.response.data.file_url;
      },
      handleAvatarSuccess_5_3(res, file) {
        this.formEdit1.imgurl_5_3 = file.response.data.file_url;
      },
      handleAvatarSuccess_5_4(res, file) {
        this.formEdit1.imgurl_5_4 = file.response.data.file_url;
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
        this.buttonInt = int;
        if(int === 3){
          this.visiblePopList = true;
          console.log(this.formEdit1.subject)
        }
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
    width: 32px;
    height: 20px;
    border: 1px solid #B2BFD0;
    border-radius: 5px;
    outline: none;
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
    height: 325px;
    position: relative;
  }

  .small_image{
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 100px;

  }
  .pop_top0{
    width: 100%;
    height: 40px;
    background-color: #E9EFF5;
  }

  .pop_top{
    width: 100%;
    border-bottom: 1px solid #d9d9d9;
    margin-bottom: 20px;
  }
  .pop_cell{
    margin: 0 20px 6px 20px;
  }
  .pop_box{
    margin: 0 20px;
  }

  .imgurl_1_1{
    width: 43%;
    height: 9%;
    position: absolute;
    top: 8%;
    right: 6%;
  }

  .imgurl_1_3{
    width: 44%;
    height: 9%;
    position: absolute;
    bottom: 8%;
    right: 28%;
  }

  .imgurl_2_3{
    width: 44%;
    height: 9%;
    position: absolute;
    bottom: 22%;
    right: 28%;
  }

  .imgurl_4_1{
    width: 44%;
    height: 16%;
    position: absolute;
    top: 8%;
    right: 28%;
  }

  .imgurl_4_3{
    width: 44%;
    height: 9%;
    position: absolute;
    bottom: 15%;
    right: 28%;
  }
  .imgurl_5_1{
    width: 49%;
    height: 16%;
    position: absolute;
    top: 1%;
    right: 1%;
  }

  .imgurl_5_3{
    width: 40%;
    height: 9%;
    position: absolute;
    bottom: 5%;
    left: 10%;
  }
  .imgurl_5_4{
    width: 40%;
    height: 9%;
    position: absolute;
    bottom: 5%;
    right: 8%;
  }
  .imgurl_issue{
    width: 77%;
    height: 9%;
    position: absolute;
    top: 20%;
    left: 8%;
  }
  .imgurl_issue1{
    width: 77%;
    height: 13%;
    position: absolute;
    top: 19%;
    left: 12%;
  }
  .imgurl_3_2_2s1{
    width: 40%;
    height: 9%;
    position: absolute;
    bottom: 10%;
    left: 30%;
  }


  .subject_center{
    position: absolute;
    top: 31%;
    left: 13%;
    width: 74%;
    height: 44%;
  }
  .reg{
    width: 420px;height: 250px;border: 1px dashed #d9d9d9;border-radius: 5px;padding: 10px;
    margin: 10px;
  }

</style>
