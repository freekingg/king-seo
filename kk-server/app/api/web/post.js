import { LinRouter, NotFound, disableLoading, config } from 'lin-mizar';
import { groupRequired, loginRequired } from '../../middleware/jwt';
import {
  PostSearchValidator,
  CreateOrUpdatePostValidator
} from '../../validator/web/post';
import { PositiveIdValidator } from '../../validator/common';
import path from 'path';
import { getSafeParamId, readLineFile } from '../../lib/util';
import { PostDao } from '../../dao/web/post';

// 实例
const postApi = new LinRouter({
  prefix: '/web/post',
  module: '文章详情'
});

// 数据库访问层实例
const postDto = new PostDao();

postApi.get('/:id', loginRequired, async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await postDto.getItem(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

postApi.get('/', loginRequired, async ctx => {
  const v = await new PostSearchValidator().validate(ctx);
  const items = await postDto.getItems(v);
  ctx.json(items);
});

postApi.get('/preview/data', loginRequired, async ctx => {
  const v = await new PostSearchValidator().validate(ctx);
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

postApi.get('/search/one', loginRequired, async ctx => {
  const v = await new PostSearchValidator().validate(ctx);
  const item = await postDto.getItemByKeyword(v.get('query.q'));
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

postApi.get('/download/:id', async ctx => {
  const v = await new PostSearchValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await postDto.getItem(id);
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

postApi.post('/', loginRequired, async ctx => {
  const v = await new CreateOrUpdatePostValidator().validate(ctx);
  await postDto.createItem(v);
  ctx.success({
    code: 0
  });
});

postApi.put('/:id', loginRequired, async ctx => {
  const v = await new CreateOrUpdatePostValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await postDto.updateItem(v, id);
  ctx.success({
    code: 13
  });
});

postApi.linDelete(
  'deleteItem',
  '/:id',
  postApi.permission('删除文章详情'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await postDto.deleteItem(id);
    ctx.success({
      code: 14
    });
  }
);

module.exports = { postApi, [disableLoading]: false };
