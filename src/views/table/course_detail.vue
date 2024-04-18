<template>
    <div class="detail-container">
        <el-button @click="ReturnToCourseInfo()">返回 </el-button>
      <div class="detail-text">课程名称：{{ course_info.course_name }}</div>
      <div class="detail-text">课程难度：{{ course_info.course_difficulty }}</div>
      <div class="detail-text">课程章节：第{{ course_info.course_chapter }}章 {{course_info.chapter_name }}</div>
      <div class="detail-text">课程限时：{{ course_info.course_limit_time }}小时</div>
      <div class="detail-text">课程简介：{{ course_info.course_intro }}</div>
      <div class="detail-text">课程目标：{{ course_info.course_aim }}</div>
      <div class="detail-text"><el-button @click="StartExperiment()">开始实验 </el-button></div>
    
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
            config_list: [
                '0.5核CPU 1G内存',
                '1核CPU 2G内存',
                '2核CPU 4G内存',
                '4核CPU 8G内存',
                '8核CPU 16G内存',
            ],
            config: '1核CPU 2G内存',
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
            let config = this.config
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