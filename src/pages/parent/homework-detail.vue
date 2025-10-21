<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业详情" :showBack="true" />

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
          <!-- 图片网格：最多显示7张 -->
          <view class="image-grid">
            <view
              class="image-item"
              v-for="(img, index) in displayImages"
              :key="index"
              @click="previewImage(index)"
            >
              <image :src="img" class="homework-image" mode="aspectFill" />
              <!-- 第7张图片显示剩余数量角标 -->
              <view v-if="index === 6 && hasMoreImages" class="more-badge">
                <text class="more-text">+{{ remainingCount }}</text>
              </view>
            </view>
          </view>

          <!-- 查看全部按钮（仅当图片超过7张时显示） -->
          <view v-if="hasMoreImages" class="view-all-btn" @click="previewImage(0)">
            <text class="btn-icon">🖼️</text>
            <text class="btn-text">查看全部{{ homeworkImages.length }}张图片</text>
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

    <!-- 使用ParentTabBar组件 -->
    <ParentTabBar activeTab="homework" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'

// 作业图片列表（使用测试图片）
// 微信小程序中需要使用 /static/ 开头的绝对路径
const homeworkImages = ref([
  '/static/test/1.jpg',
  '/static/test/2.jpg',
  '/static/test/3.jpg',
  '/static/test/4.jpg',
  '/static/test/5.jpg',
  '/static/test/6.jpg',
  '/static/test/7.jpg',
  '/static/test/3.jpg',
  '/static/test/4.jpg',
  '/static/test/5.jpg'
])

/**
 * 显示的图片列表（最多7张）
 */
const displayImages = computed(() => {
  return homeworkImages.value.slice(0, 7)
})

/**
 * 是否有更多图片
 */
const hasMoreImages = computed(() => {
  return homeworkImages.value.length > 7
})

/**
 * 剩余图片数量
 */
const remainingCount = computed(() => {
  return homeworkImages.value.length - 7
})

/**
 * 预览图片
 * @param {number} current - 当前图片索引
 */
const previewImage = async (current) => {
  try {
    // 微信小程序的 uni.previewImage 对本地图片支持有限
    // 需要先通过 getImageInfo 获取图片的临时路径
    const imagePromises = homeworkImages.value.map(src => {
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src: src,
          success: (res) => {
            console.log('getImageInfo成功:', res.path)
            resolve(res.path) // 返回图片的临时路径
          },
          fail: (err) => {
            console.error('getImageInfo失败:', err)
            resolve(src) // 失败时返回原路径
          }
        })
      })
    })

    // 等待所有图片信息获取完成
    const imagePaths = await Promise.all(imagePromises)

    console.log('预览图片 - 转换后的路径:', imagePaths)

    // 使用转换后的路径预览图片
    uni.previewImage({
      current: imagePaths[current], // 当前图片的临时路径
      urls: imagePaths, // 所有图片的临时路径
      success: () => {
        console.log('预览图片成功')
      },
      fail: (err) => {
        console.error('预览图片失败:', err)
        uni.showToast({
          title: '预览失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  } catch (err) {
    console.error('预览过程出错:', err)
    uni.showToast({
      title: '预览失败',
      icon: 'none',
      duration: 2000
    })
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding-top:144rpx;padding-bottom: 128rpx;
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

/* 图片网格 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

/* 图片项容器 */
.image-item {
  position: relative;  /* 为角标定位 */
  aspect-ratio: 1;
  border-radius: 16rpx;
  overflow: hidden;
  border: 4rpx solid #10b981;
  cursor: pointer;
  transition: all 0.2s;
}

.image-item:active {
  transform: scale(0.95);
  opacity: 0.8;
}

/* 作业图片 */
.homework-image {
  width: 100%;
  height: 100%;
}

/* 更多图片角标（显示在第7张图片右上角） */
.more-badge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);  /* 加深半透明黑色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;  /* 确保在图片上方 */
}

/* 角标文字 */
.more-text {
  font-size: 56rpx;  /* 增大字号 */
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);  /* 添加文字阴影 */
}

/* 查看全部按钮 */
.view-all-btn {
  background: linear-gradient(to right, #10b981, #059669);
  border-radius: 24rpx;
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* 按钮图标 */
.btn-icon {
  font-size: 36rpx;
}

/* 按钮文字 */
.btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
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
</style>
