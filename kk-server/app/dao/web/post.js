import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';
import { set } from 'lodash';

import { Post as Modals } from '../../model/web/post';
import { Category as categoryModals } from '../../model/web/category';

class PostDao {
  async getItem (postId) {
    const item = await Modals.findOne({
      where: {
        postId
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
      offset: page * limit
    });
    return {
      list: rows,
      total: count
    };
  }

  async createItem (data) {
    const built = new Modals();
    built.title = data.title;
    built.keywords = data.keywords;
    built.postid = data.postid;
    built.description = data.description;
    built.host = data.host;
    built.path = data.path;
    built.category_id = data.category_id;
    built.content = data.content;
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

export { PostDao };
