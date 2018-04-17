<template>
  <div >

    <div class="bodyTop padding_b_10">
      <div class="margin_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>


    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow-y: auto" :style="{height:tableHeight + 'px'}">
        <xo-pub-tree  :data='getOperationSchemeTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10 " :style="{width:tableWidth + 'px'}">

        <div class="flex_es margin_b_10">

          <div class="flex_a">
            <h3 class="margin_r_10">{{levelName}}</h3>
            <el-select size="small" filterable v-model="storeData_id" placeholder="请选择" @change="handleStore" @visible-change="canSelect">
              <el-option
                v-for="item in storeData"
                :key="item.base_store_id"
                :label="item.storename"
                :value="item.base_store_id">
              </el-option>
            </el-select>
            <div class="margin_l_10 flex_a">
              <el-button size="small" @click="reLoadData()" >重置</el-button>

              <el-button size="small" @click="step()" >同步至外卖平台</el-button>
              <el-button size="small" @click="stepTakeOut()" >同步至其他门店及外卖平台</el-button>
              <el-button size="small" @click="erpUp()" >从收银系统上新增菜品</el-button>
            </div>


          </div>

          <div class="flex_a">
            <div class="margin_r_10">
              <el-input size="small" v-model="searchName" placeholder="请输入菜品或品类名称"></el-input>
            </div>
            <el-button size="small" @click="search()">搜索</el-button>
          </div>
        </div>
        <div>
          双击菜品信息可编辑并自动同步到外卖平台
        </div>
        <el-form ref="formRules" :model="form" class="myForm">
        <el-table :data="form.tableData" border :height="tableHeight - 60" style="width: 100%;" @select-all="handleSelectionChange" ref="multipleTable" @cell-dblclick="clickOne">
          <el-table-column
            header-align="center" align="center"
            type="selection"
            label-class-name="mySelect"
            width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="sequence" label="排序" width="140">
            <template slot-scope="scope" >


            <el-form-item v-if="scope.row.id === clickId && '排序' === clickProp " label="">
              <el-input v-model="scope.row.sequence" icon="edit" :on-icon-click="()=>{
                return handleIconClick(scope.row)
              }"></el-input>
            </el-form-item>
              <div class="flex" v-else>
                {{scope.row.sequence}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="x0_productid" label="菜品编码"
                           width="100"></el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="dishname" label="名称"
                           width="140">

            <template slot-scope="scope" >
              <el-form-item v-if="scope.row.id === clickId && '名称' === clickProp " label="" >
                <el-input v-model="scope.row.dishname" icon="edit" :on-icon-click="()=>{
                return handleIconClick(scope.row)
              }"></el-input>
              </el-form-item>
            <div class="flex" v-else>
              {{scope.row.dishname}}
            </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="morecodes"
                           label="第三方编码" width="280">
            <template slot-scope="scope">


              <div v-if="scope.row.id === clickId && '第三方编码' === clickProp ">
                <div v-for="(item, index) in scope.row.morecodes"   class="flex_r padding_10 ">
                  <div style="width:150px">
                    <el-input v-model="item.code1" placeholder="请输入名称"></el-input>
                  </div>
                  <div class="m-rank">
                    <div class="m-rank-child"></div>
                  </div>
                  <div style="width:150px">
                    <el-input v-model="item.code2" placeholder="请输入编码"></el-input>
                  </div>
                  <div class="flex_sb" style="width:80px">
                    <div class="m-storeCode margin_l_10" @click="addDomain(scope.row.morecodes)">
                      <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    </div>
                    <div v-if="index !== 0" class="m-storeCode margin_l_10"
                         @click.prevent="removeDomain(scope.row.morecodes,index)">
                      <i class="fa fa-minus-circle" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
                <el-button size="small" @click="handleIconClick(scope.row)" >保存</el-button>
              </div>


              <div v-for="(item,index) in scope.row.morecodes" v-else>
                <span>{{item.code1}} -- {{item.code2}}</span>
              </div>
            </template>


          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="categoryname" label="所属品类"
                           width="120">
            <template slot-scope="scope">
            <el-form-item label="" v-if="scope.row.id === clickId && '所属品类' === clickProp ">
              <el-select v-model="scope.row.categoryname" placeholder="请选择" @change="()=>{
              return handleIconClick(scope.row)
              }">
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.categoryname"
                  :value="item.categoryname">
                </el-option>
              </el-select>
            </el-form-item>

              <div class="flex" v-else>
                {{scope.row.categoryname}}
              </div>
            </template>

          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="price" label="参考价格"
                           width="140">

            <template slot-scope="scope">
              <el-form-item v-if="scope.row.id === clickId && '参考价格' === clickProp " label="" >
                <el-input v-model="scope.row.price" icon="edit" :on-icon-click="()=>{
                return handleIconClick(scope.row)
              }"></el-input>
              </el-form-item>
              <div class="flex" v-else>
                {{scope.row.price}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="image" label="菜品图片"
                           width="140">
            <template slot-scope="scope">

              <el-upload
                :action="$updateUrl"
                name='filename'
                :show-file-list="false"
                :on-success="(res, file,list)=>{
                  return handleAvatarSuccess1(res, file,list,scope.row)
                }"
                :before-upload="beforeAvatarUpload">
                <div style="margin-top: 7px" v-if="scope.row.image">
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                >
                  <img  :src="scope.row.image" alt=""  style="width: 200px;height: 200px">
                <img slot="reference" v-if="scope.row.image" :src="scope.row.image" style="width: 100px;height: 100px" class="pointer">
                </el-popover>
                </div>

                <div class="noImg" v-else>
                </div>
              </el-upload>


                <!--<div style="margin-top: 7px" v-if="scope.row.image">-->
                  <!--<el-popover-->
                    <!--placement="top"-->
                    <!--width="200"-->
                    <!--trigger="hover"-->
                  <!--&gt;-->
                    <!--<img  :src="scope.row.image" alt=""  style="width: 200px;height: 200px">-->
                    <!--<img slot="reference" :src="scope.row.image" alt=""  style="width: 100px;height: 100px">-->
                  <!--</el-popover>-->
                <!--</div>-->
                <!--<div class="noImg" v-else>-->
                <!--</div>-->


            </template>


          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="description" label="菜品详情"
                           width="160">

            <template slot-scope="scope">

              <el-form-item v-if="scope.row.id === clickId && '菜品详情' === clickProp " label="" >
                <el-input v-model="scope.row.description" icon="edit" :on-icon-click="()=>{
                return handleIconClick(scope.row)
              }"></el-input>
              </el-form-item>

              <div class="flex" v-else>
                {{scope.row.description}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center"  label="菜品规格" prop="skus"
                           width="320">
            <template slot-scope="scope">

              <div v-if="scope.row.id === clickId && '菜品规格' === clickProp">

                <div v-for="(item,index) in scope.row.skus" class="flex_a m_16" >
                  <el-form-item label="" :prop="'tableData.' + scope.$index  + '.skus.' + index + '.skuname'" :rules="{required: true, message: '请选择菜品规格', trigger: 'blur'}">
                    <el-select v-model="item.skuname" placeholder="请选择" style="width:120px">
                      <el-option
                        v-for="item1 in skuList"
                        :key="item1.id"
                        :label="item1.skuname"
                        :value="item1.skuname">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <div class="margin_l_10" style="width:120px">
                    <el-form-item label="" :prop="'tableData.' + scope.$index  + '.skus.' + index + '.price'" :rules="{required: true, validator: checkNumber, trigger: 'blur'}">
                      <el-input v-model="item.price" placeholder="请输入价格" ></el-input>
                    </el-form-item>
                  </div>

                  <div class="m-storeCode margin_l_10" @click="addDomain2(scope.row.skus)">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                  </div>

                  <div v-if="index !== 0" class="m-storeCode margin_l_10"
                       @click.prevent="removeDomain2(scope.row.skus, index)">
                    <i class="fa fa-minus-circle" aria-hidden="true"></i>
                  </div>
                </div>

                <el-button size="small" @click="handleIconClickValidate(scope.row,'formRules')" >保存</el-button>
              </div>


              <div v-for="(item,index) in scope.row.skus" v-else>
                <span v-if="item.price !== ''">{{item.skuname}} ￥{{item.price}}</span>
              </div>

            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品属性" prop="property"
                           width="240">
            <template slot-scope="scope">

              <div v-if="scope.row.id === clickId && '菜品属性' === clickProp">
                <div class="margin_b_10">
                  <el-button size="small" type="primary" @click="addAttr(scope.row.property)">+新增属性</el-button>
                </div>
                <div v-for="(item,index) in scope.row.property" class="margin_b_10">
                  <div class="flex_a margin_b_10">
                    <div style="position: relative" class="margin_r_10">
                      <el-input size="small" v-model="item.attr" placeholder="属性">
                      </el-input>
                      <i class="el-icon-delete pointer" style="position: absolute;top: 0;right: 0" @click="delAttr(scope.row.property,index)"></i>
                    </div>
                    <el-button size="small" type="primary" @click="addAttrCell(item)">+属性值</el-button>
                  </div>

                  <div  class="flex_a" >
                    <div style="position: relative" v-for="(item1,index1) in item.list" class="margin_r_10">
                      <el-input size="small"  v-model="item1.value" placeholder="如冷热">
                      </el-input>
                      <i class="el-icon-delete pointer" style="position: absolute;top: 0;right: 0" @click="delAttrCell(item.list,index1)"></i>
                    </div>
                  </div>
                </div>

                <el-button size="small" @click="handleIconClick(scope.row)" >保存</el-button>
              </div>

              <div v-for="(item,index) in scope.row.property" v-else>
                <div class="flex">
                  <div class="margin_r_10">{{item.attr}}</div>
                  <div v-for="(item,index) in item.list">
                    <span class="margin_r_10"> {{item.value}}</span>
                  </div>
                </div>

              </div>
            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" label="餐盒" prop="lunchboxes" width="380">
            <template slot-scope="scope">

            <div v-if="scope.row.id === clickId && '餐盒' === clickProp">
              <div v-for="(item,index) in scope.row.lunchboxes" class="flex_a m_16">
                <el-form-item label="" :prop="'tableData.' + scope.$index  + '.lunchboxes.' + index + '.lunchboxid'" :rules="{type:'number',required: true, message: '请选择餐盒配置', trigger: 'blur'}">
                  <el-select v-model="item.lunchboxid" placeholder="请选择" style="width:120px">
                    <el-option
                      v-for="item1 in boxList"
                      :key="item1.id"
                      :label="item1.lunchboxname"
                      :value="item1.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div class="margin_l_10" style="width:120px">
                  <el-form-item label="" :prop="'tableData.' + scope.$index  + '.lunchboxes.' + index + '.count'" :rules="{required: true, validator: (rule, value, callback) => {
                            return checkNumber_1(rule, value, callback,'请输入数量','数量格式错误')
                            }, trigger: 'blur'}">
                    <el-input v-model="item.count" placeholder="请输入数量" ></el-input>
                  </el-form-item>
                </div>

                <div class="m-storeCode margin_l_10" @click="addDomain4(scope.row.lunchboxes)">
                  <i class="fa fa-plus-circle" aria-hidden="true"></i>
                </div>

                <div v-if="index !== 0" class="m-storeCode margin_l_10"
                     @click.prevent="removeDomain4(scope.row.lunchboxes, index)">
                  <i class="fa fa-minus-circle" aria-hidden="true"></i>
                </div>
              </div>
              <el-button size="small" @click="handleIconClickValidate(scope.row,'formRules')" >保存</el-button>
            </div>

            <div v-else>
              <div v-if="scope.row.lunchboxes !== null" >
                <div v-for="(item,index) in scope.row.lunchboxes" class="margin_b_10">
                  <span v-if="item.count !== ''" >
                    {{item.lunchboxname}} X{{item.count}} ￥{{item.price}}
                  <el-button size="small" type="primary" @click="link(item.lunchboxid,2,'营运餐盒',scope.row.id)" v-if="item.erpcode ===null">关联餐盒</el-button>

                    <span v-if="item.erpcode !==null">{{item.erpcode}}</span>
                    <el-button size="small" @click="unlinkBox(scope.row.id,item.lunchboxid)" v-if="item.erpcode !==null">解除关联</el-button>

                  </span>
                </div>
                <div v-if="scope.row.totalBoxPrice !== 0" style="border-top: 1px solid #BECBD9">餐盒总价：￥{{scope.row.totalBoxPrice}}</div>
              </div>
            </div>

            </template>
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center"  label="平台信息"
                           width="340">

            <template slot-scope="scope">


