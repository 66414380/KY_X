<template>
  <!-- v-show="getTreeArr['打印机列表']"  -->
  <div>
    <div class="bodyTop padding_b_10">
      <div class="padding_b_10">
        <xo-nav-path :navList="navList"></xo-nav-path>
      </div>
    </div>
    <div class="flex_r">
      <div ref="tree" style="min-width: 200px;overflow: auto" :style="{height:(windowH - 200) + 'px'}">
        <xo-pub-tree :data='getScatterMapTree()' :count=0 style="width: max-content;"></xo-pub-tree>
      </div>

      <div class="padding_l_10" :style="{width:tableWidth + 'px'}">
        <div>
          <!--<span class="margin_r_10">{{levelName}}</span>-->
          时间:
          <el-date-picker
            v-model="time1"
            type="datetime"
            size="small"
            placeholder="选择开始日期时间">
          </el-date-picker>
          至
          <el-date-picker
            v-model="time2"
            type="datetime"
            size="small"
            placeholder="选择结束日期时间">
          </el-date-picker>

          <el-button @click="search" size="small">查询</el-button>
        </div>
        <div class="flex_r">
          <div class=" margin_r_10 margin_t_10">
            <span>订单状态</span>
            <el-select v-model="status" clearable filterable placeholder="请选择订单状态" size="small" @change="handleChange(1)">
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>

          <div class=" margin_r_10 margin_t_10">
            <span>选择来源</span>
            <el-select v-model="source" clearable filterable placeholder="请选择来源" size="small" @change="handleChange(2)">
              <el-option
                v-for="item in soucesList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>


          <div class=" margin_r_10 margin_t_10">
            <span>选择门店</span>
            <el-select v-model="storeId" clearable filterable placeholder="请选择" size="small" @change="handleChange(3)">
              <el-option
                v-for="item in storeList"
                :key="item.base_store_id"
                :label="item.storename"
                :value="item.base_store_id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div :style="{height:(tableHeight  - 120) + 'px'}" style="margin-top: 10px">
          <div id="container" class="map" :style="{height:(windowH - 250) + 'px'}"></div>
        </div>

        <footer v-show="false">
          <xo-pagination :pageData=p @page="getPage" @pageSize="getPageSize"></xo-pagination>
        </footer>
      </div>
    </div>

  </div>

</template>

