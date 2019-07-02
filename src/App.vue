<template>
  <div id="app">
    <n-header/>
    <router-view></router-view>
    <n-footer/>
  </div>
</template>

<script>
import NFooter from '@/components/footer'
import NHeader from '@/components/header'
export default {
  name: 'app',
  components: {NHeader, NFooter}
}
</script>

<style>
</style>
