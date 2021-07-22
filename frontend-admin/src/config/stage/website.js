const websiteRouter = {
  title: '网站管理',
  type: 'folder', // 类型: folder, tab, view
  name: 'website',
  route: '/website',
  filePath: 'view/website/',
  inNav: true,
  icon: 'iconfont icon-tushuguanli',
  children: [
    {
      title: '网站列表',
      type: 'view',
      name: 'WebsiteList',
      route: '/website/list',
      filePath: 'view/website/website.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default websiteRouter
