<template>
  <div class="login_container">
    <div class="box">
      <img src="../assets/images/logo.png" alt>
      <el-form :model="form">
        <el-form-item>
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>

        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  }
};
</script>

<style  scoped>
.login_container {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #ccc, rgba(0, 217, 255, 0.685));
}
.login_container .box {
  width: 400px;
  height: 250px;
  border: 1px solid #fff;
  box-shadow: 0 0 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  background: linear-gradient(45deg, rgb(96, 161, 145), #eee);
  padding: 0 15px;
  box-sizing: border-box;
}
.login_container .box img {
  width: 200px;
  display: block;
  margin: 15px auto;
}
</style>