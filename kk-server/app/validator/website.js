import { LinValidator, Rule } from 'lin-mizar';
import { PaginateValidator } from './common';

class WebsiteSearchValidator extends PaginateValidator {
  constructor () {
    super();
    this.title = new Rule('isOptional', '必须传入搜索关键字', '');
  }
}

class CreateOrUpdateWebsiteValidator extends LinValidator {
  constructor () {
    super();
    this.title = new Rule('isNotEmpty', '必须传入名称');
    // this.category_id = new Rule('isNotEmpty', '必须传入分类');
  }
}

export { CreateOrUpdateWebsiteValidator, WebsiteSearchValidator };
