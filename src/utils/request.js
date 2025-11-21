import { getToken } from '@/store/auth'

/**
 * 请求基础配置
 */
const BASE_URL = 'https://api.hosting.chatgqt.top'
const TIMEOUT = 15000

/**
 * 封装的请求方法
 * @param {Object} options - 请求配置
 * @returns {Promise} 返回请求结果
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = getToken()

    const header = {
      'Content-Type': 'application/json;charset=UTF-8',
      ...options.header,
    }

    if (token) {
      header.Authorization = `Bearer ${token}`
    }

    // 处理 params（拼接到 URL）
    let url = BASE_URL + options.url
    if (options.params) {
      const query = Object.keys(options.params)
        .map((key) => `${key}=${options.params[key]}`)
        .join('&')
      url += (url.includes('?') ? '&' : '?') + query
    }

    uni.request({
      url,
      method: options.method || 'GET',
      data: options.data,
      header,
      timeout: TIMEOUT,
      success: (res) => {
        const data = res.data

        if (data.code === 0 || data.code === 200 || res.statusCode === 200) {
          resolve(data)
        } else {
          uni.showToast({
            title: data.message || '请求失败',
            icon: 'none',
          })
          reject(new Error(data.message || '请求失败'))
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}

export default request
