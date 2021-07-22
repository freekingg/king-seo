import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Category {
  async createCategory(data) {
    return _axios({
      method: 'post',
      url: 'v1/category',
      data,
    })
  }

  //  async await 语法糖让代码同步执行
  async getCategory(id) {
    const res = await get(`v1/category/${id}`)
    return res
  }

  async editCategory(id, info) {
    const res = await put(`v1/category/${id}`, info)
    return res
  }

  async delectCategory(id) {
    const res = await _delete(`v1/category/${id}`)
    return res
  }

  async getCategorys() {
    return _axios({
      method: 'get',
      url: 'v1/category',
      // handleError: true,
    })
  }
}

export default new Category()
