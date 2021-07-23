/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Website {
  async createItem(data) {
    return _axios({
      method: 'post',
      url: 'v1/website',
      data,
    })
  }

  async getItem(id) {
    const res = await get(`v1/website/${id}`)
    return res
  }

  async editItem(id, info) {
    const res = await put(`v1/website/${id}`, info)
    return res
  }

  async delectItem(id) {
    const res = await _delete(`v1/website/${id}`)
    return res
  }

  async getItems(data) {
    return _axios({
      method: 'get',
      url: 'v1/website',
      handleError: true,
      data
    })
  }
}

export default new Website()
