<template>
  <el-container class="home_container">
    <el-header class="home_header">
      <el-button icon="iconfont icon-caidan" size="mini" @click="toggleMenu()" circle></el-button>
      <span class="title">是时候表演真正的技术了!</span>
      <el-button class="logout" type="danger" size="mini" round>退出</el-button>
    </el-header>
    <el-container>
      <el-aside class="home_aside" :width="collapse ? '65px' : '180px'">
        <el-menu
          :collapse="collapse"        
          :collapse-transition="false"
          style="border: none; margin-top: 5px"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b" >
          <el-submenu index="1"  v-for="item in list" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item index="1-1" v-for="itemChildren in item.children" :key = "itemChildren.id">{{itemChildren.authName}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home_main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      collapse: false,
      list: [
        {authName: '',
         id: '',
         children: [
           {authName: '',
            id: ''
          }]
        },
      ],
    }
  },
  methods: {
    toggleMenu () {
      this.collapse = !this.collapse
    },
    // 获取数据
    getData() {
      this.$http.get('menus').then(res => {
        // console.log(res.data)
        this.list = res.data.data
      }).catch(err => alert('获取信息失败'))
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
</style>