<div class="flex_f flex_a" v-if="scope.row.id === clickId && '平台信息' === clickProp">
  <div class="flex_sa" >
    <div v-if="scope.row.mt_skus !== null">
      <div class="margin_b_10">
        {{scope.row.mt_skus.name}}
      </div>
      <div class="margin_b_10">
        <el-form-item label="" :prop="'tableData.' + scope.$index  + '.mt_skus.dishname'" :rules="{required: true, message: '请输入菜品名称', trigger: 'blur'}">

        <el-input size="small" class="w_80" v-model="scope.row.mt_skus.dishname" placeholder="菜品名称">
        </el-input>
        </el-form-item>
      </div>
      <div class="margin_b_10" v-for="(item,index) in scope.row.mt_skus.skus">

        <div class="flex">
          {{item.skuname}}
          <el-form-item label="" :prop="'tableData.' + scope.$index  + '.mt_skus.skus.' + index + '.price'" :rules="{required: true, validator: checkNumber, trigger: 'blur'}">
          <el-input size="small" class="w_50" v-model="item.price" placeholder="价格">
          </el-input>
          </el-form-item>
        </div>
      </div>
    </div>


    <div v-if="scope.row.el_skus !== null">
      <div class="margin_b_10">
        {{scope.row.el_skus.name}}
      </div>
      <div class="margin_b_10">
        <el-form-item label="" :prop="'tableData.' + scope.$index  + '.el_skus.dishname'" :rules="{required: true, message: '请输入菜品名称', trigger: 'blur'}">

        <el-input size="small" class="w_80" v-model="scope.row.el_skus.dishname" placeholder="菜品名称">
        </el-input>
        </el-form-item>
      </div>
      <div class="margin_b_10" v-for="(item,index) in scope.row.el_skus.skus">
        <div class="flex">
          {{item.skuname}}
          <el-form-item label="" :prop="'tableData.' + scope.$index  + '.el_skus.skus.' + index + '.price'" :rules="{required: true, validator: checkNumber, trigger: 'blur'}">
          <el-input size="small" class="w_50" v-model="item.price" placeholder="价格">
          </el-input>
          </el-form-item>
        </div>


      </div>
    </div>



  </div>
  <el-button class="w_30" size="small" @click="handleIconClickValidate(scope.row,'formRules')" >保存</el-button>
