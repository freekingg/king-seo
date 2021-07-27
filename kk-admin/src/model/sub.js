import _axios, { get, put, _delete } from '@/lin/plugin/axios'
import Config from '@/config'
class Sub {
  async createSub(data) {
    return _axios({
      method: 'post',
      url: 'web/sub',
      data,
    })
  }

  async getSub(id) {
    const res = await get(`web/sub/${id}`)
    return res
  }

  async getPreview(data) {
    const res = await get(`web/sub/preview/data`, data)
    return res
  }

  async download(id) {
    return `${Config.baseURL}web/sub/download/${id}`
  }

  async editSub(id, info) {
    const res = await put(`web/sub/${id}`, info)
    return res
  }

  async delectSub(id) {
    const res = await _delete(`web/sub/${id}`)
    return res
  }

  async getSubs(data) {
    return _axios({
      method: 'get',
      url: 'web/sub',
      data,
      // handleError: true,
    })
  }
}

export default new Sub()
