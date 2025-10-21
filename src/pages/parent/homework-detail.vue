<template>
  <view class="page">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">作业详情</text>
      <view class="placeholder"></view>
    </view>

    <view class="content">
      <!-- 基本信息卡片 -->
      <view class="card">
        <view class="card-header">
          <view class="subject-info">
            <view class="subject-icon">
              <text class="icon-text">🔢</text>
            </view>
            <view class="subject-detail">
              <text class="subject-name">数学</text>
              <text class="subject-date">2025-10-15</text>
            </view>
          </view>
          <view class="status-badge status-completed">
            <text class="badge-icon">✓</text>
            <text class="badge-text">已完成</text>
          </view>
        </view>
      </view>

      <!-- 作业要求 -->
      <view class="section-card">
        <view class="section-header section-header-blue">
          <text class="section-icon">📝</text>
          <text class="section-title">作业</text>
        </view>
        <view class="section-content">
          <view class="requirement-box">
            <text class="requirement-text">完成课本第45-52页的练习题,包括:\n1. 基础计算题(第45-48页)\n2. 应用题(第49-51页)\n3. 拓展思考题(第52页)\n\n要求:字迹工整,过程完整,认真检查</text>
          </view>
        </view>
      </view>

      <!-- 学生作答 -->
      <view class="section-card">
        <view class="section-header section-header-green">
          <text class="section-icon">✏️</text>
          <text class="section-title">学生作答</text>
        </view>
        <view class="section-content">
          <view class="image-grid">
            <view class="image-item" v-for="i in 4" :key="i">
              <view class="image-placeholder">
                <text class="placeholder-text">图片{{ i }}</text>
              </view>
            </view>
          </view>
          <text class="submit-time">⏰ 提交时间:2025-10-15 17:30</text>
        </view>
      </view>

      <!-- 教师评语 -->
      <view class="section-card">
        <view class="section-header section-header-purple">
          <text class="section-icon">💬</text>
          <text class="section-title">教师评语</text>
        </view>
        <view class="section-content">
          <view class="comment-box">
            <text class="comment-text">作业完成得很好!字迹工整,计算准确。\n基础题全部正确,应用题思路清晰。\n拓展题有一定难度,但你也完成得不错,继续保持!\n建议:第51页第3题的解题步骤可以更详细一些。</text>
            <view class="teacher-info">
              <text class="teacher-icon">👨‍🏫</text>
              <text class="teacher-name">张三老师</text>
              <text class="divider">•</text>
              <text class="comment-time">2025-10-15 20:15</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 今日学生状态 -->
      <view class="section-card">
        <view class="section-header section-header-orange">
          <text class="section-icon">😊</text>
          <text class="section-title">今日学生状态</text>
        </view>
        <view class="section-content">
          <view class="status-display">
            <view class="status-icon-wrapper">
              <text class="status-icon-large">😊</text>
            </view>
            <view class="status-info">
              <text class="status-label">状态良好</text>
              <text class="status-desc">上课认真,积极回答问题,课间活动正常</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="tabbar">
      <view class="tabbar-item" @click="goToPage('home')">
        <text class="tabbar-icon">🏠</text>
        <text class="tabbar-label">首页</text>
      </view>
      <view class="tabbar-item tabbar-item-active">
        <text class="tabbar-icon-active">📝</text>
        <text class="tabbar-label tabbar-label-active">作业信息</text>
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
const goBack = () => {
  uni.navigateBack()
}

const goToPage = (page) => {
  const routes = {
    home: '/pages/parent/home',
    checkin: '/pages/parent/checkin',
    publish: '/pages/parent/publish-homework'
  }
  if (routes[page]) {
    uni.navigateTo({
      url: routes[page]
    })
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding-bottom: 128rpx;
}

.header {
  background: linear-gradient(to right, #0ea5e9, #3b82f6);
  padding: 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  transition: background-color 0.2s;
}

.back-btn:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.back-icon {
  font-size: 64rpx;
  color: #ffffff;
  font-weight: bold;
}

.header-title {
  flex: 1;
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}

.placeholder {
  width: 64rpx;
}

.content {
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.card, .section-card {
  background-color: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx;
}

.subject-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.subject-icon {
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 48rpx;
}

.subject-detail {
  display: flex;
  flex-direction: column;
}

.subject-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #1f2937;
}

.subject-date {
  font-size: 28rpx;
  color: #6b7280;
  margin-top: 8rpx;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
}

.status-completed {
  background-color: #d1fae5;
}

.badge-icon, .badge-text {
  color: #10b981;
}

.badge-icon {
  font-size: 32rpx;
}

.badge-text {
  font-size: 28rpx;
  font-weight: 600;
}

.section-header {
  padding: 24rpx 40rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.section-header-blue {
  background: linear-gradient(to right, #0ea5e9, #3b82f6);
}

.section-header-green {
  background: linear-gradient(to right, #10b981, #059669);
}

.section-header-purple {
  background: linear-gradient(to right, #a855f7, #ec4899);
}

.section-header-orange {
  background: linear-gradient(to right, #f59e0b, #f97316);
}

.section-icon, .section-title {
  color: #ffffff;
}

.section-icon {
  font-size: 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
}

.section-content {
  padding: 40rpx;
}

.requirement-box {
  background-color: #f9fafb;
  border-radius: 24rpx;
  padding: 32rpx;
  border-left: 8rpx solid #0ea5e9;
}

.requirement-text {
  font-size: 28rpx;
  color: #374151;
  line-height: 1.6;
  white-space: pre-line;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.image-item {
  aspect-ratio: 1;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #e5e7eb;
  border-radius: 16rpx;
  border: 4rpx solid #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 20rpx;
  color: #6b7280;
}

.submit-time {
  font-size: 28rpx;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.comment-box {
  background: linear-gradient(to right, #faf5ff, #fce7f3);
  border-radius: 24rpx;
  padding: 32rpx;
  border-left: 8rpx solid #a855f7;
}

.comment-text {
  font-size: 28rpx;
  color: #374151;
  line-height: 1.6;
  white-space: pre-line;
  display: block;
  margin-bottom: 24rpx;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: #a855f7;
}

.teacher-icon {
  font-size: 32rpx;
}

.teacher-name {
  color: #a855f7;
}

.divider {
  color: #d1d5db;
}

.comment-time {
  color: #6b7280;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.status-icon-wrapper {
  width: 128rpx;
  height: 128rpx;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-icon-large {
  font-size: 64rpx;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 48rpx;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8rpx;
}

.status-desc {
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

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

.tabbar-icon, .tabbar-icon-active {
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
