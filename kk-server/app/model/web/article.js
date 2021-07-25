import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';
import { Category as CategoryModals } from './category';

class Article extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      title: this.title,
      category: this.web_category,
      path: this.path,
      category_id: this.category_id,
      summary: this.summary,
      update_time: this.update_time
    };
    return origin;
  }
}

Article.init(
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
    path: {
      type: Sequelize.STRING(280),
      allowNull: true
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
      tableName: 'web_article',
      modelName: 'web_article'
    },
    InfoCrudMixin.options
  )
);

Article.belongsTo(CategoryModals, { foreignKey: 'category_id', targetKey: 'id' });
export { Article };
