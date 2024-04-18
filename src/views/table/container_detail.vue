<template>
  <div>
    <div>
      <div class="detail-text">名称：{{ container_info.container_name}} </div>
      <div class="detail-text">配置：{{ container_info.cpu_num }}核CPU, {{ container_info.mem_size }}G内存 </div>
      <div class="detail-text">SSH端口: {{ container_info.ssh_port }}</div>
      <div class="detail-text">HTTP端口: {{ container_info.http_port }}</div>
      <div class="detail-text">SSH命令: ssh root@127.0.0.1 -p {{ container_info.ssh_port }}</div>
      <div class="detail-text">SSH密码: {{ container_info.ssh_password }}</div>
    </div>
    <form @submit.prevent="onSubmit">
      <input type="file" multiple @change="onFileChange">
      <el-input placeholder="请输入路径，注意路径不以/结尾，文件夹名不以.开头" v-model="path">
        <template slot="prepend"> {{ container_info.workdir }}/ </template>
      </el-input>
      <button type="submit">Submit</button>
    </form>
    <ul v-if="uploaded_files.length > 0">
      <li v-for="(file, index) in uploaded_files" :key="index">
        {{ file.filename }} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;  {{ file.path }}  
        <button @click="onDelete(file.path)">Delete</button>
      </li>
    </ul>
    <el-button type="primary" @click="handleEnter()"> 进入 </el-button>
    <el-button type="primary" @click="handleReturn()"> 返回 </el-button>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      files: [], //正在上传的文件
      uploaded_files:[], //已上传的文件
      container_info: {},
      path: '',
    };
  },
  methods: {
    loadFiles(name){
      console.log(name)
      const formData = new FormData()
      let user_id = localStorage.getItem('user_id')
      formData.append('user_id', user_id)
      formData.append('container_name', name)
      this.$axios({
        method: 'post',
        url: '/teacher/load_files/',
        data: formData,
      }).then(res => {
        console.log(res)
        this.uploaded_files = res.data.data
      })
      this.files = []
    },
    onFileChange(e) {
      this.files = [...e.target.files];
      console.log(this.files)
    },
    onSubmit() {
      const formData = new FormData();
      let user_id = localStorage.getItem('user_id')
      let container_name = this.container_info.container_name
      formData.append('user_id', user_id)
      formData.append('container_name', container_name)
      formData.append('path', this.path)
      for (let i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append('file[]', file);
      }
      this.$axios({
          method: 'post',
          url: '/teacher/upload_file/',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          console.log(response)
          this.loadFiles(container_name)
          this.files = []
        })
          .catch(error => console.log(error));

    },
    onDelete(path){
      const formData = new FormData();
      let user_id = localStorage.getItem('user_id')
      let container_name = this.container_info.container_name
      formData.append('user_id', user_id)
      formData.append('container_name', container_name)
      formData.append('file_path', path)
      this.$axios({
          method: 'post',
          url: '/teacher/delete_file/',
          data: formData,
        }).then(response => {
          console.log(response)
          this.loadFiles(container_name)
        })
          .catch(error => console.log(error));
    },
    search_container(){
      const formData = new FormData();
      let container_id = this.$route.query.container_id
      formData.append('container_id', container_id)
      this.$axios({
          method: 'post',
          url: '/teacher/search_container/',
          data: formData,
        }).then(response => {
          console.log(response)
          this.container_info = response.data.data
          this.loadFiles(response.data.data.container_name)
        })
          .catch(error => console.log(error));
    },
    handleEnter(){
      let url = this.container_info.container_url
      console.log(url)
      window.open(url, '_blank');
    },
    handleReturn(){
      this.$router.push('/manage/image')
    },
  },
  created(){
      this.search_container()
  },
}
</script>
  

<style lang="scss" scoped>
.detail {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>