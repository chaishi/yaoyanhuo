const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/theme/color/_tao_orange_color.scss";
          @import "@/assets/css/var.scss";
          @import "@/assets/css/base.scss";
          @import "@/assets/css/reset_markdown.scss";
        `
      }
    }
  },

  // devServer: {
  //   disableHostCheck: true,
  //   proxy: {
  //     '/api': {
  //       target: '',
  //       changeOrigin: true,
  //       secure: false
  //     }
  //   }
  // },

  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      let preRender =  new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, 'dist'),
        routes: [
          '/',
          '/blog/site_isolate_process',
          '/blog/axios_cross_origin',
          '/blog/element_in_vision',
          '/blog/corb',
          '/blog/vue_jsx_on_syntax_conflict',
          '/blog/pm2',
          '/blog/interrupt',
          '/blog/processor_status',
          '/blog/unix_linux',
          '/blog/http20180306',
          '/blog/nvm20190201',
          '/blog/nginx_error'
        ],
        renderer: new Renderer({
          inject: {
            TITLE: '妖艳货'
          },
          headless: true,
          renderAfterDocumentEvent: 'render-event'
        })
      })
      return {
        plugins: [preRender]
      }
    }
  },

  chainWebpack: config => {
    config
      .module
        .rule('eslint')
          .use('eslint-loader')
          .options({
            fix: true
          })

    config.module
        .rule('md')
          .test(/\.md$/)
          .use('vue')
            .loader('vue-loader')
            .end()
          .use('markdown-loader')
            .loader('./markdonw.loader.js')
            .end()
  }
}