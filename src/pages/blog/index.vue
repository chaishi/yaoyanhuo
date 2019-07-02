<template>
  <div>
    <div class="blog-detail g_page-container">
      <div class="markdown-body">
        <keep-alive>
          <component :is="currentTabComponent"/>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import NginxError from '@/components/blogs/nginx_error.md'
import SiteIsolateProcess from '@/components/blogs/site_isolate_process.md'
import AxiosCrossOrigin from '@/components/blogs/axios_cross_origin.md'
import ElementInVision from '@/components/blogs/element_in_vision.md'
import corb from '@/components/blogs/corb.md'
import vueJsxOnSyntaxConflict from '@/components/blogs/vue_jsx_on_syntax_conflict.md'
import Pm2 from '@/components/blogs/pm2.md'
import Interrupt from '@/components/blogs/interrupt.md'
import Processor_status from '@/components/blogs/processor_status.md'
import Unix_linux from '@/components/blogs/unix_linux.md'
import Nvm from '@/components/blogs/nvm20190201.md'
import Http from '@/components/blogs/http20180306.md'

export default {
  name: 'Blog',

  props: {
    name: String
  },

  components: { NginxError, SiteIsolateProcess, AxiosCrossOrigin, ElementInVision, corb, vueJsxOnSyntaxConflict, Pm2, Interrupt, Processor_status, Unix_linux, Nvm, Http },

  data () {
    return {
      map: {
        nginx_error: NginxError,
        site_isolate_process: SiteIsolateProcess,
        axios_cross_origin: AxiosCrossOrigin,
        element_in_vision: ElementInVision,
        corb: corb,
        vue_jsx_on_syntax_conflict: vueJsxOnSyntaxConflict,
        pm2: Pm2,
        interrupt: Interrupt,
        processor_status: Processor_status,
        unix_linux: Unix_linux,
        http20180306: Http,
        nvm20190201: Nvm
      }
    }
  },

  computed: {
    currentTabComponent () {
      return this.map[this.$route.params.name]
    }
  },

  watch: {},

  created () {},

  mounted () {
  },

  methods: {}
}
</script>

<style lang="scss">
@import '@/assets/css/markdown.scss';
@import '@/assets/css/prismjs.scss';
@import '@/assets/css/reset_markdown.scss';
.markdown-body h1 {
  border-bottom: none;
  font-size: 1.55em;
}

.markdown-body h2 {
  border-bottom: none;
  font-size: 1.35em;
  margin-top: 30px;
}

.markdown-body h3 {
  font-size: 1.15em;
  margin-top: 30px;
}

.markdown-body h4 {
  color: #2c74bd;
}

.markdown-body ul {
  list-style: circle;
}

.markdown-body pre code  {
  line-height: 20px;
}
</style>
