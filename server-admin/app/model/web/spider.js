import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';
import { Category as CategoryModals } from './category';

class Spider extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      name: this.name,
      ip: this.ip,
      category: this.category,
      category_id: this.category_id,
      path: this.path,
      country: this.country,
      update_time: this.update_time
    };
    return origin;
  }
}

Spider.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    ip: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    path: {
      type: Sequelize.STRING(280),
      allowNull: true
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    country: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    type: {
      type: Sequelize.STRING(20),
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'web_spider',
      modelName: 'web_spider',
      indexes: [
        {
          name: 'name_del',
          unique: true,
          fields: ['name', 'delete_time']
        }
      ]
    },
    InfoCrudMixin.options
  )
);

Spider.belongsTo(CategoryModals, {
  foreignKey: 'category_id',
  targetKey: 'id'
});

export { Spider };
