<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="count"
        label="序号"
        width="65">
      </el-table-column>

      <el-table-column
        label="支付方式"
        width="103"
      >
        <template slot-scope="scope">
          <div style="margin-left: 10px" v-for="item in scope.row.paymentMethod">{{ item }}</div>
        </template>
      </el-table-column>


      <el-table-column
        label="支付通道"
        width="103">
        <template slot-scope="scope">
          <div style="margin-left: 10px" v-for="item in scope.row.payment">{{ item }}</div>
        </template>
      </el-table-column>

      <el-table-column
        label="账户"
        width="144">
        label="支付通道">
        <template slot-scope="scope">
          <div style="margin-left: 10px" v-for="item in scope.row.account">{{ item }}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="date"
        label="时间"
        width="170">
      </el-table-column>

      <el-table-column
        prop="lastEdit"
        label="操作员">
      </el-table-column>

      <el-table-column
        prop="executionTime"
        label="待执行时间"
        width="170">
      </el-table-column>

      <el-table-column
        prop="state"
        label="状态"
        width="100"
        :filters="[{ text: '成功', value: '成功' }, { text: '待执行', value: '待执行' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.state === '成功' ? 'primary' : 'danger'"
            close-transition>{{scope.row.state}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="lastEdit"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="examine(scope)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="下发记录详情"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose">
      <p>操作员: {{ tableData[index].lastEdit }}</p>
      <p>添加时间: {{ tableData[index].date }}</p>
      <p>执行时间: {{ tableData[index].executionTime}}</p>
      <p>状态: {{ tableData[index].state}}</p>
      <p>下发账户: {{ tableData[index].account}}</p>
      <p>下发门店: {{ tableData[index].account}}</p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          count: 1,
          paymentMethod: ['支付宝', '微信支付'],
          payment: ['易极付', '通联'],
          account: ['炳胜(马场店)', '炳胜(兴盛路店)'],
          date: '2017-9-26  12:00:00',
          lastEdit: '张三',
          state: '成功',
          executionTime: '已完成'
        }, {
          count: 1,
          paymentMethod: ['支付宝', '微信支付'],
          payment: ['易极付', '通联'],
          account: ['炳胜(马场店)', '炳胜(兴盛路店)'],
          date: '2017-9-26  12:00:00',
          lastEdit: '张三',
          state: '待执行',
          executionTime: '2017-3-34 12:32:32',
        },
          {
            count: 1,
            paymentMethod: ['支付宝', '微信支付'],
            payment: ['易极付', '通联'],
            account: ['炳胜(马场店)', '炳胜(兴盛路店)'],
            date: '2016-05-02',
            lastEdit: '张三',
            executionTime: '2017-3-34 12:32:32',
            state: '待执行',
          },
          {
            count: 1,
            paymentMethod: ['支付宝', '微信支付'],
            payment: ['易极付', '通联'],
            account: ['炳胜(马场店)', '炳胜(兴盛路店)'],
            date: '2016-05-02',
            lastEdit: '张三',
            executionTime: '2017-3-34 12:32:32',
            state: '待执行',
          }],
        dialogVisible: false,
        index: 0
      }
    },
    methods: {
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.state === value;
      },
      handleClose(done) {
        done();
      },
      examine(scope){
        this.index = scope.$index;
        this.dialogVisible = true;
      }
    }
  }
</script>
<style scoped lang="less">
  div.cell{
    text-align: center;
  }
  p{
    padding: 10px 0 10px 10px;
  }
</style>
