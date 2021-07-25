const Koa = require('koa')
const app = new Koa()
const proxy = require('koa-proxies')

// 代理静态资源
app.use(proxy('/static/*', {
  target: 'http://localhost:5001/',    
  rewrite: path => path.replace(/^\/static(\/|\/\w+)?$/, '/static'),
  // logs: true
}))

// 代理根路径
// app.use(proxy('/a/*/*.html', {
//   target: 'http://localhost:5001/',    
//   rewrite: path => path.replace(/(.*)/, '/article'),
//   // logs: true
// }))

// 代理根路径
app.use(
  proxy("*", (params) => {
    // console.log("params", params);
    console.log("paramsArr", params["0"].split("/"));
    let paramsArr = params['0'].split('/')
    if (paramsArr[1] === 'a' && /^\d+$/.test(paramsArr[2])) {
      return {
        target: "http://localhost:5001/",
        rewrite: (path) => path.replace(/(.*)/, "/article"),
        events: {
          proxyReq(proxyReq, req) {
             console.log("article");
            let referer = req._parsedUrl.path || '';
            proxyReq.setHeader("X-Special-Proxy-Header-path", referer);
          },
        },
      };
    }

    if (paramsArr[1] === "static" || paramsArr[2] === "static") {
      console.log("paramsArr[2]", paramsArr[2]);
      return {
        target: "http://localhost:5001",
        rewrite: (path) => path.replace(/^\/static(\/|\/\w+)?$/, "/static"),
        // rewrite: (path) => path.replace(/(.*)/, "/static"),
        events: {
          proxyReq(proxyReq, req) {
            console.log("static", req._parsedUrl.path);
            let referer = req._parsedUrl.path || "";
            proxyReq.setHeader("X-Special-Proxy-Header-path", referer);
          },
        },
      };
    }
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
      logs: true,
    };
  })
);

// app.use(
//   proxy("/static/*", {
//     target: "http://localhost:5001/",
//     rewrite: (path) => path.replace(/^\/static(\/|\/\w+)?$/, "/static"),
//     // logs: true
//   })
// );

// app.use(proxy('/', {
//   target: 'http://localhost:5001/',    
//   rewrite: path => path.replace(/(.*)/, '/proxy'),
//   logs: true
// }))

app.listen(5000);
