import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';

import { Shoulu as Modals } from '../../model/web/shoulu';
import { Category as categoryModals } from '../../model/web/category';

class ShouluDao {
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

  async getItemByHost (host) {
    const item = await Modals.findOne({
      where: {
        host
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

  async getCategoryItems (category_id) {
    const { rows, count } = await Modals.findAndCountAll({
      where: {
        category_id
      }
    });
    return {
      list: rows,
      total: count
    };
  }

  async getItems () {
    const { rows, count } = await Modals.findAndCountAll({
      include: [
        {
          model: categoryModals,
          as: 'web_category'
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
    built.host = v.get('body.host');
    built.category_id = v.get('body.category_id');
    built.total = v.get('body.total');
    await built.save();
  }

  async updateItem (v, id) {
    const item = await Modals.findByPk(id);
    if (!item) {
      throw new NotFound({
        code: 10022
      });
    }
    item.host = v.get('body.host');
    item.category_id = v.get('body.category_id');
    item.total = v.get('body.total');
    await item.save();
  }

  async deleteItem (host, category_id) {
    console.log(host, category_id);
    const item = await Modals.findOne({
      where: {
        host,
        category_id
      }
    });
    if (!item) {
      throw new NotFound({
        code: 10022
      });
    }
    item.destroy({ force: true });
  }
}

export { ShouluDao };
