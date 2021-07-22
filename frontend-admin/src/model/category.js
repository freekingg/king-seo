import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Category {
  async createCategory(data) {
    return _axios({
      method: 'post',
      url: 'web/category',
      data,
    })
  }

  async createDomains(data) {
    return _axios({
      method: 'post',
      url: 'web/category/domains',
      data,
    })
  }

  async getCategory(id) {
    const res = await get(`web/category/${id}`)
    return res
  }

  async getCategoryDomains(id) {
    const res = await get(`web/category/domains/${id}`)
    return res
  }

  async editCategory(id, info) {
    const res = await put(`web/category/${id}`, info)
    return res
  }

  async delectCategory(id) {
    const res = await _delete(`web/category/${id}`)
    return res
  }

  async getCategorys() {
    return _axios({
      method: 'get',
      url: 'web/category',
      // handleError: true,
    })
  }
}

export default new Category()
