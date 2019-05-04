export default {
  name: 'GoodsAdd',
  data () {
    return {
      // 当前步骤的索引
      active: 0,
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      rules: {
        goods_name: [
          {required: true, message: '商品名必填', trigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message: '商品分类必须为三级分类', trigger: 'change'}
        ],
        goods_price: [
          {required: true, message: '商品价格必填', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '商品数量必填', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '商品重量必填', trigger: 'blur'}
        ]
      },
      // 级联相关数据
      categoryList: [],
      categoryValues: [],
      // 参数列表数据
      manyAttrs: [],
      onlyAttrs: [],
      // 上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      action: this.$http.defaults.baseURL + '/upload',
      headers: {
        Aythorization: sessionStorage.getItem('token')
      }
    }
  },
  watch: {
    categoryValues (now, old) {
      // 当categoryValues改变时并且长度等于3时 form.goods_cat已','分隔赋值
      if (now.length === 3) {
        this.form.goods_cat = now.join(',')
      } else {
        this.form.goods_cat = ''
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 上传成功后需要给 form.pics 数组追加图片
    handleSuccess (res) {
      this.form.pics.push({pic: res.data.tmp_path})
    },
    handleRemove (file, fileList) {
      // 删除图片后台触发的事件
      const tmpPath = file.response.data.tmp_path
      const index = this.form.pics.findIndex(item => item.pic === tmpPath)
      this.form.pics.splice(index, 1)
    },
    handlePictureCardPreview (file) {
      // 预览图片
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange () {},
    // 获取三级分类数据 并赋值给级联组件
    async getData () {
      const {data: {data, meta}} = await this.$http.get('categories')
      if (meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.categoryList = data
    },
    changeTabBefore (activeName, oldActiveName) {
      // console.log(activeName, oldActiveName)
      // 对整个表单进行校验 失败阻止切换
      if (oldActiveName === '0') {
        // 如果离开的是第一个选项 去校验
        return new Promise((resolve, reject) => {
          this.$refs.form.validate(valid => {
            if (valid) {
              // 校验成功 随着tab的索引切换步骤条
              this.active = +activeName
              // 获取第二个和第三个选项卡的数据
              this.getParams('many')
              this.getParams('only')
              resolve()
            } else {
              // z阻止切换
              reject(new Error('校验表单失败'))
            }
          })
        })
      } else {
        // 不是第一个选项 随着tab的索引去切换步骤条
        this.active = +activeName
      }
    },
    async getParams (type) {
      const id = this.categoryValues[2]
      const {data: {data, meta}} = await this.$http.get(`categories/${id}/attributes`, {
        params: {sel: type}
      })
      if (meta.status !== 200) return this.$message.error('获取参数数据失败')
      this[type + 'Attrs'] = data
    },
    async addSubmit () {
      // 1. 合并动态参数manyAttrs和静态参数onlyAttrs
      this.form.attrs = [...this.manyAttrs, ...this.onlyAttrs]
      // 2. 发请求
      const {data: {meta}} = await this.$http.post('goods', this.form)
      if (meta.status !== 201) return this.$message.error('商品录入失败')
      this.$message.success('商品录入成功')
      // 3. 去列表页
      this.$router.push('/goods')
    }
  }
}