# PM2 高级的进程管理工具（Node）

*posted by yaoyanhuo on 2019-03-04, last updated on 2019-03-06*

> 管理 Node 服务的一把手，支持代码变化监听，进程集群，负载平衡，日志管理，统一管理进程服务等功能。本文除开 pm2 基本描述，主要会对常用命令进行详细分析，看看各个命令到底是如何工作。还有 pm2 使用过程中经常遇到的问题进行剖析，比如：CPU 只有一个，只能启动的进程集群只能是 1 个，那还能实现 0 秒重载吗？答案是：能。赶紧来领略一下pm2的强大吧。

## PM2 功能

- `pm2` 启动 Node 服务后，可以监听文件变更，并迅速重启
- `pm2` 支持负载平衡，可以根据 CPU 核数启动多个进程，成为一个进程集群
- 启动的集群服务，可实现 0 秒重载，因其重载时集群中至少有一个进程在运行
- `pm2` 有日志管理，可随时查看进程输出结果
- 执行 `node server` 这类命令后，一般会一直运行在控制台，`pm2` 则是在后台运行，当前控制台可继续执行其它命令
- 除了 `cli`模式，还有 `pm2` 生态系统文件 `ecosystem.config.js`，文件可同时配置多个应用服务，具体配置参见 附录3


## PM2 安装

```
npm install pm2 -g
```
如果安装失败，使用 `npm config list` 查看 npm 代理和仓库地址，有些公司内部出于安全考虑可能需要设置一些代理才能访问外网，检查代理是否正确；再看仓库，由于 npm 本身的仓库比较慢，建议使用国内镜像：https://npm.taobao.org/ ，或自己公司搭建的仓库。以淘宝镜像为例，设置仓库地址 `npm config set registry http://registry.npm.taobao.org/` 和 使用 `cnpm` 本质都是从 http://registry.npm.taobao.org 拉包。

## PM2 名词解释
| 名称 | 描述 |
| --- | --- |
| App name | node 进程服务名称，pm2 启动服务会有一个名称，有默认值，可自定义，在服务启动后的一系列操作都通过该名称进行 |
| id | pm2 进程 id，唯一标识 pm2 进程，即使同一集群，名称相同，id 也不会相同，在进程被 delete 之前，无论 `pm2 start` 或 `pm2 stop`，id 都不变 |
| pid | 每次启动 pid 都会发生变化，是进程执行时 id。进程被 stop 后，其值为 0 |
| watch | 是否监听文件变化自动重启，一般建议开发时使用，节约资源 |
| status | 进程运行状态，值为 online/stopped 等 |
| mode | 进程模式，可能值 `cluster`/`fork`。前者表示进程集群，即在不同的 CPU 线程里开启相同的进程；后者表示单个进程 |
| ecosystem.config.js | 生态系统配置文件，pm2 可以直接在`cli`中添加参数，也可以在该文件中进行配置。该文件可一次性配置多个应用，使用 `pm2 start ecosystem.config.js` 统一启动，关系类似于 webpack-dev-server 和 devServer 配置项。配置示例参看 附录3 |
| 进程集群 | 相同代码运行在同一端口的多个进程归为一个集群，使用集群模式 pm2 可以实现 0 秒重载 |

## PM2 常用命令合集

先看看整体命令集合，了解各自大概是干什么的，后文会有各个命令的功能详述。以下内容，`app` 为应用名称。

| 命令示例 | 描述 |
| --- | --- |
| pm2 start app | 启动单个应用，其中 app 是指脚本路径，即 `app/index.js`，应用启动可以通过 `cli` 参数配置很多自定义内容，如 自定义名称，是否监听文件变化，日志如何显示等。如果自定内容较多建议使用 `ecosystem.config.js` 一起配置 |
| pm2 start app --watch | 启动单个应用并监听代码变化 |
| pm2 start server --name server_pre | 启动单个应用并自定义应用名称 |
| pm2 start app --log-date-format="YYYY-MM-DD HH:mm:ss" | 日志参数打印时带上日期，日期格式参看 `moment.js` |
| pm2 restart app --update-env --watch disabled | 重启单个应用，更新参数 |
| pm2 start app -i max | 负载平衡，开启 `max` 个相同的服务，`max` 数量等于 CPU 可执行的线程数，其值可为任意数字， `pm2 start app -i 3`。该命令启动的进程为进程集群，模式 `mode` 值为  `cluster` |
| pm2 show app | 通过名称查看进程详细信息，`pm2 show <id>`同理，包含：名称、版本、重启次数、脚本路径、端口号、日志路径、环境变量、创建时间、git 相关信息 |
| pm2 delete app | 根据名称删除应用进程 |
| pm2 delete all | 删除所有应用进程 |
| pm2 delete 0 | 根据 id 删除应用进程 |
| pm2 list | 查看进程列表 |
| pm2 reload all | 0 秒停机重载所有进程，仅对集群进程有用，本质是重载的时候保证至少一个同名进程在正常运行。 |
| pm2 reload app | 0 秒停机重载某一集群进程，仅对集群进程有用 |
| pm2 stop all | 停止所有进程 |
| pm2 stop app | 根据名称停止某一进程 |
| pm2 stop 3 | 根据 id 停止某一进程 |
| pm2 startup | 检测计算机上可用的 init 系统并生成配置 |
| pm2 monit | 了解每个进程的 CPU 使用情况，内存使用情况，环路延迟或请求/分钟 |
| pm2 logs | 查看所有进程日志，日志路径会在命令执行后输出到控制台 |
| pm2 logs app | 查看具体应用进程 app 的日志， `pm2 logs app --lines 1000` 可以看执行数日志 |
| pm2 flush | 清除进程列表中的所有进程应用日志，无论其状态为 `online` 还是 `stopped`。但不在进程列表中的死进程，其日志不会被清除，如：执行了 `pm2 delete app` 的 app 进程。清除操作仅仅是清空文件，不会删除文件。 |
| pm2 env 0 | 显示当前环境变量信息 |

