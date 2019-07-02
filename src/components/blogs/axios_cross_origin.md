# 如何使用 Axios 实现跨域 ？
*posted by yaoyanhuo on 2019-04-02*

> 不同的框架，不同的语言，跨域方法不一样，但其本质终是实现 CORS 跨站资源共享，设置 `Access-Control-Allow-Origin`

前端代码，
```js
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
  axios({
    url: 'http://c.dd.com:3002/data',
    method: 'get',
    withCredentials: true
  }).then((res) =>  {
    console.log(res)
  })
</script>
```

服务端代码，
```js
const express = require('express')
const app = express()
const port = process.argv[2] || 3002

app.get('/data', function (req, res) {
  res.set({
    'Access-Control-Allow-Origin': 'http://test.pp.com:3002',
    'Access-Control-Allow-Credentials': true
  })
  res.json({greeting: 'hello server1...'})
})

app.listen(port, () => console.log(`app is listening at localhost:${port}`))
```

Chrome 浏览器会隐藏请求头，出现 `Provisional headers are shown`，其它浏览器不会出现。下图为 Chrome 浏览器请求头呈现，响应头和相应内容正常。

![Chrome 跨域实现结果](http://img.yaoyanhuo.com/blog/cross.png)
