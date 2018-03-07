<template>
  <div>
    <el-radio-group v-model="radio" size="small">
      <el-radio-button v-for="(item,index) in radioList" :key="item.id" :label="item.label">{{item.name}}
      </el-radio-button>
    </el-radio-group>
    <span class="time">时间：</span>
    <el-date-picker v-model="time_start" @change="timeStart" type="datetime" placeholder="选择开始日期时间" size="small">
    </el-date-picker>
    <span>至</span>
    <el-date-picker v-model="time_end" @change="timeEnd" type="datetime" placeholder="选择结束日期时间" size="small">
    </el-date-picker>
  </div>
</template>
<script>
  export default {
    methods: {
      dateInit() {
        let start = new Date(new Date().setHours(0, 0, 0, 0)) * 1;
        let end = new Date() * 1;
        this.$emit('getRadioDate', [start, end]);
      },
      timeStart(d) {
        if (d === undefined) {
          this.start_stamp = ""
        } else {
          this.start_stamp = new Date(this.time_start) * 1;
        }
        if (this.radio === '') {
          this.$emit('getRadioDate', [this.start_stamp, this.end_stamp])
        }
      },
      timeEnd(d) {
        if (d === undefined) {
          this.end_stamp = ""
        } else {
          this.end_stamp = new Date(this.time_end) * 1;
        }
        if (this.radio === '') {
          this.$emit('getRadioDate', [this.start_stamp, this.end_stamp])
        }
      }
    },
    computed: {},
    watch: {
      "radio": function (n, o) {
        if (n !== '') {
          this.time_start = '';
          this.time_end = '';
        }
        switch (this.radio) {
          case 1:
            this.dateInit();
            break;
          case 2:
            let end = new Date(new Date().setHours(0, 0, 0, 0)) * 1;
            let start = end - 3600 * 24 * 1000;
            this.$emit('getRadioDate', [start, end]);
            break;
          case 3:
            end = new Date() * 1;
            start = end - 3600 * 24 * 1000 * 7;
            this.$emit('getRadioDate', [start, end]);
            break;
          case 4:
            end = new Date() * 1;
            start = end - 3600 * 24 * 1000 * 30;
            this.$emit('getRadioDate', [start, end]);
            break;
        }
      },
      "time_start": function (n, o) {
        if (n !== '') {
          this.radio = '';
        }
      },
      "time_end": function (n, o) {
        if (n !== '') {
          this.radio = '';
        }
      }
    },
    data() {
      return {
        radio: 1,
        radioList: [{label: 1, name: "今天"}, {label: 2, name: "昨天"}, {label: 3, name: "近7天"}, {label: 4, name: "近30天"}],
        time_start: '',
        time_end: '',
        start_stamp: '',
        end_stamp: ''
      };
    },
    created() {
      this.dateInit()
    }
  }
</script>
