import { getUserInfo } from '@/store/auth'
import { BASE_URL } from '@/utils/request'

/**
 * 获取当前登录用户的 ID
 * 参考 hosting-admin 项目 util 实现
 * @returns {number|string} 当前用户 id
 */
export const getUserId = () => {
  const userInfo = getUserInfo() || uni.getStorageSync('userInfo')
  const id = userInfo?.userId ?? null

  if (id === null || id === undefined || id === '') {
    console.log('缺少当前用户ID')
    throw new Error('缺少当前用户ID')
  }

  const parsed = Number(id)
  return Number.isNaN(parsed) ? id : parsed
}

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {string|Date} value - 日期值
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 格式化时间为 YYYY-MM-DD HH:mm
 * @param {string|Date} value - 时间值
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${formatDate(value)} ${h}:${min}`
}

/**
 * 构建完整的图片 URL
 * @param {string} path - 图片路径
 * @returns {string} 完整的图片 URL
 */
export const buildImageUrl = (path) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${BASE_URL}${path}`
}


