import _axios, { get, put, _delete } from '@/lin/plugin/axios'
import Config from '@/config'
class Article {
  async createArticle(data) {
    return _axios({
      method: 'post',
      url: 'web/article',
      data,
    })
  }

  async getArticle(id) {
    const res = await get(`web/article/${id}`)
    return res
  }

  async getPreview(data) {
    const res = await get(`web/article/preview/data`,data)
    return res
  }

  async download(id) {
    return `${Config.baseURL}web/keyword/download/${id}`
  }

  async editArticle(id, info) {
    const res = await put(`web/article/${id}`, info)
    return res
  }

  async delectArticle(id) {
    const res = await _delete(`web/article/${id}`)
    return res
  }

  async getArticles(data) {
    return _axios({
      method: 'get',
      url: 'web/article',
      data
      // handleError: true,
    })
  }
}

export default new Article()