更多 `cli` 参考： https://pm2.io/doc/zh/runtime/reference/pm2-cli/

## 生态系统文件 ecosystem.config.js
为满足需求，以上命令执行过程中可能会添加多个参数，如果需要的参数较多，直接书写命令就不是很方便，别担心，咱们还有生态系统文件，可以把所需的任何参数都配置在里面，启动的时候，运行这个文件就可以啦。如，使用 `pm2 start ecosystem.config.js` 启动所有服务，使用 `pm2 start ecosystem.config.js --only app` 仅启动名为 `app` 的 服务。

使用配置项和命令行的参数命名规则一般是：`cli` 命令参数为中划线，配置项为下划线。如 `--log-date-format` 对应配置项为 `log_date_format`。

配置示例：

```javascript
module.exports = {
  apps : [{
    // 基本配置
    name: 'app',  // 应用名称，默认是 脚本名称
    cwd: './', // 启动进程所在的当前目录
    script: 'app/index.js', // 执行的 node 脚本地址
    args: '3306', // 参数，放在 process.argv 里面，多个参数空格隔开，或使用数组
    instances: 5, // 启动的进程实例数，如果值 5 ，则会启动一个进程数为 5 的进程集群，等效 `pm2 start app -i 5`
    autorestart: true, // 是否自动启动
    watch: false, // 是否监听代码变化，等效 `pm2 start app --watch`
    max_memory_restart: '1G', // 存储超过 1G 就重启
    interpreter: '/usr/web/path/*.exe', // 解析器，用于解析执行 script 脚本
    pid_file: '~/.pm2/pids/app_name-id.pid', // 存储 pid 的文件路径

    // 日志相关配置
    output: '', // 正常日志输出路径，默认 ~/.pm2/logs/-out.log，如： /data/logs/pm2/app-out.log
    error: '', // 错误日志输出路径，默认 ~/.pm2/logs/-error.err，如：/data/logs/pm2/app-erro.log
    log: '', // [Boolean|String] 默认值 dev/null
    disable_logs: false, // [Boolean] 是否禁用日志
    log_type: 'json', // 日志输出格式
    log_date_format: '', //自定义日志中的日期格式，遵循 moment.js
    merge_logs: false, // 集群模式，是否合并一个集群的进程日志

    min_uptime: 1000, // 服务启动的最小时间，默认 1000
    max_restarts: 16, // 服务重启的最大次数，默认 16 
    exec_mode: 'cluster', // 进程模式，可选值：cluster/fork

    // 环境相关配置
    env: {   // 使用该环境命令 pm2 start ecosystem.config.js --env
      NODE_ENV: 'development' // node 环境变量
    },
    env_production: {  // 使用该环境命令 pm2 start ecosystem.config.js --env production
      NODE_ENV: 'production'  // node 环境变量
    }
  }]
}
```

更多配置项参数参考：https://pm2.io/doc/en/runtime/reference/ecosystem-file/

#### Applications 'bchat' not running

```
[9.56.22.152@root /data/web/websites/.../build]# pm2 start ecosystem.config.js 
[PM2][WARN] Applications bchat not running, starting...
[PM2] App [bchat] launched (1 instances)
┌──────────┬────┬─────────┬─────────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────┬──────────┐
│ App name │ id │ version │ mode    │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user │ watching │
├──────────┼────┼─────────┼─────────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────┼──────────┤
│ bchat │ 0  │ 1.0.0   │ cluster │ 19275 │ online │ 0       │ 0s     │ 0%  │ 16.8 MB   │ root │ disabled │
└──────────┴────┴─────────┴─────────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app

```

## 常见问题
### 进程相关
#### pm2 如何监听代码变化？
```
pm2 start app --watch
```

#### pm2 如何配合 `npm run start` 这类命令使用？
直接使用，
```
pm2 start npm -- start
```

带参数使用，
```
pm2 start --name=app -i max npm -- start
```

#### 如何开启 pm2 进程集群（cluster）模式？
使用 `pm2 start -i max` 相关命令启动的服务，默认模式即为集群模式。其中 max 值为可用 CPU 线程数，`pm2 start -i -1` 表示启动可用 CPU 线程数 - 1 个进程服务。即使 `-i` 值为 1 ，依旧可以启动集群模式 `cluster`，进程重载依旧按照集群模式重载。

#### pm2 集群模式是如何实现 0 秒重载（pm2 reload all）的？
假设当前集群 M 中运行着 4 个进程服务，id 分别为 0, 1, 2, 3。

