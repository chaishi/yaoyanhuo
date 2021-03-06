import Vue from 'vue'
import App from './App.vue'

(async function () {

  const { default: router } = await import(/* webpackChunkName: "router" */ './router')

  Vue.config.productionTip = false

  new Vue({
    el: '#app',
    router,
    render: h => h(App),
    mounted () {
      // You'll need this for renderAfterDocumentEvent.
      document.dispatchEvent(new Event('render-event'))
    }
  })

})()
