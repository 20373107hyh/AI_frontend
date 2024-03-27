<template>
    <div class="detail-container" v-if="loading===false">
        <el-button @click="ReturnToCourseInfo()">返回 </el-button>
        <timer :startTime="time" @time-remaining="handleTimeRemaining"></timer>
        <iframe :src="url" style="width:100%; height:500px;"></iframe>
    </div>
    <div class="detail-container" v-else>
        LOADING
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
            experiment_info: '',
            timer: null,
            time: 0,
            url: '',
            loading: false,
        }
    },
    methods:{
        getData(){
            this.loading = true
            let course_id = this.$route.query.course_id
            let formData = new FormData()
            formData.append('course_id', course_id)
            this.$axios({
                method: 'post',
                url: '/teacher/create_experiment/',
                data: formData,
            }).then(
                res => {
                    console.log(res)
                    this.experiment_info = res.data.data
                    this.url = res.data.data.experiment_url
                    this.time = res.data.data.experiment_countdown
                    this.loading = false
                }
            )
        },
        ReturnToCourseInfo(){
            let experiment_id = this.experiment_info.experiment_id
            let formData = new FormData()
            formData.append('experiment_id', experiment_id)
            this.$axios({
                method: 'post',
                url: '/teacher/delete_experiment/',
                data: formData,
            }).then(
                res => {
                    console.log(res)
                    this.$router.push('/manage/course')
                }
            )
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
    beforeDestroy() {
      this.ReturnToCourseInfo();
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