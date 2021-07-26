import _axios, { get, put, _delete } from '@/lin/plugin/axios'
class Post {
  async createPost(data) {
    return _axios({
      method: 'post',
      url: 'web/post',
      data,
    })
  }

  async getPost(id) {
    const res = await get(`web/post/${id}`)
    return res
  }

  async editPost(id, info) {
    const res = await put(`web/post/${id}`, info)
    return res
  }

  async delectPost(id) {
    const res = await _delete(`web/post/${id}`)
    return res
  }

  async getPosts(data) {
    return _axios({
      method: 'get',
      url: 'web/post',
      data,
      // handleError: true,
    })
  }
}

export default new Post()
