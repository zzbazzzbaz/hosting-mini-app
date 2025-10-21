<template>
  <view class="page">
    <!-- 顶部学生信息区 -->
    <view class="header-section">
      <view class="student-info">
        <view class="student-left">
          <!-- 学生头像 -->
          <view class="avatar-wrapper">
            <view class="avatar-circle">
              <text class="avatar-icon">👦</text>
            </view>
            <!-- 在线状态指示器 -->
            <view class="online-badge"></view>
          </view>

          <!-- 学生信息 -->
          <view class="student-details">
            <text class="student-name">{{ studentInfo.name }}</text>
            <view class="teacher-info">
              <text class="teacher-icon">👨‍🏫</text>
              <text class="teacher-text">辅导老师：</text>
              <text class="teacher-name">{{ studentInfo.teacher }}</text>
            </view>
          </view>
        </view>

        <!-- 编辑按钮 -->
        <view class="edit-btn">
          <text class="edit-icon">✏️</text>
        </view>
      </view>
    </view>

    <!-- 主内容区 -->
    <view class="main-content">
      <!-- 学习数据总览 -->
      <view class="stats-section">
        <view class="section-header">
          <text class="section-icon">📊</text>
          <text class="section-title">学习数据总览</text>
        </view>

        <view class="stats-grid">
          <!-- 已修课时卡片 -->
          <view class="stat-card stat-card-green">
            <view class="stat-header">
              <text class="stat-label">已修课时</text>
              <view class="stat-icon-wrapper stat-icon-green">
                <text class="stat-icon">✓</text>
              </view>
            </view>
            <text class="stat-value stat-value-green">{{ stats.completedHours }}</text>
            <text class="stat-desc">累计学习课时</text>
          </view>

          <!-- 未修课时卡片 -->
          <view class="stat-card stat-card-red">
            <view class="stat-header">
              <text class="stat-label">未修课时</text>
              <view class="stat-icon-wrapper stat-icon-red">
                <text class="stat-icon">⏰</text>
              </view>
            </view>
            <text class="stat-value stat-value-red">{{ stats.pendingHours }}</text>
            <text class="stat-desc">待完成课时</text>
          </view>

          <!-- 已完成作业卡片 -->
          <view class="stat-card stat-card-green">
            <view class="stat-header">
              <text class="stat-label">已完成作业</text>
              <view class="stat-icon-wrapper stat-icon-green">
                <text class="stat-icon">✓</text>
              </view>
            </view>
            <text class="stat-value stat-value-green">{{ stats.completedHomework }}</text>
            <text class="stat-desc">完成率 {{ stats.completionRate }}%</text>
          </view>

          <!-- 未完成作业卡片 -->
          <view class="stat-card stat-card-orange">
            <view class="stat-header">
              <text class="stat-label">未完成作业</text>
              <view class="stat-icon-wrapper stat-icon-orange">
                <text class="stat-icon">⚠️</text>
              </view>
            </view>
            <text class="stat-value stat-value-orange">{{ stats.pendingHomework }}</text>
            <text class="stat-desc">需尽快完成</text>
          </view>
        </view>
      </view>

      <!-- 公告栏 -->
      <view class="notice-card">
        <view class="notice-header">
          <view class="notice-icon-wrapper">
            <text class="notice-icon">📢</text>
          </view>
          <view class="notice-content">
            <text class="notice-title">最新通知</text>
            <text class="notice-text">本周五下午将进行期中家长会,请家长们准时参加。</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <view class="tabbar">
      <view class="tabbar-item tabbar-item-active" @click="goToPage('home')">
        <text class="tabbar-icon-active">🏠</text>
        <text class="tabbar-label tabbar-label-active">首页</text>
      </view>
      <view class="tabbar-item" @click="goToPage('homework')">
        <text class="tabbar-icon">📝</text>
        <text class="tabbar-label">作业信息</text>
      </view>
      <view class="tabbar-item" @click="goToPage('checkin')">
        <text class="tabbar-icon">✅</text>
        <text class="tabbar-label">签到信息</text>
      </view>
      <view class="tabbar-item" @click="goToPage('publish')">
        <text class="tabbar-icon">➕</text>
        <text class="tabbar-label">发布作业</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 学生信息
const studentInfo = ref({
  name: '喜洋洋',
  teacher: '张三'
})

