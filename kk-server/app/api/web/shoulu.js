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
import { ShouluDao } from '../../dao/web/shoulu';

// 实例
const shouluApi = new LinRouter({
  prefix: '/web/shoulu',
  module: '收录'
});

// 数据库访问层实例
const shouluDto = new ShouluDao();

shouluApi.get('/:id', loginRequired, async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await shouluDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

shouluApi.get('/', loginRequired, async ctx => {
  const items = await shouluDto.getItems();
  ctx.json(items);
});

shouluApi.get('/search/one', loginRequired, async ctx => {
  const v = await new KeywordSearchValidator().validate(ctx);
  const _path = v.get('query.path');

  let assetsDir = config.getItem('assetsDir');
  let content = await readLineFile(path.join(assetsDir, _path), 200);
  if (!content) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json({ content });
});

shouluApi.get('/search/one', loginRequired, async ctx => {
  const v = await new KeywordSearchValidator().validate(ctx);
  const item = await shouluDto.getItemByKeyword(v.get('query.q'));
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

shouluApi.get('/download/:id', async ctx => {
  const v = await new KeywordSearchValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await shouluDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  let assetsDir = config.getItem('assetsDir');
  let dpath = path.join(assetsDir, item.path);
  let stream = fs.createReadStream(dpath);
  ctx.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename=${item.id}.txt`
  });
  ctx.body = stream;
});

shouluApi.post('/', loginRequired, async ctx => {
  const v = await new CreateOrUpdateKeywordValidator().validate(ctx);
  await shouluDto.createItem(v);
  ctx.success({
    code: 0
  });
});

// 根据分组，添加域名
shouluApi.post('/domains', loginRequired, async ctx => {
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
shouluApi.get('/domains/:id', loginRequired, async ctx => {
  const v = await new KeywordSearchValidator().validate(ctx);
  const id = v.get('path.id');
  let dir = path.join(__dirname, '../../../web/data/domains', `${id}.txt`);
  let data = fs.readFileSync(dir);
  console.log('data', data.toString());
  if (!data) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.body = data.toString();
});

shouluApi.put('/:id', loginRequired, async ctx => {
  const v = await new CreateOrUpdateKeywordValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await shouluDto.updateItem(v, id);
  ctx.success({
    code: 13
  });
});

shouluApi.linDelete(
  'deleteItem',
  '/:id',
  shouluApi.permission('删除关键词'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await shouluDto.deleteItem(id);
    ctx.success({
      code: 14
    });
  }
);

module.exports = { shouluApi, [disableLoading]: false };
