<template>
  <view class="page">
    <PageHeader title="我的" />

    <view class="profile-section">
      <view class="profile-header">
        <view class="user-info">
          <text class="username">{{ parentInfo.name }}</text>
          <text class="phone" v-if="parentInfo.phone">{{ parentInfo.phone }}</text>
        </view>
      </view>

      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ stats.totalChildren }}</text>
          <text class="stat-label">关注孩子</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.pendingHomework }}</text>
          <text class="stat-label">待完成作业</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.upcomingEvents }}</text>
          <text class="stat-label">已完成作业</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @tap="handleScoreStats">
          <view class="menu-left">
            <view class="menu-icon-box icon-blue">
              <uni-icons type="bars" size="22" color="#3b82f6"></uni-icons>
            </view>
            <text class="menu-title">成绩统计</text>
          </view>
          <uni-icons type="forward" size="18" color="#d1d5db"></uni-icons>
        </view>

        <view class="menu-item" @tap="handleProfile">
          <view class="menu-left">
            <view class="menu-icon-box icon-green">
              <uni-icons type="analytics" size="22" color="#10b981"></uni-icons>
            </view>
            <text class="menu-title">个人信息</text>
          </view>
          <uni-icons type="forward" size="18" color="#d1d5db"></uni-icons>
        </view>
      </view>
    </view>

    <view class="logout-section">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>

    <ParentTabBar activeTab="publish" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'
import { getMyInfo } from '@/api/parent/personal'

// 家长信息
const parentInfo = ref({ name: '李女士' })
// 统计数据
const stats = ref({ totalChildren: 0, pendingHomework: 0, upcomingEvents: 0 })

/**
 * 加载个人信息数据
 */
const loadMyInfo = async () => {
  try {
    const res = await getMyInfo()
    if (res.code === 200) {
      parentInfo.value = res.data.info
      stats.value = {
        totalChildren: res.data.studentCount,
        pendingHomework: res.data.nofinishTotalCount,
        upcomingEvents: res.data.finishTotalCount,
      }
    }
  } catch (error) {
    console.error('加载个人信息失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

const handleScoreStats = () => {
  uni.navigateTo({ url: '/pages/parent/personal/score-stats' })
}

const handleProfile = () => {
  uni.navigateTo({ url: '/pages/parent/personal/components/personal-info' })
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('parentInfo')
        uni.removeStorageSync('token')
        uni.reLaunch({ url: '/pages/common/user-login' })
        uni.showToast({ title: '已退出', icon: 'success' })
      }
    },
  })
}

onMounted(() => {
  loadMyInfo()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 128rpx;
}

/* 个人信息区域 */
.profile-section {
  margin: 32rpx 48rpx;
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

/* 个人信息头部 */
.profile-header {
  padding: 48rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.username {
  font-size: 48rpx;
  font-weight: bold;
  color: #1f2937;
}

.phone {
  font-size: 28rpx;
  color: #6b7280;
}

/* 统计数据网格 */
.stats-grid {
  display: flex;
  background: #f9fafb;
  padding: 32rpx 48rpx;
  border-top: 1rpx solid #f3f4f6;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #0ea5e9;
}

.stat-label {
  font-size: 24rpx;
  color: #6b7280;
}

.stat-divider {
  width: 2rpx;
  background: #e5e7eb;
  margin: 0 24rpx;
}

.menu-section {
  padding: 24rpx 48rpx 0;
}

.menu-group {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  margin-bottom: 24rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f3f4f6;
  transition: all 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #f9fafb;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.menu-icon-box {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue {
  background: #dbeafe;
}

.icon-green {
  background: #d1fae5;
}

.menu-title {
  font-size: 32rpx;
  color: #1f2937;
  font-weight: 500;
}

.logout-section {
  padding: 24rpx 48rpx 120rpx;
}

.logout-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 24rpx;
  background: #fff;
  border: 2rpx solid #ef4444;
  color: #ef4444;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(239, 68, 68, 0.2);
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.logout-btn::after {
  border: none;
}

.logout-btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}
</style>
