<template>
  <div id="newAdd">
    <div class="contentMsg">
      <xo-nav-path></xo-nav-path>
    </div>
    <div class="contentMsg">
      <el-card :style="{ height: height + 'px'}" style="overflow: auto;">
        <el-row>
          <el-col :span="24" style="border-bottom: 1px solid gainsboro">
            <h3 style="margin-bottom: 10px;">添加门店</h3>
          </el-col>



          <el-form ref="form" :model="form" label-width="0px">
            <el-col :span="24" class="cell">
              <el-col :span="24">
                <el-form-item>

                  <div class="flex_a">
                    <el-select :class="{isSelected:form.provinceClass === true}" v-model="form.province"
                               @change="myChange(form,'province','provinceClass','isProvince')" placeholder="请选择省">
                      <el-option
                        v-for="item in provinceList"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>

                    <div class="margin_l_10">
                      <el-select :class="{isSelected:form.cityClass === true}" v-model="form.city"
                                 @change="myChange(form,'city','cityClass','isCity')" placeholder="请选择市">
                        <el-option
                          v-for="item in form.cityList"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                    </div>

                    <div class="margin_l_10">
                      <el-select :class="{isSelected:form.areaClass === true}" v-model="form.area"
                                 @change="myChange(form,'area','areaClass')" placeholder="请选择区">
                        <el-option
                          v-for="item in form.areaList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-col :span="16">
                    <el-input v-model="form.storeInfo" placeholder="请输入门店关键字"></el-input>
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <el-button>搜索</el-button>
                  </el-col>
                </el-form-item>


                <el-form-item>
                  <el-transfer v-model="form.data" :data="form.data2" :titles="['门店','已选门店']"></el-transfer>
                </el-form-item>


                <!--<el-form-item>
                  <el-row>
                    <el-col :span="11">
                      <el-tree
                        :data="form.data3"
                        show-checkbox
                        node-key="id"
                        @check-change="click"
                        @node-collapse="click1"
                        :default-expanded-keys="[17]"
                        :default-checked-keys="[17]"
                        :props="defaultProps">
                      </el-tree>
                    </el-col>

                    <el-col :span="1">-</el-col>

                    <el-col :span="11">

                      <el-card class="box-card">
                        已选门店
                      </el-card>

                      <el-col :span="24">
                        <el-tree
                          :data="form.data4"
                          show-checkbox
                          node-key="id"
                          :default-expanded-keys="[2]"
                          :default-checked-keys="[5,2]">
                        </el-tree>
                      </el-col>


                    </el-col>
                  </el-row>
                </el-form-item>-->


              </el-col>
            </el-col>
          </el-form>



          <el-col :span="24">
            <el-col :span="12" class="flex-jc">
              <el-button>取消</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary">确定</el-button>
            </el-col>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<script>
  import xoNavPath from './NavPath.vue'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        form: {
          data: [2], // 已选门店key
          data2: [
            {
              key: 10,
              label: '门店组1',
            },
            {
              key: 2,
              label: '门店组2',
            },
            {
              key: 3,
              label: '门店组3',
            }
          ],
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }
          ],
          value: '',
          storeInfo: '',
          data3: [{
            id: 0,
            label: '全部',
            children: [{
              labelId: 17,
              label: '一级 1',
              children: [{
                id: 4,
                label: '二级 1-1',
              }]
            }, {
              id: 2,
              label: '一级 2',
              children: [{
                id: 5,
                label: '二级 2-1'
              }, {
                id: 6,
                label: '二级 2-2'
              }]
            }, {
              id: 3,
              label: '一级 3',
              children: [{
                id: 7,
                label: '二级 3-1'
              }, {
                id: 8,
                label: '二级 3-2'
              }]
            }]
          }],
          data4: [{
            id: 3,
            label: '二级 2-1',
            disabled: true,
            children: [{
              id: 4,
              label: '三级 3-1-1'
            }, {
              id: 5,
              label: '三级 3-1-2',
            }]
          }, {
            id: 2,
            label: '二级 2-2',
            disabled: true,
            children: [{
              id: 6,
              label: '三级 3-2-1'
            }, {
              id: 7,
              label: '三级 3-2-2',
            }]
          }],
          province: "",
          provinceClass: false,
          city: "",
          cityList: [],
          cityClass: false,
          area: "",
          areaList: [],
          areaClass: false,
        },
        height: 0,
        provinceList: []
      }
    },
    props: {
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    },
    components: {
      xoNavPath
    },
    computed: {
      ...mapGetters([
        'getTopHeight'
      ]),
    },
    methods: {
      myChange(map, name, className, str) {
        if (str === 'isProvince') {
          areaList.forEach((data) => {
            if (data.name === map.province) {
              this.$set(map, "city", '');
              this.$set(map, "area", '');
              this.$set(map, "cityList", data.city);
              this.$set(map, "areaList", []);
            }
          })
        }
        if (str === 'isCity' && map.city !== "") {
          map.cityList.forEach((data) => {
            if (data.name === map.city) {
              this.$set(map, "area", '');
              this.$set(map, "areaList", data.area);
            }
          })
        }

        if (map[name] !== "") {
          map[className] = false
        } else {
          map[className] = true
        }
      },
      click(value1){
        console.log(value1.$treeNodeId);
      },
      click1(value1){
        console.log(value1);
      },
    },
    created() {
      this.provinceList = []
    },
    mounted() {
      // 高度调整
      var totalH = window.innerHeight - this.getTopHeight;
      var topH = document.querySelector('.contentMsg').clientHeight;

      this.height = totalH - topH - 50;
    }
  }
</script>
<style scoped lang="less">
  .contentMsg {
    padding: 0 0 25px 0;
  }

  .selectedStore {
    padding-bottom: 10px;
    border-bottom: 1px solid gainsboro;
  }

  .cell {
    margin-top: 20px;
  }
</style>
