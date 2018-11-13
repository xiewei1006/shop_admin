<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button class="btn-add" type="success" plain @click="dialogAddform = true">添加角色</el-button>
    <!-- 角色列表 -->
    <el-table :data="rolesList" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-if="scope.row.children.length === 0">暂无任何权限</el-row>
          <el-row v-for="leval1 in scope.row.children" :key="leval1.id">
            <el-col :span="4"><el-tag @close="delrights(scope.row,leval1.id)" closable>{{leval1.authName}}</el-tag></el-col>
            <el-col :span="20">
              <el-row class="leval2" v-for="leval2 in leval1.children" :key="leval2.id">
                <el-col :span="4"><el-tag @close="delrights(scope.row,leval2.id)" closable type="success">{{leval2.authName}}</el-tag></el-col>
                <el-col :span="20">
                  <el-tag @close="delrights(scope.row,leval3.id)" class="leval3" closable v-for="leval3 in leval2.children" :key="leval3.id" type="danger">{{leval3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180">
      </el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit" @click="openRoleForm(scope.row)"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check" @click="opendialogRights(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 权限树形模态框 -->
    <el-dialog title="角色授权" :visible.sync="dialogRights" width="40%" @closed="dialogRightsClose">
      <el-tree ref="rightsTree" :data="rightsList" :props="props" show-checkbox node-key="id" default-expand-all>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRights = false">取 消</el-button>
        <el-button type="primary" @click="editRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色模态框 -->
    <el-dialog title="添加角色" :visible.sync="dialogAddform" @closed="dialogAddformClose">
      <el-form :rules="rules" :model="addform" label-position="right" label-width="80px" ref="addForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addform.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddform = false">取 消</el-button>
        <el-button type="primary" @click="addrole">添 加</el-button>
      </div>
    </el-dialog>
    <!-- 修改角色模态框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogroleForm" @closed="dialogRoleFormClose">
      <el-form :rules="rules" :model="roleForm" label-position="right" label-width="80px" ref="roleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogroleForm = false">取 消</el-button>
        <el-button type="primary" @click="editRole">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      rightsList: [],
      dialogRights: false,
      dialogAddform: false,
      dialogroleForm: false,
      props: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addform: {
        roleName: '',
        roleDesc: ''
      },
      roleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取角色列表
    async getrolesList() {
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rolesList = data
      }
    },
    // 删除单个权限
    async delrights(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      let { meta: { status }, data } = res
      if (status === 200) {
        role.children = data
        this.$message.success('修改权限成功')
      }
    },
    // 打开权限树形图
    async opendialogRights(role) {
      this.dialogRights = true
      this.roleId = role.id
      let res = await this.axios.get('rights/tree')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rightsList = data
      }
      let rightIds = []
      role.children.forEach(leaval1 => {
        leaval1.children.forEach(leaval2 => {
          leaval2.children.forEach(leaval3 => {
            rightIds.push(leaval3.id)
          })
        })
      })
      this.$nextTick(() => {
        this.$refs.rightsTree.setCheckedKeys(rightIds)
      })
    },
    // 关闭权限树形图
    dialogRightsClose() {
      this.$refs.rightsTree.setCheckedKeys([])
    },
    // 关闭添加表单
    dialogAddformClose() {
      this.$refs.addForm.resetFields()
    },
    // 关闭修改角色表单
    dialogRoleFormClose() {
      this.$refs.roleForm.resetFields()
    },
    // 修改角色权限
    async editRights() {
      let assign = this.$refs.rightsTree.getCheckedKeys()
      let halfassign = this.$refs.rightsTree.getHalfCheckedKeys()
      let rightIds = [...assign, ...halfassign]
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: rightIds.join()
      })
      let { meta: { status } } = res
      if (status === 200) {
        this.$message.success('分配权限成功')
        this.getrolesList()
        this.dialogRights = false
      }
    },
    // 删除单个角色
    async del(id) {
      try {
        await this.$confirm('您确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${id}`)
        let { meta: { status } } = res
        if (status === 200) {
          this.$message.error('已成功删除')
          this.getrolesList()
        }
      } catch (err) {
        this.$message.info('已取消删除')
      }
    },
    // 添加角色
    addrole() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let res = await this.axios.post('roles', this.addform)
          let { meta: { status } } = res
          if (status === 201) {
            this.$message.success('添加成功')
            this.dialogAddform = false
            this.getrolesList()
          }
        } else {
          this.$message.error('请输入角色名称')
          return false
        }
      })
    },
    // 打开修改名称模态框
    openRoleForm(role) {
      this.dialogroleForm = true
      this.roleForm.id = role.id
      this.roleForm.roleName = role.roleName
      this.roleForm.roleDesc = role.roleDesc
    },
    // 修改角色名称描述
    editRole() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          let res = await this.axios.put(
            `roles/${this.roleForm.id}`,
            this.roleForm
          )
          let { meta: { status } } = res
          if (status === 200) {
            this.$message.success('修改角色成功')
            this.dialogroleForm = false
            this.getrolesList()
          }
        } else {
          this.$message.error('请输入角色名称')
          return false
        }
      })
    }
  },
  created() {
    this.getrolesList()
  }
}
</script>

<style lang="less" scoped>
.leval2 {
  margin-bottom: 10px;
}
.leval3 {
  margin-bottom: 5px;
  margin-right: 10px;
}
.btn-add {
  margin: 10px 0;
}
</style>
