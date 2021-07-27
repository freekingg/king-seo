import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';
import { Category as CategoryModals } from './category';

class Shoulu extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      host: this.host,
      category: this.web_category,
      category_id: this.category_id,
      summary: this.summary,
      update_time: this.update_time
    };
    return origin;
  }
}

Shoulu.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    host: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    total: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  merge(
    {
      sequelize,
      tableName: 'web_shoulu',
      modelName: 'web_shoulu',
      indexes: [
        {
          name: 'host_del',
          unique: true,
          fields: ['host', 'delete_time']
        }
      ]
    },
    InfoCrudMixin.options
  )
);

Shoulu.belongsTo(CategoryModals, {
  foreignKey: 'category_id',
  targetKey: 'id'
});
export { Shoulu };
