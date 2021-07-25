const templateRouter = {
  route: null,
  name: null,
  title: '模板管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/template/',
  order: null,
  inNav: true,
  children: [
    {
      title: '模板列表',
      type: 'view',
      name: 'TemplateList',
      route: '/template/list',
      filePath: 'view/template/template.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default templateRouter
