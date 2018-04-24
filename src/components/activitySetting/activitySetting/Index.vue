<template>
  <div >

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">

        <div>
          <el-button size="small" @click="add('新增方案')" >新增方案</el-button>
          <el-button size="small"  @click="delSelected()">批量删除</el-button>
          <el-button size="small" @click="isSwitch()">批量开启/关闭</el-button>
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
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" label="方案名称" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="编码" min-width="100">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="status"  label="状态" min-width="100">
          </el-table-column>
          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" min-width="100" label="查看门店">-->
          <!--</el-table-column>-->
          <el-table-column label-class-name="table_head" header-align="center" align="center"  min-width="240" label="方案起止时间">
            <template slot-scope="scope">
              <div>起 {{scope.row.start_time}} </div>
              <div>截止 {{scope.row.end_time}} </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="card_name" min-width="140" label="优惠券名称">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" min-width="160" label="方案过期倒计时">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" min-width="160" label="方案过期提醒状态">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="280">
            <template slot-scope="scope">
              <el-button size="small" type="text" style="color:green;" @click="optionShow('修改方案',scope.row.id)">修改</el-button>
              <el-button size="small" type="text" style="color:blue;" @click="optionShow('查看方案',scope.row.id)">查看</el-button>
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
      <div class="flex_a margin_t_10" v-for="(item,index) in formEdit.subject_data">

        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 0" :style="{'background-color':(showSubjectIndex === 0)?'#E8EEF5':''}">题目一</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 1" :style="{'background-color':(showSubjectIndex === 1)?'#E8EEF5':''}">题目二</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 2" :style="{'background-color':(showSubjectIndex === 2)?'#E8EEF5':''}">题目三</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 3" :style="{'background-color':(showSubjectIndex === 3)?'#E8EEF5':''}">题目四</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 4" :style="{'background-color':(showSubjectIndex === 4)?'#E8EEF5':''}">题目五</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 5" :style="{'background-color':(showSubjectIndex === 5)?'#E8EEF5':''}">题目六</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 6" :style="{'background-color':(showSubjectIndex === 6)?'#E8EEF5':''}">题目七</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 7" :style="{'background-color':(showSubjectIndex === 7)?'#E8EEF5':''}">题目八</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 8" :style="{'background-color':(showSubjectIndex === 8)?'#E8EEF5':''}">题目九</div>
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')"  v-if="index === 9" :style="{'background-color':(showSubjectIndex === 9)?'#E8EEF5':''}">题目十</div>

        <div class="button flex margin_l_10" :style="{'background-color':(item.subject_type === 1)?'#E8EEF5':''}">填空题</div>
        <div class="button flex margin_l_10" :style="{'background-color':(item.subject_type === 2 || item.subject_type === 3)?'#E8EEF5':''}">选择题</div>

        <div class="flex_a margin_r_10" style="width: 72px">
          <div  class="m-storeCode margin_l_10"
                @click.prevent="removeSubjectList(index)">
            <i class="fa fa-minus-circle" aria-hidden="true" style="color: red"></i>
          </div>
          <div class="m-storeCode margin_l_10">
            <i class="fa fa-plus-circle" aria-hidden="true" style="color: green" v-if="formEdit.subject_data.length === index + 1" @click="popAddSubject('增加题目')"></i>
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


      <el-form ref="formRules" :model="formEdit" label-width="140px">

        <div v-if="showFormSwitch">
          <el-form-item label="方案名称:" prop="name" :rules="{required: true, message: '请输入方案名称', trigger: 'blur'}">
            <el-input class="input_width" :disabled="show" v-model="formEdit.name" placeholder="请输入方案名称"></el-input>
          </el-form-item>

          <el-form-item label="方案编码:" v-if="showName !== '新增方案'">
            <el-input v-model="formEdit.id" placeholder="" disabled></el-input>
          </el-form-item>

          <div v-for="(domain, index) in formEdit.third_code" class="flex_r">
            <el-form-item :label="index === 0?'第三方编码':''" :key="domain.key">
              <div>
                <el-row>
                  <el-col>
                    <div style="width:150px">
                      <el-input v-model="domain.code1" :disabled="show" placeholder="请输入第三方名称"></el-input>
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
                      <el-input v-model="domain.code2" :disabled="show" placeholder="请输入第三方编码"></el-input>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <div class="flex_sc">
              <div class="m-storeCode margin_l_10" @click="addDomain">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </div>
              <div v-if="(formEdit.third_code.length>1) && (index !== 0)" class="m-storeCode margin_l_10"
                   @click.prevent="removeDomain(index)">
                <i class="fa fa-minus-circle" aria-hidden="true"></i>
              </div>
            </div>
          </div>

          <el-form-item label="状态:" >
            <el-switch
              :disabled="show"
              v-model="formEdit.status"
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
          </el-form-item>

          <el-form-item label="方案起止时间:" >
            <div class="flex_r">
              <el-date-picker
                style="width:150px"
                :disabled="show"
                v-model="formEdit.start_time"
                type="datetime"
                placeholder="选择开始时间">
              </el-date-picker>
              <div class="m-rank">
                <div class="m-rank-child"></div>
              </div>
              <el-date-picker
                style="width:150px"
                :disabled="show"
                v-model="formEdit.end_time"
                type="datetime"
                placeholder="选择结束时间">
              </el-date-picker>
            </div>

          </el-form-item>


          <!--<el-form-item label="方案过期提醒设置:" >-->

            <!--<div class="flex_r">-->
              <!--<div>-->
                <!--<span>提醒</span>-->
                <!--<el-switch-->
                  <!--v-model="formEdit.status1"-->
                  <!--on-text=""-->
                  <!--off-text=""-->
                  <!--on-color="#13ce66"-->
                  <!--off-color="#ff4949">-->
                <!--</el-switch>-->
              <!--</div>-->

              <!--<div v-if="formEdit.status1 === true">-->
                <!--<div class="margin_l_10 ">-->
                  <!--<span>过期前</span>-->
                  <!--<input type="text" class="form_input">-->
                  <!--<span>小时提醒（发送模板消息）</span>-->
                <!--</div>-->

                <!--<div class="margin_l_10 ">-->
                  <!--<el-radio v-model="formEdit.radio" :label="0">{{radioName}}</el-radio><span>提醒一次</span>-->
                <!--</div>-->
                <!--<div class="margin_l_10 ">-->
                  <!--<el-radio v-model="formEdit.radio" :label="1">{{radioName}}</el-radio><span>提醒2次/间隔</span><input type="text" class="form_input"><span>小时</span>-->
                <!--</div>-->
                <!--<div class="margin_l_10 ">-->
                  <!--<el-radio v-model="formEdit.radio" :label="2">{{radioName}}</el-radio><span>提醒3次/间隔</span><input type="text" class="form_input"><span>小时</span>-->
                <!--</div>-->
              <!--</div>-->

            <!--</div>-->
          <!--</el-form-item>-->

          <el-form-item label="专属访问信息:" >
            <div class="flex_r">
              <div>
                <!--<div class="flex_a">-->
                  <!--<span style="width: 120px">首页网址</span> <el-input v-model="formEdit.url" placeholder="" size="small"></el-input>-->
                <!--</div>-->
                <div class="flex_a">
                  <span style="width: 120px">appID</span> <el-input :disabled="show" v-model="formEdit.appId" placeholder="" size="small"></el-input>
                </div>
                <div class="flex_a">
                  <span style="width: 120px">小程序路径</span> <el-input :disabled="show" v-model="formEdit.path" placeholder="" size="small"></el-input>
                </div>
              </div>

              <!--<div class="margin_l_10 flex_sc">-->
                <!--<span class="margin_r_10" style="width: 110px;text-align: right">小程序码</span>-->
                <!--<el-upload-->
                  <!--class="avatar-uploader margin_r_10"-->
                  <!--:action="$updateUrl"-->
                  <!--name='filename'-->
                  <!--:show-file-list="false"-->
                  <!--:on-success="handleAvatarSuccess1"-->
                  <!--:before-upload="beforeAvatarUpload">-->
                  <!--<img v-if="formEdit1.imgurl_1" :src="formEdit1.imgurl_appId" class="small_image">-->
                  <!--<div v-else class="small_image flex"><i class="el-icon-plus"></i></div>-->
                <!--</el-upload>-->

                <!--<div class="flex_f flex_sb" style="height: 100px">-->
                  <!--<div class="flex_a">-->
                    <!--<el-input v-model="formEdit.url" placeholder="" size="small"></el-input>-->
                    <!--<el-button size="small" class="margin_l_10" style="color: #34D066;border-color: #34D066;" >确定</el-button>-->
                  <!--</div>-->
                  <!--<a class="width_100" :href="formEdit.businessImg" :download="formEdit.businessImg">-->
                    <!--<el-button size="small" class="width_100" style="color: #20a0ff;border-color: #20a0ff;" >下载</el-button>-->

                  <!--</a>-->


                <!--</div>-->

              <!--</div>-->


            </div>

          </el-form-item>

          <!--<el-form-item label="模板消息设置:" >-->

            <!--<div class="margin_b_10">-->
              <!--<span class="form_width">过期时间</span>-->
              <!--<el-switch-->
                <!--v-model="formEdit.status2"-->
                <!--on-text=""-->
                <!--off-text=""-->
                <!--on-color="#13ce66"-->
                <!--off-color="#ff4949">-->
              <!--</el-switch>-->
            <!--</div>-->
            <!--<div class="margin_b_10">-->
              <!--<span class="form_width">购买成功提醒</span>-->
              <!--<el-switch-->
                <!--v-model="formEdit.status3"-->
                <!--on-text=""-->
                <!--off-text=""-->
                <!--on-color="#13ce66"-->
                <!--off-color="#ff4949">-->
              <!--</el-switch>-->
            <!--</div>-->
            <!--<div class="margin_b_10">-->
              <!--<span class="form_width">赠送成功提醒</span>-->
              <!--<el-switch-->
                <!--v-model="formEdit.status4"-->
                <!--on-text=""-->
                <!--off-text=""-->
                <!--on-color="#13ce66"-->
                <!--off-color="#ff4949">-->
              <!--</el-switch>-->
            <!--</div>-->
            <!--<div class="margin_b_10">-->
              <!--<span class="form_width">退款中提醒</span>-->
              <!--<el-switch-->
                <!--v-model="formEdit.status5"-->
                <!--on-text=""-->
                <!--off-text=""-->
                <!--on-color="#13ce66"-->
                <!--off-color="#ff4949">-->
              <!--</el-switch>-->
            <!--</div>-->
            <!--<div class="margin_b_10">-->
              <!--<span class="form_width">退款完成提醒</span>-->
              <!--<el-switch-->
                <!--v-model="formEdit.status6"-->
                <!--on-text=""-->
                <!--off-text=""-->
                <!--on-color="#13ce66"-->
                <!--off-color="#ff4949">-->
              <!--</el-switch>-->
            <!--</div>-->

          <!--</el-form-item>-->

        </div>

        <div  v-else>

          <div class="flex_a margin_b_10">
            <span class="form1_width margin_r_10" >活动卡券编码:</span>
            <el-input class="input_width" :disabled="show" v-model="formEdit.card_id" placeholder="请输入编码"></el-input>
          </div>

          <div class="flex_a margin_b_10">
            <span class="form1_width margin_r_10" >活动卡面编码:</span>
            <el-input class="input_width" :disabled="show" v-model="formEdit.material_id" placeholder="请输入编码"></el-input>
          </div>

          <div class="flex_r margin_b_10">
            <div class="form2_width margin_r_10" >
              <div>
                <div class="t_a" >设置领取规则</div>
                <div class="t_a">（空为不限制）</div>
              </div>

            </div>
            <div>
                <div class="margin_b_10">
                  <span>每<input type="text" v-model="formEdit.limit_house_num" class="form_input">小时限领一次</span>
                </div>
                <div class="margin_b_10">
                  <span>每人限领<input type="text" v-model="formEdit.limit_num" class="form_input">次</span>
                </div>
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
              <el-radio-group v-model="formEdit.type">
                <div class="margin_b_10">
                  <el-radio :disabled="show" :label="0">直接领取</el-radio>
                </div>
                <div class="margin_b_10">
                  <el-radio :disabled="show" :label="1">答题后领取</el-radio>
                </div>
              </el-radio-group>
            </div>
          </div>


          <el-card class="box_header" v-if="formEdit.type === 1">
            <div slot="header" class="">
              <span >答题设置</span>
            </div>
            <div class="flex_sa">
              <div class="button flex pointer" @click="buttonClick(1)" :style="{'background-color':(buttonInt === 1)?'#E8EEF5':''}">答题首页</div>
              <div class="button flex pointer" @click="buttonClick(2)" :style="{'background-color':(buttonInt === 2)?'#E8EEF5':''}">答题须知</div>
              <div class="flex_a">

                <div class="button flex pointer" @click="buttonClick(3)" :style="{'background-color':(buttonInt === 3)?'#E8EEF5':''}">题目</div>


                <div class="m-storeCode margin_l_10" @click="popAddSubject('增加题目')" v-if="formEdit.subject_data.length === 0">
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

                  <img class="width_100 height_100" v-if="formEdit.home_background_url" :src="formEdit.home_background_url">
                  <img class="imgurl_1_1"  v-if="formEdit.home_notes_url" :src="formEdit.home_notes_url">
                  <img class="imgurl_1_3" v-if="formEdit.home_start_url" :src="formEdit.home_start_url">
                </div>
              </div>

              <div class="flex_r f_f m_t_20">
                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_home_notes_url"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.home_notes_url" class="small_image flex">
                      <img :src="formEdit.home_notes_url" class="width_100">
                    </div>
                    <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">答题须知按钮</div>
                </div>

                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_home_background_url"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.home_background_url" class="small_image flex">
                      <img :src="formEdit.home_background_url" class="height_100">
                    </div>
                    <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">背景图</div>
                </div>

                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_home_start_url"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.home_start_url" class="small_image flex">
                      <img :src="formEdit.home_start_url" class="width_100">
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
                  <div class="width_100 height_100 flex" v-if="formEdit.notes_background_url" style="background-color: rgba(0,0,0,0.8)">
                    <img :src="formEdit.notes_background_url" style="width: 85%">
                  </div>
                  <img class="imgurl_1_1" v-if="formEdit.notes_info" :src="formEdit.notes_info">
                  <img class="imgurl_2_3" v-if="formEdit.notes_button" :src="formEdit.notes_button">
                </div>
              </div>

              <div class="flex_r f_f m_t_20">
                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_notes_background_url"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.notes_background_url" class="small_image flex">
                      <img :src="formEdit.notes_background_url" class="height_100">
                    </div>
                    <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">答题须知框</div>
                </div>

                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_notes_info"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.notes_info" class="small_image flex">
                      <img :src="formEdit.notes_info" class="width_100">
                    </div>
                    <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">答题须知详情</div>
                </div>

                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_notes_button"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.notes_button" class="small_image flex">
                      <img :src="formEdit.notes_button" class="width_100">
                    </div>
                    <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">答题须知按钮</div>
                </div>
              </div>
            </div>

            <div v-if="buttonInt === 3">

              <div v-for="(item,index) in formEdit.subject_data">

                <div class="flex_r" v-if="index === showSubjectIndex">
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
                  <div class="flex_r f_f m_t_20">
                    <div class="margin_t_10 margin_r_10">
                      <el-upload
                        :disabled="show"
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
                        :disabled="show"
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
                        :disabled="show"
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
                        :disabled="show"
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

                  <div v-if="item.subject_type === 1" class="reg flex_ec margin_t_10">
                    <div class="reg_box">
                      <div class="margin_b_10" style="text-align: center;font-size: 18px">规则说明</div>
                      <div class="margin_b_10"><span>1.最多输入<input type="number" class="form_input" v-model.number="item.subject_rule.max" @change="changeNumberMax(item)" />(33)个字</span></div>
                      <div class="margin_b_10"><span>2.最小输入<input type="number" class="form_input" v-model.number="item.subject_rule.min" @change="changeNumberMin(item)"/>(0-33)个字</span></div>
                      <div class="margin_b_10">3.不可全部为标点</div>
                      <div class="margin_b_10">4.不可全部为表情</div>
                    </div>

                  </div>
                </div>

              </div>


            </div>

            <div class="flex_r" v-if="buttonInt === 4">
              <div class="margin_t_10 margin_r_10">
                <div class="t_a">效果图</div>
                <div class="big_image ">
                  <img class="imgurl_4_1"  v-if="formEdit.receive_success_url" :src="formEdit.receive_success_url">
                  <div class="width_100 height_100 flex" v-if="formEdit.receive_info_url" style="background-color: rgba(0,0,0,0.8)">
                    <img :src="formEdit.receive_info_url" style="width: 85%">
                  </div>
                  <img class="imgurl_4_3" v-if="formEdit.share_button" :src="formEdit.share_button">
                </div>
              </div>

              <div class="flex_r f_f m_t_20">
                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_receive_success_url"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.receive_success_url" class="small_image flex">
                      <img :src="formEdit.receive_success_url" class="width_100">
                    </div>
                    <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">领取完成</div>
                </div>

                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_receive_info_url"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.receive_info_url" class="small_image flex">
                      <img :src="formEdit.receive_info_url" class="height_100">
                    </div>
                    <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">领取详情</div>
                </div>

                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_share_button"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.share_button" class="small_image flex">
                      <img :src="formEdit.share_button" class="width_100">
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
                  <img class="imgurl_5_1"  v-if="formEdit.element1" :src="formEdit.element1">
                  <div class="width_100 height_100 flex" v-if="formEdit.element2" style="background-color: rgba(0,0,0,0.8)">
                    <img :src="formEdit.element2" style="width: 85%">
                  </div>
                  <img class="imgurl_5_3"  v-if="formEdit.element3" :src="formEdit.element3">
                  <img class="imgurl_5_4" v-if="formEdit.element4" :src="formEdit.element4">
                </div>
              </div>

              <div class="flex_r f_f m_t_20">
                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_element1"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.element1" class="small_image flex">
                      <img :src="formEdit.element1" class="width_100">
                    </div>
                    <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">分享元素1</div>
                </div>

                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_element2"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.element2" class="small_image flex">
                      <img :src="formEdit.element2" class="height_100">
                    </div>                       <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">分享元素2</div>
                </div>

                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_element3"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.element3" class="small_image flex">
                      <img :src="formEdit.element3" class="width_100">
                    </div>
                    <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">分享元素3</div>
                </div>

                <div class="margin_t_10 margin_r_10">
                  <el-upload
                    :disabled="show"
                    class="avatar-uploader "
                    :action="$updateUrl"
                    name='filename'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess_element4"
                    :before-upload="beforeAvatarUpload">
                    <div v-if="formEdit.element4" class="small_image flex">
                      <img :src="formEdit.element4" class="width_100">
                    </div>
                    <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <div class="t_a">分享元素4</div>
                </div>
              </div>
            </div>

          </el-card>

        </div>


      </el-form>




      <div class="margin_t_10">
        <el-button type="primary" @click="submitFrom11('formRules')" v-if="!showFormSwitch">方案下发</el-button>
        <el-button type="success" @click="submitFrom()" v-if="!showFormSwitch" :disabled="show">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="success" @click="next()" v-if="showFormSwitch">下一步</el-button>
      </div>
    </el-dialog>


    <!--批量开启/关闭-->
    <el-dialog
      title="开启/关闭"
      :visible.sync="dialogVisible1"
      width="50%" size="tiny">
      <el-switch
        v-model="storeStatusValue"
        on-color="#13ce66"
        off-color="#ff4949">
      </el-switch>
      <div class="margin_t_10">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="changeStoresStatus()">确认</el-button>
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
  import getApi from './activitySetting.service'
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
        showSubjectIndex:'',
        subjectTitle:'',
        visiblePop: false,
        visiblePopList: false,
        buttonInt:1,
        showFormSwitch:true,
        radioName:'',
        levelName: '',
        dialogFormVisible: false,
        dialogVisible1:false,
        storeStatusValue:false,
        showName: '',
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "方案管理", url: ''},{name: "方案列表", url: ''}],
        show:false,
        sgroupname: '',
        storeName: '',
        tableData: [],
        p: {page: 1, size: 20, total: 0},
        formEdit: {
          name: '',//方案名称
          third_code: [
            {code1: '', code2: ''}
          ],
          status:true,//：关闭 1：开启
          start_time:'',//活动开始时间 时间戳
          end_time:'',//活动结束时间 时间戳
          type:0,//0：直接领取 1：答题后领取
          card_id:'',//卡券编号
          material_id:'',//卡面编号
          limit_house_num:'',//每x小时限制领取一次 不限制为空或0
          limit_num:'',//每人限领x次 不限制为空或0
          appId:'',//小程序APPID
          path:'',//小程序页面路径
          qrCode:'',//小程序二维码地址
          subject_data:[],

          home_notes_url:'',//首页须知图片
          home_background_url:'',//首页背景图
          home_start_url:'',//首页开始图片

          notes_background_url:'',//答题须知背景框
          notes_info:'',//答题须知详情
          notes_button:'',//答题须知按钮

          receive_success_url:'',//领取成功按钮
          receive_info_url:'',//领取成功详情
          share_button:'',//分享按钮

          element1:'',//分享元素1
          element2:'',//分享元素2
          element3:'',//分享元素3
          element4:'',//分享元素4
          url:'',

          imgurl_appId:'',


          status1:false,
          status2:false,
          status3:false,
          status4:false,
          status5:false,
          status6:false,
          radio:''
        },

        formEdit1: {



          imgurl_1:'',


          radioSelect:''
        },

        subjectAddList:{ //增加题目
          subject_type:'',//1填空，2单选 ，3多选
          subject_problem:'',//问题url
          subject_button:'',//按钮url
          single_election:'',//__单选__
          subject_background_url:'',//背景图
          select_num:'',//选中数量
          option:[],//图片数量（单选，多选)
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
      //批量状态设置
      changeStoresStatus() {
        let storeStatusValue,list = [];
        if (this.storeStatusValue) {
          storeStatusValue = 1
        } else {
          storeStatusValue = 0
        }
        this.tableData.forEach((item) => {
          if (item.select) {
            list.push(item.id)
          }
        });
        // getApi.storesStatus(list.join(','), storeStatusValue).then((res) => {
        //   if(res.data.errcode === 0){
        //     this.$message('操作成功');
        //     this.showResouce(this.p, this.getX1StoreLevelId());
        //     this.dialogVisible1 = false
        //   }
        // })
      },
      isSwitch() {
        if(this.tableData.some((item) => {return item.select === true}) === true){
          this.dialogVisible1 = true
        } else {
          this.$message('请勾选方案');
        }
      },
      delSelected() {
        let list = [];
        this.tableData.forEach((item) => {
          if (item.select) {
            list.push(item.id)
          }
        });

        if(list.length === 0){
          this.$message('请勾选方案');
        }else {
          this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // getApi.del(list.join(",")).then((res)=>{
            //
            //   this.$message({
            //     type: 'info',
            //     message: '删除成功'
            //   });
            //   this.showResouce(this.p, this.getX1StoreLevelId());
            // })


          }).catch(() => {
            //
          });
        }


      },
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
        this.formEdit.subject_data.splice(i,1)
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
        this.buttonInt = 3
      },
      showOneSubject(item,i){
        this.showSubjectIndex = i;
        this.num = item.option.length
        this.visiblePopList = false

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

          this.formEdit.subject_data.push({
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



          this.showSubjectIndex = this.formEdit.subject_data.length -1
        } else {
          this.formEdit.subject_data.splice(this.subjectIndex,1,{
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
        this.$refs['formRules'].validate((valid) => {
          if (valid) {
            this.showFormSwitch = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
        this.showFormSwitch = true;

        this.formEdit = {
          name: '',//方案名称
            third_code: [
            {code1: '', code2: ''}
          ],
            status:true,//：关闭 1：开启
            start_time:'',//活动开始时间 时间戳
            end_time:'',//活动结束时间 时间戳
            type:0,//0：直接领取 1：答题后领取
            card_id:'',//卡券编号
            material_id:'',//卡面编号
            limit_house_num:'',//每x小时限制领取一次 不限制为空或0
            limit_num:'',//每人限领x次 不限制为空或0
            appId:'',//小程序APPID
            path:'',//小程序页面路径
            qrCode:'',//小程序二维码地址
            subject_data:[],

            home_notes_url:'',//首页须知图片
            home_background_url:'',//首页背景图
            home_start_url:'',//首页开始图片

            notes_background_url:'',//答题须知背景框
            notes_info:'',//答题须知详情
            notes_button:'',//答题须知按钮

            receive_success_url:'',//领取成功按钮
            receive_info_url:'',//领取成功详情
            share_button:'',//分享按钮

            element1:'',//分享元素1
            element2:'',//分享元素2
            element3:'',//分享元素3
            element4:'',//分享元素4
            url:'',

            imgurl_appId:'',


            status1:false,
            status2:false,
            status3:false,
            status4:false,
            status5:false,
            status6:false,
            radio:''
        }

      },


      openDialog() {
        this.dialogFormVisible = true;
      },

      submitFrom() {
        if(this.showName === '新增方案'){
          getApi.addActivity(this.getActivitySettingLevelId(), this.formEdit).then((res) => {
            if (res.data.errcode === 0) {
              this.showResouce(this.p);
              this.$message('操作成功');
              this.dialogFormVisible = false
            }
          })
        }else {
          getApi.updateActivity(this.formEdit).then((res) => {
            if (res.data.errcode === 0) {
              this.showResouce(this.p);
              this.$message('操作成功');
              this.dialogFormVisible = false
            }
          })
        }


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
        this.showName = name;
        this.dialogFormVisible = true;
        getApi.getInfo(id).then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.status === 1 ? res.data.data.status = true:res.data.data.status = false;
            res.data.data.start_time = (res.data.data.start_time + '000') * 1;
            res.data.data.end_time = (res.data.data.end_time + '000') * 1;
            this.formEdit = res.data.data;
          }

        })

        if(name === '查看方案'){
          this.show = true
        } else {
          this.show = false
        }

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

      showResouce(p,storeName = ''){
        getApi.getActivityList(p,this.getActivitySettingLevelId(), storeName).then((res) => {
          if (res.data.errcode === 0) {
            this.tableData = res.data.data.list;
            this.p.total = res.data.data.count;
          }

        })
      },


      removeDomain(index) {
        this.formEdit.third_code.splice(index, 1)
      },
      addDomain() {
        this.formEdit.third_code.push({code1: '', code2: ''});
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

      handleAvatarSuccess_home_notes_url(res, file) {
        this.formEdit.home_notes_url = file.response.data.file_url;
      },

      handleAvatarSuccess_home_background_url(res, file) {
        this.formEdit.home_background_url = file.response.data.file_url;
      },

      handleAvatarSuccess_home_start_url(res, file) {
        this.formEdit.home_start_url = file.response.data.file_url;
      },
      handleAvatarSuccess_notes_background_url(res, file) {
        this.formEdit.notes_background_url = file.response.data.file_url;
      },
      handleAvatarSuccess_notes_info(res, file) {
        this.formEdit.notes_info = file.response.data.file_url;
      },
      handleAvatarSuccess_notes_button(res, file) {
        this.formEdit.notes_button = file.response.data.file_url;
      },

      handleAvatarSuccess_receive_success_url(res, file) {
        this.formEdit.receive_success_url = file.response.data.file_url;
      },
      handleAvatarSuccess_receive_info_url(res, file) {
        this.formEdit.receive_info_url = file.response.data.file_url;
      },
      handleAvatarSuccess_share_button(res, file) {
        this.formEdit.share_button = file.response.data.file_url;
      },
      handleAvatarSuccess_element1(res, file) {
        this.formEdit.element1 = file.response.data.file_url;
      },
      handleAvatarSuccess_element2(res, file) {
        this.formEdit.element2 = file.response.data.file_url;
      },
      handleAvatarSuccess_element3(res, file) {
        this.formEdit.element3 = file.response.data.file_url;
      },
      handleAvatarSuccess_element4(res, file) {
        this.formEdit.element4 = file.response.data.file_url;
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
          console.log(this.formEdit.subject_data)
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

<style scoped lang="less">
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
.m_t_20{
  margin-top: 20px;
}

  .subject_center{
    position: absolute;
    top: 31%;
    left: 13%;
    width: 74%;
    height: 44%;
  }
  .reg{
    width: 420px;height: 345px;display: flex;align-items: flex-end;justify-content: flex-end;
    .reg_box{
      width: 200px;height: 200px;border: 1px dashed #d9d9d9;border-radius: 5px;padding: 10px;
    }
  }


</style>
