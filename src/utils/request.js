import { getToken } from '@/store/auth'

/**
 * 请求基础配置
 */
export const BASE_URL = 'https://api.hosting.chatgqt.top'
const TIMEOUT = 15000

const buildAuthHeader = (header = {}) => {
  const token = getToken()
  if (!token) return header
  return {
    ...header,
    Authorization: token,
  }
}

let isHandlingExpire = false
const handleTokenExpired = () => {
  if (isHandlingExpire) return
  isHandlingExpire = true
  uni.showModal({
    title: '登录过期',
    content: '登录已过期，请重新登录',
    showCancel: false,
    success: () => {
      uni.reLaunch({
        url: '/pages/common/user-login',
      })
    },
    complete: () => {
      isHandlingExpire = false
    },
  })
}

// 请求拦截：自动追加 Authorization 头
uni.addInterceptor('request', {
  invoke(options) {
    options.header = buildAuthHeader(options.header || {})
    return options
  },
})

// 上传拦截：自动追加 Authorization 头
uni.addInterceptor('uploadFile', {
  invoke(options) {
    options.header = buildAuthHeader(options.header || {})
    return options
  },
  success(args) {
    const data = args?.res?.data
    const parsed = typeof data === 'string' ? (() => { try { return JSON.parse(data) } catch { return null } })() : data
    if (parsed && parsed.code === 205) {
      handleTokenExpired()
      return { ...args, res: { ...args.res, data: parsed } }
    }
    return args
  },
})

/**
 * 封装的请求方法
 * @param {Object} options - 请求配置
 * @returns {Promise} 返回请求结果
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    const header = buildAuthHeader({
      'Content-Type': 'application/json;charset=UTF-8',
      ...options.header,
    })

    // 处理 params（拼接到 URL）
    let url = BASE_URL + options.url
    if (options.params) {
      const query = Object.keys(options.params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(options.params[key])}`)
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

        if (data.code === 205) {
          handleTokenExpired()
          reject(new Error('登录过期'))
          return
        }

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
