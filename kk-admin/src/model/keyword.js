import _axios, { get, put, _delete } from '@/lin/plugin/axios'
import Config from '@/config'

class Keyword {
  async createKeyword(data) {
    return _axios({
      method: 'post',
      url: 'web/keyword',
      data,
    })
  }

  async getKeyword(id) {
    const res = await get(`web/keyword/${id}`)
    return res
  }

  async getPreview(data) {
    const res = await get(`web/keyword/preview/data`,data)
    return res
  }

  async download(id) {
    return `${Config.baseURL}web/keyword/download/${id}`
  }

  async editKeyword(id, info) {
    const res = await put(`web/keyword/${id}`, info)
    return res
  }

  async delectKeyword(id) {
    const res = await _delete(`web/keyword/${id}`)
    return res
  }

  async getKeywords(data) {
    return _axios({
      method: 'get',
      url: 'web/keyword',
      data
      // handleError: true,
    })
  }
}

export default new Keyword()
