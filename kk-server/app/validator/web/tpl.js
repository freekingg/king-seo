import { LinValidator, Rule } from 'lin-mizar';
import { PaginateValidator } from '../common';

class TplSearchValidator extends PaginateValidator {
  constructor () {
    super();
    this.name = new Rule('isOptional', '必须传入搜索关键字', '');
  }
}

class CreateOrUpdateTplValidator extends LinValidator {
  constructor () {
    super();
    this.name = new Rule('isNotEmpty', '必须传入名称');
    this.path = new Rule('isNotEmpty', '必须传入路径');
  }
}

export { CreateOrUpdateTplValidator, TplSearchValidator };
