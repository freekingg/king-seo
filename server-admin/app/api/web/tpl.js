import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import fs from 'fs-extra';
import path from 'path';

import {
  TplSearchValidator,
  CreateOrUpdateTplValidator
} from '../../validator/web/tpl';
import { PositiveIdValidator } from '../../validator/common';

import { getSafeParamId, isHtml } from '../../lib/util';
import { BookNotFound } from '../../lib/exception';
import { WebTplDao } from '../../dao/web/tpl';

const WebTplDaokDtoApi = new LinRouter({
  prefix: '/web/tpl',
  module: '模板'
});

// book 的dao 数据库访问层实例
const WebTplDaokDto = new WebTplDao();

WebTplDaokDtoApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const book = await WebTplDaokDto.getItem(id);
  if (!book) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(book);
});

WebTplDaokDtoApi.get('/', async ctx => {
  const v = await new TplSearchValidator().validate(ctx);
  const accounts = await WebTplDaokDto.getItems(v);
  ctx.json(accounts);
});

// 根据模板目录同步数据库
WebTplDaokDtoApi.post('/sync', async ctx => {
  // 模板目录
  let tplpath = path.join(__dirname, '../../../web/template/index')
  console.log('tplpath: ', tplpath);
  // 获取目录所有html文件并写入数据库
  let dirs = fs.readdirSync(tplpath);
  let tplDirs = [];
  for (const iterator of dirs) {
    let curpath = path.join(tplpath, iterator)
    if (isHtml(curpath)) {
      tplDirs.push({
        name: iterator,
        path: curpath
      })
    }
  }

  await Promise.all(tplDirs.map(async (item) => {
    await WebTplDaokDto.syncTpl(item);
  }));

  ctx.success({
    code: 2
  });
});

WebTplDaokDtoApi.get('/search/one', async ctx => {
  const v = await new TplSearchValidator().validate(ctx);
  const book = await WebTplDaokDto.getBookByKeyword(v.get('query.q'));
  if (!book) {
    throw new BookNotFound();
  }
  ctx.json(book);
});

WebTplDaokDtoApi.post('/', async ctx => {
  const v = await new CreateOrUpdateTplValidator().validate(ctx);
  await WebTplDaokDto.createItem(v);
  ctx.success({
    code: 12
  });
});

WebTplDaokDtoApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateTplValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await WebTplDaokDto.updateItem(v, id);
  ctx.success({
    code: 13
  });
});

module.exports = { WebTplDaokDtoApi, [disableLoading]: false };
