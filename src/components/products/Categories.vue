<template>
  <div class="categories">
    <!-- 添加商品分类 -->
    <el-button class="btn-add" type="success" plain @click="openAddDialog">添加分类</el-button>
    <!-- 商品分类列表 -->
    <el-table :data="categoriesList" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(255, 255, 255, 0.3)">
      <el-table-tree-column parent-key="cat_pid" tree-key="cat_id" level-key="cat_level" :indentSize="20" label="分类名称" prop="cat_name">
      </el-table-tree-column>
      <el-table-column  label="是否有效" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.cat_deleted?'是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="排序" width="180" prop="cat_level">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit" @click="showedit(scope.row)"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="del(scope.row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加模态框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" @closed="cancelAdd">
      <el-form :rules="rules" :model="addform" label-position="right" label-width="80px" ref="addForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addform.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader :options="options" :props="props" change-on-select v-model="addform.cat_pid" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">添 加</el-button>
      </div>
    </el-dialog>
    <!-- 修改模态框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible">
      <el-form :rules="rules" :model="editform" label-position="right" label-width="80px" ref="editform">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editform.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoriesList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      addDialogVisible: false,
      // 添加表单数据
      addform: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      options: [],
      // 级联菜单的属性配置
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 修改分类
      editDialogVisible: false,
      editform: {
        id: '',
        cat_name: ''
      }
    }
  },
  methods: {
    // 获取分类
    async getCategoriesList() {
      this.loading = true
      let res = await this.axios.get(`categories`, {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { result, total } } = res
      if (status === 200) {
        this.categoriesList = result
        this.total = total
        this.loading = false
      }
    },
    // 翻页
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getCategoriesList()
    },
    // 改变每页条数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoriesList()
    },
    // 删除单个分类
    async del(id) {
      try {
        await this.$confirm('您确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${id}`)
        if (res.meta.status === 200) {
          this.$message.success('删除成功')
          if (this.categoriesList.length === 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getCategoriesList()
        }
      } catch (e) {
        this.$message.info('已取消删除')
      }
    },
    // 打开分类模态框
    async openAddDialog() {
      this.addDialogVisible = true
      let res = await this.axios.get(`categories?type=2`)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.options = data
      }
    },
    // 添加分类
    addCategory() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let res = await this.axios.post('categories', {
            cat_pid: this.addform.cat_pid[this.addform.cat_pid.length - 1] || 0,
            cat_name: this.addform.cat_name,
            cat_level: this.addform.cat_pid.length
          })
          if (res.meta.status === 201) {
            // 创建成功
            this.getCategoriesList()
            this.addDialogVisible = false
            this.$message.success('恭喜你，添加分类成功了')
          }
        } else {
          this.$message.error('请输入分类名称')
          return false
        }
      })
    },
    // 取消添加
    cancelAdd() {
      this.$refs.addForm.resetFields()
    },
    // 打开修改模态框
    showedit(cate) {
      this.editDialogVisible = true
      this.editform.id = cate.cat_id
      this.editform.cat_name = cate.cat_name
    },
    async editCategory() {
      let res = await this.axios.put(`categories/${this.editform.id}`, {
        cat_name: this.editform.cat_name
      })
      if (res.meta.status === 200) {
        this.getCategoriesList()
        this.editDialogVisible = false
      }
    }
  },
  created() {
    this.getCategoriesList()
  }
}
</script>

<style>
</style>
