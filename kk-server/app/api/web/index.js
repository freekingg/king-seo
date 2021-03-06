import { LinRouter, disableLoading, config } from 'lin-mizar';
import fs from 'fs-extra';
import path from 'path';
import { parse } from 'node-html-parser';

import { CreateOrUpdateTplValidator } from '../../validator/web/tpl';

import {
  getSafeParamId,
  isDirectory,
  randomKey,
  Unicode
} from '../../lib/util';
import { spider, isIp } from '../../lib/spider';

import { randomStr, randomName } from '../../lib/random';
import { WebTplDao } from '../../dao/web/tpl';
import { KeywordDao } from '../../dao/web/keyword';
import { WebsiteDao } from '../../dao/web/website';
import { ArticleDao } from '../../dao/web/article';
import { SubDao } from '../../dao/web/sub';
import { PostDao } from '../../dao/web/post';
import { DomainDao } from '../../dao/web/domain';
import { SpiderDao } from '../../dao/web/spider';

const WebTplDaokDtoApi = new LinRouter({
  module: '首页'
});

// dao 数据库访问层实例
const WebTplDaokDto = new WebTplDao();
const websiteDto = new WebsiteDao();
const keywordDaoDto = new KeywordDao();
const articleDaoDto = new ArticleDao();
const SubDaoDto = new SubDao();
const postDaoDto = new PostDao();
const domainDaoDto = new DomainDao();
const spiderDaoDto = new SpiderDao();

WebTplDaokDtoApi.use(async (ctx, next) => {
  // 蜘蛛日志
  spider(ctx.request.header).then(async (result) => {
    if (result) {
      let body = result;
      let hostSplit = result.host.split('.');
      let mainHost = hostSplit.length
        ? `${hostSplit[hostSplit.length - 2]}.${
          hostSplit[hostSplit.length - 1]
        }`
        : '';
      domainDaoDto.getItemByHost(mainHost).then((hostCategory) => {
        if (hostCategory) {
          body.category_id = hostCategory.web_category.id;
          body.category_title = hostCategory.web_category.title;
        }
        spiderDaoDto.createItem(body);
      });
    }
  });
  await next();
});

// 文章内页
WebTplDaokDtoApi.get('/article', async (ctx) => {
  let { request } = ctx;
  // console.log(ctx);
  let assetsDir = config.getItem('assetsDir');
  let host = request.host;
  if (isIp(host)) {
    return false;
  }
  let headerPath = ctx.request.header['x-special-proxy-header-path'];
  let postStr = headerPath.split('/');
  let lastStr = postStr[postStr.length - 1].split('.');
  let postid = lastStr[lastStr.length - 2];
  // 检查是否有缓存记录
  let post = await postDaoDto.getItem(postid);

  // 数据库获取一条随机关键词数据
  const keywords = await SubDaoDto.getRandItems();
  // 取随机关键词
  // let kwsArr1 = await randomKey(path.join(assetsDir, keywords.path), 20);
  let kwsArr = await randomKey(path.join(assetsDir, keywords.path), 20);
  // let kwsArr = kwsArr1.map((item) => Unicode(item));

  let links = [];
  for (let index = 0; index < 40; index++) {
    links.push(
      `http://${host}/a/${randomStr(4, 'numeric')}/${randomStr(
        5,
        'numeric'
      )}.html`
    );
  }

  // 当前域名分组
  let hostSplit = host.split('.');
  let mainHost = hostSplit.length
    ? `${hostSplit[hostSplit.length - 2]}.${hostSplit[hostSplit.length - 1]}`
    : '';

  let frendLinks = [];
  for (let index = 0; index < 3; index++) {
    frendLinks.push(`http://${randomStr()}.${mainHost}`);
  }

  if (!post) {
    // 数据库获取一条随机文章数据
    const articles = await articleDaoDto.getRandItems();
    let articleArr = await randomKey(path.join(assetsDir, articles.path), 6);

    let kws = `${kwsArr[0]},${kwsArr[1]},${kwsArr[2]}`;
    let content = '';
    articleArr.map((item, index) => {
      content += `
          <div>
            <p>
              ${item}
            </p>
            <br />
          </div>
        `;
    });

    const hostCategory = await domainDaoDto.getItemByHost(mainHost);
    let category_id = hostCategory ? hostCategory.category_id : '';

    let obj = {
      host,
      title: `${kws}`,
      keywords: `${kws}`,
      description: `${kws}`,
      content: `${content}`,
      postid,
      path: `${headerPath}`,
      category_id: `${category_id}`
    };
    await postDaoDto.createItem(obj);
    await ctx.render('article1', { ...obj, kwsArr, links, frendLinks });
    return;
  }

  let obj = {
    host,
    title: post.title,
    keywords: post.keywords,
    description: post.description,
    content: post.content,
    kwsArr,
    links,
    frendLinks
  };

  await ctx.render('article1', obj);
});

