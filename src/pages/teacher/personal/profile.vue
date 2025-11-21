<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="我的" />

    <!-- 个人信息区域 -->
    <view class="profile-section">
      <view class="profile-header">
        <view class="avatar-wrapper">
          <view class="avatar">
            <text class="avatar-text">{{ teacherInfo.name[0] }}</text>
          </view>
          <view class="online-badge"></view>
        </view>
        <view class="user-info">
          <text class="username">{{ teacherInfo.name }}</text>
          <text class="role">👨‍🏫 教师</text>
        </view>
      </view>

      <!-- 统计数据卡片 -->
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ stats.totalStudents }}</text>
          <text class="stat-label">学生总数</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.todayChecked }}</text>
          <text class="stat-label">今日签到</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.completedHomework }}</text>
          <text class="stat-label">学生作业</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @tap="handlePersonalInfo">
          <view class="menu-left">
            <view class="menu-icon-box icon-blue">
              <uni-icons type="person" size="22" color="#3b82f6"></uni-icons>
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

    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="publish" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'

/**
 * 教师个人信息
 */
const teacherInfo = ref({
  name: '张三',
  phone: '138****5678',
  email: 'zhangsan@example.com',
})

/**
 * 统计数据
 */
const stats = ref({
  totalStudents: 20, // 学生总数
  todayChecked: 18, // 今日签到数
  completedHomework: 186, // 累计批改作业数
})

/**
 * 查看个人信息
 */
const handlePersonalInfo = () => {
  uni.navigateTo({
    url: '/pages/teacher/personal/personal-info',
  })
}

/**
 * 退出登录
 */
const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗?',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('token')
        uni.reLaunch({
          url: '/pages/common/login',
        })
        uni.showToast({
          title: '已退出登录',
          icon: 'success',
        })
      }
    },
  })
}
</script>

<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 128rpx;
}

/* 个人信息区域 */
.profile-section {
  margin: 32rpx 48rpx;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  border-radius: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(14, 165, 233, 0.3);
  overflow: hidden;
}

/* 个人信息头部 */
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
  border-radius: 50%;
  background: linear-gradient(135deg, #fff, #f0f9ff);
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

.online-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32rpx;
  height: 32rpx;
  background: #10b981;
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

/* 统计数据网格 */
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
  padding: 24rpx 48rpx 0;
}

.menu-group {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f3f4f6;
  transition: background 0.2s;
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
