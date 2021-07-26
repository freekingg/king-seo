const path = require('path');

module.exports = {
  port: 5001,
  siteDomain: 'http://154.17.31.215:5001',
  countDefault: 10,
  pageDefault: 0,
  apiDir: 'app/api',
  templateDir: path.resolve(__dirname, '../../web/template/index'), // 模板文件夹
  tempDir: path.resolve(__dirname, '../../web/data/temp'), // 缓存文件夹
  accessExp: 60 * 60, // 1h 单位秒
  // 指定工作目录，默认为 process.cwd() 路径
  baseDir: path.resolve(__dirname, '../../'),
  // debug 模式
  debug: true,
  // refreshExp 设置refresh_token的过期时间，默认一个月
  refreshExp: 60 * 60 * 24 * 30,
  // 暂不启用插件
  pluginPath: {
    // // plugin name
    // poem: {
    //   // determine a plugin work or not
    //   enable: true,
    //   // path of the plugin
    //   path: "app/plugin/poem",
    //   // other config
    //   limit: 2
    // },
  }
};
