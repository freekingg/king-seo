import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Template {
  async createTemplate(data) {
    return _axios({
      method: 'post',
      url: 'web/tpl',
      data,
    })
  }

  async getTemplate(id) {
    const res = await get(`web/tpl/${id}`)
    return res
  }

  async syncTemplate() {
    return _axios({
      method: 'post',
      url: 'web/tpl/sync',
    })
  }


  async editTemplate(id, info) {
    const res = await put(`web/tpl/${id}`, info)
    return res
  }

  async delectTemplate(id) {
    const res = await _delete(`web/tpl/${id}`)
    return res
  }

  async getTemplates(data) {
    return _axios({
      method: 'get',
      url: 'web/tpl',
      data
      // handleError: true,
    })
  }
}

export default new Template()
