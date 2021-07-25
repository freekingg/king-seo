import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';
import { Category as CategoryModals } from './category';

class Domain extends Model {
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

Domain.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    host: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: false
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    summary: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'web_domain',
      modelName: 'web_domain',
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

Domain.belongsTo(CategoryModals, { foreignKey: 'category_id', targetKey: 'id' });
export { Domain };
