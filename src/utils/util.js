import { getUserInfo } from '@/store/auth'

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
