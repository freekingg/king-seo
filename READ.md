## 目录结构
**kk-web**

web页面视图托管

**kk-server**
应用后端服务

**kk-admin**
web端管理后台

## 安装依赖
分别进入 `kk-server`与 `kk-web`目录进行执行`npm install`安装依赖

## pm2进程管理器
PM2 是一个带有负载均衡功能的 Node 应用进程管理器。

![](https://gitee.com/king121314/king-static/raw/master/20210725141040.png)

**主要特性：**

- 内建负载均衡（使用 Node cluster 集群模块）
- 后台运行
- 0 秒停机重载
- 停止不稳定的进程（避免无限循环）
- 具有 Ubuntu 和 CentOS 的启动脚本


#### 安装pm2
```
npm install -g pm2
```

#### 启动配置
```
pm2 start ecosystem.config.js
```

#### 常用命令

- 启动服务

```
pm2 start ecosystem.config.js //根据配置文件启动
pm2 start app.js //启动app.js应用
```

- 停止服务
```
pm2 stop all               //停止所有应用
pm2 stop [AppName]        //根据应用名停止指定应用
pm2 stop [ID]             //根据应用id停止指定应用
```

- 删除应用
```
pm2 delete all               //关闭并删除应用
pm2 delete [AppName]        //根据应用名关闭并删除应用
pm2 delete [ID]            //根据应用ID关闭并删除应用

```


- 创建开机自启动
```
pm2 startup
```

- 静态服务器
```
pm2 serve ./dist 9090        //将目录dist作为静态服务器根目录，端口为9090
```

- 重新启动
```
pm2 restart all //重启所有
pm2 restart app.js
```
- 查看启动列表
```
pm2 list
```

- 查看每个应用程序占用情况
```
pm2 monit
```

- 日志查看
```
pm2 logs            //查看所有应用日志
pm2 logs [Name]    //根据指定应用名查看应用日志
pm2 logs [ID]      //根据指定应用ID查看应用日志
```