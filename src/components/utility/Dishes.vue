<template>
  <el-dialog title="请选择" :visible.sync="dialogVisible" @close="close" @open="open" width="560px">
    <div class="flex_ce">
      <div class="flex_a">
        <el-input size="small" placeholder="请输入编码、名称" class="margin_r_10" v-model="dishesName"></el-input>
        <el-button size="small" @click="searchDishes()">搜索</el-button>
      </div>
    </div>
    <div class="margin_t_10">
      <el-table :data="list" border style="width: 100%;" height="400" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="id" label="编码">
        </el-table-column>
        <el-table-column label-class-name="table_head" header-align="center" align="center" prop="name" :label="name">
        </el-table-column>
      </el-table>
    </div>
    <div class="margin_t_10">
      <el-button type="primary" @click="submitDishes()">确认</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {oneTwoApi} from '@/api/api.js';
    export default {
        name: "dishes",
      props: ['id','name','list','currentRow','select','x2dishid','storeData_id','levelid'],
      data() {
        return {
          dishesName:'',
          dialogVisible:false,
        }
      },
      methods:{
        searchDishes(){
          if(this.select === "营运菜品"){
            let params = {
              redirect: "x2a.dish.erpdish",
              storeid: this.storeData_id,
              type:1,
              search:this.dishesName
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.list = res.data;
              }
            });
          }
          if(this.select === "营运餐盒"){
            let params = {
              redirect: "x2a.dish.erpdish",
              storeid: this.storeData_id,
              type:2,
              search:this.dishesName
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.list = res.data;
              }
            });
          }
          if(this.select === "餐盒"){
            let params = {
              redirect: "x2a.lunchbox.erpbox",
              levelid: this.levelid,
              search:this.dishesName
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.list = res.data;
              }
            });
          }
          if(this.select === "菜品"){
            let params = {
              redirect: "x2a.product.erpdish",
              levelid: this.levelid,
              search:this.dishesName
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.list = res.data;
              }
            });
          }
        },
        open(){
          this.dishesName = ''
        },
        close(){
          this.currentRow.check = null

        },
        handleCurrentChange(val){
          this.currentRow.check = val;
        },
        submitDishes(){
          if(this.select === "营运餐盒"){
            if(this.currentRow.check === null){
              this.$message("请选择餐盒");
              return
            }
            let params = {
              redirect: "x2a.dish.linkerpbox",
              x2dishid: this.x2dishid,
              lunchboxid:this.id,
              erpfoodid:this.currentRow.check.id
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.$message("操作成功");
                this.$emit("submitErp", "ok");
                this.dialogVisible = false
              }
            });
          }
          if(this.select === "营运菜品"){
            if(this.currentRow.check === null){
              this.$message("请选择菜品");
              return
            }

            let params = {
              redirect: "x2a.dish.linkerpdish",
              x2dishid: this.id,
              erpfoodid:this.currentRow.check.id
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.$message("操作成功");
                this.$emit("submitErp", "ok");
                this.dialogVisible = false
              }
            });
          }


          if(this.select === "菜品"){
            if(this.currentRow.check === null){
              this.$message("请选择菜品");
              return
            }

            let params = {
              redirect: "x2a.product.linkerp",
              x0_productid: this.id,
              erpfoodid:this.currentRow.check.id
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.$message("操作成功");
                this.$emit("submitErp", "ok");
                this.dialogVisible = false
              }
            });
          }
          if(this.select === "餐盒"){
            if(this.currentRow.check === null){
              this.$message("请选择餐盒");
              return
            }

            let params = {
              redirect: "x2a.lunchbox.linkerp",
              lunboxid: this.id,
              erpfoodid:this.currentRow.check.id
            };
            oneTwoApi(params).then((res) => {
              if(res.errcode === 0){
                this.$message("操作成功");
                this.$emit("submitErp", "ok");
                this.dialogVisible = false
              }
            });
          }
        },

        openDialog() {
          this.dialogVisible = true
        },
      }
    }
</script>

<style scoped>

</style>
