import { LinRouter, disableLoading,config } from 'lin-mizar';
import fs from 'fs-extra';
import path from 'path';
import cheerio from 'cheerio';

import {
  TplSearchValidator,
  CreateOrUpdateTplValidator
} from '../../validator/web/tpl';

import { getSafeParamId, isDirectory, randomA2B, space2Array, randomKey } from '../../lib/util';
import { WebTplDao } from '../../dao/web/tpl';
import { KeywordDao } from '../../dao/web/keyword';
import { WebsiteDao } from '../../dao/web/website';
import { ArticleDao } from '../../dao/web/article';

const WebTplDaokDtoApi = new LinRouter({
  // prefix: '/s',
  module: '首页'
});

// 模板 的dao 数据库访问层实例
const WebTplDaokDto = new WebTplDao();
const websiteDto = new WebsiteDao();
const keywordDaoDto = new KeywordDao();
const articleDaoDto = new ArticleDao();

// WebTplDaokDtoApi.use('/',async (ctx,next) => {
//   ctx.body = 2
 
// });

WebTplDaokDtoApi.get('/', async ctx => {
  let { request } = ctx;
  console.log('当前请求的域名', request.host);
  let host = request.host;
  
  // 检查是否有缓存记录
  let site = await websiteDto.getItem(host)
  console.log(site)
  if (!site) {
    // 第一次请求

    let assetsDir = config.getItem('assetsDir')

    // 获取随机模板
    const tpls = await WebTplDaokDto.getRandItems();
    let randomTplPath = path.join(tpls.path);
    console.log('当前使用模板: ', randomTplPath);
 
    // 数据库获取一条随机关键词数据
    const keywords = await keywordDaoDto.getRandItems();

    // 数据库获取一条随机文章数据
    const articles = await articleDaoDto.getRandItems();
  

    // 取随机3个关键词  和随机一条文章
    let kws1 = await randomKey(path.join(assetsDir, keywords.path))
    let kws2 = await randomKey(path.join(assetsDir, keywords.path))
    let kws3 = awai111t randomKey(path.join(assetsDir, keywords.path))
    console.log('当前使用关键词: ', kws1, kws2, kws3);
    let kws = `${kws1},${kws2},${kws3}`
    let article1 = await randomKey(path.join(assetsDir, articles.path))
    console.log('当前使用文章: ', article1);

    kws = kws.replace(/<\/?.+?>/g,""); 
    kws = kws.replace(/[\r\n]/g, "");

    // 模板替换
    let d = fs.readFileSync(randomTplPath);
    const jq = cheerio.load(d);
    jq('title').html(`${kws1}_${kws2}_${kws3}`);
    jq('meta[name="keywords"]').attr('connent', `${kws}`);
    jq('meta[name="description"]').attr('connent', `${kws}-${article1}`);

    // 模板目录
    let tplTmppath = path.join(__dirname, '../../web/data/temp', tpls.name)
    fs.writeFileSync(tplTmppath, jq.html())
   
    let obj = {
      host,
      title: `${kws}`,
      keywords: `${kws}`,
      template: `${tpls.name}`,
      path: `${tplTmppath}`
    }
    await websiteDto.createItem(obj)
    ctx.body = jq.html();
  }
  // ctx.body = jq.html();
});

// 根据模板目录同步数据库
WebTplDaokDtoApi.post('/sync', async ctx => {
  // 模板目录
  let tplpath = path.join(__dirname, '../../web/template')
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
