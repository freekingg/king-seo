const Koa = require('koa')
const app = new Koa()
const proxy = require('koa-proxies')

// 代理根路径
app.use(
  proxy("*", (params) => {
    let paramsArr = params['0'].split('/')
    console.log(params);

    if (paramsArr[0] === '/favicon.ico') {
      return false;
    }

    // 代理内容页
    if (paramsArr[1] === 'a' && /^\d+$/.test(paramsArr[2])) {
      console.log("article");
      return {
        target: "http://localhost:5001/",
        rewrite: (path) => path.replace(/(.*)/, "/article"),
        events: {
          proxyReq(proxyReq, req) {
            let referer = req._parsedUrl.path || '';
            proxyReq.setHeader("X-Special-Proxy-Header-path", referer);
          },
        },
      };
    }

    // 代理静态资源
    if (paramsArr.includes('static')) {
      return {
        target: "http://localhost:5001",
        rewrite: (path) => path.replace(/(.*?static)/, "/static"),
        // rewrite: (path) => {
        //   return path.replace(/(.*?static)/, "/static");
        // },
        events: {
          proxyReq(proxyReq, req) {
            let referer = req._parsedUrl.path || "";
            proxyReq.setHeader("X-Special-Proxy-Header-path", referer);
          },
        },
      };
    }

     console.log("proxy");
    return {
      target: "http://localhost:5001/",
      rewrite: (path) => path.replace(/(.*)/, "/proxy"),
      events: {
        proxyReq(proxyReq, req) {
          let referer = req._parsedUrl.path || "";
          proxyReq.setHeader("X-Special-Proxy-Header-path", referer);
        },
      },
      // changeOrigin:true,
      // logs: true,
    };
  })
);

app.listen(5000);
