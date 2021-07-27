import { LinValidator, Rule } from 'lin-mizar';

class SubSearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule('isOptional', '必须传入搜索关键字');
  }
}

class CreateOrUpdateSubValidator extends LinValidator {
  constructor () {
    super();
    this.title = new Rule('isNotEmpty', '必须传入分类名');
  }
}

export { SubSearchValidator, CreateOrUpdateSubValidator };
