import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';
import { WebTpl } from '../../model/web/tpl';

class WebTplDao {
  async getItem (id) {
    const item = await WebTpl.findOne({
      where: {
        id
      }
    });
    return item;
  }

  async getItemByKeyword (q) {
    const item = await WebTpl.findOne({
      where: {
        name: {
          [Sequelize.Op.like]: `%${q}%`
        }
      }
    });
    return item;
  }

  async getItems (v) {
    const page = v.get('query.page');
    const limit = v.get('query.count');
    const name = v.get('query.name');
    const condition = {};
    const { rows, count } = await WebTpl.findAndCountAll({
      where: Object.assign({}, condition, {
        name: {
          [Sequelize.Op.like]: `%${name}%`
        }
      }),
      order: [['create_time', 'DESC']],
      offset: page * limit,
      limit: limit
    });
    return {
      list: rows,
      total: count
    };
  }

  async getAllItems () {
    const { rows, count } = await WebTpl.findAndCountAll({
      order: [['create_time', 'DESC']]
    });
    return {
      list: rows,
      total: count
    };
  }

  // 随机取一条数据
  async getRandItems () {
    const item = await WebTpl.findOne({
      order: [Sequelize.literal('rand()')]
    });
    return item;
  }

  async createItem (v) {
    const item = await WebTpl.findOne({
      where: {
        name: v.get('body.name')
      }
    });
    if (item) {
      throw new Forbidden({
        code: 10240
      });
    }
    const bk = new WebTpl();
    bk.name = v.get('body.name');
    bk.path = v.get('body.path');
    bk.summary = v.get('body.summary');
    await bk.save();
  }

  async syncTpl (data) {
    let { name, path } = data;
    const item = await WebTpl.findOne({
      where: {
        name: name
      }
    });
    if (item) {
      return true;
    }
    const bk = new WebTpl();
    bk.name = name;
    bk.path = path;
    await bk.save();
    return true;
  }

  async updateItem (v, id) {
    const item = await WebTpl.findByPk(id);
    if (!item) {
      throw new NotFound({
        code: 10022
      });
    }
    item.title = v.get('body.name');
    item.path = v.get('body.path');
    item.summary = v.get('body.summary');
    await item.save();
  }

  async deleteItem (id) {
    const item = await WebTpl.findOne({
      where: {
        id
      }
    });
    if (!item) {
      throw new NotFound({
        code: 10022
      });
    }
    item.destroy();
  }
}

export { WebTplDao };
