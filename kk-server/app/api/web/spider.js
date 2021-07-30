import { LinRouter, NotFound, disableLoading, config } from 'lin-mizar';
import { groupRequired, loginRequired } from '../../middleware/jwt';
import {
  SpiderSearchValidator,
  CreateOrUpdateSpiderValidator
} from '../../validator/web/spider';
import { PositiveIdValidator } from '../../validator/common';

import { getSafeParamId } from '../../lib/util';
import { SpiderDao } from '../../dao/web/spider';

// 实例
const SpiderApi = new LinRouter({
  prefix: '/web/spider',
  module: '蜘蛛'
});

// 数据库访问层实例
const spiderDto = new SpiderDao();

SpiderApi.get('/:id', loginRequired, async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await spiderDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

SpiderApi.get('/statistics/tongji', async (ctx) => {
  const v = await new SpiderSearchValidator().validate(ctx);
  const items = await spiderDto.getTongji(v);
  ctx.json(items);
});

SpiderApi.get('/', loginRequired, async ctx => {
  const v = await new SpiderSearchValidator().validate(ctx);
  const items = await spiderDto.getItems(v);
  ctx.json(items);
});

SpiderApi.get('/search/one', loginRequired, async ctx => {
  const v = await new SpiderSearchValidator().validate(ctx);
  const item = await spiderDto.getItemByKeyword(v.get('query.q'));
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

SpiderApi.post('/', loginRequired, async ctx => {
  const v = await new CreateOrUpdateSpiderValidator().validate(ctx);
  await spiderDto.createItem(v);
  ctx.success({
    code: 0
  });
});

SpiderApi.put('/:id', loginRequired, async ctx => {
  const v = await new CreateOrUpdateSpiderValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await spiderDto.updateItem(v, id);
  ctx.success({
    code: 13
  });
});

SpiderApi.linDelete(
  'deleteItem',
  '/:id',
  SpiderApi.permission('删除蜘蛛'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await spiderDto.deleteItem(id);
    ctx.success({
      code: 14
    });
  }
);

module.exports = { SpiderApi, [disableLoading]: false };
