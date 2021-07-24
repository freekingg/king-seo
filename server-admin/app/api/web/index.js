import { LinRouter, disableLoading, config } from 'lin-mizar';
import fs from 'fs-extra';
import path from 'path';
import { parse } from 'node-html-parser';

import {
  TplSearchValidator,
  CreateOrUpdateTplValidator
} from '../../validator/web/tpl';

import {
  getSafeParamId,
  isDirectory,
  randomKey,
  Unicode
} from '../../lib/util';

import randomStr from '../../lib/random';
import { WebTplDao } from '../../dao/web/tpl';
import { KeywordDao } from '../../dao/web/keyword';
import { WebsiteDao } from '../../dao/web/website';
import { ArticleDao } from '../../dao/web/article';
import { DomainDao } from '../../dao/web/domain';

const WebTplDaokDtoApi = new LinRouter({
  module: '首页'
});

// dao 数据库访问层实例
const WebTplDaokDto = new WebTplDao();
const websiteDto = new WebsiteDao();
const keywordDaoDto = new KeywordDao();
const articleDaoDto = new ArticleDao();
const domainDaoDto = new DomainDao();

WebTplDaokDtoApi.use(async (ctx, next) => {
  console.log('all', ctx);
  await next();
});

// 文章内页
WebTplDaokDtoApi.get('/article', async (ctx) => {
  // 数据库获取一条随机关键词数据
  // const keywords = await keywordDaoDto.getRandItems();
  console.log('article页面');

  await ctx.render('article1', {
    titles: 'sfad'
  });
});

