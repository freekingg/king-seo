/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Spider {
  async createItem(data) {
    return _axios({
      method: 'post',
      url: 'web/spider',
      data,
    })
  }

  async getItem(id) {
    const res = await get(`web/spider/${id}`)
    return res
  }

  async editItem(id, info) {
    const res = await put(`web/spider/${id}`, info)
    return res
  }

  async delectItem(id) {
    const res = await _delete(`web/spider/${id}`)
    return res
  }

  async getItems(data) {
    return _axios({
      method: 'get',
      url: 'web/spider',
      handleError: true,
      data,
    })
  }
}

export default new Spider()
