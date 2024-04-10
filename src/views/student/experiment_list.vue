<template>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="course_list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
      <el-table-column align="center" label="实验ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.course_id }}
        </template>
      </el-table-column>
      <el-table-column label="实验名称">
        <template slot-scope="scope">
          {{ scope.row.course_name }}
        </template>
      </el-table-column>
      <el-table-column label="实验章节">
        <template slot-scope="scope">
          {{ scope.row.course_chapter }}
        </template>
      </el-table-column>
      <el-table-column label="难度">
        <template slot-scope="scope">
          {{ scope.row.course_difficulty }}
        </template>
      </el-table-column>
      <el-table-column label="限时">
        <template slot-scope="scope">
          {{ scope.row.course_limit_time }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <span>
            <el-button type="primary" @click="handleEnter(scope.row)"> 进入实验 </el-button>
            <!-- <el-button type="primary" @click="handleDelete(scope.row.course_id)"> 删除 </el-button> -->
          </span>
        </template>
      </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  import { getList } from '@/api/table'
  
  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        course_list: null,
        listLoading: false
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.$axios({
          method: 'post',
          url: '/student/get_course_list/',
        }).then(
          res => {
            console.log(res)
            this.course_list = res.data.data
            this.listLoading = false
          }
        )
      },
      handleEnter(row){
            console.log(row)
            this.$router.push({
                path:'/experiment_list/experiment_detail',
                query:{
                    course_id: row.course_id,
                }
            })
        },
    }
  }
  </script>