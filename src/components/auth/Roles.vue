<template>
  <div class="roles_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" plain @click="showAdd()">添加角色</el-button>
      <el-table :data="rolesList">
        <el-table-column type="expand" width="100px">
          <template slot-scope="scope">
            <span v-if="!scope.row.child.length" style="color: red">暂无分配任何权限</span>
            <!-- 一级权限 -->
            <el-row style="border-bottom: 1px solid #eee"
                    :style="{'border-top':i ===0?'1px solid #eee':'none'}"
                    v-for ="(item,i) in scope.row.child" :key="item.id">
              <el-col :span="4">
                <el-tag @close="delRights(scope.row,item.id)" closable>{{item.authName}}</el-tag>
                <span class="el-icon-caret-right"></span>
              </el-col>
              <el-col :span="20">
                <!-- 二级权限 -->
                <el-row :style="{'border-top':i===0?'none':'1px solid #eee'}"
                        v-for="(sItem,i) in item.child" :key="sItem.id">
                  <el-col :span="8">
                    <el-tag @close="delRights(scope.row,secondItem.id)" closable type="success">{{sItem.authName}}</el-tag>
                    <span class="el-icon-caret-right"></span>
                  </el-col>
                  <el-col :span="16">
                    <!-- 三级权限 -->
                    <el-tag @close="delRights(scope.row,lastItem.id)" closable type="warning" v-for="lastItem in sItem.child" :key="lastItem.id">{{lastItem.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="100px"></el-table-column>
        <el-table-column property="roleName" label="角色名称"></el-table-column>
        <el-table-column property="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-edit" @click="showEdit(scope.row.id)" round></el-button>
              <el-button icon="el-icon-delete" @click="delRoles(scope.row.id)" round></el-button>
              <el-button icon="el-icon-setting" @click="showRight(scope.row)" round></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog width="400px" title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        autocomplete="off"
        :rules="addRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog width="400px" title="编辑角色" :visible.sync="editDialogFormVisible">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"     
        :rules="editRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog width="400px" title="分配角色" :visible.sync="rightDialogFormVisible">
      <el-tree :data="rightTree" 
              show-checkbox 
              node-key="id" 
              :default-expand-all ="true" 
              :props="defaultProps"
              :default-checked-keys = "rightCheckedList" 
              ref = "tree">    
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="rightSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "./Roles-Mixin";
export default {
  mixins: [mixin]
};
</script>

<style scoped>
.el-row {
    display: flex;
    align-items: center
}
.el-tag {
    margin: 5px
}
</style>