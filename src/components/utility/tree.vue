//最左侧树
<template>
  <div>
    <div v-for='(item,index) in data' style="line-height: 36px;">
      <div class="tree-node" :style="{'padding-left':  count *  20  + 'px','background':(item.selected)?'#48576a':''}">

        <span :style="{display:(item.children && item.children.length !== 0)?'none':'inline-block'}"
              style="vertical-align: middle;width: 25px"></span>
        <span @click.stop.self='item.show=!item.show' v-if='item.children && item.children.length !== 0'
              :style="{transform:(item.show)?'rotate(90deg)':'rotate(0deg)'}"
              class="el-tree-node__expand-icon el-icon-caret-right tree_size"></span>

        <span @click.stop.self="test(item)" class="pointer el-tree-node__label" style="color: #bfcbd9">{{item.name}}</span>

      </div>
      <transition
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
        v-on:enter-cancelled="enterCancelled"

        v-on:before-leave="beforeLeave"
        v-on:leave="leave"
        v-on:after-leave="afterLeave"
        v-on:leave-cancelled="leaveCancelled"
      >
        <trees :data='item.children' v-if="item.show" :count='count +1' class="heightTran" ></trees>
      </transition>
    </div>
  </div>
</template>

<script>
  import Hub from '../utility/commun'
  import { mapActions,mapGetters } from 'vuex';
  import {getArr} from '../utility/communApi'
  export default {
    name: 'trees',
    props: ['data', 'count'],
    watch: {},
    data() {
      return {
        item: {},
      }
    },
    methods: {
      ...mapActions(['setTreeArr']),
      test(item) {
        if(item.router !== ''){
          if(item.router.indexOf("http") === 0){
            window.open(item.router,"_blank")
          }else {
            this.$router.push(item.router);
            this.$nextTick(()=>{
              this.setTreeArr({obj:getArr(item.arr)})
            })
          }
        }

        item.show = !item.show
      },
      beforeEnter: function (el) {
        el.style.height = '0';
      },
      enter: function (el) {
        if (el.scrollHeight !== 0) {
          el.style.height = el.scrollHeight + 'px';
        } else {
          el.style.height = '';
        }
      },
      afterEnter: function (el) {
        el.style.height = '';
      },
      enterCancelled: function (el) {

      },
      beforeLeave: function (el) {
        el.style.height = el.scrollHeight + 'px';
      },

      leave: function (el) {
        if (el.scrollHeight !== 0) {
          el.style.height = 0;
        }
      },
      afterLeave: function (el) {
        el.style.height = '';
      },

      leaveCancelled: function (el) {

      },
    },
    created() {
    },
    mounted() {
    },
    destroyed(){
    }
  }
</script>

<style lang="less" scoped>


  .heightTran {
    overflow: hidden;
    transition: all .3s
  }

  .tree-node:hover {
    background: #48576a;
  }


</style>
