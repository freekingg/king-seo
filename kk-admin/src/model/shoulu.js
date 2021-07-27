import _axios, { get, put, _delete } from '@/lin/plugin/axios'
import Config from '@/config'

class Shoulu {
  async createShoulu(data) {
    return _axios({
      method: 'post',
      url: 'web/shoulu',
      data,
    })
  }

  async getShoulu(id) {
    const res = await get(`web/shoulu/${id}`)
    return res
  }

  async getSearch(data) {
    const res = await get(`web/shoulu/search/one`, data)
    return res
  }

  async download(id) {
    return `${Config.baseURL}web/shoulu/download/${id}`
  }

  async editShoulu(id, info) {
    const res = await put(`web/shoulu/${id}`, info)
    return res
  }

  async delectShoulu(id) {
    const res = await _delete(`web/shoulu/${id}`)
    return res
  }

  async getShoulus(data) {
    return _axios({
      method: 'get',
      url: 'web/shoulu',
      data,
      // handleError: true,
    })
  }
}

export default new Shoulu()
