export default {
  name: 'Categories',
  data () {
    return {
      reqParams: {
        pagenum: 1,
        pagesize: 5
      },
      categories: [],
      total: 0,
      // 添加分类相关数据
      addDialogFormVisible: false,
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addRules: {
        cat_name: [
          {required: true, message: '分类名称必填', trigger: 'blur'}
        ]
      },
      // 级联相关数据
      categoryList: [],
      // 选择了级联控件后的值
      categoryValues: [],
      // 编辑相关数据
      editDialogFormVisible: false,
      editForm: {},
      editRules: {
        cat_name: [
          {required: true, message: '分类名必填', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      // 获取树状表格依赖的数据
      const {data: {data, meta}} = await this.$http.get('categories', {
        params: this.reqParams
      })
      if (meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.categories = data.result
      this.total = data.total
    },
    // 分页功能
    changePager (newPage) {
    // 改变页码
      this.reqParams.pagenum = newPage
      // 获取数据
      this.getData()
    },
    async showAdd () {
      // 显示添加对话框 -->获取数据 渲染级联
      const {data: {data, meta}} = await this.$http.get('categories', {
        params: {type: 2}
      })
      if (meta.status !== 200) return this.$message.error('获取分类数据失败')
      // 设置下拉选择数据
      this.categoryList = data
      // console.log(data)
      // 重置级联之前选择的值
      this.categoryValues = []
      this.addDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    addSubmit () {
      // 提交校验
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 准备需要提交的数据
          const len = this.categoryValues.length
          if (len) {
            this.addForm.cat_pid = this.categoryValues[len - 1]
          } else {
            this.addForm.cat_pid = 0
          }
          this.addForm.cat_level = len
          const {data: {meta}} = await this.$http.post('categories', this.addForm)
          if (meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')
          this.getData()
          this.addDialogFormVisible = false
        }
      })
    },
    showEdit (id) {
      // 编辑功能 重置表单 -->填充数据
      this.editDialogFormVisible = true
      this.$nextTick(async () => {
        this.$refs.editForm.resetFields()
        const {data: {data, meta}} = await this.$http.get(`categories/${id}`)
        if (meta.status !== 200) return this.$message.error('获取分类失败')
        this.editForm = data
      })
    },
    editSubmit () {
      // 验证表单 -->提交请求 --> 更新数据-->关闭对话框
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const {data: {data, meta}} = await this.$http.put(`categories/${this.editForm.cat_id}`, {
            cat_name: this.editForm.cat_name
          })
          console.log(data)
          if (meta.status !== 200) return this.$message.error('编辑分类失败')
          this.$message.success('编辑分类成功')
          this.getData()
          this.editDialogFormVisible = false
        }
      })
    },
    del (id) {
      this.$confirm('是否删除该分类??', '温馨提示= =!', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: { meta } } = await this.$http.delete(`categories/${id}`)
        if (meta.status !== 200) return this.$message.error('删除分类失败')
        this.$message.success('删除分类成功')
        this.getData()
      }).catch(() => { })
    }
  }
}