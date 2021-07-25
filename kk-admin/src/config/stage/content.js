const templateRouter = {
  route: null,
  name: null,
  title: '内容管理',
  type: 'folder',
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/content/',
  order: null,
  inNav: true,
  children: [
    {
      title: '关键词列表',
      type: 'view',
      name: 'KeywordsList',
      route: '/keywords/list',
      filePath: 'view/content/keywords.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '文章列表',
      type: 'view',
      name: 'ArticleList',
      route: '/article/list',
      filePath: 'view/content/article.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default templateRouter
