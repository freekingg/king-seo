import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';
import { Website } from '../../model/web/website';
import { Category as categoryModals } from '../../model/web/category';
import { set } from 'lodash';

class WebsiteDao {
  async getItem (host) {
    const item = await Website.findOne({
      where: {
        host
      }
    });
    return item;
  }

  async getItemByKeyword (q) {
    const item = await Website.findOne({
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
    const category_id = v.get('query.category_id') || '';
    const condition = {};
    v.get('query.category_id') && set(condition, 'category_id', v.get('query.category_id'));

    const { rows, count } = await Website.findAndCountAll({
      where: Object.assign({}, condition, {
        host: {
          [Sequelize.Op.like]: `%${host}%`
        }
      }),
      include: [
        {
          model: categoryModals,
          as: 'category'
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

  async createItem (data) {
    const item = await Website.findOne({
      where: {
        host: data.host
      }
    });
    if (item) {
      return false;
    }
    const bk = new Website();
    bk.host = data.host;
    bk.title = data.title;
    bk.category_id = data.category_id;
    bk.description = data.description;
    bk.keywords = data.keywords;
    bk.template = data.template;
    bk.path = data.path;
    await bk.save();
  }

  async updateItem (v, id) {
    const item = await Website.findByPk(id);
    if (!item) {
      throw new NotFound({
        code: 10022
      });
    }
    item.title = v.get('body.title');
    item.domain = v.get('body.domain');
    item.category_id = v.get('body.category_id');
    item.targetDomain = v.get('body.targetDomain');
    item.summary = v.get('body.summary');
    item.open = v.get('body.open');
    await item.save();
  }

  async deleteItem (id) {
    const item = await Website.findOne({
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

export { WebsiteDao };
