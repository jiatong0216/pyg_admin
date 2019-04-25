<template>
  <div class="cate_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" plain @click="showAdd()">添加角色</el-button>
      <el-table
        :data="categories"
        :index="50"
        style="width: 100%;margin-bottom: 20px;"
        row-key="cat_id"
      >
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template slot-scope="scope">
            <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color: green"></i>
            <i v-else class="el-icon-error" style="color: red"></i>
          </template>
        </el-table-column>
        <el-table-column label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level===0">一级分类</el-tag>
            <el-tag type="success" v-if="scope.row.cat_level===1">二级分类</el-tag>
            <el-tag type="warning" v-if="scope.row.cat_level===2">三级分类</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-edit" @click="showEditDialog(scope.row.cat_id)" round></el-button>
              <el-button icon="el-icon-delete" @click="delCategory(scope.row.cat_id)" round></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="changePager"
        :page-size="reqParams.pagesize"
        :current-page="reqParams.pagenum"
        background
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog width="400px" title="添加分类" :visible.sync="addDialogFormVisible">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        autocomplete="off"
        :rules="addRules"
      >
        <el-form-item label="父级分类">
          <!-- 级联显示 -->
          <el-cascader
            style="width: 100%"
            expand-trigger="hover"
            :options="categoryList"
            v-model="categoryValues"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "./Categories-Mixin";
export default {
  mixins: [mixin]
};
</script>

<style scoped>
</style>