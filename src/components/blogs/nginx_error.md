# Nginx Error List

*posted by yaoyanhuo on 2019-06-26*

> 本文将记录 nginx 使用过程中遇到的各类问题

## nginx: [error] open() "/run/nginx.pid" failed (2: No such file or directory)

安装好 nginx 后，执行 `nginx -s reload` 便会出现如下错误提示，
```
nginx: [error] open() "/run/nginx.pid" failed (2: No such file or directory)
```
这是因为刚安装好的 nginx 还未启动，自然找不到对应的进程，无法重新载入。

解决办法也简单，直接到 nginx 目录下，运行一下 nginx 即可，如下

```
cd /usr/sbin
./nginx
```
