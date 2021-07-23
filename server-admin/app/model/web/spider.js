import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';
import { Category as CategoryModals } from './category';

class Spider extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      host: this.host,
      category: this.category,
      category_id: this.category_id,
      summary: this.summary,
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
    title: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    ip: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    url: {
      type: Sequelize.STRING(200),
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
      tableName: 'spider',
      modelName: 'spider',
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

export { Spider };
