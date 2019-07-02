<template>
  <div class="page-home">
    <div class="g_page-container home">
      <div class="blog-list">
        <div v-for="(item, index) in blogList" :key="index" class="blog">
          <h2 class="title"><a :href="item.url">{{ item.title }}</a></h2>
          <div class="subinfo">
            <span class="post-date">{{ item.date }}</span>
            <!-- <span class="pv">阅读：{{ item.content }}</span> -->
          </div>
          <div class="content">{{ item.content }}...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import blogList from '@/const/blog.js'

export default {
  name: 'BlogHome',

  layout: 'home',

  data () {
    return {
      blogList,
      tabModel: 'code',
      categories: [
        {text: '代码', value: 'code'},
        {text: '摄影', value: 'photograph'},
        {text: '英语', value: 'english'},
        {text: '电影', value: 'movie'},
        {text: '音乐', value: 'music'},
        {text: '历史', value: 'history'},
        {text: '花艺', value: 'flower_arrangement'},
        {text: '阅读', value: 'reading'}
      ]
    }
  },

  computed: {},

  watch: {},

  created () {},

  mounted () {},

  methods: {}
}
</script>

<style lang="scss">
.page-home {
  text-align: left;
  .home {
    margin-top: 30px;
  }
  nav {
    width: 100%;
    margin-bottom: 40px;
    > .h-tab {
      line-height: 30px;
      height: 40px;
      padding-left: 100px;
      margin-top: 10px;
      > .h-tab-item {
        display: inline-block;
        vertical-align: top;
        position: relative;
        margin-right: 15px;
      }
      > .h-tab-item:hover {
        padding-top: 10px;
        transition: .2s all;
        cursor: pointer;
        .line {
          top: 0px;
          transition: .2s top;
          display: inline;
        }
      }

      > .h-tab-item.actived {
        padding-top: 10px;
        .line {
          display: inline;
          top: 0;
        }
      }
      > .h-tab-item {
        .line {
          height: 15px;
          border-right: 2px solid $multiColor-3;
          position: absolute;
          top: -10px;
          left: 50%;
          display: none;
        }
        .line::after {
          content: "";
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: $multiColor-3;
          position: absolute;
          bottom: 0;
          left: -2px;
        }
      }
    }
  }

  .blog-list {
    max-width: 1000px;
    .blog {
      color: $colorGrey-8;
      margin-bottom: 20px;
      .title > a {
        font-size: 1.1em;
        color: $colorGrey-9;
        text-decoration: none;
      }
      .title > a:visited {
        color: $colorGrey-9;
      }
      .title > a:hover {
        text-decoration: underline;
        color: $colorPrimary-7;
      }
      .subinfo {
        margin: 8px 0;
        color: $colorGrey-7;
        font-size: 0.8em;
        font-style: italic;
      }
      .content {
        color: $colorGrey-8;
        line-height: 1.5;
      }
    }
  }
}

@media screen and (max-width: 900px) {
  .page-home nav > .h-tab {
    padding-left: 20px;
  }
  .page-home nav > .h-tab > .h-tab-item {
    margin-right: 13px;
  }
}

@media screen and (max-width: 420px) {
  .page-home .head .head-inner h1.name {
    font-size: 1.1em;
  }
}

</style>
