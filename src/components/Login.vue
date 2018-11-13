<template>
  <div class="login">
    <el-form label-position="top" status-icon :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm login-form">
      <img src="../assets/mz.jpg">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" clearable></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios.post('login', this.ruleForm).then(res => {
            if (res.meta.status === 400) {
              this.$message.error(res.meta.msg)
            }
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.meta.msg,
                duration: 1000
              })
              localStorage.setItem('token', res.data.token)
              this.$router.push('/home')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .login-form {
    width: 440px;
    padding: 20px;
    background-color: white;
    margin: 200px auto;
    border-radius: 15px;
    position: relative;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -100px);
      border: 10px solid #fff;
    }
  }
}
</style>
