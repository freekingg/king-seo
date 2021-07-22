import { LinRouter, NotFound, disableLoading, config } from 'lin-mizar';
import { groupRequired, loginRequired } from '../../middleware/jwt';
import {
  KeywordSearchValidator,
  CreateOrUpdateKeywordValidator
} from '../../validator/web/keyword';
import { PositiveIdValidator } from '../../validator/common';
import path from 'path';
import fs from 'fs-extra';

import { getSafeParamId, readLineFile } from '../../lib/util';
import { KeywordDao } from '../../dao/web/keyword';

// 实例
const keywordApi = new LinRouter({
  prefix: '/web/keyword',
  module: '关键词'
});

// 数据库访问层实例
const keywordDto = new KeywordDao();

keywordApi.get('/:id', loginRequired, async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await keywordDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

keywordApi.get('/', loginRequired, async ctx => {
  const items = await keywordDto.getItems();
  ctx.json(items);
});

keywordApi.get('/preview/data', loginRequired, async ctx => {
  const v = await new KeywordSearchValidator().validate(ctx);
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

keywordApi.get('/search/one', loginRequired, async ctx => {
  const v = await new KeywordSearchValidator().validate(ctx);
  const item = await keywordDto.getItemByKeyword(v.get('query.q'));
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

keywordApi.get('/download/:id', async ctx => {
  const v = await new KeywordSearchValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await keywordDto.getItem(id);
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

keywordApi.post('/', loginRequired, async ctx => {
  const v = await new CreateOrUpdateKeywordValidator().validate(ctx);
  await keywordDto.createItem(v);
  ctx.success({
    code: 0
  });
});

// 根据分组，添加域名
keywordApi.post('/domains', loginRequired, async ctx => {
  const v = await new CreateOrUpdateKeywordValidator().validate(ctx);
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
keywordApi.get('/domains/:id', loginRequired, async ctx => {
  const v = await new KeywordSearchValidator().validate(ctx);
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

keywordApi.put('/:id', loginRequired, async ctx => {
  const v = await new CreateOrUpdateKeywordValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await keywordDto.updateItem(v, id);
  ctx.success({
    code: 13
  });
});

keywordApi.linDelete(
  'deleteItem',
  '/:id',
  keywordApi.permission('删除关键词'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await keywordDto.deleteItem(id);
    ctx.success({
      code: 14
    });
  }
);


module.exports = { keywordApi, [disableLoading]: false };
