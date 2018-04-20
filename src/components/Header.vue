<style scoped>
  .header-top {
    background-color: #2A3642;
    height: 80px;
    color: white;
    padding: 0 20px;
  }

  .img-size {
    width: 20px;
  }

  .login {
    color: #AAAFB5;
    margin-left: 10px;
  }

  .header-top h3 {
    display: inline;
  }

</style>

<template>
  <div ref="getTop" class="header-top flex_sb">
    <div class="flex">
      <img src="../assets/home/mingsheng-log.png" alt="" style="width: 291px;height: 35px;">
      <img src="../assets/home/vertical-line.png" alt="" style="width: 2px;height: 30px;margin-left: 10px;">
      <img src="../assets/home/happy-font.png" alt="" style="width: 30px;height: 30px;margin-left: 10px;">
      <img src="../assets/home/zhihuicanyin-log.png" alt="" style="width: 95px;height: 23px;margin-left: 10px;">
    </div>
    <div>
      <i class="el-icon-loading" v-show="getLoadingStatus"></i>

      <span class="login">帮助</span>
      <el-dropdown @command="loginOut">
        <span class="login el-dropdown-link pointer">
          {{user}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="login">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import {mapActions,mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'getLoadingStatus'
      ]),
    },
    data() {
      return {
        height: 0,
        user: ''
      }
    },
    methods: {
      ...mapActions(['setStoreTreeList', 'setShowStoreTree', 'setPermissionLevelId', 'setPermissionTree',
        'setBusinessConfTree', 'setBusinessConfLevelId', 'setPushStateTree', 'setPushStateLevelId', 'setRunningStateTree',
      'setRunningStateLevelId','setPrintConfTree','setPrintConfLevelId','setX2storeTree','setX2StoreLevelId','setX1storeTree',
        'setX1StoreLevelId','setPublicTree','setPublicLevelId','setDishesLibraryTree','setDishesLibraryLevelId',
        'setSalesRankingTree','setSalesRankingLevelId','setSettlementRecordTree','setSettlementRecordLevelId',
      'setDishesSpecTree','setDishesSpecLevelId','setBoxSettingTree','setBoxSettingLevelId','setDishesCategoryTree',
        'setDishesCategoryLevelId','setStoreDishesManageTree','setStoreDishesManageLevelId','setDishesGroupTree','setDishesGroupLevelId',
        'setStoreLabelTree','setStoreLabelLevelId','setOperationSchemeTree','setOperationSchemeLevelId','setDishesRecordTree','setDishesRecordLevelId',
        'setStoreRecordTree','setStoreRecordLevelId','setAccountListTree','setAccountListLevelId'
      ]),
      loginOut: function () {
        this.$http.get(`?controller=user&action=logout&token=${this.$localStorage.get("token")}`).then((res) => {
          if (res.data.errcode === 0) {
            this.$localStorage.remove("token");
            this.$localStorage.remove("user");
            this.setStoreTreeList({list: []});
            this.setShowStoreTree({obj: {levelid: '', type: '', showAdd: false}});

            this.setPermissionTree({list: []});
            this.setPermissionLevelId({levelId: ''});

            this.setBusinessConfTree({list: []});
            this.setBusinessConfLevelId({levelId: ''});

            this.setPushStateTree({list: []});
            this.setPushStateLevelId({levelId: ''});

            this.setRunningStateTree({list: []});
            this.setRunningStateLevelId({levelId: ''});

            this.setPrintConfTree({list: []});
            this.setPrintConfLevelId({levelId: ''});

            this.setX2storeTree({list: []});
            this.setX2StoreLevelId({levelId: ''});

            this.setX1storeTree({list: []});
            this.setX1StoreLevelId({levelId: ''});

            this.setPublicTree({list: []});
            this.setPublicLevelId({levelId: ''});

            this.setDishesLibraryTree({list: []});
            this.setDishesLibraryLevelId({levelId: ''});

            this.setSalesRankingTree({list: []});
            this.setSalesRankingLevelId({levelId: ''});

            this.setSettlementRecordTree({list: []});
            this.setSettlementRecordLevelId({levelId: ''});

            this.setDishesSpecTree({list: []});
            this.setDishesSpecLevelId({levelId: ''});

            this.setBoxSettingTree({list: []});
            this.setBoxSettingLevelId({levelId: ''});

            this.setDishesCategoryTree({list: []});
            this.setDishesCategoryLevelId({levelId: ''});

            this.setStoreDishesManageTree({list: []});
            this.setStoreDishesManageLevelId({levelId: ''});

            this.setDishesGroupTree({list: []});
            this.setDishesGroupLevelId({levelId: ''});

            this.setStoreLabelTree({list: []});
            this.setStoreLabelLevelId({levelId: ''});

            this.setOperationSchemeTree({list: []});
            this.setOperationSchemeLevelId({levelId: ''});

            this.setDishesRecordTree({list: []});
            this.setDishesRecordLevelId({levelId: ''});

            this.setStoreRecordTree({list: []});
            this.setStoreRecordLevelId({levelId: ''});

            this.setAccountListTree({list: []});
            this.setAccountListLevelId({levelId: ''});
            this.$router.push("/login")
          } else {
            this.$message(res.data.errmsg)
          }
        });
      },
      ...mapActions([
        'topHeight'
      ])
    },
    created() {
      this.user = this.$localStorage.get("user")
    },
    mounted() {
      let top = this.$refs.getTop;
      this.height = top.clientHeight;
      // this.$emit('topHeight',this.height)

      this.topHeight(this.height);
      // this.$store.dispatch('topHeight',this.height);

    },
  }

</script>
