import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';
import { Category as CategoryModals } from './category';

class Website extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      host: this.host,
      title: this.title,
      description: this.description,
      keywords: this.keywords,
      template: this.template,
      category: this.category,
      category_id: this.category_id,
      path: this.path,
      update_time: this.update_time
    };
    return origin;
  }
}

Website.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // 域名
    host: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    title: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    keywords: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    template: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    path: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'website',
      modelName: 'website',
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

Website.belongsTo(CategoryModals, { foreignKey: 'category_id', targetKey: 'id' });
export { Website };