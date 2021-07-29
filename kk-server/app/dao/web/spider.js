import { NotFound } from 'lin-mizar';
import Sequelize from 'sequelize';

import { Spider as Modals } from '../../model/web/spider';
import { Category as categoryModals } from '../../model/web/category';
import { set } from 'lodash';
class SpiderDao {
  async getItem (id) {
    const item = await Modals.findOne({
      where: {
        id
      },
      include: [
        {
          model: categoryModals,
          as: 'web_category'
        }
      ]
    });
    return item;
  }

  // 随机取一条数据
  async getRandItems () {
    const item = await Modals.findOne({
      order: [Sequelize.literal('rand()')]
    });
    return item;
  }

  async getItemByKeyword (q) {
    const item = await Modals.findOne({
      where: {
        title: {
          [Sequelize.Op.like]: `%${q}%`
        }
      }
    });
    return item;
  }

  async getItems (v) {
    const page = v.get('query.page');
    const limit = v.get('query.count');
    const host = v.get('query.host') || '';
    const condition = {};
    v.get('query.category_id') &&
      set(condition, 'category_id', v.get('query.category_id'));
    console.log('condition', condition);
    const { rows, count } = await Modals.findAndCountAll({
      where: Object.assign({}, condition, {
        host: {
          [Sequelize.Op.like]: `%${host}%`
        }
      }),
      include: [
        {
          model: categoryModals,
          as: 'web_category'
        }
      ],

      order: [['create_time', 'DESC']],
      offset: page * limit,
      limit: limit
    });
    return {
      list: rows,
      total: count
    };
  }

  async getTongji (v) {
    const { rows, count } = await Modals.findAndCountAll({
      group: [Sequelize.fn('date_format', Sequelize.col('create_time'), '%Y-%m-%d')]
      // attributes: [
      // [Sequelize.fn('date_format', Sequelize.col('create_time'), '%Y-%m-%d')]
      // [Sequelize.literal('COUNT(*)'), 'count']
      // ]
      // group: ['create_time']
    });
    return {
      list: rows,
      total: count
    };
  }

  async createItem (body) {
    const built = new Modals();
    built.name = body.name;
    built.ip = body.ip;
    built.path = body.path;
    built.host = body.host;
    built.category_id = body.category_id;
    built.category_title = body.category_title;
    built.country = body.country;
    built.type = body.type;
    await built.save();
  }

  async updateItem (v, id) {
    const item = await Modals.findByPk(id);
    if (!item) {
      throw new NotFound({
        code: 10022
      });
    }
    item.title = v.get('body.title');
    item.path = v.get('body.path');
    item.template = v.get('body.template');
    item.category_id = v.get('body.category_id');
    item.summary = v.get('body.summary');
    await item.save();
  }

  async deleteItem (id) {
    const item = await Modals.findOne({
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

export { SpiderDao };
