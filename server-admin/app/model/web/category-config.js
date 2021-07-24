import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';

class CategoryConfig extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      title: this.title,
      summary: this.summary,
      update_time: this.update_time
    };
    return origin;
  }
}

CategoryConfig.init(
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
    // 全局js
    globalJs: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    summary: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'web_category_config',
      modelName: 'web_category_config'
    },
    InfoCrudMixin.options
  )
);

export { CategoryConfig };
