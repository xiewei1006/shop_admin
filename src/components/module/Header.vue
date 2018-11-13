<template>
  <div class="header">
    <div class="logo"><img src="../../assets/logo.png"></div>
    <div class="title"><h1>电商后台管理系统</h1></div>
    <div class="loginout">
      <span>欢迎光临</span>
      <a href="javascript:;" @click="loginOut">退出</a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    loginOut() {
      this.$confirm('您确定退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 60px;
  line-height: 60px;
  background-color: #b3c1cd;
  text-align: center;
  position: relative;
  padding: 0 210px;
  margin: 0 -20px;
  .logo {
    position: absolute;
    height: 60px;
    top: 0;
    left: 10px;
    padding: 0 10px;
    img {
      width: 180px;
      vertical-align: middle;
    }
  }
  h1 {
    font-size: 30px;
    color: #fff;
    overflow: hidden;
    height: 60px;
  }
  .loginout {
    position: absolute;
    top: 0;
    right: 0;
    width: 210px;
    height: 60px;
    font-weight: bolder;
    a {
      color: #b07a17;
    }
  }
}
</style>
