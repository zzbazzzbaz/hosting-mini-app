<template>
  <view class="page">
    <!-- 顶部欢迎区 -->
    <view class="header-section">
      <view class="header-content">
        <!-- Logo图标 -->
        <view class="logo-circle">
          <image src="/static/logo.png" class="logo-image" mode="aspectFit"></image>
        </view>

        <!-- 欢迎文字 -->
        <text class="header-title">托管小程序</text>
        <text class="header-subtitle">家长与教师的沟通桥梁</text>
      </view>
    </view>

    <!-- 主内容区 -->
    <view class="main-content">
      <!-- 登录提示卡片 -->
      <view class="login-prompt-card">
        <view class="lock-icon-wrapper">
          <uni-icons type="locked" size="50" color="#3b82f6"></uni-icons>
        </view>
        <text class="prompt-title">请先登录</text>
        <text class="prompt-desc">登录后即可查看孩子的学习情况</text>

        <!-- 登录按钮 -->
        <button class="goto-login-btn" @click="gotoLogin">立即登录</button>
      </view>

      <!-- 功能介绍 -->
      <view class="features-section">
        <view class="section-header">
          <uni-icons type="star" size="24" color="#1f2937"></uni-icons>
          <text class="section-title">主要功能</text>
        </view>

        <view class="features-grid">
          <!-- 功能卡片1 - 学习数据 -->
          <view class="feature-card">
            <view class="feature-icon-wrapper feature-icon-blue">
              <uni-icons type="bars" size="28" color="#ffffff"></uni-icons>
            </view>
            <text class="feature-title">学习数据</text>
            <text class="feature-desc">实时查看孩子的学习进度和统计数据</text>
          </view>

          <!-- 功能卡片2 - 作业管理 -->
          <view class="feature-card">
            <view class="feature-icon-wrapper feature-icon-green">
              <uni-icons type="compose" size="28" color="#ffffff"></uni-icons>
            </view>
            <text class="feature-title">作业管理</text>
            <text class="feature-desc">查看作业详情,了解完成情况</text>
          </view>

          <!-- 功能卡片3 - 签到记录 -->
          <view class="feature-card">
            <view class="feature-icon-wrapper feature-icon-purple">
              <uni-icons type="checkmarkempty" size="28" color="#ffffff"></uni-icons>
            </view>
            <text class="feature-title">签到记录</text>
            <text class="feature-desc">查看孩子每日签到情况和照片</text>
          </view>

          <!-- 功能卡片4 - 发布作业 -->
          <view class="feature-card">
            <view class="feature-icon-wrapper feature-icon-orange">
              <uni-icons type="plusempty" size="28" color="#ffffff"></uni-icons>
            </view>
            <text class="feature-title">发布作业</text>
            <text class="feature-desc">为孩子上传和提交作业内容</text>
          </view>
        </view>
      </view>

      <!-- 平台优势 -->
      <view class="advantage-card">
        <view class="advantage-header">
          <view class="advantage-icon-wrapper">
            <uni-icons type="star" size="30" color="#ffffff"></uni-icons>
          </view>
          <view class="advantage-content">
            <text class="advantage-title">为什么选择我们?</text>
            <view class="advantage-list">
              <view class="advantage-item">
                <uni-icons type="checkmarkempty" size="18" color="#10b981"></uni-icons>
                <text class="advantage-text">实时了解孩子学习动态</text>
              </view>
              <view class="advantage-item">
                <uni-icons type="checkmarkempty" size="18" color="#10b981"></uni-icons>
                <text class="advantage-text">与教师便捷沟通交流</text>
              </view>
              <view class="advantage-item">
                <uni-icons type="checkmarkempty" size="18" color="#10b981"></uni-icons>
                <text class="advantage-text">数据安全有保障</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <view class="tabbar">
      <view class="tabbar-item tabbar-item-active">
        <uni-icons type="home-filled" :size="26" color="#0ea5e9"></uni-icons>
        <text class="tabbar-label tabbar-label-active">首页</text>
      </view>
      <view class="tabbar-item tabbar-item-disabled">
        <uni-icons type="compose" :size="26" color="#d1d5db"></uni-icons>
        <text class="tabbar-label-disabled">作业信息</text>
      </view>
      <view class="tabbar-item tabbar-item-disabled">
        <uni-icons type="checkmarkempty" :size="26" color="#d1d5db"></uni-icons>
        <text class="tabbar-label-disabled">签到信息</text>
      </view>
      <view class="tabbar-item tabbar-item-disabled">
        <uni-icons type="plusempty" :size="26" color="#d1d5db"></uni-icons>
        <text class="tabbar-label-disabled">发布作业</text>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 跳转到登录页
 */
