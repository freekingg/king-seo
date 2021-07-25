/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Product {
  // 类中的方法可以代表一个用户行为
  async createItem(data) {
    return _axios({
      method: 'post',
      url: 'v1/exam',
      data,
    })
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getItem(id) {
    const res = await get(`v1/exam/${id}`)
    return res
  }

  async editItem(id, info) {
    const res = await put(`v1/exam/${id}`, info)
    return res
  }

  async delectItem(id) {
    const res = await _delete(`v1/exam/${id}`)
    return res
  }

  async getItems() {
    return _axios({
      method: 'get',
      url: 'v1/exam',
      handleError: true,
    })
  }
}

export default new Product()
