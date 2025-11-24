<script setup>
import { isAuthenticated, getToken, getUserInfo, clearAuth } from '@/store/auth'
import { checkToken } from '@/api/common/auth'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

/**
 * 检查认证状态并根据用户类型跳转
 * 验证 token 是否过期，过期则跳转到未登录首页，未过期则根据 type 跳转到对应首页
 */
const checkAuthStatus = async () => {
  // 如果没有 token，不做处理（停留在未登录首页）
  if (!isAuthenticated()) {
    console.log('未登录，停留在未登录首页')
    return
  }

  // 验证 token 是否过期
  try {
    const response = await checkToken(getToken())
    if (!response.data.isValid) {
      console.log('Token 已过期，跳转到未登录首页')
      clearAuth()
      await uni.reLaunch({ url: '/pages/common/home-unlogged' })
    } else {
      // token 有效，根据用户类型跳转到对应首页
      const userInfo = getUserInfo()
      if (userInfo && userInfo.type) {
        if (userInfo.type === 2) {
          console.log('家长端，跳转到家长首页')
          await uni.reLaunch({ url: '/pages/parent/home/parent-home' })
        } else if (userInfo.type === 3) {
          console.log('教师端，跳转到教师首页')
          await uni.reLaunch({ url: '/pages/teacher/home/teacher-home' })
        }
      }
    }
  } catch (error) {
    console.error('Token 验证失败:', error)
    clearAuth()
    await uni.reLaunch({ url: '/pages/common/home-unlogged' })
  }
}

onLaunch(() => {
  console.log('App Launch')
  checkAuthStatus()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
/*每个页面公共css */
</style>
