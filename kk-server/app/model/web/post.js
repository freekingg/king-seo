import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';
import { Category as CategoryModals } from './category';

class Post extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      postid: this.postid,
      title: this.title,
      host: this.host,
      keywords: this.keywords,
      description: this.description,
      category: this.web_category,
      path: this.path,
      category_id: this.category_id,
      content: this.content,
      update_time: this.update_time
    };
    return origin;
  }
}

Post.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    postid: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    title: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    keywords: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    host: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    path: {
      type: Sequelize.STRING(280),
      allowNull: true
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'web_post',
      modelName: 'web_post',
      indexes: [
        {
          name: 'title_del',
          unique: true,
          fields: ['title', 'delete_time']
        }
      ]
    },
    InfoCrudMixin.options
  )
);

Post.belongsTo(CategoryModals, { foreignKey: 'category_id', targetKey: 'id' });
export { Post };
