/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Website {
  async createItem(data) {
    return _axios({
      method: 'post',
      url: 'web/website',
      data,
    })
  }

  async getItem(id) {
    const res = await get(`web/website/${id}`)
    return res
  }

  async editItem(id, info) {
    const res = await put(`web/website/${id}`, info)
    return res
  }

  async delectItem(id) {
    const res = await _delete(`web/website/${id}`)
    return res
  }

  async getItems(data) {
    return _axios({
      method: 'get',
      url: 'web/website',
      handleError: true,
      data
    })
  }
}

export default new Website()
