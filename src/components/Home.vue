<template>

  <el-container class="home">
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="200px"><Aside></Aside></el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import Aside from './module/Aside'
import Header from './module/Header'
export default {
  data() {
    return {}
  },
  methods: {},
  components: {
    Aside,
    Header
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  .el-main {
    background-color: #eaeef1;
  }
}
</style>