// 主页面逻辑入口
WebTplDaokDtoApi.get(['/', '/proxy'], async (ctx) => {
  let { request } = ctx;
  // console.log('主页面逻辑入口: ', ctx);
  console.log('当前请求的域名:', request.host);
  let host = request.host;

  if (isIp(host)) return false;

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
      keywordsDom.setAttribute('content', `${asciiKey}-${article1[0]}`);
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

    // 当前域名分组
    let hostSplit = host.split('.');
    let mainHost = hostSplit.length
      ? `${hostSplit[hostSplit.length - 2]}.${hostSplit[hostSplit.length - 1]}`
      : '';
    const hostCategory = await domainDaoDto.getItemByHost(mainHost);
    // console.log('hostCategory: ', hostCategory.web_category);

    let category_id = hostCategory ? hostCategory.category_id : '';
    if (!hostCategory) {
      ctx.body = '<h3>★★★ 域名未绑定,快去绑定 ★★★</h3>';
      return;
    }

    // 全局js

    if (hostCategory.web_category.globalJs) {
      const globalJsDom = parse(hostCategory.web_category.globalJs);
      bodyDom.appendChild(globalJsDom);
    }

    // h标签
    let htagLink = hostCategory.web_category.htagLink;
    if (htagLink && htagLink != 1) {
      let h1s = root.querySelectorAll('h2');
      let h2s = root.querySelectorAll('h3');
      let h3s = root.querySelectorAll('h4');

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
          )}/${randomStr(4, 'numeric')}.html">${Unicode(kwsArr[0])}</a>`;
          const aLinkDom = parse(str);
          item.set_content('');
          item.appendChild(aLinkDom);
        });
        h2s.map((item) => {
          let str = `<a href="http://${host}/a/${randomStr(
            4,
            'numeric'
          )}/${randomStr(4, 'numeric')}.html">${Unicode(kwsArr[1])}</a>`;
          const aLinkDom = parse(str);
          item.set_content('');
          item.appendChild(aLinkDom);
        });
        h3s.map((item) => {
          let str = `<a href="http://${host}/a/${randomStr(
            4,
            'numeric'
          )}/${randomStr(4, 'numeric')}.html">${Unicode(kwsArr[2])}</a>`;
          const aLinkDom = parse(str);
          item.set_content('');
          item.appendChild(aLinkDom);
        });
      }
    }

    // a标签
    let atagLink = hostCategory.web_category.atagLink;
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
          item.setAttribute('href', `http://${host}`);
        });
      }

      if (atagLink == 4) {
        as.map((item) => {
          item.set_content(Unicode(kwsArr[0]));
          item.setAttribute(
            'href',
            `http://${host}/a/${randomStr(4, 'numeric')}/${randomStr(
              4,
              'numeric'
            )}.html`
          );
        });
      }

      // 内页
      if (atagLink == 5) {
        as.map((item) => {
          item.setAttribute(
            'href',
            `http://${host}/a/${randomStr(4, 'numeric')}/${randomStr(
              4,
              'numeric'
            )}.html`
          );
        });
      }

      // 内页
      if (atagLink == 6) {
        as.map((item) => {
          item.setAttribute('href', `http://${host}/${randomStr()}`);
        });
      }
    }

    // 插入友情链接
    let friendLinkStr = `
    <ul style="display:flex;height:80px;align-items:center;list-style:none;justify-content:center;position: relative;z-index:888">
      <li style="padding:0 2px;"><a href="http://news.baidu.com/">百度新闻</a></li>
      <li style="padding:0 2px;"><a href="http://${randomName()}.${mainHost}">${Unicode(
  kwsArr[3]
)}</a></li>
      <li style="padding:0 2px;"><a href="https://www.sina.com.cn/">新浪网</a></li>
      <li style="padding:0 2px;"><a href="http://${randomName()}.${mainHost}">${Unicode(
  kwsArr[4]
)}</a></li>
      <li style="padding:0 2px;"><a href="https://www.sohu.com/">搜狐网</a></li>
      <li style="padding:0 2px;"><a href="http://${randomName()}.${mainHost}">${Unicode(
  kwsArr[5]
)}</a></li>
      <li style="padding:0 2px;"><a href="https://www.zhihu.com/">知乎</a></li>
    </ul>
    `;

    const friendLinkDom = parse(friendLinkStr);
    bodyDom.appendChild(friendLinkDom);

    // 模板目录  ---  写入
    let tplTmppath = path.join(tempDir, tpls.name);
    fs.writeFileSync(tplTmppath, root.toString());

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
