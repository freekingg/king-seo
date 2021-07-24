import { NotFound } from 'lin-mizar';
import Sequelize from 'sequelize';

import { Spider as Modals } from '../../model/web/spider';
import { Category as categoryModals } from '../../model/web/category';

class SpiderDao {
  async getItem (id) {
    const item = await Modals.findOne({
      where: {
        id
      },
      include: [
        {
          model: categoryModals,
          as: 'category'
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

  async getItems () {
    const { rows, count } = await Modals.findAndCountAll({
      include: [
        {
          model: categoryModals,
          as: 'category'
        }
      ]
    });
    return {
      list: rows,
      total: count
    };
  }

  async createItem (v) {
    const built = new Modals();
    built.name = v.get('body.name');
    built.ip = v.get('body.ip');
    built.path = v.get('body.path');
    built.category_id = v.get('body.category_id');
    built.country = v.get('body.country');
    built.type = v.get('body.type');
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
