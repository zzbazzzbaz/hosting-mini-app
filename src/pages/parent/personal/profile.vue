<template>
  <view class="page">
    <PageHeader title="我的" />

    <view class="profile-section">
      <view class="profile-header">
        <view class="avatar-wrapper">
          <view class="avatar">
            <text class="avatar-text">{{ parentInfo.name.slice(0, 1) }}</text>
          </view>
          <view class="relation-badge">{{ parentInfo.relation }}</view>
          <view class="online-badge"></view>
        </view>

        <view class="user-info">
          <text class="username">{{ parentInfo.name }}</text>
          <text class="role">👨‍👩‍👧 家长</text>
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
          <text class="stat-label">近期提醒</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @tap="handleChildInfo">
          <view class="menu-left">
            <view class="menu-icon-box icon-blue">
              <uni-icons type="personadd" size="22" color="#3b82f6"></uni-icons>
            </view>
            <text class="menu-title">孩子信息</text>
          </view>
          <uni-icons type="forward" size="18" color="#d1d5db"></uni-icons>
        </view>

        <view class="menu-item" @tap="handleStudyReport">
          <view class="menu-left">
            <view class="menu-icon-box icon-green">
              <uni-icons type="analytics" size="22" color="#10b981"></uni-icons>
            </view>
            <text class="menu-title">学习报告</text>
          </view>
          <uni-icons type="forward" size="18" color="#d1d5db"></uni-icons>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @tap="handleAttendance">
          <view class="menu-left">
            <view class="menu-icon-box icon-orange">
              <uni-icons type="calendar" size="22" color="#f97316"></uni-icons>
            </view>
            <text class="menu-title">签到记录</text>
          </view>
          <uni-icons type="forward" size="18" color="#d1d5db"></uni-icons>
        </view>

        <view class="menu-item" @tap="handleTuition">
          <view class="menu-left">
            <view class="menu-icon-box icon-indigo">
              <uni-icons type="wallet" size="22" color="#6366f1"></uni-icons>
            </view>
            <text class="menu-title">课时与缴费</text>
          </view>
          <uni-icons type="forward" size="18" color="#d1d5db"></uni-icons>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @tap="handleSettings">
          <view class="menu-left">
            <view class="menu-icon-box icon-gray">
              <uni-icons type="gear" size="22" color="#6b7280"></uni-icons>
            </view>
            <text class="menu-title">系统设置</text>
          </view>
          <uni-icons type="forward" size="18" color="#d1d5db"></uni-icons>
        </view>

        <view class="menu-item" @tap="handleSupport">
          <view class="menu-left">
            <view class="menu-icon-box icon-cyan">
              <uni-icons type="help" size="22" color="#06b6d4"></uni-icons>
            </view>
            <text class="menu-title">联系客服</text>
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
import {ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'

const parentInfo = ref({
  name: '李女士',
  relation: '妈妈'
})

const stats = ref({
  totalChildren: 1,
  pendingHomework: 2,
  upcomingEvents: 3
})

const handleChildInfo = () => {
  uni.navigateTo({
    url: '/pages/parent/homework/homework-list'
  })
}

const handleStudyReport = () => {
  uni.showToast({
    title: '学习报告功能开发中',
    icon: 'none'
  })
}

const handleAttendance = () => {
  uni.navigateTo({
    url: '/pages/parent/checkin/checkin'
  })
}

const handleTuition = () => {
  uni.showToast({
    title: '课时功能开发中',
    icon: 'none'
  })
}

const handleSettings = () => {
  uni.showToast({
    title: '系统设置功能开发中',
    icon: 'none'
  })
}

const handleSupport = () => {
  uni.showModal({
    title: '客服中心',
    content: '如需帮助，请拨打 400-800-1000，或添加客服微信号：edu-support',
    showCancel: false,
    confirmText: '知道了'
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('parentInfo')
        uni.removeStorageSync('token')
        uni.reLaunch({
          url: '/pages/common/login'
        })
        uni.showToast({
          title: '已退出',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 128rpx;
}

.profile-section {
  margin: 32rpx 48rpx;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  border-radius: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(14, 165, 233, 0.3);
  overflow: hidden;
}

.profile-header {
  padding: 48rpx;
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 32rpx;
  background: linear-gradient(135deg, #fff, #f8fafc);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 56rpx;
  font-weight: bold;
  color: #0ea5e9;
}

.relation-badge {
  position: absolute;
  bottom: -12rpx;
  left: 50%;
  transform: translateX(-50%);
  background: #facc15;
  color: #854d0e;
  font-size: 22rpx;
  font-weight: 600;
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  box-shadow: 0 8rpx 16rpx rgba(250, 204, 21, 0.35);
}

.online-badge {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 28rpx;
  height: 28rpx;
  background: #22c55e;
  border-radius: 50%;
  border: 4rpx solid #fff;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.username {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
}

.role {
  font-size: 28rpx;
  color: #bae6fd;
}

.stats-grid {
  display: flex;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10rpx);
  padding: 32rpx 48rpx;
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
  color: #fff;
}

.stat-label {
  font-size: 24rpx;
  color: #e0f2fe;
}

.stat-divider {
  width: 2rpx;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 24rpx;
}

.menu-section {
  padding: 0 48rpx;
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

.icon-orange {
  background: #ffedd5;
}

.icon-indigo {
  background: #e0e7ff;
}

.icon-gray {
  background: #f3f4f6;
}

.icon-cyan {
  background: #cffafe;
}

.menu-title {
  font-size: 32rpx;
  color: #1f2937;
  font-weight: 500;
}

.logout-section {
  padding: 32rpx 48rpx;
}

.logout-btn {
  width: 100%;
  height: 96rpx;
  background: #fff;
  border: 2rpx solid #ef4444;
  border-radius: 24rpx;
  color: #ef4444;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 12rpx rgba(239, 68, 68, 0.1);
  transition: all 0.3s;
}

.logout-btn::after {
  border: none;
}

.logout-btn:active {
  background: #fef2f2;
  transform: scale(0.98);
}
</style>
