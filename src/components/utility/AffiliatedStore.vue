<template>
  <el-dialog
    title=""
    @open="open2"
    @close="dialogClose2"
    :visible.sync="dialogVisible"
    width="1100px" >
    <div class="flex_a margin_b_10">
      <!--<el-cascader-->
      <!--:props="defaultProps"-->
      <!--:options="dataLeft"-->
      <!--v-model="selectedOptions"-->
      <!--change-on-select-->
      <!--@change="handleChange">-->
      <!--</el-cascader>-->
      <div class="margin_r_10">
        <el-input size="small" v-model="searchName" placeholder="请输入门店名称"></el-input>
      </div>
      <el-button size="small" @click="search()">搜索</el-button>

    </div>

    <div class="flex_a">

      <div class="margin_r_10 fr_body">
        <div class="fr flex_a">
          组织结构
        </div>
        <el-tree class="tree "
                 :data="dataLeft"
                 :props="defaultProps"
                 @node-click="nodeClick"
                 node-key="id"
                 default-expand-all
                 :highlight-current="true"
                 :expand-on-click-node="false">
        </el-tree>
      </div>

      <el-transfer
        class="transfer"
        v-model="storeDataNew"
        :props="{
            key: 'id',
            label: 'storename'
          }"
        :render-content="renderFunc"
        :titles="['全部门店', '已选门店']"
        :data="storeDataOld">
      </el-transfer>
    </div>
    <div class="margin_t_10">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitFromStroe()" >确认</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import getApi from '../infrastructure/PermissionManagement/user/user.service'
  import {getLevel} from './communApi'
  export default {
    name: 'auth',
    props: ['uid','username'],
    watch: {},
    data() {
      return {
        levelId:'',
        searchName:'',
        dataLeft: [],
        dialogVisible: false,
        storeDataOld: [],
        storeDataNew: [],
        storeDataSelected: [],
        defaultProps: {
          value:'id',
          children: 'child',
          label: 'levelname'
        },
        // <input type="checkbox" checked={option.select} onClick={(that)=>{this.$parent.data.forEach((item)=>{if(item.id === option.id){item.select = that.target.checked}})}}/>

        renderFunc(h, option) {
          return<div class="equal">
            <div class="row">
            <div class="two">{option.storename}</div>
          <div >

          </div>

          </div>
          </div>;
        },
      }
    },
    methods: {
      search(){
        if(this.searchName === ''){

          this.getBsList(this.levelId)
        }else {
          this.getBsList(this.levelId,this.searchName)
        }
      },
      submitFromStroe(){
        let data = [];
        this.storeDataOld.forEach((item)=>{
          this.storeDataNew.forEach((item1)=>{
            if(item.id === item1){
              data.push({uid:this.uid,username:this.username,store_id:item.id,storename:item.storename})
            }
          })
        });

        getApi.userStoreInfo(data).then((res)=>{
          if(res.data.errcode === 0){
            this.dialogVisible = false
          }
        })

      },
      nodeClick(item) {
        this.getBsList(item.id);
      },
      getBsList(levelId,storeName = ''){
        getApi.getBsList(levelId,storeName).then((res)=>{
          let arr =  res.data.data.list.concat(this.storeDataSelected);
          let list2 = [];
          let listMap = {};
          for (let i = 0, id, storename, key; i < arr.length; i++) {
            id = arr[i].id;
            storename = arr[i].storename;
            key = id + '|' + storename;
            if (!!listMap[key]) {
              listMap[key]++;
            } else {
              listMap[key] = 1;
            }
          }
          for (let item in listMap) {
            list2.push({
              id: item.split('|')[0] *1,
              storename: item.split('|')[1],
            })
          }
          this.storeDataOld = list2
        })
      },
      open2(){
        getApi.getUserStore(this.uid).then((res)=>{
          if(res.data.errcode === 0){
            let list = res.data.data.list.map(item=>item.id);
            this.storeDataOld = res.data.data.list;
            this.storeDataSelected = res.data.data.list;
            this.storeDataNew = list
          }

        });
        getLevel().then((res) => {
          if (res.data.errcode === 0) {
            this.dataLeft = res.data.data
          }
        });
        // this.$nextTick(()=>{
        //   let dom = document.querySelectorAll(".transfer div p.el-transfer-panel__header")
        //   let span =  document.createElement('span');
        //   span.classList.add("my-transfer");
        //   span.textContent = "设置语音播报";
        //   dom[1].appendChild(span);
        // })
      },
      dialogClose2() {
        this.searchName = ""
        // let dom = document.querySelectorAll(".transfer div p.el-transfer-panel__header");
        // dom[1].removeChild(dom[1].childNodes[1])
      },
      openDialog() {
        this.dialogVisible = true
      },

    },
    created() {

    },
    mounted() {
    },
    destroyed() {
    }
  }
</script>

<style lang="less" scoped>
  .fr_body {
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
  }
  .fr {
    height: 36px;
    background: #fbfdff;
    border-top: 1px solid #d1dbe5;
    border-left: 1px solid #d1dbe5;
    border-right: 1px solid #d1dbe5;
    box-sizing: border-box;
    padding-left: 20px;
  }

  .tree {
    width: 300px;
    height: 284px;
    overflow-y: auto;
    box-sizing: border-box;
  }
</style>
