import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';

import { Domain as Modals } from '../../model/web/domain';
import { Category as categoryModals } from '../../model/web/category';

class DomainDao {
  async getItem(id) {
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

  async getItemByKeyword(q) {
    const item = await Modals.findOne({
      where: {
        host: {
          [Sequelize.Op.like]: `%${q}%`
        }
      }
    });
    return item;
  }

  async getItems() {
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

  async createItem(v) {
    const item = await Modals.findOne({
      where: {
        host: v.get('body.host')
      }
    });
    if (item) {
      throw new Forbidden({
        code: 10240
      });
    }

    const built = new Modals();
    built.host = v.get('body.host');
    built.category_id = v.get('body.category_id');
    built.summary = v.get('body.summary');
    await built.save();
  }

  async updateItem(v, id) {
    const item = await Modals.findByPk(id);
    if (!item) {
      throw new NotFound({
        code: 10022
      });
    }
    item.host = v.get('body.host');
    item.category_id = v.get('body.category_id');
    item.summary = v.get('body.summary');
    await item.save();
  }

  async deleteItem(id) {
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

export { DomainDao };
