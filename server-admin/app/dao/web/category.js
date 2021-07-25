import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';
import { Category as Modals } from '../../model/web/category';

class CategoryDao {
  async getItem (id) {
    const item = await Modals.findOne({
      where: {
        id
      }
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
    const { rows, count } = await Modals.findAndCountAll();
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
    item.globalJs = v.get('body.globalJs');
    item.cacheType = v.get('body.cacheType');
    item.htagLink = v.get('body.htagLink');
    item.atagLink = v.get('body.atagLink');
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

export { CategoryDao };
