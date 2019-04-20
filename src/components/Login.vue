<template>
  <div class="login_container">
    <div class="box">
      <img src="../assets/images/logo.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
    name: 'Login',
};
</script>

<style  scoped>
.login_container {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #ccc, rgba(0, 217, 255, 0.685))
}
.login_container .box {
  width: 400px;
  height: 250px;
  border: 1px solid #fff;
  box-shadow: 0 0 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-60%);
  background: linear-gradient(45deg, rgb(96, 161, 145), #eee)
}
.login_container .box img {
  margin: 0;
  padding: 0;
}
</style>