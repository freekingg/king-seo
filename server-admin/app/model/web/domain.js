import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';
import { Category as CategoryModals } from './category';

class Domain extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      domain: this.domain,
      category: this.category,
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
    domain: {
      type: Sequelize.STRING(50),
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
      tableName: 'domain',
      modelName: 'domain',
      indexes: [
        {
          name: 'domain_del',
          unique: true,
          fields: ['domain', 'delete_time']
        }
      ]
    },
    InfoCrudMixin.options
  )
);

Domain.belongsTo(CategoryModals, { foreignKey: 'category_id', targetKey: 'id' });
export { Domain };
