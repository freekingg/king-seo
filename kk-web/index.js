const Koa = require('koa')
const app = new Koa()
const proxy = require('koa-proxies')

// 代理静态资源
// app.use(proxy('/static/*', {
//   target: 'http://localhost:5001/',    
//   rewrite: path => path.replace(/^\/static(\/|\/\w+)?$/, '/static'),
//   // logs: true
// }))

// 代理根路径
// app.use(proxy('/a/*/*.html', {
//   target: 'http://localhost:5001/',    
//   rewrite: path => path.replace(/(.*)/, '/article'),
//   // logs: true
// }))

// 代理根路径
app.use(
  proxy("*", (params) => {
    console.log("params", params);
    console.log("params", params['0'].split('/'));
    let paramsArr = params['0'].split('/')
    if (paramsArr[1] === 'a' && /^\d+$/.test(paramsArr[2])) {
      console.log('neiye');
      return {
        target: 'http://localhost:5001/',
        rewrite: path => path.replace(/(.*)/, '/article'),
      }
    }
    return {
      target: "http://localhost:5001/",
      rewrite: (path) => path.replace(/(.*)/, "/proxy"),
      logs: true,
    };
  })
);

// app.use(proxy('/', {
//   target: 'http://localhost:5001/',    
//   rewrite: path => path.replace(/(.*)/, '/proxy'),
//   logs: true
// }))

app.listen(5000);