<script>
  import {getLeft, recur} from '../../utility/communApi'
  import Hub from '../../utility/commun'
  import {getScrollHeight} from '../../utility/getScrollHeight'
  import {mapActions, mapGetters} from 'vuex';
  import {oneTwoApi} from '@/api/api.js';

  export default {
    computed: {
      ...mapGetters([
        'getTreeArr','getBodyHeight'
      ]),
      beginTime(){
        if (this.time1 != ''){
          return Date.parse(new Date(this.time1)) / 1000;
        }else {
          return '';
        }
      },
      endTime(){
        if (this.time2 != ''){
          return Date.parse(new Date(this.time2)) / 1000;
        }else {
          return ''
        }
      }
    },
    components: {},
    data() {
      return {
        navList: [{name: "x2运营数据", url: ''}, {name: "散点地图", url: ''}],
        levelName: '',
        storeData_id: '',
        tableWidth: 0,
        tableHeight: 0,
        windowH: '',

        p: {page: 1, size: 20, total: 0},

        map: null,          // 地图类
        time1: '',
        time2: '',
        status: '',
        source: '',
        storeId: '',
        latArr: [],

        statusList: [{id:1,name:'未接单'},{id:2,name:'已接单'},{id:3,name:'配送中'},{id:4,name:'订单取消'},{id:5,name:'已完成'},{id:6,name:'已退款'},{id:8,name:'完成前退款中'},{id:10,name:'完成后退款中'}],
        soucesList: [{id: 'el', name: '饿了么'}, {id: 'mt', name: '美团外卖'}, {id: 'bd', name: '百度外卖'}],
        storeList: [],
      }
    },
    watch: {},
    methods: {
      ...mapActions(['setScatterMapTreeLevelId', 'setScatterMapTree']),
      ...mapGetters(['getScatterMapTreeLevelId', 'getScatterMapTree']),

      getPage(page) {
        this.p.page = page;
        this.getPrintData(this.p);
      },
      getPageSize(size) {
        this.p.size = size;
        this.getPrintData(this.p);
      },

      showLevel() {
        getLeft('x2').then((res) => {
          if (res.data.errcode === 0) {
            this.setScatterMapTree({list: res.data.data});
            if (this.getScatterMapTreeLevelId() === '') {
              this.setScatterMapTreeLevelId({levelId: res.data.data[0].id});
            }
            this.levelName = res.data.data[0].levelname;
            this.showResouce(res.data.data[0].id);
            recur(res.data.data,true,this.getScatterMapTreeLevelId(),this);

          } else {

          }
        })
      },
      showResouce(levelId) {
        //获取门店列表
        let params = {
          redirect: "x2.store.index",
          levelId: levelId,
          noPage: 1
        };
        oneTwoApi(params).then((res) => {
          if (res.errcode === 0) {
            if (res.data.list.length !== 0) {
              this.storeData_id = res.data.list[0].base_store_id;
            }
            this.storeList = res.data.list;
            console.log(this.storeList);
          }
        })
      },

      scatterMap() {

        document.querySelector('.map').innerHTML = '';

        var arr = this.latArr;        // 模拟数据
        var msgArr = [];        // 消息数组

        var map = new BMap.Map("container");          // 创建地图实例
        var point = new BMap.Point(95.369272, 29.773890);  // 创建点坐标
        map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别

        for (let key in arr) {
          var point = new BMap.Point(parseFloat(arr[key].lat), parseFloat(arr[key].lng));  // 创建点坐标
          var marker = new BMap.Marker(point);        // 创建标注
          marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
          map.addOverlay(marker);                     // 将标注添加到地图中
          msgArr.push(point);

          /*marker.addEventListener("click", function () {
            console.log(event.target);
            var opts = {
              width: 100,          // 信息窗口宽度
              height: 50,          // 信息窗口高度
              title: arr[key].msg  // 信息窗口标题
            }
            console.log(key);
            var infoWindow = new BMap.InfoWindow('经度: ' + arr[key].latitude + ' 纬度:' + arr[key].longitude, opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow, msgArr[key]);      // 打开信息窗口
          });*/
        }

        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      },
      layoutSubviews() {
        let bodyWidth = document.querySelector('.content div').clientWidth;
        let clientWidth = this.$refs.tree ? this.$refs.tree.clientWidth : 0;
        this.tableWidth = bodyWidth - clientWidth;

      },

      handleChange(value) {
        switch (value){
          case 1:
            console.log('订单状态');
            console.log(this.status);
            break;
          case 2:
            console.log('订单来源');
            console.log(this.source);
            break;
          case 3:
            console.log('门店');
            console.log(this.storeId);
            break;
          default:
        }
      },

      search(){
        this.orderList();
      },

      initializeMap(){
        // 创建空地图
        var map = new BMap.Map("container");          // 创建地图实例
        var point = new BMap.Point(95.369272, 29.773890);  // 创建点坐标
        map.centerAndZoom(point, 6);                 // 初始化地图，设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      },

      /******************* API  ***************/
      // 绘制地图
      orderList() {
        let params = {
          redirect: "x2.order.getLatLngList",
          begTime: this.beginTime,
          endTime: this.endTime,
          status: this.status,
          storeId: this.storeId,
          source: this.source,
          levelId: this.getScatterMapTreeLevelId()
        };
        oneTwoApi(params).then((res) => {
          console.log(res);
          if (res.errcode === 0) {
            console.log(res);
            this.latArr = res.data;
            this.scatterMap();
          }
        })
      },
    },
    created() {
      this.windowH = document.body.clientHeight;

      // this.layoutSubviews();
      if (this.getScatterMapTree().length === 0) {
        this.showLevel()
      } else {
        this.showResouce(this.getScatterMapTreeLevelId());
      }
    },

    mounted() {
      this.layoutSubviews();
      Hub.$on('showAdd', (e) => {
        this.storeData_id = "";
        this.levelName = e.levelName;
        this.setScatterMapTreeLevelId({levelId: e.levelid});
        this.showResouce(e.levelid);
        recur(this.getScatterMapTree(),false,this.getScatterMapTreeLevelId(),this);
        this.orderList();
      });
      Hub.$emit('mountedOk', 'mountedOk');
      // 初始化地图
      // this.initializeMap();
      this.orderList();
      this.$nextTick(()=>{
        getScrollHeight(this.getBodyHeight).then((h) => {
          this.tableHeight = h;
        })
      })
    },
    destroyed() {
      Hub.$off("showAdd");
    }
  }
</script>

<style scoped lang="less">

  .third {
    position: absolute;
    top: 0;
    left: -100px;
  }

  .map {
    width: 100%;
    height: 100%;
    min-height: 500px;
  }

</style>
