const shujuRouter = {
  route: null,
  name: null,
  title: '数据分析',
  type: 'folder',
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/content/',
  order: null,
  inNav: true,
  children: [
    {
      title: '收录数据',
      type: 'view',
      name: 'ShouluList',
      route: '/shoulu/list',
      filePath: 'view/shuju/shoulu.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    }
  ],
}

export default shujuRouter
