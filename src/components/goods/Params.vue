<template>
  <div class="params_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意:第三级分类才可设置参数" type="warning" show-icon></el-alert>
      <el-form-item label="选择商品分类：">
          <el-cascader></el-cascader>
      </el-form-item>
    </el-card>
  </div>
</template>

<script>
import mixin from "./Params-Mixin";
export default {
  mixins: [mixin]
};
</script>

<style scoped>
</style>