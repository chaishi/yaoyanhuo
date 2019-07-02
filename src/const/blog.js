/* this file is built from the files in the dir of components/blog/ */

const blogList = [
  {
    "title": "Nginx Error List",
    "date": "posted by yaoyanhuo on 2019-06-26",
    "url": "/blog/nginx_error",
    "content": "本文将记录 nginx 使用过程中遇到的各类问题"
  },
  {
    "title": "如何使用 Axios 实现跨域 ？",
    "date": "posted by yaoyanhuo on 2019-04-02",
    "url": "/blog/axios_cross_origin",
    "content": "不同的框架，不同的语言，跨域方法不一样，但其本质终是实现 CORS 跨站资源共享，设置 `Access-Control-Allow-Origin`"
  },
  {
    "title": "站点隔离技术中的进程实现（Site Isolation）",
    "date": "posted by yaoyanhuo on 2019-04-02",
    "url": "/blog/site_isolate_process",
    "content": "Site Isolation 是 Chrome 67 之后默认开启的一项技术实现，采用了“一个站点一个进程”的实现模式。没有使用这项技术的浏览器依旧是一个标签页一个进程的方式。本文将以问答实验的形式对进程表现进行详细的探讨，属于实验性内容，图片较多，注意在 WI-FI 环境下浏览，土豪流量随意。"
  },
  {
    "title": "JS 如何判断一个元素是否在可视区域",
    "date": "posted by yaoyanhuo on 2019-03-27",
    "url": "/blog/element_in_vision",
    "content": "最近做的项目，需要上报广告的曝光和点击数据，理解下来本质是检测某个元素是否在可视区域内。由于一个元素有很多位置信息，相对于页面，相对于窗口，相对于父元素，client /offset /top /bottom /right /left /scroll /pageXOffset/... 基本上已经把自己搞晕了。每次使用的时候都要进行一波查询，费时，特此记录。"
  },
  {
    "title": "Cross-Origin Read Blocking (CORB)",
    "date": "posted by yaoyanhuo on 2019-03-23,  last updated on 2019-04-18",
    "url": "/blog/corb",
    "content": "从 v67 开始，Chrome 会默认启用一个新的功能叫 Site Isolation。CORB 是其中一项很重要的功能 ，属于一种新的网络平台安全策略，能够降低旁道攻击（ side-channel attacks）的风险。设计之初是为了防止浏览器把跨域网站信息发送到当前网站，这些信息可能是跨域网站的敏感信息，却又不是当前网站需要的。比如：使用 img 标签请求了 json/html/xml 等数据，这时，该请求的响应结果会变成空，且请求头和响应头会被隐藏。"
  },
  {
    "title": "Vue 项目中使用 JSX 出现的语法冲突，导致 props 传入失效",
    "date": "posted by yaoyanhuo on 2019-03-22",
    "url": "/blog/vue_jsx_on_syntax_conflict",
    "content": "有这样一个场景，switch 组件需要两个 props 参数：onText 和 offText，用于表述开关状态。在 JSX 使用 switch 组件时，在控制台发现 offText 传入 props 很正常，但 onText 却怎么也没有数据，无论传值是什么。这是为何呢？一起来看看吧。"
  },
  {
    "title": "PM2 高级的进程管理工具（Node）",
    "date": "posted by yaoyanhuo on 2019-03-04, last updated on 2019-03-06",
    "url": "/blog/pm2",
    "content": "管理 Node 服务的一把手，支持代码变化监听，进程集群，负载平衡，日志管理，统一管理进程服务等功能。本文除开 pm2 基本描述，主要会对常用命令进行详细分析，看看各个命令到底是如何工作。还有 pm2 使用过程中经常遇到的问题进行剖析，比如：CPU 只有一个，只能启动的进程集群只能是 1 个，那还能实现 0 秒重载吗？答案是：能。赶紧来领略一下pm2的强大吧。"
  },
  {
    "title": "中断和异常（操作系统）",
    "date": "posted by yaoyanhuo on 2019-02-20",
    "url": "/blog/interrupt",
    "content": "中断（interrupt）指在程序执行过程中遇到急需处理的事件时，暂时中止现行程序在 CPU 上的运行，转而执行响应的事件处理程序，待处理完成后再返回断点或调度其他程序。本文主要对中断和异常的区别、中断优先级、中断处理程序和中断服务例程关系和常见几类中断进行描述。并以 Linux 系统作为中断例子，进一步了解中断机制和中断处理过程。"
  },
  {
    "title": "处理器状态（操作系统）",
    "date": "posted by yaoyanhuo on 2019-02-12",
    "url": "/blog/processor_status",
    "content": "处理器状态至少有两种：内核态（管态）和用户态（目态）。有些操作系统会设置三种或三种以上的状态。内核状态可以执行所有指令，用户态只能执行非特权指令。程序状态字会记录程序运行的各种状态，以便保存和恢复程序现场。"
  },
  {
    "title": "Node Verion Manager (NVM)",
    "date": "posted by yaoyanhuo on 2019-02-02, laste updated on 2019-04-17",
    "url": "/blog/nvm20190201",
    "content": "Different projects have different environment, and we need to use different node version sometimes. but how ? NVM is just for that."
  },
  {
    "title": "HTTP 概述",
    "date": "posted by yaoyanhuo on 2018-03-06",
    "url": "/blog/http20180306",
    "content": "学无止尽，HTTP 相关知识有很多，本文将从资源、事物、报文和连接几个方面进行概述。可以在短时间内对 HTTP 有一个初步的认识"
  }
] 

export default blogList
