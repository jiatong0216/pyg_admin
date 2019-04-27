export default {
  name: 'Params',
  data () {
    return {
      // 分类级联相关数据
      categoryList: [],
      // 当前选中的分类的数据包含每一级的分类ID
      categoryValues: [],
      // tabs相关数据
      activeName: 'many',
      disabled: true,
      // 动态参数列表
      manyAttrs: [],
      // 静态参数列表
      onlyAttrs: [],
      // 对话框数据
      addDialogFormVisible: false,
      addForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [
          {required: true, message: '参数名称必填', trigger: 'blur'}
        ]
      }
    }
  },
  // 计算属性
  computed: {
    id () {
      if (this.categoryValues.length === 3) {
        return this.categoryValues[2]
      } else {
        return null
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      // 发请求 获取级联组件数据 --> 渲染级联数据
      const {data: {data, meta}} = await this.$http.get('categories')
      if (meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.categoryList = data
    },
    handleChange () {
      // 选择了分类的时候
      this.getParams()
    },
    handleClick () {
      // 切换tab的时候
      this.getParams()
    },
    async getParams () {
      // 获取参数列表数据 三级分类的ID(判断是否有三级分类) 当前选中的参数类型
      const len = this.categoryValues.length
      if (len === 3) {
        // 选了三级
        const id = this.categoryValues[len - 1]
        // 发送数据请求
        const {data: {data, meta}} = await this.$http.get(`categories/${id}/attributes`, {
          params: {sel: this.activeName}
        })
        if (meta.status !== 200) return this.$message.error('获取参数数据失败')
        // data中的attr_vals是一个字符串 条件动态参数的时候才需要转换数组
        if (this.activeName === 'many') {
          data.forEach(item => {
            // 如果attr_vals='' 使用split() 产生['']
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            // 添加字段 inputShow 控制tag和input显示隐藏
            item.inputShow = false
            item.inputValue = ''
          })
        }
        // 根据当前的activeName去找到对应的列表 赋值
        this[`${this.activeName}Attrs`] = data
        this.disabled = false
      } else {
        // 没有选中三级--> 清空当前不符合要求的选择
        this.categoryValues = []
        this.disabled = true
      }
    },
    // 显示对话框
    showAdd () {
      this.addDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    addSubmit () {
      // 验证提交 --> 更新列表 --> 关闭对话框
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 获取三级分类的ID
        //   const id = this.categoryValues[2]
          const {data: {meta}} = await this.$http.post(`categories/${this.id}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (meta.status !== 201) return this.$message.error('添加参数失败')
          this.$message.success('添加参数成功')
          // 更新列表
          this.getParams()
          this.addDialogFormVisible = false
        }
      })
    },
    // 删除静态动态参数
    delParams (attrId) {
      this.$confirm('是否删除该参数??', '温馨提示= =!', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const id = this.categoryValues[2]
        const { data: { meta } } = await this.$http.delete(`categories/${this.id}/attributes/${attrId}`)
        if (meta.status !== 200) return this.$message.error('删除参数失败')
        this.$message.success('删除参数成功')
        this.getParams()
      }).catch(() => { })
    },
    // 显示input
    showInput (row) {
      row.inputShow = true
      // dom.focus() 获取焦点 dom当前行的input
      this.$nextTick(() => {
        this.$refs['input' + row.attr_id].focus()
      })
    },
    // 隐藏input
    hideInput (row) {
      row.inputShow = false
      if (row.inputValue) {
        row.attr_vals.push(row.inputValue)
        this.editAttr(row)
        row.inputValue = ''
      }
    },
    // tags 删除事件
    delTag (row, i) {
      // 删除tag的效果 并没有真正的去修改后台的数据
      row.attr_vals.splice(i, 1)
      this.editAttr(row)
    },
    async editAttr (row) {
      // 根据现在的arr去修改后台的参数的值
      const {data: {meta}} = await this.$http.put(`categories/${this.id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(',')
      })
      if (meta.status !== 200) return this.$message.error('更新参数失败')
      this.$message.success('更新参数成功')
    }
  }
}