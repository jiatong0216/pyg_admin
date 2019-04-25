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
    }
  }
}