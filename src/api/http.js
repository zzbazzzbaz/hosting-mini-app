const DEFAULT_BASE_URL =
  (import.meta?.env && import.meta.env.VITE_API_BASE_URL) ||
  (process.env && process.env.UNI_APP_API_BASE_URL) ||
  ''

const defaultHeaders = {
  'Content-Type': 'application/json'
}

/**
 * 统一封装 uni.request，返回 Promise，便于在组合式 API 中使用
 * @param {Object} options uni.request 配置
 * @returns {Promise<any>}
 */
export const request = (options = {}) => {
  const {
    url,
    method = 'GET',
    data,
    header,
    baseURL = DEFAULT_BASE_URL,
    showLoading = false,
    loadingText = '加载中...'
  } = options

  if (!url) {
    throw new Error('request: url 不能为空')
  }

  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`

  if (showLoading) {
    uni.showLoading({title: loadingText})
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method,
      data,
      header: {
        ...defaultHeaders,
        ...(header || {})
      },
      success: (res) => {
        if (showLoading) {
          uni.hideLoading()
        }
        const {statusCode, data: responseData} = res
        if (statusCode >= 200 && statusCode < 300) {
          resolve(responseData)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        if (showLoading) {
          uni.hideLoading()
        }
        reject(err)
      }
    })
  })
}