</div>




              <div class="flex_sa" v-else>
                <div v-if="scope.row.mt_skus !== null">
                  <div class="margin_b_10">
                    {{scope.row.mt_skus.name}}
                  </div>
                  <div class="margin_b_10">
                    {{scope.row.mt_skus.dishname}}
                  </div>
                  <div class="margin_b_10" v-for="(item,index) in scope.row.mt_skus.skus">
                    {{item.skuname}} ￥{{item.price}}
                  </div>
                </div>


                <div v-if="scope.row.el_skus !== null">
                  <div class="margin_b_10">
                    {{scope.row.el_skus.name}}
                  </div>
                  <div class="margin_b_10">
                    {{scope.row.el_skus.dishname}}
                  </div>
                  <div class="margin_b_10" v-for="(item,index) in scope.row.el_skus.skus">
                    {{item.skuname}} ￥{{item.price}}
                  </div>
                </div>
              </div>


            </template>

          </el-table-column>

          <!--<el-table-column label-class-name="table_head" header-align="center" align="center" label="上下架操作" width="120">-->
            <!--<template slot-scope="scope">-->

              <!--<div  @click.prevent="handleSwitch(scope.row.id,scope.row.is_pay_invoice)">-->
                <!--<el-switch-->
                  <!--v-model="scope.row.is_pay_invoice"-->
                  <!--on-color="#13ce66"-->
                  <!--off-color="#ff4949">-->
                <!--</el-switch>-->
              <!--</div>-->
            <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="收银系统菜品" width="140">
            <template slot-scope="scope">

              <el-button size="small" type="primary" @click="link(scope.row.id,1,'营运菜品')" v-if="scope.row.erpcode ===null">关联菜品</el-button>

              <div class="">
                <span>{{scope.row.erpcode}}</span>
                <el-button size="small" @click="unlinkDishes(scope.row.id)" v-if="scope.row.erpcode !==null">解除关联</el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="更新记录" width="240">
            <template slot-scope="scope">
              <div class="flex_f">
                <div class="flex">
                  <span class="margin_r_10" v-for="(item,index) in scope.row.dishUpdatelog[0]" >{{item}}</span>
                </div>
                <el-button type="text" @click="showHistory(scope.row.dishUpdatelog)">查看历史</el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column label-class-name="table_head" header-align="center" align="center" label="操作" width="160">
          <template slot-scope="scope">

              <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>
            <el-button size="small"  @click="gq(scope.row.id)" v-show="scope.row.stocktype === 1">沽清</el-button>
            <el-button size="small"  @click="zm(scope.row.id)" v-show="scope.row.stocktype === 2">置满</el-button>
          </template>
          </el-table-column>
        </el-table>
        </el-form>
        <footer>
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>


    </div>
    <el-dialog title="是否将菜品更新变化同步至外卖平台？" :visible.sync="dialogVisible2">
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="mt">美团</el-checkbox>
        <el-checkbox label="el">饿了么</el-checkbox>
        <!--<el-checkbox label="3">百度</el-checkbox>-->
      </el-checkbox-group>
      <div class="flex_a margin_t_10">
        <el-radio class="margin_r_10" :label="0" v-model="radio2">立即生效</el-radio>
        <span class="margin_l_10">指：将已修改的菜品信息立即同步到对应的外卖平台</span>
      </div>
      <div class="margin_t_10">
        <div class="flex_a">
          <el-radio class=" margin_r_10" :label="1" v-model="radio2">定时下发</el-radio>
          <span class="margin_l_10">指：将已修改的菜品信息于指定时间同步到对应的外卖平台</span>
        </div>
        <div v-if="radio2 === 1" class="margin_t_10">
          <el-date-picker
            v-model="time"
            type="datetime"
            :picker-options="pickerOptions0"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </div>


      <div class="flex margin_t_10">
        <el-button  type="primary" @click="save()" >确认</el-button>
        <el-button  @click="out()" >取消</el-button>
      </div>
    </el-dialog>

    <!--选择门店-->
    <el-dialog title="选择门店" :visible.sync="dialogFormVisible1" >
      <div class="flex_ce">
        <div class="flex_a">
          <el-input size="small" placeholder="请输入门店名称" class="margin_r_10" v-model="storeName"></el-input>
          <el-button size="small" @click="searchStore()">搜索</el-button>
        </div>
      </div>
      <div class="margin_t_10">
        <el-table :data="storeData1" border style="width: 100%;" @select-all="handleSelectionChange1" ref="multipleTable1">

          <el-table-column
            header-align="center" align="center"
            type="selection"
            label-class-name="mySelect"
            width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.select" @change="handleChecked1">{{scope.$index + 1 }}</el-checkbox>
            </template>
          </el-table-column>


          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="storename" label="门店名称">
          </el-table-column>
          <el-table-column label-class-name="table_head" header-align="center" align="center" prop="base_store_id" label="门店编码">
          </el-table-column>
        </el-table>
      </div>
      <div class="margin_t_10">
        <el-button type="primary" @click="submit()">确认</el-button>
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
      </div>
    </el-dialog>


    <el-dialog title="" :visible.sync="dialogFormVisible2" >
      <div class="flex_f flex_a width_100">
        <div class="margin_b_10" v-for="(item,index) in history" >{{item.username}} {{item.time}}</div>
      </div>
      <div class="flex_f flex_a width_100" v-if="history.length === 0">
        暂无数据
      </div>
    </el-dialog>

    <!--选择菜品/餐盒-->
    <xo-dishes ref="dishes" name="名称" :select="select" :list="erpList" :currentRow="currentRow" :id="id" :x2dishid="x2dishid" :storeData_id ='storeData_id' @submitErp="submitErp"></xo-dishes>
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
    components: {

    },
    computed:{
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
    },
    data() {
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() +  3600 * 24 * 1000 * 7;
          }
        },
        time:'',
        radio2:'',
        checkList:[],
        dialogFormVisible1:false,
        dialogFormVisible2:false,
        dialogVisible2: false,
        tableWidth: 0,
        tableHeight: 0,
        navList: [{name: "运营方案", url: ''}],
        levelName:'',
        form:{tableData: []},
        p: {page: 1, size: 20, total: 0},
        showAdd:'',
        baseDishes: {},
        storeData:[],
        storeData_id:'',
        searchName:'',
        selectOne:false,
        clickId:'',
        clickProp:'',
        categoryList:[],
        skuList:[],
        boxList:[],
        storeName:'',
        storeData1:[],

        select:'',//收银系统名称
        erpList:[],
        id:'',
        x2dishid:'',
        currentRow:{check:null},
        history:[]
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setOperationSchemeTree','setOperationSchemeLevelId']),
      ...mapGetters(['getOperationSchemeTree','getOperationSchemeLevelId']),
      showHistory(list){
        this.dialogFormVisible2 = true;
        this.history = list
      },
      erpUp(){
        let params = {
          redirect: "x2a.dish.erpcreate",
          storeid: this.storeData_id,
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.$message(`更新成功：${res.data}个菜品！`);
            this.showResouce(this.p,this.dishesName);
          }
        });
      },
      unlinkBox(x2dishid,lunchboxid){
        this.$confirm('此操作将解除关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.dish.linkerpbox",
            x2dishid: x2dishid,
            lunchboxid:lunchboxid,
            erpfoodid:''
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.$message("操作成功");
              this.showResouce(this.p,this.dishesName);
            }
          });
        }).catch(() => {
          //
        });
      },
      link(id,int,select,x2dishid = ''){
        this.select = select;
        let params = {
          redirect: "x2a.dish.erpdish",
          storeid:this.storeData_id,
          type:int
        };
        oneTwoApi(params).then((res) => {
          if(res.errcode === 0){
            this.id = id;
            this.x2dishid = x2dishid;
            this.erpList = res.data;
            this.$refs.dishes.openDialog();
          }
        });


      },
      submitErp(){
        this.currentRow.check = null;
        this.getSchemeData(this.p);
      },
      unlinkDishes(id){
        this.$confirm('此操作将解除关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.dish.linkerpdish",
            x2dishid: id,
            erpfoodid:''
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.$message("操作成功");
              this.showResouce(this.p,this.dishesName);
            }
          });
        }).catch(() => {
          //
        });
      },

      submit(){
        let storeList = [],dishesList = [];
        this.storeData1.forEach((item)=>{
          if(item.select === true){
            storeList.push(item.base_store_id)
          }
          });

        this.form.tableData.forEach((item)=>{
          if (item.select === true){
            dishesList.push(item.id)
          }
        });

        if(storeList.length === 0){
          this.$message.warning('请选择门店');
          return
        }
        if(dishesList.length === 0){
          this.$message.warning('请选择菜品');
          return
        }
        let params = {
          redirect: "x2a.dish.publish",
          id: dishesList.join(','),
          from_storeid: this.storeData_id,
          to_storeid: storeList.join(',')
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.$message('操作成功');
            this.dialogFormVisible1 = false;
            this.getSchemeData(this.p)
          }
        })
      },
      store(storeName){
        //获取门店列表
        let list = [];
        let params = {
          redirect: "x2.store.index",
          levelId: this.getOperationSchemeLevelId(),
          storeName: storeName,
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            res.data.list.forEach((item)=>{
              item.select = false
            });

             list = res.data.list.filter((item)=>{
             return item.base_store_id !== this.storeData_id
            });


            this.storeData1 = list;

          }
        })
      },
      searchDishes(){

  },
      searchStore(){
        this.store(this.storeName)
      },

      stepTakeOut(){
        this.storeName = '';
        this.dialogFormVisible1 = true;
        this.store('')
      },
      save(){
        if(this.checkList.length === 0){
          this.$message.warning('请选择平台');
          return
        }
        if(this.radio2 === ''){
          this.$message.warning('请选择生效时间');
          return
        }
        if(this.radio2 === 1 && (this.time === '' || this.time === undefined)){
          this.$message.warning('请选择日期时间');
          return
        }

        let params = {
          redirect: "x2a.dish.online",
          storeid:this.storeData_id,
          source:this.checkList.join(','),
          timetype: this.radio2 === 1?new Date(this.time * 1).format("yyyy-MM-dd hh:mm:ss"): 0,
          type:2,

        };

        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            this.clickId = "";
            this.$message('操作成功');
          }
        })

      },
      out(){
        this.time = '';
        this.radio2 = '';
        this.checkList = [];
        this.dialogVisible2 = false
      },
      step(){
        this.dialogVisible2 = true
      },
      handleIconClick (row){
        let re = /^[1-9]\d*$/;
        if (row.sequence === '') {
          this.$message.warning('排序必须填写');
          return
        }else {
          if(!re.test(row.sequence)){
            this.$message.warning('排序格式必须整数');
            return
          }
        }

        if(row.dishname === ''){
          this.$message.warning('名称必须填写');
          return
        }

        let re1 = /^0{1}([.]([1-9][0-9]?)|[.][0-9][1-9])$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/;
        if (row.price === '') {
          this.$message.warning('请输入价格');
          return
        }else {
          if(!re1.test(row.price)){
            this.$message.warning('价格格式错误');
            return
          }
        }

        if(this.clickId !== '' ){
          let params = {
            redirect: "x2a.dish.update",
            id:row.id,
            dishname:row.dishname,
            sequence: row.sequence,
            price:row.price,
            image:row.image,
            morecodes: window.JSON.stringify(row.morecodes),
            categoryname: row.categoryname,
            description: row.description,
            skus: window.JSON.stringify(row.skus),
            property: window.JSON.stringify(row.property),
            lunchboxes: window.JSON.stringify(row.lunchboxes),
            el_skus: window.JSON.stringify(row.el_skus),
            mt_skus: window.JSON.stringify(row.mt_skus),
            bd_skus:'',
            unit:row.unit,
            mincount:row.mincount
          };
          console.log(params)
          oneTwoApi(params).then((res) => {
            if (res.errcode === 0) {
              this.clickId = "";
              this.$message('操作成功');
            }
          })
        }
      },
      handleIconClickValidate(row,formName){
        if(this.clickProp === '餐盒'){
          // row.totalBoxPrice = 0;
          // row.lunchboxes.forEach((item1)=>{
          //   if(item1.lunchboxid !== ''){
          //   item1.totalprice =  item1.count * item1.price;
          //   row.totalBoxPrice += item1.totalprice
          //   }
          // });
          // row.totalBoxPrice = row.totalBoxPrice.toFixed(2);
          // console.log(row)
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
         this.handleIconClick(row)

          } else {
            console.log('error submit!!');
            this.$message({
              message: '请填写所需选项',
              type: 'warning'
            });
            return false;
          }
        });

      },
      clickOne(row, column, cell, event){
        this.clickId = row.id;
        this.clickProp = column.label
      },
      checkNumber_1(rule, value, callback,str1,str2){
        let re = /^[1-9]\d*$/;
        if (value === '') {
          callback(new Error(str1));
        }else {
          if(re.test(value)){
            callback()
          }else {
            callback(new Error(str2));
          }
        }
      },
      handleSwitch(id,is_pay_invoice){
        if(is_pay_invoice === true){
          this.$confirm('是否保存？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updatePayInvoice(id,0)
          }).catch(() => {

          });
        }else {
          // this.$confirm('是否保存？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   this.updatePayInvoice(id,1)
          // }).catch(() => {
          //
          // });
        }
      },


      close2() {
        this.baseDishes = {};

      },
      getPage(page) {
        this.p.page = page;
        this.getSchemeData(this.p);
      },
      getPageSize(size) {
        this.p.size = size;
        this.getSchemeData(this.p);
      },

      edit() {


      },
      zm(id){
        this.$confirm('确认置满吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.dish.updatestock",
            x2dishid:id,
            type:2
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.$message(res.data);
              this.getSchemeData(this.p)
            }
          })

        }).catch(() => {
          //
        });
      },
      gq(id){
        this.$confirm('确认沽清吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.dish.updatestock",
            x2dishid:id,
            type:1
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.$message(res.data);
              this.getSchemeData(this.p)
            }
          })

        }).catch(() => {
          //
        });
      },
      del(id) {
        this.$confirm('此操作将删除选择的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            redirect: "x2a.dish.delete",
            id:id,
          };
          oneTwoApi(params).then((res) => {
            if(res.errcode === 0){
              this.$message("操作成功");
              this.getSchemeData(this.p)
            }
          })

        }).catch(() => {
          //
        });
      },
      search() {
        this.getSchemeData(this.p = {page: 1, size: 20, total: 0})
      },
      handleStore() {
        if(this.selectOne === true) {
          this.getSchemeData(this.p = {page: 1, size: this.p.size, total: 0})
        }
      },
      getSchemeData(p) {
        //获取运营方案列表
        let params = {
          redirect: "x2a.dish.index",
          base_store_id:this.storeData_id,
          dishname: this.searchName,
          page: p.page,
          pagesize: p.size

        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            res.data.list.forEach((item)=>{
              item.select = false;
              item.totalBoxPrice = 0;
              if(item.lunchboxes === null){
                item.lunchboxes = [{lunchboxid: '', count: ''}]
              }else {
                item.lunchboxes.forEach((item1)=>{
                  if(item1.lunchboxid !== ''){
                    item.totalBoxPrice += item1.totalprice * 1
                  }
                });
                if(item.totalBoxPrice !== 0){
                  item.totalBoxPrice = item.totalBoxPrice.toFixed(2)
                }
              }


              if(item.skus === null){
                item.skus = [{skuid: '', price: ''}]
              }

              if(item.property === null){
                item.property = [{attr:'',list:[]}]
              }
            });

            this.form.tableData = res.data.list;
            this.p.total = res.data.count;

          }
        })

      },

      showResouce(){
        //获取门店列表
        let params = {
          redirect: "x2.store.index",
          levelId: this.getOperationSchemeLevelId(),
          storeName: '',
          noPage:1
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            if (res.data.list.length !== 0) {
              this.storeData_id = res.data.list[0].base_store_id;
            }

            this.storeData = res.data.list;

             this.getSchemeData(this.p = {page: 1, size: this.p.size, total: 0})
          }
        })

        let params0 = {
          redirect: "x2a.category.index",
          levelid:this.getOperationSchemeLevelId(),
          noPage:1,
        };
        oneTwoApi(params0).then((res) => {
          if(res.errcode === 0){
            this.categoryList = res.data.list;
          }
        });
        let params1 = {
          redirect: "x2a.sku.index",
          levelid:this.getOperationSchemeLevelId(),
          noPage:1,
        };
        oneTwoApi(params1).then((res) => {
          if(res.errcode === 0){
            this.skuList = res.data.list;
          }
        });
        let params2 = {
          redirect: "x2a.lunchbox.index",
          levelid:this.getOperationSchemeLevelId(),
          noPage:1,
        };
        oneTwoApi(params2).then((res) => {
          if(res.errcode === 0){
            this.boxList = res.data.list;
          }
        })
      },
      handleSelectionChange(val) {
        if(val.length === this.form.tableData.length){
          this.form.tableData.forEach((map) => {
            this.$set(map, 'select', true)
          });
        }else {
          this.form.tableData.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },

      handleChecked() {
        let list =  this.form.tableData.filter((item)=>{
          return item.select === true
        });

        if (list.length === this.form.tableData.length) {
          list.forEach((item)=>{
            this.$refs.multipleTable.toggleRowSelection(item)
          })
        }else {
          this.$refs.multipleTable.clearSelection();
        }

      },

      handleSelectionChange1(val) {
        if(val.length === this.storeData1.length){
          this.storeData1.forEach((map) => {
            this.$set(map, 'select', true)
          });
        }else {
          this.storeData1.forEach((map) => {
            this.$set(map, 'select', false)
          });
        }
      },

      handleChecked1() {
        let list =  this.storeData1.filter((item)=>{
          return item.select === true
        });

        if (list.length === this.storeData1.length) {
          list.forEach((item)=>{
            this.$refs.multipleTable1.toggleRowSelection(item)
          })
        }else {
          this.$refs.multipleTable1.clearSelection();
        }

      },


      canSelect(e){
        (e === true)? this.selectOne = true: this.selectOne = false
      },
      checkNumber(rule, value, callback){
        let re = /^0{1}([.]([1-9][0-9]?)|[.][0-9][1-9])$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/;
        if (value === '') {
          callback(new Error('请输入价格'));
        }else {
          if(re.test(value)){
            callback()
          }else {
            callback(new Error('价格格式错误'));
          }
        }
      },
      showLevel() {
        getApi1.getLevel('', 1).then((res) => {
          if (res.data.errcode === 0) {

            this.setOperationSchemeTree({list:res.data.data});
            if (this.getOperationSchemeLevelId() === '') {
              this.setOperationSchemeLevelId({levelId: res.data.data[0].id});
            }
            this.showResouce();
            recur(res.data.data,true,this.getOperationSchemeLevelId(),this)
          }
        });
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
        item.image = file.response.data.file_url;
        this.clickId = item.id;
        this.handleIconClick(item)
      },
      delAttrCell(list,i){
        list.splice(i, 1)
      },
      delAttr(list,i){
        list.splice(i, 1)
      },
      addAttr(item){
        item.push({attr:'',list:[]});
      },
      addAttrCell(item){
        if(item.list.length === 3){
          return
        }
        item.list.push({value:''})
      },
      removeDomain(list, i) {
        list.splice(i, 1)
      },
      addDomain(list) {
        list.push({code1: '', code2: ''});
      },
      removeDomain2(list, i) {
        list.splice(i, 1)
      },
      addDomain2(list) {
        list.push({skuid: '', price: ''});
      },
      removeDomain4(list, i) {
        list.splice(i, 1)
      },
      addDomain4(list) {
        list.push({lunchboxid: '', count: ''});
      },
      reLoadData(){
        this.clickId = '';
        this.clickProp = '';
        this.showResouce()
      },

    },
    created() {
      if(this.getOperationSchemeTree().length === 0){
        this.showLevel()
      }else {
        this.showResouce();
        recur(this.getOperationSchemeTree(),false,this.getOperationSchemeLevelId(),this)
      }

    },

    mounted() {
      Hub.$on('showAdd', (e) => {
        this.setOperationSchemeLevelId({levelId: e.levelid});
        recur(this.getOperationSchemeTree(),false,this.getOperationSchemeLevelId(),this);
        this.storeData_id = "";
        this.showResouce();
      });
      Hub.$emit('mountedOk','mountedOk');
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
    destroyed(){
      Hub.$off("showAdd");
    }
  }
</script>

<style scoped>
.noImg{
  margin: 7px 0;width: 100px;height: 100px;border: 1px dashed #d9d9d9;
}
  .m_16{
    margin-bottom: 16px
  }
  .w_80{
    width: 80%;
  }
.w_50{
  width: 50%;
}
.w_30{
  width: 30%;
}
</style>
