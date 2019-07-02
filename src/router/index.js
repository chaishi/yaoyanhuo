import Vue from 'vue'
import VueRouter from 'vue-router'
import BlogList from '../pages/list.vue'
import Blog from '../pages/blog/index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: BlogList },
  { path: '/blog/:name', component: Blog, props: true }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
