import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { groupRequired } from '../../middleware/jwt';
import {
  CategorySearchValidator,
  CreateOrUpdateCategoryValidator,
  CreateOrUpdateCategoryDomainsValidator
} from '../../validator/web/category';
import { PositiveIdValidator } from '../../validator/common';
import path from 'path';
import fs from 'fs-extra';
import { getSafeParamId, isFileExisted } from '../../lib/util';
import { CategoryDao } from '../../dao/web/category';

// 实例
const categoryApi = new LinRouter({
  prefix: '/web/category',
  module: '分类'
});

// 数据库访问层实例
const categoryDto = new CategoryDao();

categoryApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await categoryDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

categoryApi.get('/', async ctx => {
  const items = await categoryDto.getItems();
  ctx.json(items);
});

categoryApi.get('/search/one', async ctx => {
  const v = await new CategorySearchValidator().validate(ctx);
  const item = await categoryDto.getItemByKeyword(v.get('query.q'));
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

categoryApi.post('/', async ctx => {
  const v = await new CreateOrUpdateCategoryValidator().validate(ctx);
  await categoryDto.createItem(v);
  ctx.success({
    code: 0
  });
});

// 根据分组，添加域名
categoryApi.post('/domains', async ctx => {
  const v = await new CreateOrUpdateCategoryDomainsValidator().validate(ctx);
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
categoryApi.get('/domains/:id', async ctx => {
  const v = await new CategorySearchValidator().validate(ctx);
  const id = v.get('path.id');
  let dir = path.join(__dirname, '../../../web/data/domains', `${id}.txt`);
  let isFileExit = await isFileExisted(dir);
  console.log('isFileExit: ', isFileExit);

  let data = ' ';
  if (isFileExit) {
    data = fs.readFileSync(dir).toString();
  }
  ctx.body = data;
});

categoryApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateCategoryValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await categoryDto.updateItem(v, id);
  ctx.success({
    code: 13
  });
});

categoryApi.linDelete(
  'deleteItem',
  '/:id',
  categoryApi.permission('删除分类'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await categoryDto.deleteItem(id);
    ctx.success({
      code: 14
    });
  }
);

module.exports = { categoryApi, [disableLoading]: false };
