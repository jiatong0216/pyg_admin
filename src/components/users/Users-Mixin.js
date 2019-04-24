export default {
  name: 'Users',
  data () {
    // 定义 手机校验函数 rule 规则信息 value 验证的输入框的值 callback回调函数
    const checkMobile = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) return callback(new Error('手机号不对'))
      callback()
    }
    return {
      // 用户列表
      userList: [],
      // 传参
      reqParams: {
        query: '',
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
          { required: true, message: '用户名必填', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { min: 6, max: 18, message: '密码必须为6-18位字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱必填', trigger: 'blur' },
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 手机验证必须自定义校验规则 通过自己的函数来校验
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      // 控制分配角色对话框的显示隐藏
      roleDialogFormVisible: false,
      // 选中角色的值
      roleValue: '',
      // 当前用户的用户名
      roleUserName: '',
      // 当前用户的角色
      roleUserRoleName: '',
      // 用户的ID
      roleUserId: '',
      // 角色下拉所有选项
      options: [],
      // 编辑数据
      editDialogFormVisible: false,
      editForm: {},
      editRules: {
        email: [
          { required: true, message: '邮箱必填', trigger: 'blur' },
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 手机验证必须自定义校验规则 通过自己的函数来校验
          {validator: checkMobile, trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    // 用户列表数据获取
    this.getData()
  },
  methods: {
    async getData () {
      // get传参 get(url,{params:{参数}})
      const { data: { data, meta } } = await this.$http.get('users', { params: this.reqParams })
      //   console.log(this.reqParams);
      if (meta.status !== 200) return this.$message.error('获取用户属性失败')
      // 成功显示列表数据
      this.userList = data.users
      // 总条数
      this.total = data.total
    },
    changePager (newPage) {
      // 进行分页查询 需显示当前页码
      this.reqParams.pagenum = newPage
      this.getData()
    },
    search () {
      // 根据当前搜索关键字 查询第一页的数据
      this.reqParams.pagenum = 1
      this.getData()
    },
    addSubmit () {
      // 输入的时候进行数据的验证  点击提交的时候,需再次验证
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const { data: { meta } } = await this.$http.post('users', this.addForm)
          // console.log(this.addForm)
          if (meta.status !== 201) return this.$message.error('添加失败')
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
      this.$nextTick(() => { this.$refs.addForm.resetFields() })
    },
    delUsers (id) {
      // 删除用户ID
      this.$confirm('是否删除该数据???', '删还是不删呢??', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击确认发请求
        const { data: { meta } } = await this.$http.delete(`users/${id}`)
        if (meta.status !== 200) return this.$message.error('删除数据失败')
        this.$message.success('删除成功')
        this.getData()
      }).catch(() => { })
    },
    async updateState (id, newState) {
      // id用户的ID newState 已改变的状态
      // console.log(id, newState)
      const { data: { meta } } = await this.$http.put(`users/${id}/state/${newState}`)
      if (meta.status !== 200) return this.$message.error('修改状态失败')
      this.$message.success('修改状态成功')
      this.getData()
    },
    async showRoleDialogFormVisible (row) {
      // 添加显示对话框
      this.roleDialogFormVisible = true
      // 渲染下拉菜单
      const {data: {data, meta}} = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error('获取角色失败')
      this.options = data
      this.roleUserId = row.id
      this.roleUserName = row.username
      this.roleUserRoleName = row.role_name
    },
    async changeRole () {
      // 发送请求 分配用户角色
      const {data: {meta}} = await this.$http.put(`users/${this.roleUserId}/role`, {
        rid: this.roleValue
      })
      if (meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.roleDialogFormVisible = false
      this.getData()
    },
    async showEditRoleDialogFormVisible (id) {
      // 显示对话框
      this.editDialogFormVisible = true
      // 填充数据 根据ID发送请求
      const {data: {data, meta}} = await this.$http.get(`users/${id}`)
      if (meta.status !== 200) return this.$message.error('获取用户数据失败')
      // 获取成功时暂时渲染到表单内
      this.editForm = data
    },
    // 编辑修改提交数据 -->整个表单的验证
    editSubmit () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          // 校验成功 -->重新获取数据 --> 关闭对话框
          const {data: {meta}} = await this.$http.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (meta.status !== 200) return this.$message.error('编辑失败')
          this.$message.success('编辑成功')
          this.getData()
          this.editDialogFormVisible = false
        }
      })
    }
  }
}