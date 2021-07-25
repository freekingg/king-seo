import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../../lib/db';

class WebTpl extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      name: this.name,
      path: this.path,
      summary: this.summary,
      update_time: this.update_time
    };
    return origin;
  }
}

WebTpl.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // 名称
    name: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    // 路径
    path: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    // 备注
    summary: {
      type: Sequelize.STRING(1000),
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'web_tpl',
      modelName: 'web_tpl',
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

export { WebTpl };