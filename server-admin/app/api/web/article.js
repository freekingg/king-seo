import { LinRouter, NotFound, disableLoading, config } from 'lin-mizar';
import { groupRequired, loginRequired } from '../../middleware/jwt';
import {
  ArticleSearchValidator,
  CreateOrUpdateArticleValidator
} from '../../validator/web/article';
import { PositiveIdValidator } from '../../validator/common';
import path from 'path';
import fs from 'fs-extra';
import { getSafeParamId, readLineFile } from '../../lib/util';
import { ArticleDao } from '../../dao/web/article';


// 实例
const articleApi = new LinRouter({
  prefix: '/web/article',
  module: '文章'
});

// 数据库访问层实例
const articleDto = new ArticleDao();

articleApi.get('/:id', loginRequired, async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await articleDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

articleApi.get('/', loginRequired, async ctx => {
  const items = await articleDto.getItems();
  ctx.json(items);
});

articleApi.get('/preview/data', loginRequired, async ctx => {
  const v = await new ArticleSearchValidator().validate(ctx);
  const _path = v.get('query.path')

  let assetsDir = config.getItem('assetsDir')
  let content = await readLineFile(path.join(assetsDir, _path), 200)
  if (!content) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json({ content });
});

articleApi.get('/search/one', loginRequired, async ctx => {
  const v = await new ArticleSearchValidator().validate(ctx);
  const item = await articleDto.getItemByKeyword(v.get('query.q'));
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

articleApi.get('/download/:id', async ctx => {
  const v = await new ArticleSearchValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await articleDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  let assetsDir = config.getItem('assetsDir')
  let dpath = path.join(assetsDir, item.path)
  let stream = fs.createReadStream(dpath);
  ctx.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename=${item.id}.txt`
  });
  ctx.body = stream;
});

articleApi.post('/', loginRequired, async ctx => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx);
  await articleDto.createItem(v);
  ctx.success({
    code: 0
  });
});

// 根据分组，添加域名
articleApi.post('/domains', loginRequired, async ctx => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx);
  let id = v.get('body.id');
  let url = v.get('body.url');

  // 将域名写入对应的txt本地文件
  let dir = path.join(__dirname, '../../../web/data/domains', `${id}.txt`);
  fs.writeFileSync(dir, url);
  ctx.success({
    code: 0
  });
});

// 获取分组绑定的域名
articleApi.get('/domains/:id', loginRequired, async ctx => {
  const v = await new ArticleSearchValidator().validate(ctx);
  const id = v.get('path.id');
  let dir = path.join(__dirname, '../../../web/data/domains', `${id}.txt`);
  let data = fs.readFileSync(dir)
  console.log('data', data.toString());
  if (!data) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.body = data.toString()
});

articleApi.put('/:id', loginRequired, async ctx => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await articleDto.updateItem(v, id);
  ctx.success({
    code: 13
  });
});

articleApi.linDelete(
  'deleteItem',
  '/:id',
  articleApi.permission('删除文章'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await articleDto.deleteItem(id);
    ctx.success({
      code: 14
    });
  }
);


module.exports = { articleApi, [disableLoading]: false };
