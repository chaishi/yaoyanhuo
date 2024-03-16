- 日志
- 监控
- 调试
- 框架
- 效率
- 收入
- Linux（常用命令行、解决常见的问题）
- 引擎（Chrome V8/quickJS)
  各类引擎分析和对比：https://juejin.cn/post/6988458924630835231
  Skyline 小程序渲染引擎：https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html

使用 -> 理解 -> 深入

YouTube 2023年一个季度广告收入就 76.65 亿美元
https://36kr.com/p/2366101695784066
疫情推动了数字化发展，电子商务与视频内容结合，不少视频平台向电商领域扩张，寻求新的经济增长点。YouTube正是抓住了这一机遇强势成长？

- 技术分享
 - [图形学在 web 前端的应用](https://doc.weixin.qq.com/doc/w3_AGsAagbGABsYPjjkK91SNehEw3r0E?scode=AJEAIQdfAAoHHEgy8XAGsAagbGABs)
 - [iframe 功能特性及其安全问题](
 https://doc.weixin.qq.com/doc/w3_ATUAQgY1ABQK2gmc3DETkSyazeGEp?scode=AJEAIQdfAAoLAV7BaYATUAQgY1ABQ)
 - [HTTP2 & HTTPS](https://doc.weixin.qq.com/doc/w3_AVsAzwbJAKIKsmR4ztKReq6g7UOzs?scode=AJEAIQdfAAofoEY9H0AAgAiAbDAK4)
 - [React16 ~ React18 发展变更](https://doc.weixin.qq.com/doc/w3_AVsAzwbJAKIKsmR4ztKReq6g7UOzs?scode=AJEAIQdfAAofoEY9H0AAgAiAbDAK4)

起初不一定会用，但一定得知道这个东西可以用来做什么，以便在需要的时候可以立即想起。

- JavaScript 引擎（无论中间多少层转换，最终结果都是机器代码）
  - Duktape https://github.com/svaarala/duktape
  - V8 https://v8.dev/
    - 项目语言：C++
    - 解析语言1：JavaScript
    - 解析语言2：WebAssembly https://webassembly.org/ （跨平台技术）
      - 是也不完全是网络应用程序的汇编语言，是一种字节码，二进制格式，解码速度更快（JS 需要先解析成 AST，再转二进制）
      - WebAssembly 代码是静态类型的，所以 Javascript 引擎不需要在编译时猜测变量的类型（重要）
      - 主要用于解决跨平台、性能速度、密集型计算、人脸识别、机器学习、3D 游戏、视频解码、语言编译器/虚拟机、开发者工具（调试器、编译器、编辑器、加密工具、VPN）等问题
      - 可以作为一个编译目标，其他任何语言编译成 WASM（Rust 编译成 WebAssembly、 AssemblyScript 编译 WebAssembly、通过 llvm 直接把 wasm 翻译成二进制）
      - AssemblyScript: https://www.assemblyscript.org/
      - Emscripten 能够将一段 C/C++ 代码编译出一个.wasm 模块、用来加载和运行该模块的 JavaScript”胶水“代码、一个用来展示代码运行结果的 HTML 文档
  - LiteEngine（quickJS (Why This One？)）
    - 项目语言：？
    - 目标语言：？
    - https://tc39.es/ecma262/2023/
    - https://github.com/tc39/test262
  - LiteApp
    - 项目语言：？
    - 业务语言：Vue/React
    - 目标语言：Flutter
  - Hippy
    - 项目语言：？
    - 目标语言1：Android 可识别二进制代码 ?
    - 目标语言2：iOS 可识别二进制代码 ?

- 框架
  - Vue3
  - React
  - Next.JS https://nextjs.org/docs

- 测试
  - jest
  - web-check https://mp.weixin.qq.com/s/opdf8Cs_JjLOb4vgcfSoIA

- 包管理工具（Features）
  - npm
    - workspace command
      - npm install xxx -w pkgA
  - pnpm
  - yarn
    - ^1.22.19 (latest is 1.22.22, most download is 1.22.21)
    - https://yarnpkg.com/
  - bun
    - https://bun.sh/
  - 对比
    - https://muratkaragozgil.medium.com/a-comparison-of-yarn-npm-and-pnpm-7d6310f97bd7
    - https://pnpm.io/feature-comparison
    - yarn official benchmark https://yarnpkg.com/features/performances

- 大仓（monorepo）
  - npm
    - npm install xxx -w pkg
    - npm uninstall xxx -w pkg
    - npm run xxx -w pkg
  - pnpm
    -
  - lerna (Nx)
    - ^5.1.0（latest is 8.1.2）
  - yarn
    - workspace command
      - yarn workspace pkgA add xxx
      - yarn workspace pkgA remove xxx
      - yarn workspace pkgA test
      - yarn workspace pkgA build
      - yarn workspace pkgA publish
      - yarn workspaces run test
  - 实践
    - [大仓实践录：Lerna/NPM/Yarn Workspace 方案组合和性能对比](https://cloud.tencent.com/developer/article/1913720)

- 编辑器
  - 添加 code 命令到环境变量： https://juejin.cn/post/7254341178257686588

- 构建工具
  - Vite
  - Rspack
  - turbo
    - https://turbo.build/repo/docs
  - webpack
    - Docs
      - webpack v4 -> v5: https://webpack.docschina.org/migrate/5/
    - ecosystem
      - webpack-chain: https://github.com/neutrinojs/webpack-chain?tab=readme-ov-file
      - webpack-bundle-analyzer: https://github.com/webpack-contrib/webpack-bundle-analyzer
      - circular-dependency-plugin
      - webpack-manifest-plugin
      - webpack-dev-server
      - webpack-deadcode-plugin
      - chunks-webpack-plugin
      - node-polyfill-webpack-plugin
      - terser-webpack-plugin
      - clean-webpack-plugin

- 移动端开发必备知识-Hybrid App
https://juejin.cn/post/7062967241268019214
手机系统类型判断: Android/Apple/WinPhone/HarmonyOS

Hybrid 开发难点，
  - 例如H5和客户端如何保证在业务数据，UI风格，交互逻辑上保持一致性？
  - 如何决断某个功能客户端做还是前端做?
  - 如果一个功能最初版本是前端做的，现在要替换为客户端版本，如何保证开发，验收，发版流程的通畅？
  - webview 相关的问题谁来解决？

- JSBridge 的原理
https://juejin.cn/post/6844903585268891662
WeiXinJSBridge（JSSDK)

# LiteApp

- LiteApp 最终目标代码是转成 Flutter，除了语法转换，还包含其他哪些实质性的功能？


# Flutter

四，热更新技术方案分析
https://developer.jdcloud.com/article/2949
