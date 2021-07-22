import { InfoCrudMixin, config } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';
// import { Special as SpecialModals } from '../model/special';
// import { Category as CategoryModals } from '../model/category';

class Product extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      title: this.title,
      author: this.author,
      summary: this.summary,
      image: this.image,
      video: this.video,
      views: this.views,
      price: this.price,
      charge: this.charge,
      category_id: this.category_id,
      tagids: this.tagids,
      special_id: this.special_id,
      special: this.special,
      category: this.category,
      recommend: this.recommend,
      update_time: this.update_time
    };
    return origin;
  }
}

Product.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    author: {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: 'admin'
    },
    summary: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    image: {
      type: Sequelize.STRING(200),
      allowNull: true,
      get () {
        return config.getItem('siteDomain').replace(/\/+$/, '') + '/assets/' + this.getDataValue('image');
      }
    },
    video: {
      type: Sequelize.STRING(200),
      allowNull: true,
      get () {
        return config.getItem('siteDomain').replace(/\/+$/, '') + '/assets/' + this.getDataValue('video');
      }
    },
    views: {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: '326'
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    charge: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    category_id: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    tagids: {
      type: Sequelize.STRING(600),
      allowNull: true,
      get () {
        let value = this.getDataValue('tagids');
        return value ? value.split(',') : [];
      },
      set (val) {
        this.setDataValue('tagids', val.join());
      }
    },
    special_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    recommend: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }

  },
  merge(
    {
      sequelize,
      tableName: 'video',
      modelName: 'video',
      indexes: [
        {
          name: 'title_del',
          unique: true,
          fields: ['title', 'delete_time']
        },
        {
          name: 'category_del',
          unique: true,
          fields: ['category', 'delete_time']
        }
      ]
    },
    InfoCrudMixin.options
  )
);

// Product.belongsTo(SpecialModals, { foreignKey: 'special_id', targetKey: 'id' });
// Product.belongsTo(CategoryModals, { foreignKey: 'category_id', targetKey: 'id' });

export { Product };