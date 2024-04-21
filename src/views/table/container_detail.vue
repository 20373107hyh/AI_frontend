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
      <input type="file" webkitdirectory directory multiple @change="onFileChange">
      <el-input placeholder="请输入路径，注意路径不以/结尾，文件夹名不以.开头" v-model="path">
        <template slot="prepend"> {{ container_info.workdir }}/ </template>
      </el-input>
      <button type="submit">Submit</button>
    </form>
    <!-- <ul v-if="uploaded_files.length > 0">
      <li v-for="(file, index) in uploaded_files" :key="index">
        {{ file.filename }} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;  {{ file.path }}  
        <button @click="onDelete(file.path)">Delete</button>
      </li>
    </ul> -->
    <el-table 
      :data="uploaded_files" 
      v-loading="listLoading"
      @selection-change="handleSelectionChange">
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
      <el-table-column 
        prop="operation" 
        label="操作">
        <template slot-scope="scope">
          <el-button @click="onDelete([scope.row.path])">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="onDeleteSelectedFiles">删除所选</el-button>
    <el-button type="primary" @click="handleEnter()"> 进入 </el-button>
    <el-button type="primary" @click="handleReturn()"> 返回 </el-button>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      files: [], //正在上传的文件
      selectedFiles: [],
      uploaded_files:[], //已上传的文件
      container_info: {},
      path: '',
      listLoading: true,
    };
  },
  methods: {
    handleSelectionChange(selected) {
      this.selectedFiles = selected.map(file => file.path);
    },
    loadFiles(name){
      this.listLoading = true
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
        this.listLoading = false
      })
      this.files = []
    },
    onFileChange(e) {
      this.files = [...e.target.files];
      console.log(this.files)
    },
    isSelectable(file) {
      // 这个函数决定哪些文件可以被选中
      // 不写代表允许所有文件被选中
      return true;
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
        formData.append('path[]', file.webkitRelativePath || file.name); // 添加文件的相对路径
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
      console.log(path)
      const formData = new FormData();
      let user_id = localStorage.getItem('user_id')
      let container_name = this.container_info.container_name
      formData.append('user_id', user_id)
      formData.append('container_name', container_name)
      formData.append('file_paths', JSON.stringify(path))
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
    onDeleteSelectedFiles(){
      console.log(this.selectedFiles)
      this.onDelete(this.selectedFiles); // Call onDelete with the paths of the selected files
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