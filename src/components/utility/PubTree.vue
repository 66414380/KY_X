//x2门店管理
//用户组管理
<template>
  <div>

    <div v-for='(item,index) in data' style="line-height: 36px;min-width: 200px">
      <div class="tree-node" :style="{'padding-left':  count *  20  + 'px','background':(item.selected)?'#edf7ff':''}">

        <span :style="{display:(item.child && item.child.length !== 0)?'none':'inline-block'}"
              style="vertical-align: middle;width: 25px"></span>
        <span @click.stop.self='item.show=!item.show' v-if='item.child && item.child.length !== 0'
              :style="{transform:(item.show)?'rotate(90deg)':'rotate(0deg)'}"
              class="el-tree-node__expand-icon el-icon-caret-right tree_size"></span>

        <span @click.stop.self="test(item)" class="pointer el-tree-node__label">{{item.levelname}}</span>

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
        <trees :data='item.child' v-if="item.show" :count='count +1' class="heightTran" ></trees>
      </transition>
    </div>
  </div>
</template>

<script>

  import Hub from './commun'


  export default {
    name: 'trees',
    props: ['data', 'count'],
    watch: {

    },

    data() {
      return {
        myHeight: '',
        item: {},
        levelname:'',
      }
    },
    methods: {
      test(item) {
        this.levelname = item.levelname;
        Hub.$emit('showAdd',{levelid:item.id,type:item.type,levelName:item.levelname});
//        item.show = !item.show
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
    background: #e4e8f1;
  }


</style>
