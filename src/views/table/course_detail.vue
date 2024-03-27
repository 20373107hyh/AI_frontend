<template>
    <div class="detail-container">
        <el-button @click="ReturnToCourseInfo()">返回 </el-button>
        <timer :startTime="time" @time-remaining="handleTimeRemaining"></timer>
      <div class="detail-text">课程名称：{{ course_info.course_name }}</div>
      <div class="detail-text">课程难度：{{ course_info.course_difficulty }}</div>
      <div class="detail-text">课程章节：{{ course_info.course_chapter }}</div>
      <div class="detail-text">课程限时：{{ course_info.course_limit_time }}</div>
      <div class="detail-text">课程简介：{{ course_info.course_intro }}</div>
      <div class="detail-text">课程目标：{{ course_info.course_aim }}</div>
      <el-button @click="StartExperiment()">开始实验 </el-button>    
    </div>
</template>


<script>
import timer from '@/components/timer'
import axios from 'axios';
export default{
    components:{
        timer
    },
    data(){
        return {
            course_id: '',
            course_info: '',
            timer: null,
            time: 0,
        }
    },
    methods:{
        getData(){
            let course_id = this.$route.query.course_id
            let formData = new FormData()
            formData.append('course_id', course_id)
            this.$axios({
                method: 'post',
                url: '/teacher/get_course_info/',
                data: formData,
            }).then(
                res => {
                    console.log(res)
                    this.course_info = res.data.data
                    console.log(res.data.data.course_limit_time)
                    this.time = res.data.data.course_limit_time * 3600
                }
            )
        },
        ReturnToCourseInfo(){
            this.$router.push("/manage/course")
        },
        handleTimeRemaining(time) {
            console.log('剩余时间:', time);
        },
        StartExperiment(){
            let course_id = this.course_info.course_id
            window.open(this.$router.resolve({ path: '/experiment', query:{ course_id:course_id } }).href, '_blank');
        }
    },
    async created(){
        this.getData()
    },
}
</script>



<style lang="scss" scoped>
.detail {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>