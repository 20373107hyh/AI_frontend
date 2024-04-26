<template>
    <div class="detail-container">
        <el-button @click="ReturnToCourseInfo()">返回 </el-button>
      <div class="detail-text">课程名称：{{ course_info.course_name }}</div>
      <div class="detail-text">课程难度：{{ course_info.course_difficulty }}</div>
      <div class="detail-text">课程章节：第{{ course_info.course_chapter }}章 {{course_info.chapter_name }}</div>
      <div class="detail-text">课程限时：{{ course_info.course_limit_time }}小时</div>
      <div class="detail-text">课程简介：{{ course_info.course_intro }}</div>
      <div class="detail-text">课程目标：{{ course_info.course_aim }}</div>
      <div class="detail-text"><el-button @click="StartExperiment()">开始实验 </el-button><el-button @click="uploadExpVisible()">上传实验文件 </el-button></div>
            <el-table 
                :data="files_uploaded_to_teacher" 
                v-loading="uplistLoading"
                @selection-change="handleExpFileSelectionChange"
                style="width: 100%"
                :height="300">
                <el-table-column
                type="selection"
                :selectable="isSelectable"
                width="55">
                </el-table-column>
                <el-table-column 
                prop="name" 
                label="文件名">
                <template slot-scope="scope">
                    {{ scope.row}}
                </template>
                </el-table-column>
                <el-table-column 
                prop="name" 
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="downloadFile(scope.row)">下载文件</el-button>
                    <el-button @click="deleteFile(scope.row)">删除文件</el-button>
                </template>
                </el-table-column>
            </el-table>


        <el-dialog title="上传实验文件" :visible.sync="uploadDialogVisible" width="40%"center>
            <el-table 
                :data="uploaded_files" 
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                style="width: 100%"
                :height="300">
                <el-table-column
                type="selection"
                :selectable="isSelectable"
                width="55">
                </el-table-column>
                <el-table-column 
                prop="name" 
                label="文件名">
                <template slot-scope="scope">
                    {{ scope.row.filename}}
                </template>
                </el-table-column>
                <el-table-column 
                prop="path" 
                label="文件路径">
                <template slot-scope="scope">
                    {{ scope.row.path}}
                </template>
                </el-table-column>
            </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="uploadDialogVisible = false"> 取消 </el-button>
            <el-button type="primary" @click="handleSubmit()"> 提交 </el-button>
        </div>
        </el-dialog>
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
            uploadDialogVisible: false,
            uploaded_files: [],
            files_uploaded_to_teacher: [],
            selectedFiles: [],
            selectedExpFiles: [],
            listLoading: false,
            uplistLoading: false,
            userlistLoading: false,
            users_have_uploaded: [],
            user_files: [],
            userfileDialogVisible: false,
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
            this.$router.push("/experiment_list")
        },
        handleTimeRemaining(time) {
            console.log('剩余时间:', time);
        },
        StartExperiment(){
            let course_id = this.course_info.course_id
            let config = this.config
            window.open(this.$router.resolve({ path: '/experiment', query:{ course_id:course_id } }).href, '_blank');
        },
        loadExpFiles(){
            this.listLoading = true
            const formData = new FormData()
            let user_id = localStorage.getItem('user_id')
            let course_id = this.$route.query.course_id
            formData.append('user_id', user_id)
            formData.append('course_id', course_id)
            this.$axios({
                method: 'post',
                url: '/teacher/load_experiment_files/',
                data: formData,
            }).then(res => {
                console.log(res)
                this.uploaded_files = res.data.data
                this.listLoading = false
            })
        },
        loadUploadedExpFiles(){
            this.uplistLoading = true
            const formData = new FormData()
            let user_id = localStorage.getItem('user_id')
            let course_id = this.$route.query.course_id
            formData.append('user_id', user_id)
            formData.append('course_id', course_id)
            this.$axios({
                method: 'post',
                url: '/teacher/list_user_files_uploaded/',
                data: formData,
            }).then(res => {
                console.log(res)
                this.files_uploaded_to_teacher = res.data.data
                this.uplistLoading = false
            })
        },
        loadUsers(){
            this.userlistLoading = true
            const formData = new FormData()
            let course_id = this.$route.query.course_id
            formData.append('course_id', course_id)
            this.$axios({
                method: 'post',
                url: '/teacher/list_users_have_uploaded/',
                data: formData,
            }).then(res => {
                console.log(res)
                this.users_have_uploaded = res.data.data
                this.userlistLoading = false
            })
        },
        uploadExpVisible(){
            this.uploadDialogVisible = true
            this.loadExpFiles()
        },
        viewFile(row){
            let user_id = row[0]
            this.userfileDialogVisible = true
            this.loadUserExpFile(user_id)
        },
        loadUserExpFile(user_id){
            this.uplistLoading = true
            const formData = new FormData()
            let course_id = this.$route.query.course_id
            formData.append('user_id', user_id)
            formData.append('course_id', course_id)
            this.$axios({
                method: 'post',
                url: '/teacher/list_user_files_uploaded/',
                data: formData,
            }).then(res => {
                console.log(res)
                this.user_files = res.data.data
                this.uplistLoading = false
            })
        },
        handleSelectionChange(selected) {
            this.selectedFiles = selected.map(file => file.path);
            console.log(this.selectedFiles)
        },
        handleExpFileSelectionChange(selected){
            this.selectedExpFiles= selected.map(file => file.path);
            console.log(this.selectedExpFiles)
        },
        isSelectable(file) {
            // 这个函数决定哪些文件可以被选中
            // 不写代表允许所有文件被选中
            return true;
        },
        handleSubmit(){
            const formData = new FormData();
            let user_id = localStorage.getItem('user_id')
            let course_id = this.$route.query.course_id
            console.log(this.selectedFiles)
            formData.append('user_id', user_id)
            formData.append('course_id', course_id)
            formData.append('file_paths', JSON.stringify(this.selectedFiles))
            this.$axios({
                method: 'post',
                url: '/teacher/upload_exp_file/',
                data: formData,
                }).then(response => {
                console.log(response)
                window.alert(response.data.msg)
                this.loadUploadedExpFiles()
                this.uploadDialogVisible = false
                })
                .catch(error => console.log(error));
        },    
        downloadFile(filename) {
            let user_id = localStorage.getItem('user_id')
            let course_id = this.$route.query.course_id
            console.log(filename)
            let formData = new FormData();
            formData.append('user_id', user_id);
            formData.append('course_id', course_id);
            formData.append('filename', filename);

            this.$axios({
                method: 'post',
                url: '/teacher/download_file/', 
                data: formData,
                responseType: 'blob',
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                console.error(error);
            });
        },
        deleteFile(filename) {
            let user_id = localStorage.getItem('user_id')
            let course_id = this.$route.query.course_id
            console.log(filename)
            let formData = new FormData();
            formData.append('user_id', user_id);
            formData.append('course_id', course_id);
            formData.append('filename', filename);

            this.$axios({
                method: 'post',
                url: '/teacher/delete_exp_file/', 
                data: formData,
            })
            .then((response) => {
                window.alert(response.data.msg)
                this.loadUploadedExpFiles()
            })
            .catch((error) => {
                console.error(error);
            });
        },
    },
    async created(){
        this.getData()
        this.loadUploadedExpFiles()
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