const gotoLogin = () => {
  uni.navigateTo({
    url: '/pages/common/login'
  })
}
</script>

<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding-bottom: 128rpx; /* 底部导航栏高度 */
}

/* 顶部欢迎区 */
.header-section {
  background: linear-gradient(to right, #0ea5e9, #3b82f6);
  border-bottom-left-radius: 48rpx;
  border-bottom-right-radius: 48rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  padding: 96rpx 48rpx;
  margin-bottom: 48rpx;
}

.header-content {
  text-align: center;
}

.logo-circle {
  width: 192rpx;
  height: 192rpx;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 16rpx 32rpx rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32rpx;
}

.logo-image {
  width: 120rpx;
  height: 120rpx;
}


.header-title {
  display: block;
  font-size: 60rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16rpx;
}

.header-subtitle {
  display: block;
  font-size: 28rpx;
  color: #bae6fd;
}

/* 主内容区 */
.main-content {
  padding: 0 48rpx;
}

/* 登录提示卡片 */
.login-prompt-card {
  background-color: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  padding: 64rpx;
  text-align: center;
  margin-bottom: 48rpx;
}

.lock-icon-wrapper {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32rpx;
}

.prompt-title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16rpx;
}

.prompt-desc {
  display: block;
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 48rpx;
}

/* 登录按钮 */
.goto-login-btn {
  width: 100%;
  background: linear-gradient(to right, #0ea5e9, #3b82f6);
  color: #ffffff;
  padding: 32rpx;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 16rpx 32rpx rgba(14, 165, 233, 0.25);
  border: none;
  transition: all 0.2s;
}

.goto-login-btn:active {
  transform: translateY(2rpx);
}

/* 功能介绍部分 */
.features-section {
  margin-bottom: 48rpx;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
}


.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1f2937;
}

/* 功能卡片网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx;
}

.feature-card {
  background-color: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  padding: 40rpx;
  transition: all 0.3s;
}

.feature-icon-wrapper {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.feature-icon-blue {
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
}

.feature-icon-green {
  background: linear-gradient(135deg, #10b981, #059669);
}

.feature-icon-purple {
  background: linear-gradient(135deg, #a855f7, #ec4899);
}

.feature-icon-orange {
  background: linear-gradient(135deg, #f97316, #dc2626);
}


.feature-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8rpx;
}

.feature-desc {
  display: block;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.5;
}

/* 平台优势卡片 */
.advantage-card {
  background: linear-gradient(to right, #fffbeb, #fef3c7);
  border-radius: 32rpx;
  padding: 40rpx;
  border-left: 8rpx solid #fbbf24;
}

.advantage-header {
  display: flex;
  gap: 24rpx;
}

.advantage-icon-wrapper {
  flex-shrink: 0;
  width: 80rpx;
  height: 80rpx;
  background-color: #fbbf24;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}


.advantage-content {
  flex: 1;
}

.advantage-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16rpx;
}

.advantage-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.advantage-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 28rpx;
  color: #4b5563;
}

.advantage-text {
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
}

.tabbar-item-active {
  color: #0ea5e9;
}

.tabbar-item-disabled {
  color: #d1d5db;
  cursor: not-allowed;
}


.tabbar-label {
  font-size: 24rpx;
}

.tabbar-label-active {
  font-weight: 500;
  color: #0ea5e9;
}

.tabbar-label-disabled {
  color: #d1d5db;
}
</style>
