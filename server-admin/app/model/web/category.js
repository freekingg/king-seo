import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';

class Category extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      title: this.title,
      summary: this.summary,
      globalJs: this.globalJs,
      htagReplace: this.htagReplace,
      htagLink: this.htagLink,
      update_time: this.update_time
    };
    return origin;
  }
}

Category.init(
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
    htagReplace: {
      type: Sequelize.BOOLEAN,
      comment: '0：关闭 1：开启',
      defaultValue: 0
    },
    htagLink: {
      type: Sequelize.BOOLEAN,
      comment: '0：关闭 1：开启',
      defaultValue: 0
    },
    summary: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'category',
      modelName: 'category'
    },
    InfoCrudMixin.options
  )
);

export { Category };
