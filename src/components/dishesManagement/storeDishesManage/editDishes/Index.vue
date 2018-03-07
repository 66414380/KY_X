<template>
  <div>

    <div class="margin_b_10">
      <xo-nav-path :navList="navList"></xo-nav-path>
    </div>

    <div>
      <el-table :data="dishesList" border style="width: 100%;">

        <el-table-column label-class-name="table_head" header-align="center" align="center" label="排序">

          <template slot-scope="scope">
            <el-input v-model="scope.row.sequence"></el-input>
          </template>

        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品名称"
                         width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.productname"></el-input>
          </template>
        </el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id"
                         label="菜品编码"
                         width="120"></el-table-column>

        <el-table-column label-class-name="table_head" header-align="center" align="center"
                         label="第三方编码" width="420">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.morecodes" class="flex_a padding_10">
              <div style="width:150px">
                <el-input v-model="item.value" placeholder="请输入名称"></el-input>
              </div>
              <div class="m-rank">
                <div class="m-rank-child"></div>
              </div>
              <div style="width:150px">
                <el-input v-model="item.value" placeholder="请输入编码"></el-input>
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
          </template>


        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="所属品类" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.categoryid" placeholder="请选择">
              <el-option
                v-for="item in scope.row.categoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="参考价格"
                         width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品图片"
                         width="140">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.image">
              <el-popover
                placement="right"
                width="200"
                trigger="hover"
              >
                <img src="../../../../assets/login-ky-login-small.png" alt="" style="width: 200px;height: 200px">
                <img slot="reference" src="../../../../assets/login-ky-login-small.png" alt=""
                     style="width: 100px;height: 100px">
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品详情"
                         width="120">
          <template slot-scope="scope">

            <el-input v-model="scope.row.description"></el-input>

          </template>

        </el-table-column>


        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品规格" width="360">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.skus" class="flex_a margin_b_10">
              <el-select v-model="item.value" placeholder="请选择" style="width:120px">
                <el-option
                  v-for="item1 in specList"
                  :key="item1.id"
                  :label="item1.name"
                  :value="item1.id">
                </el-option>
              </el-select>
              <div class="margin_l_10" style="width:120px">
                <el-input v-model="item.value1" placeholder="请输入内容"></el-input>
              </div>

              <div class="m-storeCode margin_l_10" @click="addDomain2(scope.row.skus)">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </div>

              <div v-if="index !== 0" class="m-storeCode margin_l_10"
                   @click.prevent="removeDomain2(scope.row.skus, index)">
                <i class="fa fa-minus-circle" aria-hidden="true"></i>
              </div>
            </div>
          </template>
        </el-table-column>


        <el-table-column label-class-name="table_head" header-align="center" align="center" label="菜品属性"
                         width="300">
          <template slot-scope="scope">
            <div class="">
              <el-button size="small" type="primary" @click="addAttr(scope.row.property)" class="margin_b_10">+新增属性</el-button>
              <div v-for="(item,index) in scope.row.property" class="margin_b_10">
                <div class="flex_a margin_b_10">
                  <div style="position: relative" class="margin_r_10">
                    <el-input size="small" v-model="item.property" placeholder="属性">
                    </el-input>
                    <i class="el-icon-delete pointer" style="position: absolute;top: 0;right: 0" @click="delAttr(scope.row.property,index)"></i>
                  </div>
                  <el-button size="small" type="primary" @click="addAttrCell(item)">+属性值</el-button>

                </div>

                <div  class="flex_a" >
                  <div style="position: relative" v-for="(item1,index1) in item.list" :key="item1.id" class="margin_r_10">
                    <el-input size="small"  v-model="item1.id" placeholder="如冷热">
                    </el-input>
                    <i class="el-icon-delete pointer" style="position: absolute;top: 0;right: 0" @click="delAttrCell(item.list,index1)"></i>
                  </div>
                </div>

              </div>
            </div>

          </template>

        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" label="餐盒配置"
                         width="360">

          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.luncboxes" class="flex_a margin_b_10">
              <el-select v-model="item.id" placeholder="请选择" style="width:120px">
                <el-option
                  v-for="item1 in boxList"
                  :key="item1.id"
                  :label="item1.name"
                  :value="item1.id">
                </el-option>
              </el-select>
              <div class="margin_l_10" style="width:120px">
                <el-input v-model="item.value1" placeholder="请输入内容"></el-input>
              </div>

              <div class="m-storeCode margin_l_10" @click="addDomain4(scope.row.luncboxes)">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </div>

              <div v-if="index !== 0" class="m-storeCode margin_l_10"
                   @click.prevent="removeDomain4(scope.row.luncboxes, index)">
                <i class="fa fa-minus-circle" aria-hidden="true"></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="status" label="平台信息"
                         width="340">

          <template slot-scope="scope">
            <div class="flex_r">
              <div class="flex_1" v-for="(item,index) in scope.row.plat">
                <div>
                  {{item.value}}
                </div>
                <div class="margin_b_10">
                  {{item.value1}}
                </div>
                <div v-for="(item1,index) in item.value2">
                  {{item1.value}} {{item1.value1}}
                </div>

              </div>
            </div>

          </template>

        </el-table-column>


      </el-table>


    </div>


  </div>