先解释下集群中的进程重载运行过程，pm2 先会依次创建新的进程服务 0, 1, 2，可能 0 号还没完全启动，1 号已经开始着手创建（`starting`），输出创建信息到日志，待 0 号进程创建完成后，pm2 会 `stop` 旧的 0 号进程（_old_0），最后断掉连接退出 _old_0 号进程，并发出 `SIGINT` 信号，其它进程也会以相同的运行流程紧随其后。进程的这样一个周期，暂时称它为一个进程的**生命轮回**。

![pm2 集群中的进程重载](http://img.yaoyanhuo.com/reload_processor.png)

举个例子，当执行 `pm2 reload M`进程集群重载时，刚好一个请求来到，这时请求会被随机发送到其中一个进程服务中，假设本次是 3 号进程服务收到任务，有两种情况。第一种，3 号进程还未开始轮回；第二种，3 号进程已经开始轮回。对于第一种，简单，直接接收请求并返回，其它进程的轮回同自己无关。对于第二种情况，3 号正在轮回过程中，这时响应请求的艰巨任务就要交给旧的 3 号进程（_old_3）来处理了，待新 3 号生命轮回完成，便开始接手网络请求。

由此可见，即使集群中只有一个进程也能实现 0s 重载。创建新的进程时，使用旧进程接收请求，新进程创建完毕，使用新进程接收。

### 日志相关
#### 哪些方式可以查看进程日志路径？
- `pm2 logs` 可以查看所有进程日志信息及各个进程日志路径， `pm2 logs app` 查看`app`进程日志信息和路径。
- `pm2 show app`可以查看进程所有信息，包括进程日常日志路径、错误日志路径、脚本路径、命令运行路径，甚至 git 相关的信息。
- `pm2 flush` 用于清除进程列表中的所有日志，待日志清除后，会输出日志路径到终端。

#### 如何添加日期（或日期格式）到日志里面？--log-date-format
`cli`命令模式，一定记得日格式用双引号，单引号日期格式不被识别。
 ```
 pm2 start server --log-date-format "YYYY-MM-DD HH:mm:ss"
 ```
`ecosystem.config.js` 配置如下，
```
module.exports = {
  apps : [{
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
}
```

#### 如何禁用日志？--disable-logs
`cli`命令模式，
 ```
 pm2 start server --disable-logs
 ```
`ecosystem.config.js` 配置如下，
```
module.exports = {
  apps : [{
    disable_logs: true
  }]
}
```

#### 对于集群日志，默认是各个进程是分开的日志，是否合并为一个日志文件？ --merge-logs
`cli`命令模式，
 ```
 pm2 start server --merge-logs
 ```
`ecosystem.config.js` 配置如下，
```
module.exports = {
  apps : [{
    merge_logs: true
  }]
}
```

## PM2 常用命令详述

Demo 目录结构如下，
```
│  ecosystem.config.js  // pm2 生态系统文件
│
├─app
│   index.js   // 应用 app
│
└─server
    index.js   // 应用 server
```

如果想查看各个文件的内容，参看 附录1、附录2、附录3。

### 查看进程列表 pm2 list

#### 查看所有进程列表 pm2 list
进程列表基本上会在每一次 pm2 操作后显示。
```
e:\workplace>pm2 list
┌────────────┬────┬─────────┬──────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐
│ App name   │ id │ version │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├────────────┼────┼─────────┼──────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤
│ server_pre │ 1  │ 1.0.0   │ fork │ 17504 │ online │ 0       │ 4h     │ 0%  │ 16.5 MB   │ somebody │ disabled │
└────────────┴────┴─────────┴──────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

### 启动服务 pm2 start

#### 启动单个应用：pm2 start app
应用名称自动填充为 `app`， 进程状态 `online`，默认不监听文件变更， `watching` 为 `disabled`

```
e:\pm2>pm2 start app
[PM2] Starting e:\pm2\app in fork_mode (1 instance)
[PM2] Done.
┌──────────┬────┬─────────┬──────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐
│ App name │ id │ version │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├──────────┼────┼─────────┼──────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤
│ app      │ 0  │ 1.0.0   │ fork │ 23284 │ online │ 0       │ 0s     │ 0%  │ 30.9 MB   │ somebody │ disabled │
└──────────┴────┴─────────┴──────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

#### 启动单个应用并监听代码变化：pm2 start app --watch

可以看到 `watching` 选项值为 `enabled`，此时，代码文件变化，会触发服务自动重启。
```
e:\pm2>pm2 start app --watch
[PM2] Starting e:\pm2\app in fork_mode (1 instance)
[PM2] Done.
┌──────────┬────┬─────────┬──────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐
│ App name │ id │ version │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├──────────┼────┼─────────┼──────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤
│ app      │ 0  │ 1.0.0   │ fork │ 14288 │ online │ 0       │ 0s     │ 0%  │ 31.1 MB   │ somebody │ enabled  │
└──────────┴────┴─────────┴──────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

#### 启动单个应用并自定义应用名称：pm2 start --name server_pre
如下运行所示，新增了名为 `server_pre` 的进程服务

```
e:\pm2>pm2 start server --name server_pre
[PM2] Starting e:\pm2\server in fork_mode (1 instance)
[PM2] Done.
┌────────────┬────┬─────────┬──────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐
│ App name   │ id │ version │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├────────────┼────┼─────────┼──────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤
│ app        │ 0  │ 1.0.0   │ fork │ 14288 │ online │ 0       │ 74s    │ 0%  │ 27.6 MB   │ somebody │ enabled  │
│ server_pre │ 1  │ 1.0.0   │ fork │ 17504 │ online │ 0       │ 0s     │ 0%  │ 31.1 MB   │ somebody │ disabled │
└────────────┴────┴─────────┴──────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

#### 重启单个应用，更新参数： pm2 restart app --update-env --watch disabled
重启应用需要更新参数，使用 `--update-env`， 第一个 app 应用 `watching` 参数已经从 `enabled` 状态变为 `disabled` 状态。参数 `restart` 表示自应用启动后，重启的次数
```
e:\pm2>pm2 restart app --update-env --watch disabled
[PM2] Applying action restartProcessId on app [app](ids: 0)
[PM2] [app](0) ✓
┌────────────┬────┬─────────┬──────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐
│ App name   │ id │ version │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├────────────┼────┼─────────┼──────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤
│ app        │ 0  │ 1.0.0   │ fork │ 24256 │ online │ 4       │ 0s     │ 0%  │ 31.2 MB   │ somebody │ disabled │
│ server_pre │ 1  │ 1.0.0   │ fork │ 17504 │ online │ 0       │ 8m     │ 0%  │ 27.0 MB   │ somebody │ disabled │
└────────────┴────┴─────────┴──────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

#### 启动应用，负载平衡： pm2 start app -i max
参数 `-i max` 表示启动当前系统 CPU 数量的进程数，其中 `max` 可替换为具体数字，如 `3`、 `-1`，甚至大于 `max` 的数字。数字是多少，启动的进程数就是多少。仔细观察 `mode` 一栏，通过这种方式启动的进程都是 `cluster`，集群模式。

```
e:\pm2>pm2 start app -i max
[PM2] Starting e:\pm2\app in cluster_mode (0 instance)
[PM2] Done.
┌────────────┬────┬─────────┬─────────┬───────┬────────┬─────────┬────────┬───────┬───────────┬──────────┬────────
──┐
│ App name   │ id │ version │ mode    │ pid   │ status │ restart │ uptime │ cpu   │ mem       │ user     │ watching │
├────────────┼────┼─────────┼─────────┼───────┼────────┼─────────┼────────┼───────┼───────────┼──────────┼────────
──┤
│ app        │ 2  │ 1.0.0   │ cluster │ 25892 │ online │ 0       │ 1s     │ 0%    │ 34.6 MB   │ somebody │ disabled │
│ app        │ 3  │ 1.0.0   │ cluster │ 19520 │ online │ 0       │ 1s     │ 0%    │ 34.8 MB   │ somebody │ disabled │
│ app        │ 4  │ 1.0.0   │ cluster │ 26428 │ online │ 0       │ 1s     │ 0%    │ 34.8 MB   │ somebody │ disabled │
│ app        │ 5  │ 1.0.0   │ cluster │ 9480  │ online │ 0       │ 1s     │ 0%    │ 35.1 MB   │ somebody │ disabled │
│ app        │ 6  │ 1.0.0   │ cluster │ 4180  │ online │ 0       │ 1s     │ 0%    │ 34.8 MB   │ somebody │ disabled │
│ app        │ 7  │ 1.0.0   │ cluster │ 16456 │ online │ 0       │ 0s     │ 0%    │ 34.9 MB   │ somebody │ disabled │
│ app        │ 8  │ 1.0.0   │ cluster │ 21960 │ online │ 0       │ 0s     │ 10.9% │ 34.9 MB   │ somebody │ disabled │
│ app        │ 9  │ 1.0.0   │ cluster │ 26904 │ online │ 0       │ 0s     │ 25%   │ 34.3 MB   │ somebody │ disabled │
│ server_pre │ 1  │ 1.0.0   │ fork    │ 17504 │ online │ 0       │ 17m    │ 0%    │ 27.0 MB   │ somebody │ disabled │
└────────────┴────┴─────────┴─────────┴───────┴────────┴─────────┴────────┴───────┴───────────┴──────────┴────────
──┘
 Use `pm2 show <id|name>` to get more details about an app
```

**根据自己对电脑的感觉，应该差不多 4 个才对，怎么出现了 8 个相同的进程？这个数字怎么来的？**

先看看系统信息，
```
e:\workplace>systeminfo
                                                                              
主机名:           ******
OS 名称:          Microsoft Windows 7 专业版
OS 版本:          6.1.7601 Service Pack 1 Build 7601
OS 制造商:        Microsoft Corporation
OS 配置:          ******
OS 构件类型:      Multiprocessor Free
注册的所有人:     ******
注册的组织:       ******
产品 ID:         ******-******-******-******
初始安装日期:     ****/2/21, 12:46:21
系统启动时间:     ****/2/21, 18:29:48
系统制造商:       LENOVO
系统型号:         ThinkCentre M8500t-N000
系统类型:         x64-based PC
处理器:           安装了 1 个处理器。
                  [01]: Intel64 Family 6 Model 60 Stepping 3 GenuineIntel ~3601 Mhz
BIOS 版本:        LENOVO FBKTC1AUS, ****/2/16
......
```

只有一个处理器，嗯... 不像，再看 CPU 信息，
`numberofcores = 4` 表示系统 CPU 为四核；`NumberOfLogicalProcessors = 8`，表示 CPU 线程数为 8，系统使用了超线程技术。由此可推测， `pm2 start app -i max` 中， `max`是指系统 CPU 最终的可执行的线程数决定。

```
e:\workplace>wmic
wmic:root\cli>cpu get numberofcores
NumberOfCores
4

wmic:root\cli>cpu get NumberOfLogicalProcessors
NumberOfLogicalProcessors
8
```

#### 0 秒停机重载所有进程 pm2 reload all
用于集群进程，即 pm2 start -i `n`，重载所有进程，但过程中始终保持一个进程在正常运行。看运行结果`[app](0)`，其中 `app` 是进程名称， `0`是进程 id。`reload` 也会使用进程列表中的 `restart` 数值加1。
```
e:\pm2>pm2 reload all
Use --update-env to update environment variables
[PM2] Applying action reloadProcessId on app [all](ids: 0,2,3)
[PM2] [app](0) ✓
[PM2] [app](2) ✓
[PM2] [server_pre](3) ✓
```

#### 0 秒停机重载某一集群进程 pm2 reload app
系统有两个应用，app 和 server，但只重载了 app 应用的所有进程。
```
e:\pm2>pm2 reload app
Use --update-env to update environment variables
[PM2] Applying action reloadProcessId on app [app](ids: 0,2)
[PM2] [app](0) ✓
[PM2] [app](2) ✓
```

### 删除进程 pm2 delete

#### 根据名称删除应用进程 pm2 delete app
先使用 `pm2 start app -i 3` 创建三个相同的 app 进程，然后使用 `pm2 delete app`，观察输出结果。会显示删除的 App id。
```
e:\pm2>pm2 delete app
[PM2] Applying action deleteProcessId on app [app](ids: 57,58,59)
[PM2] [app](57) ✓
[PM2] [app](58) ✓
[PM2] [app](59) ✓
┌────────────┬────┬─────────┬──────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐
│ App name   │ id │ version │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├────────────┼────┼─────────┼──────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤
│ server_pre │ 1  │ 1.0.0   │ fork │ 17504 │ online │ 0       │ 4h     │ 0%  │ 17.0 MB   │ somebody │ disabled │
└────────────┴────┴─────────┴──────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

#### 删除所有应用进程 pm2 delete all
```
e:\pm2>pm2 delete all
[PM2] Applying action deleteProcessId on app [all](ids: 1,60,61,62)
[PM2] [server_pre](1) ✓
[PM2] [app](61) ✓
[PM2] [app](60) ✓
[PM2] [app](62) ✓
┌──────────┬────┬─────────┬──────┬─────┬────────┬─────────┬────────┬─────┬─────┬──────┬──────────┐
│ App name │ id │ version │ mode │ pid │ status │ restart │ uptime │ cpu │ mem │ user │ watching │
└──────────┴────┴─────────┴──────┴─────┴────────┴─────────┴────────┴─────┴─────┴──────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

#### 根据 id 删除应用进程 pm2 delete 0
重新创建全新的 pm2 进程，然后删除具体某一个 id 进程。 根据名称会删除所有进程，但是根据 id 只会删除其中一个。名称相同， id 不同的进程一般属于一个集群。

```
e:\pm2>pm2 start app -i 3
[PM2] Starting e:\pm2\app in cluster_mode (3 instances)
[PM2] Done.
┌──────────┬────┬─────────┬─────────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐
│ App name │ id │ version │ mode    │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├──────────┼────┼─────────┼─────────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤
│ app      │ 0  │ 1.0.0   │ cluster │ 19600 │ online │ 0       │ 0s     │ 0%  │ 34.8 MB   │ somebody │ disabled │
│ app      │ 1  │ 1.0.0   │ cluster │ 27652 │ online │ 0       │ 0s     │ 0%  │ 34.6 MB   │ somebody │ disabled │
│ app      │ 2  │ 1.0.0   │ cluster │ 27792 │ online │ 0       │ 0s     │ 0%  │ 34.8 MB   │ somebody │ disabled │
└──────────┴────┴─────────┴─────────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app

e:\pm2>pm2 delete 1
[PM2] Applying action deleteProcessId on app [1](ids: 1)
[PM2] [app](1) ✓
┌──────────┬────┬─────────┬─────────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐
│ App name │ id │ version │ mode    │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├──────────┼────┼─────────┼─────────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤
│ app      │ 0  │ 1.0.0   │ cluster │ 19600 │ online │ 0       │ 15s    │ 0%  │ 34.9 MB   │ somebody │ disabled │
│ app      │ 2  │ 1.0.0   │ cluster │ 27792 │ online │ 0       │ 14s    │ 0%  │ 34.8 MB   │ somebody │ disabled │
└──────────┴────┴─────────┴─────────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

### 停止进程 pm2 stop

#### 停止所有进程 pm2 stop all 
```
e:\workplace>pm2 stop all
[PM2] Applying action stopProcessId on app [all](ids: 0,2,3)
[PM2] [app](0) ✓
[PM2] [app](2) ✓
[PM2] [server_pre](3) ✓
┌────────────┬────┬─────────┬─────────┬─────┬─────────┬─────────┬────────┬─────┬────────┬──────────┬──────────┐
│ App name   │ id │ version │ mode    │ pid │ status  │ restart │ uptime │ cpu │ mem    │ user     │ watching │
├────────────┼────┼─────────┼─────────┼─────┼─────────┼─────────┼────────┼─────┼────────┼──────────┼──────────┤
│ app        │ 0  │ 1.0.0   │ cluster │ 0   │ stopped │ 3       │ 0      │ 0%  │ 0 B    │ somebody │ disabled │
│ app        │ 2  │ 1.0.0   │ cluster │ 0   │ stopped │ 3       │ 0      │ 0%  │ 0 B    │ somebody │ disabled │
│ server_pre │ 3  │ 1.0.0   │ fork    │ 0   │ stopped │ 1       │ 0      │ 0%  │ 0 B    │ somebody │ disabled │
└────────────┴────┴─────────┴─────────┴─────┴─────────┴─────────┴────────┴─────┴────────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

#### 根据名称停止某一进程 pm2 stop app
名称为 app 的两个进程都被 stopped 了
```
e:\workplace>pm2 stop app
[PM2] Applying action stopProcessId on app [app](ids: 0,2)
[PM2] [app](0) ✓
[PM2] [app](2) ✓
┌────────────┬────┬─────────┬─────────┬───────┬─────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐

│ App name   │ id │ version │ mode    │ pid   │ status  │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├────────────┼────┼─────────┼─────────┼───────┼─────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤

│ app        │ 0  │ 1.0.0   │ cluster │ 0     │ stopped │ 3       │ 0      │ 0%  │ 0 B       │ somebody │ disabled │
│ app        │ 2  │ 1.0.0   │ cluster │ 0     │ stopped │ 3       │ 0      │ 0%  │ 0 B       │ somebody │ disabled │
│ server_pre │ 3  │ 1.0.0   │ fork    │ 11940 │ online  │ 1       │ 12s    │ 0%  │ 31.3 MB   │ somebody │ disabled │
└────────────┴────┴─────────┴─────────┴───────┴─────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘

 Use `pm2 show <id|name>` to get more details about an app
```

#### 根据 id 停止某一进程 pm2 stop 3 
只有 `server_pre` 的状态 status 已变为 `stopped`
```
e:\workplace>pm2 stop 3
[PM2] Applying action stopProcessId on app [3](ids: 3)
[PM2] [server_pre](3) ✓
┌────────────┬────┬─────────┬─────────┬───────┬─────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐

│ App name   │ id │ version │ mode    │ pid   │ status  │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├────────────┼────┼─────────┼─────────┼───────┼─────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤

│ app        │ 0  │ 1.0.0   │ cluster │ 23856 │ online  │ 3       │ 8m     │ 0%  │ 29.2 MB   │ somebody │ disabled │
│ app        │ 2  │ 1.0.0   │ cluster │ 28412 │ online  │ 3       │ 8m     │ 0%  │ 28.7 MB   │ somebody │ disabled │
│ server_pre │ 3  │ 1.0.0   │ fork    │ 0     │ stopped │ 1       │ 0      │ 0%  │ 0 B       │ somebody │ disabled │
└────────────┴────┴─────────┴─────────┴───────┴─────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘

 Use `pm2 show <id|name>` to get more details about an app
```

### 进程信息查看

#### 查看单个进程详细信息

`pm2 show <name|id>`，包含：名称、版本、重启次数、脚本路径、端口号、日志路径、环境变量、创建时间、git 相关信息等。

```
e:\workplace\yaoyanhuo>pm2 show 0
 Describing process with id 0 - name bcontent 
┌───────────────────┬───────────────────────────────────────────────────────┐
│ status            │ online                                                │
│ name              │ bcontent                                              │
│ version           │ 1.0.0                                                 │
│ restarts          │ 1                                                     │
│ uptime            │ 23h                                                   │
│ script path       │ e:\webtorm_workplace\landing-page\dev\server\index.js │
│ script args       │ 10001                                                 │
│ error log path    │ C:\Users\somebody\.pm2\logs\bcontent-error-0.log      │
│ out log path      │ C:\Users\somebody\.pm2\logs\bcontent-out-0.log        │
│ pid path          │ C:\Users\somebody\.pm2\pids\bcontent-0.pid            │
│ interpreter       │ node                                                  │
│ interpreter args  │ N/A                                                   │
│ script id         │ 0                                                     │
│ exec cwd          │ e:\webtorm_workplace\landing-page\dev\build           │
│ exec mode         │ cluster_mode                                          │
│ node.js version   │ 10.15.1                                               │
│ node env          │ production                                            │
│ watch & reload    │ ✘                                                     │
│ unstable restarts │ 0                                                     │
│ created at        │ 2019-02-28T07:21:26.068Z                              │
└───────────────────┴───────────────────────────────────────────────────────┘
 Revision control metadata 
┌──────────────────┬──────────────────────────────────────────────────────────┐
│ revision control │ git                                                      │
│ remote url       │ http://git.code.oa.com/business_content/landing-page.git │
│ repository root  │ e:\webtorm_workplace\landing-page                        │
│ last update      │ 2019-02-28T07:21:26.651Z                                 │
│ revision         │ 61f60121fbca3d7bbd6872caa2f094fa44ed5a33                 │
│ comment          │ add pre bash                                             │
│ branch           │ master                                                   │
└──────────────────┴──────────────────────────────────────────────────────────┘
 Code metrics value 
┌────────────────────┬──────────┐
│ Event Loop Latency │ 306.55ms │
│ Active handles     │ 2        │
└────────────────────┴──────────┘
 Add your own code metrics: http://bit.ly/code-metrics
 Use `pm2 logs bcontent [--lines 1000]` to display logs
 Use `pm2 env 0` to display environement variables
 Use `pm2 monit` to monitor CPU and Memory usage bcontent
```

#### 进程监视 pm2 monit
查看进程 CPU 运行情况

### 日志管理

- 日志会打印 node 服务中的所有 `console`，无论是启动服务中的，还是网络请求中的。
- 日志分类存储，错误日志和普通日志分开存储，不同进程服务不同的日志文件，同一进程集群，也会因进程 id 不同而分开存储日志。
- 日志文件一旦创建，无论执行 `restart` `start` 还是 `delete` 命令，过往日志都不会被删除和清空。

#### 查看所有进程日志 pm2 logs

日志路径会在命令执行后输出到控制台，并且可以看到是分文件输出，且仅显示最新的 log。进入具体日志路径 `C:\Users\somebody\.pm2\logs\server-pre-out.log` 查看完整日志。

```
e:\pm2>pm2 logs
[TAILING] Tailing last 15 lines for [all] processes (change the value with --lines option)
C:\Users\somebody\.pm2\pm2.log last 15 lines:
PM2        | 2019-02-27T23:03:59: PM2 log: App name:app id:0 disconnected
PM2        | 2019-02-27T23:03:59: PM2 log: App [app:0] exited with code [1] via signal [SIGINT]
PM2        | 2019-02-27T23:03:59: PM2 log: App name:app id:2 disconnected
PM2        | 2019-02-27T23:03:59: PM2 log: App [app:2] exited with code [1] via signal [SIGINT]
PM2        | 2019-02-27T23:03:59: PM2 log: pid=17860 msg=process killed
PM2        | 2019-02-27T23:03:59: PM2 log: App [app:0] starting in -cluster mode-
PM2        | 2019-02-27T23:03:59: PM2 log: pid=28304 msg=process killed
PM2        | 2019-02-27T23:03:59: PM2 log: App [app:2] starting in -cluster mode-
PM2        | 2019-02-27T23:03:59: PM2 log: App [app:0] online
PM2        | 2019-02-27T23:03:59: PM2 log: Stopping app:server_pre id:3
PM2        | 2019-02-27T23:03:59: PM2 log: App [app:2] online
PM2        | 2019-02-27T23:03:59: PM2 log: App [server_pre:3] exited with code [1] via signal [SIGINT]
PM2        | 2019-02-27T23:03:59: PM2 log: pid=14312 msg=process killed
PM2        | 2019-02-27T23:03:59: PM2 log: App [server_pre:3] starting in -fork mode-
PM2        | 2019-02-27T23:03:59: PM2 log: App [server_pre:3] online

C:\Users\somebody\.pm2\logs\server-pre-error.log last 15 lines:
C:\Users\somebody\.pm2\logs\app-error-0.log last 15 lines:
C:\Users\somebody\.pm2\logs\app-error-2.log last 15 lines:
C:\Users\somebody\.pm2\logs\app-out-2.log last 15 lines:
2|app      | hello app...
2|app      | undefined
2|app      | app is listening at localhost:3001
2|app      | hello app...
2|app      | undefined
2|app      | app is listening at localhost:3001
2|app      | hello app...
2|app      | undefined
2|app      | app is listening at localhost:3001
2|app      | hello app...
2|app      | undefined
2|app      | app is listening at localhost:3001
2|app      | hello app...
2|app      | undefined
2|app      | app is listening at localhost:3001

C:\Users\somebody\.pm2\logs\app-out-0.log last 15 lines:
0|app      | hello app...
0|app      | undefined
0|app      | app is listening at localhost:3001
0|app      | hello app...
0|app      | undefined
0|app      | app is listening at localhost:3001
0|app      | hello app...
0|app      | undefined
0|app      | app is listening at localhost:3001
0|app      | hello app...
0|app      | undefined
0|app      | app is listening at localhost:3001
0|app      | hello app...
0|app      | undefined
0|app      | app is listening at localhost:3001

C:\Users\somebody\.pm2\logs\server-pre-out.log last 15 lines:
3|server_p | hello server...
3|server_p | undefined
3|server_p | app is listening at localhost:3002
3|server_p | hello server...
3|server_p | undefined
3|server_p | app is listening at localhost:3002
3|server_p | request once refresh
3|server_p | hello server...
3|server_p | undefined
3|server_p | app is listening at localhost:3002
3|server_p | request once refresh
3|server_p | request once refresh
3|server_p | hello server...
3|server_p | undefined
3|server_p | app is listening at localhost:3002
```


#### 查看具体应用日志 pm2 logs app

如下，`request once refresh` 是在网络请求代码请求中输出的。 `hello server` 则是应用启动 log，每次应用启动或更新时会打印。

```
e:\workplace>pm2 logs server_pre
[TAILING] Tailing last 15 lines for [server_pre] process (change the value with --lines option)
C:\Users\somebody\.pm2\logs\server-pre-error.log last 15 lines:
C:\Users\somebody\.pm2\logs\server-pre-out.log last 15 lines:
3|server_p | hello server...
3|server_p | undefined
3|server_p | app is listening at localhost:3002
3|server_p | hello server...
3|server_p | undefined
3|server_p | app is listening at localhost:3002
3|server_p | hello server...
3|server_p | undefined
3|server_p | app is listening at localhost:3002
3|server_p | request once refresh
```

#### 清除日志 pm2 flush
清除进程列表`pm2 list`中的所有进程应用日志，无论其状态为 `online` 还是 `stopped`。但不在进程列表中的死进程，其日志不会被清除，如：执行了 `pm2 delete app` 的 app 进程。清除操作仅仅是清空文件，不会删除文件。

如下执行结果所示，`sopped` 状态的 `server` 和 `online` 状态的 `bcontent` 日志都被清除了。
```
e:\pm2>pm2 stop server
[PM2] Applying action stopProcessId on app [server](ids: 1)
[PM2] [server](1) ✓
┌──────────┬────┬─────────┬──────┬───────┬─────────┬─────────┬────────┬─────┬───────────┬──────────┬──────────┐
│ App name │ id │ version │ mode │ pid   │ status  │ restart │ uptime │ cpu │ mem       │ user     │ watching │
├──────────┼────┼─────────┼──────┼───────┼─────────┼─────────┼────────┼─────┼───────────┼──────────┼──────────┤
│ bcontent │ 0  │ 1.0.0   │ fork │ 10176 │ online  │ 0       │ 5m     │ 0%  │ 36.6 MB   │ somebody │ enabled  │
│ server   │ 1  │ 1.0.0   │ fork │ 0     │ stopped │ 0       │ 0      │ 0%  │ 0 B       │ somebody │ disabled │
└──────────┴────┴─────────┴──────┴───────┴─────────┴─────────┴────────┴─────┴───────────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app

e:\pm2>pm2 flush
[PM2] Flushing C:\Users\somebody\.pm2\pm2.log
[PM2] Flushing:
[PM2] C:\Users\somebody\.pm2\logs\bcontent-out-0.log
[PM2] C:\Users\somebody\.pm2\logs\bcontent-error-0.log
[PM2] Flushing:
[PM2] C:\Users\somebody\.pm2\logs\server-out.log
[PM2] C:\Users\somebody\.pm2\logs\server-error.log
[PM2] Logs flushed
```


### 启动挂钩

- 启动挂钩是为了保存进程列表，在计算机重启或出现意外时将其恢复。
- 每个操作系统都有一个特定的工具来处理启动挂钩：pm2提供了一种简单的方法来生成和配置它们。

#### 检测可用的 init 系统并生成配置 pm2 startup
这是一台 linux 系统执行结果，
```
ubuntu@VM-16-2-ubuntu:~$ pm2 startup
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v10.15.1/bin /home/ubuntu/.nvm/versions/node/v10.15.1/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

这是本地 windows 执行结果，啥都没有。
```
e:\workplace\yaoyanhuo>pm2 startup
[PM2][ERROR] Init system not found
D:\Program Files\nodejs\node_modules\@tencent\pm2\lib\API\Startup.js:201
      throw new Error('Init system not found');
      ^

Error: Init system not found
    at API.CLI.startup (D:\Program Files\nodejs\node_modules\@tencent\pm2\lib\API\Startup.js:201:13)
    at Command.<anonymous> (D:\Program Files\nodejs\node_modules\@tencent\pm2\bin\pm2:736:9)
    at Command.listener (D:\Program Files\nodejs\node_modules\@tencent\pm2\node_modules\commander\index.js:315:8)
    at Command.emit (events.js:189:13)
    at Command.parseArgs (D:\Program Files\nodejs\node_modules\@tencent\pm2\node_modules\commander\index.js:651:12)
    at Command.parse (D:\Program Files\nodejs\node_modules\@tencent\pm2\node_modules\commander\index.js:474:21)
    at Timeout._onTimeout (D:\Program Files\nodejs\node_modules\@tencent\pm2\bin\pm2:204:15)
    at ontimeout (timers.js:436:11)
    at tryOnTimeout (timers.js:300:5)
    at listOnTimeout (timers.js:263:5)
```


## 附录1 app/index.js
```
const express = require('express')
const app = express()
const port = process.argv[2] || 3001

console.log('hello app...')
console.log(process.env.NODE_ENV)

app.get('/', function (req, res) {
  res.json({data: 'hello app'})
})
app.listen(port, () => console.log(`app is listening at localhost:${port}`))

```

## 附录2 server/index.js
```
const express = require('express')
const app = express()
const port = process.argv[2] || 3002

console.log('hello server...')
console.log(process.env.NODE_ENV)

app.get('/', function (req, res) {
  console.log('request once refresh')
  res.json({greeting: 'hello server'})
})
app.listen(port, () => console.log(`app is listening at localhost:${port}`))

```


## 附录3 ecosystem.config.js
```
module.exports = {
  apps : [{
    name: 'app',
    script: 'app/index.js',
    args: '3306',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },{
    name: 'server',
    script: 'server/index.js',
    args: '1001',
    instances: 3,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
```

## 附录4 参考地址
- pm2 从入门到精通：https://www.kancloud.cn/daiji/pm2/395334
- 官网：https://pm2.io/doc/en/runtime/quick-start/
- 中文：https://pm2.io/doc/zh/runtime/quick-start/