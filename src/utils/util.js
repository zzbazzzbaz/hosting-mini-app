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

export const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const buildImageUrl = (path) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${BASE_URL}${path}`
}
