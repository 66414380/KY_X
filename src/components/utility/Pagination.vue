<template>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=pageData.page
      :page-sizes="[10, 20, 40]"
      :page-size=pageData.size
      layout="total, sizes, prev, pager, next, jumper"
      :total=pageData.total>
    </el-pagination>
  </div>
</template>
<script>
  export default {
    name:"pagination",
    props: ["pageData"],
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.$emit("pageSize", val);

      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.$emit("page", val);
      }
    },
    data() {
      return {
      };
    }
  }
</script>
