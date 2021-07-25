import { LinValidator, Rule } from 'lin-mizar';

class CategorySearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule('isOptional', '必须传入搜索关键字');
  }
}

class CreateOrUpdateCategoryValidator extends LinValidator {
  constructor () {
    super();
    this.title = new Rule('isOptional', '必须传入分类名');
  }
}

class CreateOrUpdateCategoryDomainsValidator extends LinValidator {
  constructor () {
    super();
    this.id = new Rule('isNotEmpty', '必须传入分类id');
  }
}

export { CreateOrUpdateCategoryValidator, CategorySearchValidator ,CreateOrUpdateCategoryDomainsValidator};
