import { LinRouter, disableLoading,config } from 'lin-mizar';
import fs from 'fs-extra';
import path from 'path';
import cheerio from 'cheerio';
import { parse } from 'node-html-parser';



import {
  TplSearchValidator,
  CreateOrUpdateTplValidator
} from '../../validator/web/tpl';

import { getSafeParamId, isDirectory, randomKey, Unicode } from '../../lib/util';
import { WebTplDao } from '../../dao/web/tpl';
import { KeywordDao } from '../../dao/web/keyword';
import { WebsiteDao } from '../../dao/web/website';
import { ArticleDao } from '../../dao/web/article';

const WebTplDaokDtoApi = new LinRouter({
  // prefix: '/s',
  module: '首页'
});

// dao 数据库访问层实例
const WebTplDaokDto = new WebTplDao();
const websiteDto = new WebsiteDao();
const keywordDaoDto = new KeywordDao();
const articleDaoDto = new ArticleDao();

// 主页面逻辑入口
WebTplDaokDtoApi.get(['/', '/proxy'], async ctx => {
  let { request, url } = ctx;
  let host = request.host;
  let referer = ctx.request.header.referer;

  if (url === '/localhost:5001') return;
  if (url === '/proxy' && referer) {
    let r = new URL(referer);
    host = r.host;
  }
  console.log('当前请求的域名:', host);

  let assetsDir = config.getItem('assetsDir')
  let templateDir = config.getItem('templateDir')
  let tempDir = config.getItem('tempDir')

  // 检查是否有缓存记录
  let site = await websiteDto.getItem(host)
  if (!site) {
    // 第一次请求 处理逻辑

    // 获取随机模板
    const tpls = await WebTplDaokDto.getRandItems();
    let randomTplPath = path.join(templateDir, tpls.path);

    // 数据库获取一条随机关键词数据
    const keywords = await keywordDaoDto.getRandItems();
    // 数据库获取一条随机文章数据
    const articles = await articleDaoDto.getRandItems();
    // 取随机3个关键词  和随机一条文章
    let kwsArr = await randomKey(path.join(assetsDir, keywords.path), 3);
    let kws = `${kwsArr[0]},${kwsArr[1]},${kwsArr[2]}`;
    let article1 = await randomKey(path.join(assetsDir, articles.path));

    // 模板替换
    let d = fs.readFileSync(randomTplPath);
    const root = parse(d);
    let asciiKey = Unicode(`${kws}`)
    root.querySelector('title').set_content(`${asciiKey}`);
    root.querySelector('meta[name="keywords"]').setAttribute('content', `${asciiKey}`);
    root.querySelector('meta[name="description"]').setAttribute('content', `${asciiKey}-${article1}`);
    console.log(root.toString());

    // 模板目录
    let tplTmppath = path.join(tempDir, tpls.name);
    // console.log(jq.html({decodeEntities: false }));
    fs.writeFileSync(tplTmppath, root.toString());
   
    let obj = {
      host,
      title: `${kws}`,
      keywords: `${kws}`,
      template: `${tpls.name}`,
      path: `${tpls.name}`
    };
    await websiteDto.createItem(obj);
    ctx.body = root.toString();
    return;
  }
  let d = fs.readFileSync(path.join(tempDir, site.path));
  console.log('直接读取');
  ctx.body = d.toString();
});

// 根据模板目录同步数据库
WebTplDaokDtoApi.post('/sync', async ctx => {
  // 模板目录
  let tplpath = path.join(__dirname, '../../../web/template/index')
  console.log('tplpath: ', tplpath);
  // 获取目录所有一级文件夹
  let dirs = fs.readdirSync(tplpath);
  let tplDirs = [];
  for (const iterator of dirs) {
    let curpath = path.join(tplpath, iterator)
    if (isDirectory(curpath)) {
      tplDirs.push({
        name: iterator,
        path: curpath
      })
    }
  }

  await Promise.all(tplDirs.map(async (item) => {
    await WebTplDaokDto.syncTpl(item);
  }));

  ctx.success({
    code: 2
  });
});

// WebTplDaokDtoApi.get('/search/one', async ctx => {
//   const v = await new TplSearchValidator().validate(ctx);
//   const book = await WebTplDaokDto.getBookByKeyword(v.get('query.q'));
//   if (!book) {
//     throw new BookNotFound();
//   }
//   ctx.json(book);
// });

WebTplDaokDtoApi.post('/', async ctx => {
  const v = await new CreateOrUpdateTplValidator().validate(ctx);
  await WebTplDaokDto.createItem(v);
  ctx.success({
    code: 12
  });
});

WebTplDaokDtoApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateTplValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await WebTplDaokDto.updateBook(v, id);
  ctx.success({
    code: 13
  });
});

module.exports = { WebTplDaokDtoApi, [disableLoading]: false };
