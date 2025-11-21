<script setup>
import { isAuthenticated, getToken, clearAuth } from '@/store/auth'
import { checkToken } from '@/api/auth'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

/**
 * 检查认证状态
 * 验证 token 是否过期，过期则跳转到登录页
 */
const checkAuthStatus = async () => {
  // eslint-disable-next-line no-undef
  const pages = getCurrentPages()
  if (!pages || pages.length === 0) return

  const currentRoute = '/' + pages[pages.length - 1].route

  if (
    currentRoute === '/pages/common/user-login' ||
    currentRoute === '/pages/common/home-unlogged'
  ) {
    return
  }

  if (!isAuthenticated()) {
    console.log('未登录，跳转到登录页')
    await uni.reLaunch({ url: '/pages/common/user-login' })
    return
  }

  try {
    const response = await checkToken(getToken())
    if (!response.data.isValid) {
      console.log('Token 已过期，清除并跳转到登录页')
      clearAuth()
      await uni.reLaunch({ url: '/pages/common/user-login' })
    }
  } catch (error) {
    console.error('Token 验证失败:', error)
    clearAuth()
    await uni.reLaunch({ url: '/pages/common/user-login' })
  }
}

onLaunch(() => {
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
  checkAuthStatus()
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
/*每个页面公共css */
</style>
