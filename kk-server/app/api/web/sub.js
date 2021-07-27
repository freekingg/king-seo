import { LinRouter, NotFound, disableLoading, config } from 'lin-mizar';
import { groupRequired, loginRequired } from '../../middleware/jwt';
import {
  SubSearchValidator,
  CreateOrUpdateSubValidator
} from '../../validator/web/sub';
import { PositiveIdValidator } from '../../validator/common';
import path from 'path';
import fs from 'fs-extra';
import { getSafeParamId, readLineFile } from '../../lib/util';
import { SubDao } from '../../dao/web/sub';

// 实例
const subApi = new LinRouter({
  prefix: '/web/sub',
  module: '内页'
});

// 数据库访问层实例
const subDto = new SubDao();

subApi.get('/:id', loginRequired, async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await subDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

subApi.get('/', loginRequired, async ctx => {
  const items = await subDto.getItems();
  ctx.json(items);
});

subApi.get('/preview/data', loginRequired, async ctx => {
  const v = await new SubSearchValidator().validate(ctx);
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

subApi.get('/search/one', loginRequired, async ctx => {
  const v = await new SubSearchValidator().validate(ctx);
  const item = await subDto.getItemByKeyword(v.get('query.q'));
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

subApi.get('/download/:id', async ctx => {
  const v = await new SubSearchValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await subDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  let assetsDir = config.getItem('assetsDir');
  let dpath = path.join(assetsDir, item.path);
  console.log('dpath: ', dpath);
  let stream = fs.createReadStream(dpath);
  ctx.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename=${item.id}.txt`
  });
  ctx.body = stream;
});

subApi.post('/', loginRequired, async ctx => {
  const v = await new CreateOrUpdateSubValidator().validate(ctx);
  await subDto.createItem(v);
  ctx.success({
    code: 0
  });
});

// 根据分组，添加域名
subApi.post('/domains', loginRequired, async ctx => {
  const v = await new CreateOrUpdateSubValidator().validate(ctx);
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
subApi.get('/domains/:id', loginRequired, async ctx => {
  const v = await new SubSearchValidator().validate(ctx);
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

subApi.put('/:id', loginRequired, async ctx => {
  const v = await new CreateOrUpdateSubValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await subDto.updateItem(v, id);
  ctx.success({
    code: 13
  });
});

subApi.linDelete(
  'deleteItem',
  '/:id',
  subApi.permission('删除文章'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await subDto.deleteItem(id);
    ctx.success({
      code: 14
    });
  }
);

module.exports = { subApi, [disableLoading]: false };