// 主页面逻辑入口
WebTplDaokDtoApi.get(['/', '/proxy'], async (ctx) => {
  let { request, url } = ctx;
  let host = request.host;
  let referer = ctx.request.header.referer;
  console.log('主页面', ctx);
  // if (url === "/proxy" && referer) {
  //   let r = new URL(referer);
  //   host = r.host;
  // }

  console.log('当前请求的域名:', host);

  let assetsDir = config.getItem('assetsDir');
  let templateDir = config.getItem('templateDir');
  let tempDir = config.getItem('tempDir');

  // 检查是否有缓存记录
  let site = await websiteDto.getItem(host);
  if (!site) {
    // 第一次请求 处理逻辑
    // 获取随机模板
    const tpls = await WebTplDaokDto.getRandItems();
    if (!tpls) {
      ctx.body = '<h3>★★★ 快去上传模板 ★★★</h3>';
      return;
    }
    let randomTplPath = path.join(templateDir, tpls.path);

    // 当前域名分组
    const hostCategory = await domainDaoDto.getItemByHost(host);
    // console.log("hostCategory: ", hostCategory);

    // 数据库获取一条随机关键词数据
    const keywords = await keywordDaoDto.getRandItems();
    if (!keywords) {
      ctx.body = '<h3>★★★ 快去上传关键词 ★★★</h3>';
      return;
    }

    // 数据库获取一条随机文章数据
    const articles = await articleDaoDto.getRandItems();
    if (!articles) {
      ctx.body = '<h3>★★★ 快去上传文章 ★★★</h3>';
      return;
    }

    // 取随机6个关键词  和随机一条文章
    let kwsArr = await randomKey(path.join(assetsDir, keywords.path), 6);
    if (kwsArr.length < 6) {
      ctx.body = '<h3>★★★ 关键词太少,请添加关键词 ★★★</h3>';
      return;
    }
    let kws = `${kwsArr[0]},${kwsArr[1]},${kwsArr[2]}`;
    let article1 = await randomKey(path.join(assetsDir, articles.path));

    // 模板替换
    let d = fs.readFileSync(randomTplPath);
    const root = parse(d);
    let asciiKey = Unicode(`${kws}`);
    let headDom = root.querySelector('head');
    let bodyDom = root.querySelector('body');
    let titleDom = root.querySelector('title');
    if (titleDom) {
      titleDom.set_content(`${asciiKey}`);
    } else {
      const newTitleDom = parse(`<title>${asciiKey}</title>`);
      headDom.appendChild(newTitleDom);
    }

    let keywordsDom = root.querySelector('meta[name="description"]');
    if (keywordsDom) {
      keywordsDom.setAttribute('content', `${asciiKey}-${article1}`);
    } else {
      const newKeywordsDom = parse(
        `<meta name="keywords" content="${asciiKey}">`
      );
      headDom.appendChild(newKeywordsDom);
    }

    let descriptionDom = root.querySelector('meta[name="description"]');
    if (descriptionDom) {
      descriptionDom.setAttribute('content', `${asciiKey}-${article1}`);
    } else {
      const newDescriptionDom = parse(
        `<meta name="description" content="${asciiKey}-${article1}">`
      );
      headDom.appendChild(newDescriptionDom);
    }

    // 模板目录
    let tplTmppath = path.join(tempDir, tpls.name);
    fs.writeFileSync(tplTmppath, root.toString());
    let category_id = hostCategory ? hostCategory.category_id : '';
    if (!hostCategory) {
      ctx.body = '<h3>★★★ 域名未绑定,快去绑定 ★★★</h3>';
      return;
    }

    // 全局js
    if (hostCategory.category.globalJs) {
      const globalJsDom = parse(hostCategory.category.globalJs);
      bodyDom.appendChild(globalJsDom);
    }

    // h标签
    let htagLink = hostCategory.category.htagLink;
    if (htagLink && htagLink != 1) {
      let h1s = root.querySelectorAll('h1');
      let h2s = root.querySelectorAll('h2');
      let h3s = root.querySelectorAll('h3');

      if (htagLink == 2) {
        h1s.map((item) => {
          item.set_content(Unicode(kwsArr[0]));
        });
        h2s.map((item) => {
          item.set_content(Unicode(kwsArr[1]));
        });
        h3s.map((item) => {
          item.set_content(Unicode(kwsArr[2]));
        });
      }

      if (htagLink == 3) {
        h1s.map((item) => {
          let str = `<a href="http://${host}">${Unicode(kwsArr[0])}</a>`;
          const aLinkDom = parse(str);
          item.set_content('');
          item.appendChild(aLinkDom);
        });
        h2s.map((item) => {
          let str = `<a href="http://${host}">${Unicode(kwsArr[1])}</a>`;
          const aLinkDom = parse(str);
          item.set_content('');
          item.appendChild(aLinkDom);
        });
        h3s.map((item) => {
          let str = `<a href="http://${host}">${Unicode(kwsArr[2])}</a>`;
          const aLinkDom = parse(str);
          item.set_content('');
          item.appendChild(aLinkDom);
        });
      }

      if (htagLink == 4) {
        h1s.map((item) => {
          let str = `<a href="http://${host}/a/${randomStr(
            4,
            'numeric'
          )}/${randomStr(3, 'numeric')}.html">${Unicode(kwsArr[0])}</a>`;
          const aLinkDom = parse(str);
          item.set_content('');
          item.appendChild(aLinkDom);
        });
        h2s.map((item) => {
          let str = `<a href="http://${host}/a/${randomStr(
            4,
            'numeric'
          )}/${randomStr(3, 'numeric')}.html">${Unicode(kwsArr[1])}</a>`;
          const aLinkDom = parse(str);
          item.set_content('');
          item.appendChild(aLinkDom);
        });
        h3s.map((item) => {
          let str = `<a href="http://${host}/a/${randomStr(
            4,
            'numeric'
          )}/${randomStr(3, 'numeric')}.html">${Unicode(kwsArr[2])}</a>`;
          const aLinkDom = parse(str);
          item.set_content('');
          item.appendChild(aLinkDom);
        });
      }
    }

    // h标签
    let atagLink = hostCategory.category.atagLink;
    if (atagLink && atagLink != 1) {
      let as = root.querySelectorAll('a');

      if (atagLink == 2) {
        as.map((item) => {
          item.set_content(Unicode(kwsArr[0]));
          item.setAttribute('href', '#');
        });
      }

      if (atagLink == 3) {
        as.map((item) => {
          item.set_content(Unicode(kwsArr[0]));
          item.setAttribute('href', `http://${randomStr()}.${host}`);
        });
      }

      if (atagLink == 4) {
        as.map((item) => {
          item.set_content(Unicode(kwsArr[0]));
          item.setAttribute(
            'href',
            `http://${randomStr()}.${host}/a/${randomStr(
              4,
              'numeric'
            )}/${randomStr(3, 'numeric')}.html`
          );
        });
      }
    }

    // 插入友情链接
    let friendLinkStr = `
    <ul style="display:flex;list-style:none;justify-content:center;position: relative;z-index:888">
      <li style="padding:0 2px;"><a href="http://news.baidu.com/">百度新闻</a></li>
      <li style="padding:0 2px;"><a href="http://${randomStr()}.${host}">${Unicode(
  kwsArr[3]
)}</a></li>
      <li style="padding:0 2px;"><a href="https://www.sina.com.cn/">新浪网</a></li>
      <li style="padding:0 2px;"><a href="http://${randomStr()}.${host}">${Unicode(
  kwsArr[4]
)}</a></li>
      <li style="padding:0 2px;"><a href="https://www.sohu.com/">搜狐网</a></li>
      <li style="padding:0 2px;"><a href="http://${randomStr()}.${host}">${Unicode(
  kwsArr[5]
)}</a></li>
      <li style="padding:0 2px;"><a href="https://www.zhihu.com/">知乎</a></li>
    </ul>
    `;
    const friendLinkDom = parse(friendLinkStr);
    bodyDom.appendChild(friendLinkDom);

    let obj = {
      host,
      title: `${kws}`,
      keywords: `${kws}`,
      template: `${tpls.name}`,
      path: `${tpls.name}`,
      category_id: `${category_id}`
    };
    await websiteDto.createItem(obj);
    ctx.body = root.toString();
    return;
  }
  let d = fs.readFileSync(path.join(tempDir, site.path));
  console.log('直接读取', site.path);
  ctx.body = d.toString();
});

// 根据模板目录同步数据库
WebTplDaokDtoApi.post('/sync', async (ctx) => {
  // 模板目录
  let tplpath = path.join(__dirname, '../../../web/template/index');
  console.log('tplpath: ', tplpath);
  // 获取目录所有一级文件夹
  let dirs = fs.readdirSync(tplpath);
  let tplDirs = [];
  for (const iterator of dirs) {
    let curpath = path.join(tplpath, iterator);
    if (isDirectory(curpath)) {
      tplDirs.push({
        name: iterator,
        path: curpath
      });
    }
  }

  await Promise.all(
    tplDirs.map(async (item) => {
      await WebTplDaokDto.syncTpl(item);
    })
  );

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

WebTplDaokDtoApi.post('/', async (ctx) => {
  const v = await new CreateOrUpdateTplValidator().validate(ctx);
  await WebTplDaokDto.createItem(v);
  ctx.success({
    code: 12
  });
});

WebTplDaokDtoApi.put('/:id', async (ctx) => {
  const v = await new CreateOrUpdateTplValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await WebTplDaokDto.updateBook(v, id);
  ctx.success({
    code: 13
  });
});

module.exports = { WebTplDaokDtoApi, [disableLoading]: false };