// 学习数据统计
const stats = ref({
  completedHours: 13,
  pendingHours: 27,
  completedHomework: 65,
  pendingHomework: 3,
  completionRate: 95.6
})

/**
 * 导航到指定页面
 * @param {string} page - 页面标识
 */
const goToPage = (page) => {
  const routes = {
    home: '/pages/parent/home',
    homework: '/pages/parent/homework-list',
    checkin: '/pages/parent/checkin',
    publish: '/pages/parent/publish-homework'
  }

  if (routes[page] && page !== 'home') {
    uni.navigateTo({
      url: routes[page]
    })
  }
}
</script>

<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding-bottom: 128rpx; /* 底部导航栏高度 */
}

/* 顶部学生信息区 */
.header-section {
  background: linear-gradient(to right, #0ea5e9, #3b82f6);
  border-bottom-left-radius: 48rpx;
  border-bottom-right-radius: 48rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  padding: 64rpx 48rpx;
  margin-bottom: 48rpx;
}

.student-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.student-left {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

/* 头像区域 */
.avatar-wrapper {
  position: relative;
}

.avatar-circle {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 80rpx;
}

/* 在线状态指示器 */
.online-badge {
  position: absolute;
  bottom: -4rpx;
  right: -4rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #10b981;
  border-radius: 50%;
  border: 4rpx solid #ffffff;
}

/* 学生详情 */
.student-details {
  color: #ffffff;
}

.student-name {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #bae6fd;
  font-size: 28rpx;
}

.teacher-icon {
  font-size: 32rpx;
}

.teacher-text {
  color: #bae6fd;
}

.teacher-name {
  font-weight: 600;
  color: #ffffff;
}

/* 编辑按钮 */
.edit-btn {
  padding: 16rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 16rpx;
  transition: background-color 0.2s;
}

.edit-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
}

.edit-icon {
  font-size: 48rpx;
}

/* 主内容区 */
.main-content {
  padding: 0 48rpx;
}

/* 学习数据总览部分 */
.stats-section {
  margin-bottom: 48rpx;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.section-icon {
  font-size: 40rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1f2937;
}

/* 数据卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  padding: 40rpx;
  transition: box-shadow 0.3s;
}

.stat-card:active {
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
}

/* 不同颜色边框的卡片 */
.stat-card-green {
  border-left: 8rpx solid #10b981;
}

.stat-card-red {
  border-left: 8rpx solid #ef4444;
}

.stat-card-orange {
  border-left: 8rpx solid #f97316;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.stat-label {
  font-size: 28rpx;
  font-weight: 500;
  color: #4b5563;
}

/* 统计图标容器 */
.stat-icon-wrapper {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-green {
  background-color: #d1fae5;
}

.stat-icon-red {
  background-color: #fee2e2;
}

.stat-icon-orange {
  background-color: #ffedd5;
}

.stat-icon {
  font-size: 40rpx;
}

/* 统计数值 */
.stat-value {
  display: block;
  font-size: 60rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.stat-value-green {
  color: #10b981;
}

.stat-value-red {
  color: #ef4444;
}

.stat-value-orange {
  color: #f97316;
}

.stat-desc {
  display: block;
  font-size: 24rpx;
  color: #9ca3af;
}

/* 公告卡片 */
.notice-card {
  background: linear-gradient(to right, #fffbeb, #fef3c7);
  border-radius: 32rpx;
  padding: 32rpx;
  border-left: 8rpx solid #fbbf24;
}

.notice-header {
  display: flex;
  gap: 24rpx;
}

.notice-icon-wrapper {
  flex-shrink: 0;
  width: 64rpx;
  height: 64rpx;
  background-color: #fbbf24;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-icon {
  font-size: 40rpx;
}

.notice-content {
  flex: 1;
}

.notice-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8rpx;
}

.notice-text {
  display: block;
  font-size: 28rpx;
  color: #4b5563;
  line-height: 1.5;
}

/* 底部导航栏 */
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1rpx solid #e5e7eb;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
  display: flex;
  padding: 16rpx 0;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 0;
  color: #9ca3af;
}

.tabbar-item-active {
  color: #0ea5e9;
}

.tabbar-icon {
  font-size: 48rpx;
}

.tabbar-icon-active {
  font-size: 48rpx;
}

.tabbar-label {
  font-size: 24rpx;
}

.tabbar-label-active {
  font-weight: 500;
  color: #0ea5e9;
}
</style>
