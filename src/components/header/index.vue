<template>
  <div class="head">
    <div class="head-inner g_page-container">
      <router-link :to="{path: '/'}">
        <img src="/img/head.jpg">
      </router-link>
      <div class="info">
        <h1 class="name">Yaoyanhuo 妖艳货</h1>
        <span>Be a simple programmer. </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss">
.head {
  margin-top: 30px;
  .head-inner {
    text-align: left;
    img {
      height: 60px;
      margin-right: 15px;
    }
    .info {
      display: inline-block;
      vertical-align: top;
      height: 60px;
      border-bottom: 1px solid $colorGrey-3;
      padding-right: 40px;
    }
    h1.name {
      font-size: 1.3em;
      color: $colorGrey-8;
      padding-bottom: 8px;
    }
  }
}
</style>