</template>

<script>


  import Hub from '../../../utility/commun'

  import {mapActions, mapGetters} from 'vuex';


  export default {
    components: {
    },
    data() {
      return {
        navList: [{name: "菜品管理", url: ''},{name: "菜品列表", url: '/dishesManagement/dishesManageList'}, {name: "编辑菜品", url: ''}],


        attrList: [{id: 1, name: '辣度'}, {id: 2, name: '甜度'}, {id: 3, name: '口味'}],
        boxList:[{
          id: 1,
          name: '大杯'
        }, {
          id: 2,
          name: '中杯'
        }, {
          id: 3,
          name: '小杯'
        }],
        specList: [{
          id: 1,
          name: '品类1'
        }, {
          id: 2,
          name: '品类2'
        }],
        dishesList: [{
          sequence: '1',
          id: '83789',
          productname: '菜品1',
          price: "1角",
          status: '在售中',
          image: [{img: '../../../assets/login-ky-login-small.png'}],
          categoryid: 2,
          description: '好吃的',
          categoryList: [{
            value: 1,
            label: '品类1'
          }, {
            value: 2,
            label: '品类2'
          }],
          morecodes: [
            {value: '11', value1: '22'},
            {value: '33', value1: '44'},
            {value: '55', value1: '66'}
          ],


          skus: [
            {skuid: '大份', price: '￥90.00'},
            {skuid: '中份', price: '￥80.00'},
            {skuid: '小份', price: '￥70.00'},
          ],

          property: [],

          luncboxes: [
              {lunchboxid: 1, count: '¥18.99'},
              {lunchboxid: 3, count: '¥17.99'},
            ],
          plat: [
            {
              value: '美团',
              value1: 'MT鱼香肉丝',
              value2: [{value: '大份', value1: '￥90.00'}, {value: '中份', value1: '￥80.00'}, {
                value: '小份',
                value1: '￥70.00'
              },]
            },
            {
              value: '饿了么',
              value1: 'ele鱼香肉丝',
              value2: [{value: '大份', value1: '￥90.00'}, {value: '中份', value1: '￥80.00'}, {
                value: '小份',
                value1: '￥70.00'
              },]
            },
            {
              value: '百度',
              value1: 'BD鱼香肉丝',
              value2: [{value: '大份', value1: '￥90.00'}, {value: '中份', value1: '￥80.00'}, {
                value: '小份',
                value1: '￥70.00'
              },]
            }
          ]
        }],

      }
    },
    watch: {},
    methods: {
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
        item.list.push({id:''})
      },
      changeAttr(changeAttr){
        changeAttr.checkList = []
      },

      removeDomain(list, i) {
        list.splice(i, 1)
      },
      addDomain(list) {
        list.push({value: '', value1: ''});
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
    },
    created() {

      this.dishesList.forEach((map) => {
        this.$set(map, 'select', false)
      })

    },
    mounted() {

    }


  }
</script>


<style scoped lang="less">
  .item {
    margin-right: 10px;
  }
</style>
