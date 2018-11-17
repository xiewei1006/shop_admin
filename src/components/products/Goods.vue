<template>
  <div class="goods">
    <el-button type="success" plain>添加商品</el-button>
    <!-- 商品列表 -->
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column prop="goods_name" label="商品名称">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="180">
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.add_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete"></el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      query: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    async getgoodsList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { goods, total } } = res
      console.log(res)
      if (status === 200) {
        this.goodsList = goods
        this.total = total
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getgoodsList()
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getgoodsList()
    }
  },
  created() {
    this.getgoodsList()
  }
}
</script>

<style>
</style>
