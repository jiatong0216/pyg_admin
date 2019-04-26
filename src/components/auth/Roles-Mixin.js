export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      // 添加角色数据相关
      addDialogFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addRules: {
        // 校验规则
        roleName: [
          { required: true, message: '角色名必填', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述必填', trigger: 'blur' }
        ]
      },
      // 编辑角色
      editDialogFormVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      editRules: {
        roleName: [
          { required: true, message: '角色名必填', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述必填', trigger: 'blur' }
        ]
      },
      // 分配权限
      rightDialogFormVisible: false,
      rightTree: [],
      // 选中权限的ID列表
      rightCheckedList: [],
      // 分配权限角色ID
      rightRoleId: null,
      defaultProps: {
        // 数据结构中 下一级字段的数据名
        children: 'children',
        // 显示文字的字段名字
        label: 'authName'
      }

    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取列表数据
    async getData () {
      const { data: { data, meta } } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error('获取角色列表失败')
      // 表格中data对数据格式有固定要求 会解析children数据 需要对children数据进行处理
      // 去除children数据 保留children有的数据
      //   console.log(data)
      data.forEach(item => {
        item.child = item.children
        delete item.children
        item.child.forEach(item => {
          item.child = item.children
          delete item.children
          item.child.forEach(item => {
            item.child = item.children
            delete item.children
          })
        })
      })
      this.rolesList = data
      //   console.log(data)
    },
    showAdd () {
      // 显示添加对话框
      this.addDialogFormVisible = true
      // 重置表单 内容 验证resetFields()
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    addSubmit () {
      // 添加功能  验证表单 --> 提交请求 --> 成功关闭对话框 --> 更新数据列表
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const { data: { meta } } = await this.$http.post('roles', this.addForm)
          if (meta.status !== 201) return this.$message.error('添加角色失败')
          this.$message.success('添加角色成功')
          this.addDialogFormVisible = false
          this.getData()
        }
      })
    },
    delRoles (id) {
      // 删除角色功能 点击确认发送请求 --> 成功 -->更新列表数据
      this.$confirm('是否删除该数据??', '温馨提示= =!', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: { meta } } = await this.$http.delete(`roles/${id}`)
        if (meta.status !== 200) return this.$message.error('删除数据失败')
        this.$message.success('删除成功')
        this.getData()
      }).catch(() => { })
    },
    showEdit (id) {
      // 显示对话编辑框 -->默认填充数据  --> 更新数据列表
      this.editDialogFormVisible = true
      this.$nextTick(async () => {
        this.$refs.editForm.resetFields()
        const { data: { data, meta } } = await this.$http.get(`roles/${id}`)
        if (meta.status !== 200) return this.$message.error('获取角色失败')
        this.editForm = data
      })
    },
    editSubmit () {
      // 编辑角色功能  验证表单 --> 发送请求 --> 关闭对话框--> 更新列表
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const { data: { meta } } = await this.$http.put(`roles/${this.editForm.roleId}`, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          })
          if (meta.status !== 200) return this.$message.error('编辑角色失败')
          this.$message.success('编辑角色成功')
          this.editDialogFormVisible = false
          this.getData()
        }
      })
    },
    delRights   (row, rightId) {
      // 删除功能
      this.$confirm('是否删除该权限?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: { data, meta } } = await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
        if (meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        // 局部更新 当前行的数据 child数据 当前修改后返回的数据 就是child数据
        data.forEach(item => {
          item.child = item.children
          delete item.children
          item.child.forEach(item => {
            item.child = item.children
            delete item.children
          })
        })
        row.child = data
      }).catch(() => { })
    },
    async showRight (row) {
      // 显示分配权限对话框 --> 发请求获取树状结构数据 --> 渲染数据     
      const {data: {data, meta}} = await this.$http.get('rights/tree')
      if (meta.status !== 200) return this.$message.error('获取所有权限失败')
      // console.log(data)
      this.rightTree = data
      // 选中已有权限
      const arr = []
      row.child.forEach(item => {
        item.child.forEach(item => {
          item.child.forEach(item => {
            arr.push(item.id)
          })
        })
      })
      // console.log(arr)
      this.rightCheckedList = arr
      // 先获取权限选中数据在进行显示对话框
      this.rightDialogFormVisible = true
      // 设置当前分配权限的角色ID
      this.rightRoleId = row.id
    },
    async rightSubmit () {
      // 分配权限 合并半选和全选 -->提交角色授权请求 --> 关闭对话框--> 更新列表
      const treeDom = this.$refs.tree
      // 获取选中
      const checkedArr = treeDom.getCheckedKeys()
      // 获取半选中
      const halfCheckArr = treeDom.getHalfCheckedKeys()
      // 合并数组 (选中和半选中)
      const arr = [...checkedArr,...halfCheckArr]
      // console.log(arr)
      const {data: {meta}} = await this.$http.post(`roles/${this.rightRoleId}/rights`, {
        rids: arr.join(',')
      })
      if (meta.status !== 200) return this.$message.error('角色授权失败')
      this.$message.success('角色授权成功')
      this.rightDialogFormVisible = false
      this.getData()
    }
  }
}