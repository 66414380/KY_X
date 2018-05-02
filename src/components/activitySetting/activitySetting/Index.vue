<template>
  <div v-show="getTreeArr['列表']">

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>

      <div class="flex_es">

        <div>
          <el-button size="small" @click="add('新增方案')" v-show="getTreeArr['新增活动']" :disabled="showAdd !== 4">新增方案</el-button>
          <el-button size="small"  @click="delSelected()" v-show="getTreeArr['批量删除']">批量删除</el-button>
          <el-button size="small" @click="isSwitch()" v-show="getTreeArr['批量开启/关闭']">批量开启/关闭</el-button>
        </div>

        <div class="flex_a">
          <div class="margin_r_10">
            <el-input size="small" v-model="activityName" placeholder="请输入方案名称"></el-input>
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
              <div v-if="scope.row.start_time !== ''">起 {{scope.row.start_time}} </div>
              <div v-if="scope.row.end_time !== ''">截止 {{scope.row.end_time}} </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="card_name" min-width="140" label="优惠券名称">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" min-width="180" label="方案过期倒计时">
            <template slot-scope="scope">
              <div v-if="scope.row.end_time !== '' && scope.row.start_time !== ''">
                <time-component :end-time="scope.row.end_time" :start-time="scope.row.start_time" :update-time="timeNow"></time-component>
              </div>

            </template>
          </el-table-column>
          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" prop="sgroupname" min-width="160" label="方案过期提醒状态">-->
          <!--</el-table-column>-->
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="280">
            <template slot-scope="scope">
              <el-button size="small" type="text" style="color:green;" @click="optionShow('修改方案',scope.row.id)" v-show="getTreeArr['编辑活动']">修改</el-button>
              <el-button size="small" type="text" style="color:blue;" @click="optionShow('查看方案',scope.row.id)" v-show="getTreeArr['活动详情']">查看</el-button>
              <el-button size="small" type="text" style="color:red;" @click="del(scope.row.id)" v-show="getTreeArr['删除']">删除</el-button>
              <!--<el-button size="small" type="text" style="color:burlywood;" @click="activeDown()">方案下发</el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
        </div>

      </div>
    <!--题目列表-->
    <el-dialog :visible.sync="visiblePopList" title="选择类型页" width="440px">
      <div class="flex_a margin_t_10" v-for="(item,index) in formEdit.subject_data">
        <div class="button flex pointer margin_r_10" @click="editOneSubject(item,index,'修改题目')" :style="{'background-color':(showSubjectIndex === index)?'#E8EEF5':''}">题目{{index + 1}}</div>
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
    <el-dialog :title="subjectTitle" :visible.sync="visiblePop" width="440px">
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
    <el-dialog :title="showName" :visible.sync="dialogFormVisible" @open="open" @close="close" class="dialog" width="800px">


      <el-form ref="formRules" :model="formEdit" label-width="140px">

        <div v-if="showFormSwitch">
          <el-form-item label="方案名称:" prop="name" :rules="{required: true, message: '请输入方案名称', trigger: 'blur'}">
            <el-input class="input_width" :disabled="show" v-model="formEdit.name" placeholder="请输入方案名称"></el-input>
          </el-form-item>

          <el-form-item label="方案编码:" v-if="showName !== '新增方案'">
            <el-input class="input_width" v-model="formEdit.id" placeholder="" disabled></el-input>
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
             >
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

                <!--<div class="flex_a">-->
                  <!--<span style="width: 120px">首页网址</span> <el-input v-model="formEdit.url" placeholder="" size="small"></el-input>-->
                <!--</div>-->
                <div class="flex_a">
                  <span style="width: 115px">appID</span> <el-input style="width: 198px" :disabled="show" v-model="formEdit.appId" placeholder="请输入appID" size="small"></el-input>
                </div>
                <div class="flex_a">
                  <span style="width: 115px">小程序路径</span> <el-input style="width: 198px" :disabled="show" v-model="formEdit.path" placeholder="请输入小程序路径" size="small"></el-input>
                </div>
                <div class="flex_a">

                  <el-form-item label="公众号APPID:" label-width="115px" prop="wx_appid" :rules="{required: true, message: '请输入公众号APPID', trigger: 'blur'}">
                    <el-input style="width: 200px" :disabled="show" v-model="formEdit.wx_appid" placeholder="请输入公众号APPID" size="small"></el-input>
                  </el-form-item>

                </div>


              <div class=" flex_a margin_t_10" v-if="show">
                <span class="margin_r_10" style="width: 105px;text-align: left">小程序码</span>

                <div class="el-upload">
                  <img v-if="formEdit.qr_code" :src="formEdit.qr_code" class="qr_code_image">
                  <div v-else class="small_image flex"></div>
                </div>


                <div class="margin_l_10 flex_f flex_sb" style="height: 100px">
                  <!--<div class="flex_a">-->
                    <!--<el-input v-model="formEdit.url" placeholder="" size="small"></el-input>-->
                    <!--<el-button size="small" class="margin_l_10" style="color: #34D066;border-color: #34D066;" >确定</el-button>-->
                  <!--</div>-->
                    <el-button size="small" class="width_100" style="color: #20a0ff;border-color: #20a0ff;" @click="openDownLoad(formEdit.id)">下载</el-button>

                </div>
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
          <el-form ref="formRules1" :model="formEdit1" label-width="140px">

          <el-form-item label="活动卡券编码:" prop="card_id" :rules="{required: true, message: '请输入活动卡券编码', trigger: 'blur'}">
            <el-input class="input_width" :disabled="show" v-model="formEdit1.card_id" placeholder="请输入活动卡券编码"></el-input>
          </el-form-item>

          <el-form-item label="活动卡面编码:" prop="material_id" :rules="{required: true, message: '请输入活动卡面编码', trigger: 'blur'}">
            <el-input class="input_width" :disabled="show" v-model="formEdit1.material_id" placeholder="请输入活动卡面编码"></el-input>
          </el-form-item>
          </el-form>
          <div class="flex_r margin_b_10">
            <div class="form2_width margin_r_10" >
              <div>
                <div class="t_a" >设置领取规则</div>
                <div class="t_a">（空或0为不限制）</div>
              </div>

            </div>
            <div>
                <div class="margin_b_10">
                  <span v-if="!show">每<input type="text" v-model="formEdit.limit_house_num" class="form_input">小时限领一次</span>
                  <span v-else>每<span  class="form_input b_c">{{formEdit.limit_house_num}}</span>小时限领一次</span>
                </div>
                <div class="margin_b_10">
                  <span v-if="!show">每人限领<input type="text" v-model="formEdit.limit_num" class="form_input">次</span>
                  <span v-else>每人限领<span class="form_input b_c">{{formEdit.limit_num}}</span>次</span>
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
                  <img class="home_notes_url"  v-if="formEdit.home_notes_url" :src="formEdit.home_notes_url">
                  <img class="home_start_url" v-if="formEdit.home_start_url" :src="formEdit.home_start_url">
                </div>
              </div>

              <div class="flex_r f_f m_t_20">
                <el-popover

                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W320px,H66px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>

                  <div class="margin_t_10 margin_r_10" slot="reference">
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

                </el-popover>

                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W750px,H1108px
                  </div>
                  <div>
                    大小不超过600kb的图片
                  </div>
                  <div class="margin_t_10 margin_r_10" slot="reference">
                    <el-upload
                      :disabled="show"
                      class="avatar-uploader "
                      :action="$updateUrl"
                      name='filename'
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess_home_background_url"
                      :before-upload="beforeAvatarUpload2">
                      <div v-if="formEdit.home_background_url" class="small_image flex">
                        <img :src="formEdit.home_background_url" class="height_100" >
                      </div>
                      <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                    </el-upload>
                    <div class="t_a">背景图</div>
                  </div>
                </el-popover>

                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W310px,H88px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>
                  <div class="margin_t_10 margin_r_10" slot="reference">
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
                </el-popover>

              </div>
            </div>

            <div class="flex_r" v-if="buttonInt === 2">

              <div class="margin_t_10 margin_r_10">
                <div class="t_a">效果图</div>
                <div class="big_image ">
                  <div class="width_100 height_100 flex" v-if="formEdit.notes_background_url" style="background-color: rgba(0,0,0,0.8)">
                    <img :src="formEdit.notes_background_url" style="width: 85%">
                  </div>

                    <textarea class="notes_info" style="border: none;outline: none;background-color:transparent;" readonly v-model="formEdit.notes_info">
                    </textarea>
                  <div >

                  </div>

                  <img class="notes_button" v-if="formEdit.notes_button" :src="formEdit.notes_button">
                </div>
              </div>


              <div class="flex_r f_f m_t_20">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W580px,H760px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>
                  <div class="margin_t_10 margin_r_10" slot="reference">
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
                </el-popover>


                <div class="margin_t_10 margin_r_10" >


                  <el-input
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    @change="textAreaChange"
                    v-model="formEdit.notes_info">
                  </el-input>
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover">
                    <div>
                      一行最多17个字，超过换行。最多不能十行
                    </div>
                    <div class="t_a" slot="reference">答题须知详情</div>
                  </el-popover>

                </div>


                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W310px,H88px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>
                  <div class="margin_t_10 margin_r_10" slot="reference">
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
                </el-popover>

              </div>
            </div>

            <div v-if="buttonInt === 3" style="min-height: 337px">

              <div v-for="(item,index) in formEdit.subject_data" >

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
                            <img class="height_100 width_100" v-if="item.option.length > 4 && item.option[4].img" :src="item.option[4].img">
                          </div>
                          <div style="width: 33.33%" class="height_100">
                            <img class="height_100 width_100" v-if=" item.option.length > 5 &&item.option[5].img" :src="item.option[5].img">
                          </div>
                        </div>

                        <div style="height: 33.33%" class="width_100 flex_a">
                          <div style="width: 33.33%" class="height_100">
                            <img class="height_100 width_100" v-if="item.option.length > 6 && item.option[6].img" :src="item.option[6].img">
                          </div>
                          <div style="width: 33.33%" class="height_100">
                            <img class="height_100 width_100" v-if="item.option.length > 7 && item.option[7].img" :src="item.option[7].img">
                          </div>
                          <div style="width: 33.33%" class="height_100">
                            <img class="height_100 width_100" v-if="item.option.length > 8 &&item.option[8].img" :src="item.option[8].img">
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div class="flex_r f_f m_t_20">

                    <el-popover
                      placement="top-start"
                      width="200"
                      trigger="hover"
                      >

                      <div>
                        请上传
                      </div>
                      <div>
                        尺寸为W750px,H1108px
                      </div>
                      <div>
                        大小不超过600kb的图片
                      </div>

                      <div class="margin_t_10 margin_r_10" slot="reference">
                        <el-upload
                          :disabled="show"
                          class="avatar-uploader "
                          :action="$updateUrl"
                          name='filename'
                          :show-file-list="false"
                          :on-success="(res, file)=>{
                      return handleAvatarSuccess_background(res, file,item)
                      }"
                          :before-upload="beforeAvatarUpload2">
                          <div v-if="item.subject_background_url" class="small_image flex">
                            <img :src="item.subject_background_url" class="height_100">
                          </div>
                          <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                        </el-upload>
                        <div class="t_a">背景图</div>
                      </div>
                    </el-popover>


                    <el-popover
                      v-if="item.subject_type === 1"
                      placement="top-start"
                      width="200"
                      trigger="hover"
                    >
                      <div>
                        请上传
                      </div>
                      <div>
                        尺寸为W600px,H184px
                      </div>
                      <div>
                        大小不超过300kb的图片
                      </div>

                      <div class="margin_t_10 margin_r_10" slot="reference">
                        <el-upload
                          :disabled="show"
                          class="avatar-uploader "
                          :action="$updateUrl"
                          name='filename'
                          :show-file-list="false"
                          :on-success="(res, file)=>{
                      return handleAvatarSuccess_subject_problem1(res, file,item)
                      }"
                          :before-upload="beforeAvatarUpload">
                          <div v-if="item.subject_problem" class="small_image flex">
                            <img :src="item.subject_problem" class="width_100">
                          </div>
                          <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                        </el-upload>
                        <div class="t_a">问题</div>
                      </div>
                    </el-popover>
                    <el-popover
                      v-else
                      placement="top-start"
                      width="200"
                      trigger="hover"
                    >
                      <div>
                        请上传
                      </div>
                      <div>
                        尺寸为W560px,H104px
                      </div>
                      <div>
                        大小不超过300kb的图片
                      </div>

                      <div class="margin_t_10 margin_r_10" slot="reference">
                        <el-upload
                          :disabled="show"
                          class="avatar-uploader "
                          :action="$updateUrl"
                          name='filename'
                          :show-file-list="false"
                          :on-success="(res, file)=>{
                      return handleAvatarSuccess_subject_problem23(res, file,item)
                      }"
                          :before-upload="beforeAvatarUpload">
                          <div v-if="item.subject_problem" class="small_image flex">
                            <img :src="item.subject_problem" class="width_100">
                          </div>
                          <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                        </el-upload>
                        <div class="t_a">问题</div>
                      </div>
                    </el-popover>



                    <el-popover
                      placement="top-start"
                      width="200"
                      trigger="hover"
                    >
                      <div>
                        请上传
                      </div>
                      <div>
                        尺寸为W310px,H88px
                      </div>
                      <div>
                        大小不超过300kb的图片
                      </div>

                      <div class="margin_t_10 margin_r_10" slot="reference">
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

                    </el-popover>


                    <!--2选-->
                    <el-popover
                      v-for="(item1,index1) in item.option"
                      :key="item1.id"
                      v-if="item.subject_type !== 1 && item.option.length === 2"
                      placement="top-start"
                      width="200"
                      trigger="hover">
                      <div>
                        请上传
                      </div>
                      <div>
                        尺寸为W290px,H580px
                      </div>
                      <div>
                        大小不超过300kb的图片
                      </div>


                      <div  slot="reference" class="margin_t_10 margin_r_10"  >
                        <el-upload
                          :disabled="show"
                          class="avatar-uploader "
                          :action="$updateUrl"
                          name='filename'
                          :show-file-list="false"
                          :on-success="(res, file)=>{
                          return handleAvatarSuccess_option_2s(res, file,item1)
                      }"
                          :before-upload="beforeAvatarUpload">
                          <div v-if="item1.img" class="small_image flex">
                            <img :src="item1.img" class="height_100">
                          </div>
                          <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                        </el-upload>
                        <div class="width_100 flex" >

                          <el-input style="width: 80px;" :disabled="show" v-model="item1.name" :placeholder="'回答' + (index1 + 1)" size="small"></el-input>
                        </div>
                      </div>

                    </el-popover>

                    <!--3选-->
                    <el-popover
                      v-for="(item1,index1) in item.option"
                      :key="item1.id"
                      v-if="item.subject_type !== 1 && item.option.length === 3"
                      placement="top-start"
                      width="200"
                      trigger="hover">
                      <div>
                        请上传
                      </div>
                      <div>
                        尺寸为W194px,H580px
                      </div>
                      <div>
                        大小不超过300kb的图片
                      </div>


                      <div  slot="reference" class="margin_t_10 margin_r_10"  >
                        <el-upload
                          :disabled="show"
                          class="avatar-uploader "
                          :action="$updateUrl"
                          name='filename'
                          :show-file-list="false"
                          :on-success="(res, file)=>{
                          return handleAvatarSuccess_option_3s(res, file,item1)
                      }"
                          :before-upload="beforeAvatarUpload">
                          <div v-if="item1.img" class="small_image flex">
                            <img :src="item1.img" class="height_100">
                          </div>
                          <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                        </el-upload>
                        <div class="width_100 flex" >

                          <el-input style="width: 80px;" :disabled="show" v-model="item1.name" :placeholder="'回答' + (index1 + 1)" size="small"></el-input>
                        </div>
                      </div>

                    </el-popover>

                    <!--4选-->
                    <el-popover
                      v-for="(item1,index1) in item.option"
                      :key="item1.id"
                      v-if="item.subject_type !== 1 && item.option.length === 4"
                      placement="top-start"
                      width="200"
                      trigger="hover">
                      <div>
                        请上传
                      </div>
                      <div>
                        尺寸为W290px,H290px
                      </div>
                      <div>
                        大小不超过300kb的图片
                      </div>


                      <div  slot="reference" class="margin_t_10 margin_r_10"  >
                        <el-upload
                          :disabled="show"
                          class="avatar-uploader "
                          :action="$updateUrl"
                          name='filename'
                          :show-file-list="false"
                          :on-success="(res, file)=>{
                          return handleAvatarSuccess_option_4s(res, file,item1)
                      }"
                          :before-upload="beforeAvatarUpload">
                          <div v-if="item1.img" class="small_image flex">
                            <img :src="item1.img" class="height_100">
                          </div>
                          <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                        </el-upload>
                        <div class="width_100 flex" >

                          <el-input style="width: 80px;" :disabled="show" v-model="item1.name" :placeholder="'回答' + (index1 + 1)" size="small"></el-input>
                        </div>
                      </div>

                    </el-popover>

                    <!--5选以上-->
                    <el-popover
                      v-for="(item1,index1) in item.option"
                      :key="item1.id"
                      v-if="item.subject_type !== 1 && item.option.length > 4"
                      placement="top-start"
                      width="200"
                      trigger="hover">
                      <div>
                        请上传
                      </div>
                      <div>
                        尺寸为W194px,H194px
                      </div>
                      <div>
                        大小不超过300kb的图片
                      </div>


                      <div  slot="reference" class="margin_t_10 margin_r_10"  >
                        <el-upload
                          :disabled="show"
                          class="avatar-uploader "
                          :action="$updateUrl"
                          name='filename'
                          :show-file-list="false"
                          :on-success="(res, file)=>{
                          return handleAvatarSuccess_option_5s(res, file,item1)
                      }"
                          :before-upload="beforeAvatarUpload">
                          <div v-if="item1.img" class="small_image flex">
                            <img :src="item1.img" class="height_100">
                          </div>
                          <div v-else class="small_image flex"><i class="el-icon-plus"></i></div>
                        </el-upload>
                        <div class="width_100 flex" >

                          <el-input style="width: 80px;" :disabled="show" v-model="item1.name" :placeholder="'回答' + (index1 + 1)" size="small"></el-input>
                        </div>
                      </div>

                    </el-popover>


                  </div>

                  <div v-if="item.subject_type === 1" class="reg flex_ec margin_t_10">
                    <div class="reg_box">
                      <div class="margin_b_10" style="text-align: center;font-size: 18px">规则说明</div>
                      <div class="margin_b_10">
                        <span v-if="!show">1.最多输入<input type="number" min="1" max="33" class="form_input" v-model.number="item.subject_rule.max" @change="changeNumberMax(item)" />(33)个字</span>
                        <span v-else>1.最多输入<span class="form_input b_c" >{{item.subject_rule.max}}</span>(33)个字</span>
                      </div>
                      <div class="margin_b_10">
                        <span v-if="!show">2.最小输入<input type="number" min="1" max="33" class="form_input" v-model.number="item.subject_rule.min" @change="changeNumberMin(item)"/>(1-33)个字</span>
                        <span v-else>2.最小输入<span  class="form_input b_c" >{{item.subject_rule.min}}</span>(0-33)个字</span>
                      </div>
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
                  <img class="receive_success_url"  v-if="formEdit.receive_success_url" :src="formEdit.receive_success_url">
                  <div class="width_100 height_100 flex" v-if="formEdit.receive_info_url" style="background-color: rgba(0,0,0,0.8)">
                    <img :src="formEdit.receive_info_url" style="width: 85%">
                  </div>
                  <img class="share_button" v-if="formEdit.share_button" :src="formEdit.share_button">
                </div>
              </div>

              <div class="flex_r f_f m_t_20">


                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W330px,H250px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>

                  <div class="margin_t_10 margin_r_10" slot="reference">
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

                </el-popover>



                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W580px,H450px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>
                  <div class="margin_t_10 margin_r_10" slot="reference">
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

                </el-popover>

                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W310px,H88px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>
                  <div class="margin_t_10 margin_r_10" slot="reference">
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

                </el-popover>



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

                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W92px,H80px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>

                  <div class="margin_t_10 margin_r_10" slot="reference">
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
                </el-popover>

                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W500px,H760px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>

                  <div class="margin_t_10 margin_r_10" slot="reference">
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
                </el-popover>


                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W280px,H88px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>

                  <div class="margin_t_10 margin_r_10" slot="reference">
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
                </el-popover>

                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                  <div>
                    请上传
                  </div>
                  <div>
                    尺寸为W310px,H88px
                  </div>
                  <div>
                    大小不超过300kb的图片
                  </div>

                  <div class="margin_t_10 margin_r_10" slot="reference">
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
                </el-popover>

              </div>
            </div>

          </el-card>

        </div>


      </el-form>




      <div class="margin_t_10 flex_ce" style="margin-right: 10%">
        <!--<el-button type="primary" @click="submitFrom11('formRules')" v-if="!showFormSwitch">方案下发</el-button>-->
        <el-button type="success" @click="submitFrom()" v-if="!showFormSwitch" :disabled="show">保存</el-button>
        <el-button @click="dialogFormVisible = false" type="danger">取消</el-button>
        <el-button type="success" @click="next()" v-if="showFormSwitch">下一步</el-button>
      </div>
    </el-dialog>


    <!--批量开启/关闭-->
    <el-dialog
      title="开启/关闭"
      :visible.sync="dialogVisible1"
      width="400px" >
      <el-switch
        v-model="storeStatusValue"
        >
      </el-switch>
      <div class="margin_t_10">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="changeStoresStatus()">确认</el-button>
      </div>
    </el-dialog>

    <!--下载-->
    <el-dialog
      title="下载图片"
      :visible.sync="dialogVisible2"
      width="400px"  @close="closeImg">

      <!--<el-select v-model="downLoadValue" placeholder="请选择图片规格" @change="changeImg">-->
        <!--<el-option-->
          <!--v-for="item in options"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
        <!--</el-option>-->
      <!--</el-select>-->

      <img :src="imgUrl" alt="">
      <div class="margin_t_10">
        <!--<el-button @click="dialogVisible2 = false">取消</el-button>-->
        <a class="width_100"  v-if="imgUrl !== ''" :href="imgUrl" :download="imgUrl">
          <el-button type="primary">下载</el-button>
        </a>
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
  import timeComponent from './timeComponent.vue'
  export default {

    components: {
      timeComponent
    },
    computed: {
      ...mapGetters([
        'getTreeArr', 'getBodyHeight'
      ]),
    },
    data() {
      return {
        imgUrl:'',
        activityId:'',
        downLoadValue:'',
        options: [{
          value: '60',
          label: '宽度60px'
        }, {
          value: '90',
          label: '宽度90px'
        }, {
          value: '120',
          label: '宽度120px'
        }, {
          value: '150',
          label: '宽度150px'
        }, {
            value: '300',
            label: '宽度300px'
          }, {
            value: '600',
            label: '宽度600px'
          },
        ],
        timeNow:new Date() * 1,
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
        dialogVisible2:false,
        storeStatusValue:false,
        showName: '',
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "活动管理", url: ''},{name: "活动方案", url: ''}],
        show:false,
        activityName: '',
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

          limit_house_num:'',//每x小时限制领取一次 不限制为空或0
          limit_num:'',//每人限领x次 不限制为空或0
          appId:'',//小程序APPID
          path:'',//小程序页面路径
          wx_appid:'',
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
          qr_code:'',

          status1:false,
          status2:false,
          status3:false,
          status4:false,
          status5:false,
          status6:false,
          radio:''
        },

        formEdit1: {
          card_id:'',//卡券编号
          material_id:'',//卡面编号

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
          subject_rule:{max:33,min:1}
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
      closeImg(){
        this.imgUrl = '';
        this.activityId = '';
        this.downLoadValue = ''
      },
      changeImg(e){


      },
      openDownLoad(id){
        this.activityId = id;
        this.dialogVisible2 = true;
            getApi.downloadQrCode(this.activityId,'240').then((res) => {
              if (res.data.errcode === 0) {
                this.imgUrl = res.data.data
              }
            });
      },

      textAreaChange(e){
       let str =  e.split('\n').toString();
       let list = str.split(',');
        if(list.length >10){
          this.$message.warning('不能超过10行')
        }
        list.forEach((item ,index)=>{
          if(item.length > 17){
              this.$message.warning(`第${index +1}行已经超出17个字符`)
          }
        })

      },



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
        getApi.batchStatus(list.join(","),this.storeStatusValue).then((res) => {
          if (res.data.errcode === 0) {
            this.showResouce(this.p);
            this.$message('操作成功');
            this.dialogVisible1 =false
          }
        });
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
            getApi.batchDel(list.join(",")).then((res) => {
              if (res.data.errcode === 0) {
                this.showResouce(this.p);
                this.$message('操作成功');
              }
            });

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
          subject_rule:{max:33,min:1}
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
          optionList.push({img:'',select:false,name:'',id:i})
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
            subject_rule:{max:33,min:1}
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
        if(new Date(this.formEdit.start_time) * 1 > new Date(this.formEdit.end_time) * 1){
          this.$message.warning('开始时间不能大于结束时间')
          return
        }
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
        this.$refs['formRules'].resetFields();
        this.showFormSwitch = true;
        this.show = false;
        this.formEdit = {
          name: '',//方案名称
            third_code: [
            {code1: '', code2: ''}
          ],
            status:true,//：关闭 1：开启
            start_time:'',//活动开始时间 时间戳
            end_time:'',//活动结束时间 时间戳
            type:0,//0：直接领取 1：答题后领取
            limit_house_num:'',//每x小时限制领取一次 不限制为空或0
            limit_num:'',//每人限领x次 不限制为空或0
            appId:'',//小程序APPID
            path:'',//小程序页面路径
            wx_appid:'',
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
        };
        this.formEdit1 = {
            card_id:'',//卡券编号
            material_id:'',//卡面编号
        }

      },


      openDialog() {
        this.dialogFormVisible = true;
      },

      submitFrom() {

        this.$refs['formRules1'].validate((valid) => {
          if (valid) {

            if(this.showName === '新增方案'){
              getApi.addActivity(this.getActivitySettingLevelId(), this.formEdit,this.formEdit1).then((res) => {
                if (res.data.errcode === 0) {
                  this.showResouce(this.p);
                  this.$message('操作成功');
                  this.dialogFormVisible = false
                }
              })
            }else {
              getApi.updateActivity(this.formEdit,this.formEdit1).then((res) => {
                if (res.data.errcode === 0) {
                  this.showResouce(this.p);
                  this.$message('操作成功');
                  this.dialogFormVisible = false
                }
              })
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      getPage(page) {
        this.p.page = page;
        this.showResouce(this.p, this.activityName);
      },
      getPageSize(size) {
        this.p.size = size;
        this.showResouce(this.p, this.activityName);
      },

      del(id) {
        this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getApi.delActivity(id).then((res) => {
            if (res.data.errcode === 0) {
              this.showResouce(this.p);
              this.$message('操作成功');

            }
          });

        }).catch(() => {
          //
        });
      },
      search() {
        this.showResouce(this.p = {page: 1, size: 20, total: 0}, this.activityName);
      },

      optionShow(name, id) {
        this.showName = name;
        this.dialogFormVisible = true;
        getApi.getInfo(id).then((res) => {
          if (res.data.errcode === 0) {
            res.data.data.status === 1 ? res.data.data.status = true:res.data.data.status = false;
            res.data.data.start_time === ''? res.data.data.start_time = '': res.data.data.start_time  = (res.data.data.start_time + '000') * 1;
            res.data.data.end_time === ''? res.data.data.end_time  = '': res.data.data.end_time  = (res.data.data.end_time + '000') * 1;
            this.formEdit = res.data.data;
            this.formEdit1.card_id = res.data.data.card_id;
            this.formEdit1.material_id = res.data.data.material_id
          }

        });

        (name === '查看方案')? this.show = true : this.show = false


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
            this.showResouce(this.p, this.activityName);
            recur(res.data.data, true, this.getActivitySettingLevelId(), this)
          }
        });
      },

      showResouce(p,activityName = ''){
        getApi.getActivityList(p,this.getActivitySettingLevelId(), activityName).then((res) => {
          res.data.data.list.forEach((item)=>{
            item.select = false
          })
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


      handleAvatarSuccess_background(res, file,item){

        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==750 && img.height !== 1108){
            this.$message.warning('宽高必须为W750px,H1108px');
            item.subject_background_url = ''
          } else {
            item.subject_background_url = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_subject_problem1(res, file,item){
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==600 && img.height !== 184){
            this.$message.warning('宽高必须为W600px,H184px');
            item.subject_problem = ''
          } else {
            item.subject_problem = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_subject_problem23(res, file,item){
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==560 && img.height !== 104){
            this.$message.warning('宽高必须为W560px,H104px');
            item.subject_problem = ''
          } else {
            item.subject_problem = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_subject_button(res, file,item){
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==310 && img.height !== 88){
            this.$message.warning('宽高必须为W310px,H88px');
            item.subject_button = ''
          } else {
            item.subject_button = file.response.data.file_url;
          }
        }
      },

      handleAvatarSuccess_option_2s(res, file,item){
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==290 && img.height !== 580){
            this.$message.warning('宽高必须为W290px,H580px');
            item.img = ''
          } else {
            item.img = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_option_3s(res, file,item){

        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==194 && img.height !== 580){
            this.$message.warning('宽高必须为W194px,H580px');
            item.img = ''
          } else {
            item.img = file.response.data.file_url;
          }
        }
      },

      handleAvatarSuccess_option_4s(res, file,item){
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==290 && img.height !== 290){
            this.$message.warning('宽高必须为W290px,H290px');
            item.img = ''
          } else {
            item.img = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_option_5s(res, file,item){
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==194 && img.height !== 194){
            this.$message.warning('宽高必须为W194px,H194px');
            item.img = ''
          } else {
            item.img = file.response.data.file_url;
          }
        }
      },

      handleAvatarSuccess_option(res, file,item){
        item.img = file.response.data.file_url;
      },

      handleAvatarSuccess_home_notes_url(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==320 && img.height !== 66){
            this.$message.warning('宽高必须为W320px,H66px');
            this.formEdit.home_notes_url = ''
          } else {
            this.formEdit.home_notes_url = file.response.data.file_url;
          }

        }
      },

      handleAvatarSuccess_home_background_url(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==750 && img.height !== 1108){
            this.$message.warning('宽高必须为W750px,H1108px');
            this.formEdit.home_background_url = ''
          } else {
            this.formEdit.home_background_url = file.response.data.file_url;
          }
        }
      },

      handleAvatarSuccess_home_start_url(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==310 && img.height !== 88){
            this.$message.warning('宽高必须为W310px,H88px');
            this.formEdit.home_start_url = ''
          } else {
            this.formEdit.home_start_url = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_notes_background_url(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==580 && img.height !== 760){
            this.$message.warning('宽高必须为W580px,H760px');
            this.formEdit.notes_background_url = ''
          } else {
            this.formEdit.notes_background_url = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_notes_info(res, file) {
        this.formEdit.notes_info = file.response.data.file_url;
      },
      handleAvatarSuccess_notes_button(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==310 && img.height !== 88){
            this.$message.warning('宽高必须为W310px,H88px');
            this.formEdit.notes_button = ''
          } else {
            this.formEdit.notes_button = file.response.data.file_url;
          }
        }
      },

      handleAvatarSuccess_receive_success_url(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==330 && img.height !== 250){
            this.$message.warning('宽高必须为W330px,H250px');
            this.formEdit.receive_success_url = ''
          } else {
            this.formEdit.receive_success_url = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_receive_info_url(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==580 && img.height !== 450){
            this.$message.warning('宽高必须为W580px,H450px');
            this.formEdit.receive_info_url = ''
          } else {
            this.formEdit.receive_info_url = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_share_button(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==310 && img.height !== 88){
            this.$message.warning('宽高必须为W310px,H88px');
            this.formEdit.share_button = ''
          } else {
            this.formEdit.share_button = file.response.data.file_url;
          }
        }

      },
      handleAvatarSuccess_element1(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==92 && img.height !== 80){
            this.$message.warning('宽高必须为W92px,H80px');
            this.formEdit.element1 = ''
          } else {
            this.formEdit.element1 = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_element2(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==500 && img.height !== 760){
            this.$message.warning('宽高必须为W500px,H760px');

            this.formEdit.element2 = ''
          } else {
            this.formEdit.element2 = file.response.data.file_url;
          }
        }
      },
      handleAvatarSuccess_element3(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==280 && img.height !== 88){
            this.$message.warning('宽高必须为W280px,H88px');
            this.formEdit.element3 = ''
          } else {
            this.formEdit.element3 = file.response.data.file_url;
          }
        }


      },
      handleAvatarSuccess_element4(res, file) {
        let img = new Image();
        img.src = file.response.data.file_url;
        img.onload = ()=>{
          if(img.width !==310 && img.height !== 88){
            this.$message.warning('宽高必须为W310px,H88px');
            this.formEdit.element4 = ''
          } else {
            this.formEdit.element4 = file.response.data.file_url;
          }
        }
      },

      beforeAvatarUpload(file) {

        const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 0.3;
        let img;

        if (isJPG || isPNG) {
          img = true
        } else {
          img = false;
          this.$message.error('上传图片只能是 JPG,PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 300k!');
        }

        return img && isLt5M;
      },
      beforeAvatarUpload2(file) {

        const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 0.6;
        let img;

        if (isJPG || isPNG) {
          img = true
        } else {
          img = false;
          this.$message.error('上传图片只能是 JPG,PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 600k!');
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

      this.int = setInterval(()=>{
        this.timeNow = new Date() * 1;
      },1000)
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
      clearInterval(this.int);
      this.int = null;
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
    text-align: center;
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
  .item_name{
    width: 40px;
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
  .qr_code_image{
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

  .home_notes_url{
    width: 43%;
    height: 9%;
    position: absolute;
    top: 8%;
    right: 6%;
  }

  .home_start_url{
    width: 44%;
    height: 9%;
    position: absolute;
    bottom: 8%;
    right: 28%;
  }
  .notes_info{
    width: 77%;
    height: 37%;
    position: absolute;
    top: 29%;
    left: 15%;
    font-size: 10px;
  }
  .notes_button{
    width: 44%;
    height: 9%;
    position: absolute;
    bottom: 22%;
    right: 28%;
  }

  .receive_success_url{
    width: 44%;
    height: 16%;
    position: absolute;
    top: 8%;
    right: 28%;
  }

  .share_button{
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
  .b_c{
    background-color: #eef1f6;
    color: #bbb;
  }
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 100px;
  }

</style>
