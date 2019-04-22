<template>
  <div class="users_container">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片 搜索框+ 添加按钮 plain镂空设置-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="reqParams.query">
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" plain @click="showDialogForm()">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- 使用当前行的数据  scope.row  状态 scope.row.mg_state -->
            <!-- el-switch 默认布尔值  如果为true激活   -->
            <el-switch
              @change="updateState(scope.row.id,scope.row.mg_state)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ccc"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 自定义内容 和数据的传递 需要使用template 且包含 slot-scope = "scope" -->
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-edit" round></el-button>
              <el-button icon="el-icon-delete" @click="delUsers(scope.row.id)" round></el-button>
              <el-button icon="el-icon-setting" @click="showRoleDialogFormVisible(scope.row)" round></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- @current-change 改变当前页事件 changePager事件触发函数不带() 因为有默认传参 -->
      <!-- :page-size = "reqParams.pagesize" 指定现在每页多少条 -->
      <!-- :current-page = "reqParams.pagenum" 分页根据当前的页数选中按钮 -->
      <el-pagination
        @current-change="changePager"
        :page-size="reqParams.pagesize"
        :current-page="reqParams.pagenum"
        background
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog width="400px" title="添加用户" :visible.sync="dialogFormVisible">
      <el-form ref ="addForm" :model="addForm" label-width="80px" autocomplete = "off" :rules="addRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>          
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>
 

<script>
export default {
  data() {
    return {
      // 用户列表
      userList: [],
      // 传参
      reqParams: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      // 总条数
      total: 0,
    //   标识当前对话框是否显示
    dialogFormVisible: false,
    // 添加表单对象数据
    addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
    },
    addRules: {
        username: [
            {required: true, message: '用户名必填',trigger: 'blur'}
        ],
        password: [
            {required: true, message: '密码必填',trigger: 'blur'},
            {min: 6, max: 18, message: '密码必须为6-18位字符',trigger: 'blur'}
        ],
        email: [
            {required: true, message: '邮箱必填',trigger: 'blur'},
            {type: 'email',message: '邮箱格式错误', trigger: 'blur'}
        ],
        mobile: [
            {required: true, message: '手机号必填',trigger: 'blur'}
        ]
    },
    // 控制分配角色对话框的显示隐藏
    roleDialogFormVisible: false,
    // 选中角色的值
    roleValue: '',
    // 当前用户的用户名
    roleUserRoleName: '',
    // 用户的ID
    roleUserId: '',
    // 角色下拉所有选项
    option: []
    }
  },
  mounted() {
    // 用户列表数据获取
    this.getData();
  },
  methods: {
    async getData() {
      // get传参 get(url,{params:{参数}})
      const {data: { data, meta }} = await this.$http.get("users", { params: this.reqParams });
    //   console.log(this.reqParams);
      if (meta.status !== 200) return this.$message.error("获取用户属性失败");
      // 成功显示列表数据
      this.userList = data.users;
      // 总条数
      this.total = data.total;
    },
    changePager(newPage) {
      // 进行分页查询 需显示当前页码
      this.reqParams.pagenum = newPage;
      this.getData();
    },
    search() {
      // 根据当前搜索关键字 查询第一页的数据
      this.reqParams.pagenum = 1;
      this.getData();
    },
    addSubmit() {
        // 输入的时候进行数据的验证  点击提交的时候,需再次验证
        this.$refs.addForm.validate(async valid => {
            if(valid) {
                const {data: {meta}} = await this.$http.post('users', this.addForm)
                // console.log(this.addForm)
                if(meta.status !== 201) return this.$message.error('添加失败')
                // 添加成功后 关闭对话框 更新列表
                this.dialogFormVisible = false
                this.getData()
            }
        })
    },
    showDialogForm () {
        // 显示添加对话框 
         this.dialogFormVisible = true
        // 重置表单 内容 验证resetFields()
        //  this.$refs.addForm.resetFields()
        this.$nextTick(()=>{this.$refs.addForm.resetFields()})
    },
    delUsers(id) {
        // 删除用户ID
        this.$confirm('是否删除该数据???', '删还是不删呢??',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async ()=> {
            // 点击确认发请求
            const{ data: {data,meta}} = await this.$http.delete(`users/${id}`)
            if(meta.status !== 200) return this.$message.error('删除数据失败')
            this.$message.success('删除成功')
            this.getData()
        }).catch(()=>{})
    },
    async updateState (id, newState) {
        // id用户的ID newState 已改变的状态
        // console.log(id, newState)
        const {data:{meta}} = await this.$http.put(`users/${id}/state/${newState}`)
        if (meta.status !== 200) return this.$message.error('修改状态失败')
        this.$message.success('修改状态成功')
        this.getData()
    }
  }
};
</script>

<style scoped>
</style>