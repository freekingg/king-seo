import { LinValidator, Rule } from 'lin-mizar';

class SpiderSearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule('isOptional', '必须传入搜索关键字');
  }
}

class CreateOrUpdateSpiderValidator extends LinValidator {
  constructor () {
    super();
    this.name = new Rule('isOptional', '必须传入分类名');
  }
}

export { SpiderSearchValidator, CreateOrUpdateSpiderValidator };
