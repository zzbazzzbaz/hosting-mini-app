<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="我的" />

    <!-- 个人信息区域 -->
    <view class="profile-section">
      <view class="profile-header">
        <view class="avatar-wrapper">
          <view class="avatar">
            <text class="avatar-text">{{teacherInfo.name[0]}}</text>
          </view>
          <view class="online-badge"></view>
        </view>
        <view class="user-info">
          <text class="username">{{teacherInfo.name}}</text>
          <text class="role">👨‍🏫 教师</text>
        </view>
      </view>

      <!-- 统计数据卡片 -->
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{stats.totalStudents}}</text>
          <text class="stat-label">学生总数</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{stats.todayChecked}}</text>
          <text class="stat-label">今日签到</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{stats.completedHomework}}</text>
          <text class="stat-label">作业批改</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单列表 -->
    <view class="menu-section">
      <!-- 个人信息 -->
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

      <!-- 系统功能组 -->
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
      </view>

      <!-- 其他功能组 -->
      <view class="menu-group">
        <view class="menu-item" @tap="handleAbout">
          <view class="menu-left">
            <view class="menu-icon-box icon-cyan">
              <uni-icons type="info" size="22" color="#06b6d4"></uni-icons>
            </view>
            <text class="menu-title">关于我们</text>
          </view>
          <uni-icons type="forward" size="18" color="#d1d5db"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>

    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="publish" />
  </view>
</template>

<script setup>
import {ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'

/**
 * 教师个人信息
 */
const teacherInfo = ref({
  name: '张三',
  phone: '138****5678',
  email: 'zhangsan@example.com'
})

/**
 * 统计数据
 */
const stats = ref({
  totalStudents: 20,       // 学生总数
  todayChecked: 18,        // 今日签到数
  completedHomework: 186   // 累计批改作业数
})

/**
 * 处理个人信息点击
 */
const handlePersonalInfo = () => {
  uni.showToast({
    title: '个人信息功能开发中',
    icon: 'none'
  })
}

/**
 * 处理消息中心点击
 */
const handleMessages = () => {
  uni.showToast({
    title: '消息中心功能开发中',
    icon: 'none'
  })
}

/**
 * 处理系统设置点击
 */
const handleSettings = () => {
  uni.showToast({
    title: '系统设置功能开发中',
    icon: 'none'
  })
}

/**
 * 处理帮助中心点击
 */
const handleHelp = () => {
  uni.showToast({
    title: '帮助中心功能开发中',
    icon: 'none'
  })
}

/**
 * 处理关于我们点击
 */
const handleAbout = () => {
  uni.showModal({
    title: '关于我们',
    content: '托管小程序 v1.0.0\n教师端移动应用\n版权所有 © 2025',
    showCancel: false,
    confirmText: '确定'
  })
}

/**
 * 处理退出登录
 */
const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗?',
    success: (res) => {
      if (res.confirm) {
        // 清除登录信息
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('token')

        // 跳转到登录页
        uni.reLaunch({
          url: '/pages/common/login'
        })

        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
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

/* 功能菜单区域 */
.menu-section {
  padding: 0 48rpx;
}

/* 菜单组 */
.menu-group {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  margin-bottom: 24rpx;
  overflow: hidden;
}

/* 菜单项 */
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

.icon-purple {
  background: #ede9fe;
}

.icon-green {
  background: #d1fae5;
}

.icon-gray {
  background: #f3f4f6;
}

.icon-orange {
  background: #fed7aa;
}

.icon-cyan {
  background: #cffafe;
}

.menu-title {
  font-size: 32rpx;
  color: #1f2937;
  font-weight: 500;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

/* 未读消息徽章 */
.badge {
  min-width: 36rpx;
  height: 36rpx;
  background: #ef4444;
  border-radius: 18rpx;
  padding: 0 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
}

/* 退出登录区域 */
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
