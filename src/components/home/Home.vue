<template>
  <el-container class="home_container">
    <el-header class="home_header">
      <el-button icon="iconfont icon-caidan" size="mini" @click="toggleMenu()" circle></el-button>
      <span class="title">是时候表演真正的技术了!</span>
      <el-button class="logout" type="danger" size="mini" round @click="logOut()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside class="home_aside" :width="collapse ? '65px' : '180px'">
        <el-menu
          :default-active="'/'+$route.name"
          router
          :unique-opened= "true"
          :collapse="collapse"        
          :collapse-transition="false"
          style="border: none; margin-top: 5px"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b" >
          <el-submenu :index="item.id.toString()"  v-for="(item, i) in menus" :key="item.id">
            <template slot="title">
              <i :class="['iconfont', icons[i]]"></i>
              <span>&nbsp;&nbsp;&nbsp;{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+itemChildren.path" v-for="itemChildren in item.children" :key = "itemChildren.id">
              <i class="el-icon-menu"></i>
              <span>{{itemChildren.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home_main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      collapse: false,
      menus: [],  
      icons: ['icon-yonghuguanli','icon-permission','icon-shangpinguanli','icon-dingdanguanli','icon-dabianshujutongji'] 
    }
  },
  methods: {
    toggleMenu () {
      this.collapse = !this.collapse
    },
    // 获取数据
    async getData() {
     /*  this.$http.get('menus').then(res => {
        // console.log(res.data)
        this.list = res.data.data
      }).catch(err => alert('获取信息失败')) */
      const {data: {data, meta}} = await this.$http.get('menus')
      // 判断获取是否成功,  添加操作 201 ,其他操作200
      if( meta.status !== 200) return this.$message.error('获取菜单失败')
      // 成功时 修改data中的数据
      this.menus = data
    },
    logOut() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
  mounted() {
    // 获取菜单数据
    this.getData()
  }
};
</script>

<style scoped>
.home_container {
  height: 100%;
}
.home_header {
  background: #373d41;
  line-height: 60px;
}
.home_aside {
  background: #333744;
}
.home_main {
  background: #eaedf1;
  font-size: 20px;
}

.title {
  padding-left: 20px;
  color: #fff;
  font-size: 18px;
}
.logout {
  float: right;
  margin-top: 15px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}
</style>