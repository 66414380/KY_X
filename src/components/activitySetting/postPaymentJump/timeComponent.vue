<template>
<div>
  {{myTime}}
</div>
</template>

<script>
  export default {
    props: ['endTime', 'startTime','updateTime'],
    data() {
      return {

      }
    },
    computed: {
      myTime: {
        get: function () {
          let getTimeGo;

          if(new Date(this.startTime) > new Date(this.updateTime)){
            getTimeGo = "活动未开始";
          }else {
            let endTime = new Date(this.endTime) ;
            let nowTime = new Date(this.updateTime)  ;
            let leftTime = parseInt((endTime.getTime() - nowTime.getTime())/1000);
            let d = parseInt(leftTime / 3600 / 24);
            let h = parseInt((leftTime / 3600) % 24);
            let m = parseInt((leftTime / 60) % 60);
            let s = parseInt(leftTime % 60);

            getTimeGo = `${d}天${h}小时${m}分${s}秒`;

            if(leftTime <= 0){
              getTimeGo = "已结束";
            }
          }

          return getTimeGo
        },
        set: function (newValue) {
          console.log(newValue)
        }
      }
    },
    methods: {},
    destroyed() {

    }

  }
</script>

<style scoped>

</style>
