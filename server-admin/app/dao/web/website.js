import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';
import { Website } from '../../model/web/website';

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
    const title = v.get('query.title');
    const condition = {};

    const { rows, count } = await Website.findAndCountAll({
      where: Object.assign({}, condition, {
        title: {
          [Sequelize.Op.like]: `%${title}%`
        }
      }),
      // include: [
      //   {
      //     model: categoryModals,
      //     as: 'category'
      //   }
      // ],
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
