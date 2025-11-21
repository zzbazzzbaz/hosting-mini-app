import { ref } from 'vue'

/**
 * 认证状态管理
 * 用于管理用户的登录令牌和认证状态
 */
const token = ref(uni.getStorageSync('token') || '')
const userInfo = ref(uni.getStorageSync('userInfo') || null)

/**
 * 设置登录令牌和用户信息
 * @param {string} newToken - 新的访问令牌
 * @param {Object} info - 用户信息
 */
export const setAuth = (newToken, info) => {
  token.value = newToken
  userInfo.value = info
  uni.setStorageSync('token', newToken)
  uni.setStorageSync('userInfo', info)
}

/**
 * 清除登录令牌和用户信息
 */
export const clearAuth = () => {
  token.value = ''
  userInfo.value = null
  uni.removeStorageSync('token')
  uni.removeStorageSync('userInfo')
}

/**
 * 检查是否已登录
 * @returns {boolean} 是否存在有效的 token
 */
export const isAuthenticated = () => {
  return !!token.value
}

/**
 * 获取当前 token
 * @returns {string} 当前 token
 */
export const getToken = () => {
  return token.value
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
export const getUserInfo = () => {
  return userInfo.value
}
