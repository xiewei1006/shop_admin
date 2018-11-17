<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索功能 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="keyOfList"></el-button>
    </el-input>
    <el-button type="success" plain @click="dialogAddform = true">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="usersList" border style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column label="用户状态"  width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeState(scope.row.id,scope.row.mg_state)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit" @click="getUser(scope.row.id)"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check" @click="openallocation(scope.row.id)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentpage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 编辑用户模态框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :model="form" label-position="right" label-width="80px" ref="editForm">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editUser">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户模态框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogAddform">
      <el-form :rules="rules" :model="addform" label-position="right" label-width="80px" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addForm')">取 消</el-button>
        <el-button type="primary" @click="addUser('addForm')">添 加</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色模态框 -->
    <el-dialog title="分配角色" :visible.sync="dialogallocation">
      <el-form :model="allocationForm" label-position="right" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="allocationForm.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-select v-model="allocationForm.rid" placeholder="请选择角色">
          <el-option v-for="v in roleList" :key="v.id" :label="v.roleName" :value="v.id">
          </el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogallocation = false">取 消</el-button>
        <el-button type="primary" @click="getallocation">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      currentpage: 1,
      pagesize: 2,
      total: 1,
      usersList: [],
      dialogFormVisible: false,
      dialogAddform: false,
      dialogallocation: false,
      form: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
      addform: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^1\d{10}$/, message: '请输入正确的手机', trigger: 'blur' }
        ]
      },
      allocationForm: {
        username: '',
        rid: '',
        id: ''
      },
      roleList: []
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表
    getUsersList() {
      this.axios
        .get('users', {
          params: {
            query: this.query,
            pagenum: this.currentpage,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.usersList = res.data.users
            this.total = res.data.total || 1
          }
        })
    },
    // 改变每页显示条数
    handleSizeChange(val) {
      this.pagesize = val
      this.currentpage = 1
      this.getUsersList()
    },
    // 翻页功能
    handleCurrentChange(val) {
      this.currentpage = val
      this.getUsersList()
    },
    // 依据关键字搜索
    keyOfList() {
      this.currentpage = 1
      this.getUsersList()
    },
    // 删除单个用户
    del(id) {
      this.$confirm('您确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios({
            method: 'delete',
            url: `users/${id}`
          }).then(res => {
            if (res.meta.status === 200) {
              this.$message.error(res.meta.msg)
              if (this.usersList.length === 1 && this.currentpage > 1) {
                this.currentpage--
              }
              this.getUsersList()
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 更改用户状态
    changeState(id, state) {
      this.axios({
        url: `users/${id}/state/${state}`,
        method: 'put'
      }).then(res => {
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
        }
      })
    },
    // 获取用户信息
    getUser(id) {
      this.axios.get(`users/${id}`).then(res => {
        this.dialogFormVisible = true
        this.form.id = res.data.id
        this.form.username = res.data.username
        this.form.mobile = res.data.mobile
        this.form.email = res.data.email
      })
    },
    // 更改用户信息
    editUser() {
      this.dialogFormVisible = false
      this.axios({
        method: 'put',
        url: `users/${this.form.id}`,
        data: {
          email: this.form.email,
          mobile: this.form.mobile
        }
      }).then(res => {
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
        }
        this.getUsersList()
      })
    },
    // 取消更改
    cancelEdit() {
      this.dialogFormVisible = false
      this.$refs.editForm.resetFields()
    },
    // 添加用户
    addUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios.post('users', this.addform).then(res => {
            if (res.meta.status === 201) {
              this.$message.success('添加成功')
              this.$refs[formName].resetFields()
              this.dialogAddform = false
              // this.currentpage = Math.ceil((this.total + 1) / this.pagesize)
              this.total++
              this.currentpage = Math.ceil(this.total / this.pagesize)
              this.getUsersList()
            } else {
              this.$message.error(res.meta.msg)
            }
          })
        } else {
          this.$message.error('请重新输入用户名或者密码')
          return false
        }
      })
    },
    // 取消添加
    cancelAdd(formName) {
      this.dialogAddform = false
      this.$refs[formName].resetFields()
    },
    // 打开分配角色模态框
    openallocation(id) {
      this.allocationForm.id = id
      this.dialogallocation = true
      this.axios.get('roles').then(res => {
        this.roleList = res.data
      })
      this.axios.get(`users/${id}`).then(res => {
        this.allocationForm.rid = res.data.rid === -1 ? '' : res.data.rid
        this.allocationForm.username = res.data.username
      })
    },
    // 分配
    getallocation() {
      this.axios
        .put(`users/${this.allocationForm.id}/role`, {
          rid: this.allocationForm.rid
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success('设置角色成功')
            this.dialogallocation = false
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 400px;
  margin-bottom: 10px;
}
</style>
