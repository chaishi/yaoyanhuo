# 站点隔离技术中的进程实现（Site Isolation）

*posted by yaoyanhuo on 2019-04-02*

> Site Isolation 是 Chrome 67 之后默认开启的一项技术实现，采用了“一个站点一个进程”的实现模式。没有使用这项技术的浏览器依旧是一个标签页一个进程的方式。本文将以问答实验的形式对进程表现进行详细的探讨，属于实验性内容，图片较多，注意在 WI-FI 环境下浏览，土豪流量随意。

## 总述

实现了 Site Isolation 的浏览器根据站点分配进程，一个站点一个进程；而普通浏览器是根据标签页进行分配，多一个标签多一个进程，无论是否是同一站点同一URL。

## 探索目录
#### 1. 两个 URL 一模一样的标签页运行在两个不同的进程中吗？
  普通浏览器会产生两个进程，支持 Site Isolation 的浏览器只会产生一个。

#### 2. 支持 Site Isolation 的浏览器中，不同的域名、子域名、端口号会对进程有什么影响？
  只要一级域名相同就共享同一个进程，一级域名不同，则不共享进程。

#### 3. 源站点页面中嵌入跨域站点的 iframe 会产生新的进程吗？
  普通浏览器跨域站点和源站共享内存; 支持 Site Isolation 的浏览器会产生新的进程。
  
#### 4. 源站点页面中嵌入 一级域名相同 而子域名和端口号不同 站点的 iframe 时，会产生新的进程吗？
  不会。


## 环境准备

host 配置
```
127.0.0.1 a.dd.com
127.0.0.1 c.dd.com
127.0.0.1 test.pp.com
127.0.0.1 bcc.qq.com
127.0.0.1 sheepluo.cap.qq.com
```

浏览器：Chrome 73、Firefox 66、IE11

服务端代码片段示例，
```js
const express = require('express')
const app = express()
const port = process.argv[2] || 3002

app.get('/', function (req, res) {
  res.json({greeting: 'hello chrome!'})
})

app.listen(port, () => console.log(`app is listening at localhost:${port}`))
```


## 1 两个 URL 一模一样的标签页运行在两个不同的进程中吗？

**测试案例**：在各个浏览器打开两个一模一样的标签页，`localhost:8000/blog/corb`

**测试结果**：Firefox 和 IE 这类普通浏览器会生成两个进程（因为开了两个标签页）；应用了 `Site Isolation` 的 Chrome 高版本浏览器（Chrome 67 以后）只会生成一个进程。如下图所示，

**【Tooltip】`shift + ~ + ESC` 会自动打开 Chrome 的任务管理器；IE 没有自身的任务管理器，只能查看系统的任务管理器观察。**

![chrome 相同标签页的进程表现](http://img.yaoyanhuo.com/blog/chrome_process_detail.png)

![Firefox 相同标签页的进程表现](http://img.yaoyanhuo.com/blog/firefox_process.png)

![IE 相同标签页的进程表现](http://img.yaoyanhuo.com/blog/IE_process.png)


## 2 支持 Site Isolation 的浏览器中，不同的子域名、端口号会对进程有什么影响？

**测试案例**：在浏览器中访问 `a.dd.com:3001` `a.dd.com:3002` `c.dd.com:3002` 和 `sheepluo.cap.qq.com:3002`

**测试结果**：如下图所示，一级域名相同、子域名和端口号不同的的三个标签页共享一个进程；域名完全不同的 `sheepluo.cap.qq.com:3002` 独占一个进程。

对于普通浏览器，进程开启的一般标准是有几个标签页，由此，当前测试结果毫无疑问，开启了 4 个进程。

![不同域名端口的进程情况](http://img.yaoyanhuo.com/blog/different_domain_port_process.png)


## 3 源站点页面中嵌入跨域站点的 iframe 会产生新的进程吗？

**案例**：在 `test.pp.com:3002` 中嵌入 `v.qq.com`
**结果**：Crome 73 产生了新进程，分配了新内存；Firefox 没有产生新进程，跨域站点和源站点共享进程。

代码片段如下，
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>跨域测试</title>
</head>
<body>
  <h1>Home Page</h1>
  <p>This is a test project!</p>

  <div style="position: absolute;width:100%;height:100%;top:0;">
    <iframe src="https://v.qq.com" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</body>
</html>
```

![chrome 嵌入跨站 iframe](http://img.yaoyanhuo.com/blog/process_01.png)

![Firefox 相同标签页的进程表现](http://img.yaoyanhuo.com/blog/firefox_iframe_process.png)

## 4 源站点页面中嵌入 一级域名相同 而子域名和端口号不同 站点的 iframe 时，会产生新的进程吗？

**测试案例**：`http://a.dd.com:3002/` 中嵌入 `http://c.dd.com:3001/`

**测试结果**：所有浏览器都不会产生新的进程，甚至子进程，直接使用原进程。

代码片段如下，
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>跨域测试</title>
</head>
<body>
  <h1>Home Page</h1>
  <p>This is a test project!</p>

  <div style="position: absolute;width:100%;height:100%;top:0;">
    <iframe src="https://c.dd.com:3001" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</body>
</html>
```

![chrome 嵌入同域名 iframe](http://img.yaoyanhuo.com/blog/chrome_iframe_same_domain.png)
![firefox 嵌入同域名 iframe](http://img.yaoyanhuo.com/blog/fire_fox_iframe_same_domain.png)
