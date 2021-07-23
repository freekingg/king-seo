const Koa = require('koa')
const app = new Koa()
const proxy = require('koa-proxies')

// app.use(proxy('/', {
//   target: 'http://localhost:5001',    
//   changeOrigin: true,
//   logs: true
// }))

app.use(proxy('/', {
  target: 'http://localhost:5001/',    
  changeOrigin: true,
  rewrite: path => path.replace(/(.*)/, '/proxy'),
  logs: true
}))

app.listen(5000);
