import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Domain {
  // async createDomain(data) {
  //   return _axios({
  //     method: 'post',
  //     url: 'web/domain',
  //     data,
  //   })
  // }

  async createDomains(data) {
    return _axios({
      method: 'post',
      url: 'web/domain',
      data,
    })
  }

  async getDomain(id) {
    const res = await get(`web/domain/${id}`)
    return res
  }

  async getCategoryDomains(id) {
    const res = await get(`web/domain/category/${id}`)
    return res
  }

  async editDomain(id, info) {
    const res = await put(`web/domain/${id}`, info)
    return res
  }

  async delectDomain(info) {
    const res = await _delete(`web/domain/1`, info)
    return res
  }

  async getDomains(data) {
    return _axios({
      method: 'get',
      url: 'web/domain',
      data,
      // handleError: true,
    })
  }
}

export default new Domain()
