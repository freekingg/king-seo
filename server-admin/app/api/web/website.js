import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { groupRequired } from '../../middleware/jwt';
import {
  WebsiteSearchValidator,
  CreateOrUpdateWebsiteValidator
} from '../../validator/website';
import { PositiveIdValidator } from '../../validator/common';

import { getSafeParamId } from '../../lib/util';
import { ItemNotFound } from '../../lib/exception';
import { WebsiteDao } from '../../dao/web/website';

const websiteApi = new LinRouter({
  prefix: '/v1/website',
  module: '网站'
});

// account 的dao 数据库访问层实例
const websiteDto = new WebsiteDao();

websiteApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const account = await websiteDto.getItem(id);
  if (!account) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(account);
});

websiteApi.get('/', async ctx => {
  const v = await new WebsiteSearchValidator().validate(ctx);
  const accounts = await websiteDto.getItems(v);
  ctx.json(accounts);
});

websiteApi.get('/search/one', async ctx => {
  const v = await new WebsiteSearchValidator().validate(ctx);
  const account = await websiteDto.getItemByKeyword(v.get('query.q'));
  if (!account) {
    throw new ItemNotFound();
  }
  ctx.json(account);
});

websiteApi.post('/', async ctx => {
  const v = await new CreateOrUpdateWebsiteValidator().validate(ctx);
  await websiteDto.createItem(v);
  ctx.success({
    code: 12
  });
});

websiteApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateWebsiteValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await websiteDto.updateItem(v, id);
  ctx.success({
    code: 13
  });
});

websiteApi.linDelete(
  'deleteWebsite',
  '/:id',
  websiteApi.permission('删除网站'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await websiteDto.deleteItem(id);
    ctx.success({
      code: 14
    });
  }
);

module.exports = { websiteApi, [disableLoading]: false };
