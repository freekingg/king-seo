import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';

import { Article as Modals } from '../../model/web/article';
import { Category as categoryModals } from '../../model/web/category';

class ArticleDao {
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
    const item = await Modals.findOne({
      where: {
        title: v.get('body.title')
      }
    });
    if (item) {
      throw new Forbidden({
        code: 10240
      });
    }

    const built = new Modals();
    built.title = v.get('body.title');
    built.path = v.get('body.path');
    built.category_id = v.get('body.category_id');
    built.summary = v.get('body.summary');
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

export { ArticleDao };
