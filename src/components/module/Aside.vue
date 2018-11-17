<template>
  <el-menu ref="myAside" :default-active="$route.path.replace('/','')" class="el-menu-vertical-demo" router unique-opened background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">

    <el-submenu :index="leval1.path" v-for="leval1 in rolesList" :key="leval1.id">
      <template slot="title"><i class="el-icon-location"></i><span>{{ leval1.authName }}</span></template>
      <el-menu-item :index="leval2.path" v-for="leval2 in leval1.children" :key="leval2.id">
        <i class="el-icon-menu"></i><span>{{ leval2.authName }}</span>
      </el-menu-item>
    </el-submenu>

  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      rolesList: []
    }
  },
  methods: {},
  async created() {
    let res = await this.axios.get('menus')
    if (res.meta.status === 200) {
      this.rolesList = res.data
    }
  }
}
</script>

<style scoped>
.el-menu {
  height: 100%;
  background-color: rgb(84, 92, 100);
  width: 201px;
}
.el-submenu {
  width: 200px;
}
</style>
