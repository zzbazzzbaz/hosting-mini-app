<template>
  <view class="page">
    <view class="header">
      <view class="header-content">
        <view class="logo-area">
          <view class="logo-icon">
            <uni-icons type="home" size="28" color="#fff"/>
          </view>
          <view class="app-info">
            <text class="app-name">托管小程序</text>
          </view>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="section-title">
        <uni-icons type="bars" size="24" color="#1f2937"/>
        <text class="title">学习数据总览</text>
      </view>
      <view class="stats-row">
        <view class="stat-card stat-blue">
          <view class="stat-header">
            <text class="label">累计课时</text>
            <view class="icon-box icon-blue">
              <uni-icons type="calendar" size="20" color="#2563eb"/>
            </view>
          </view>
          <text class="value">{{ stats.totalHours }}</text>
          <text class="desc">完成 {{ stats.completedHours }} · 待学 {{ stats.pendingHours }}</text>
        </view>

        <view class="stat-card stat-green">
          <view class="stat-header">
            <text class="label">作业完成率</text>
            <view class="icon-box icon-green">
              <uni-icons type="checkbox" size="20" color="#059669"/>
            </view>
          </view>
          <text class="value">{{ homeworkRate }}%</text>
          <text class="desc">已完成 {{ stats.completedHomework }} · 未完成 {{ stats.pendingHomework }}</text>
        </view>
      </view>

      <view class="section-title section-notice">
        <uni-icons type="sound" size="24" color="#1f2937"/>
        <text class="title">公告通知</text>
      </view>
      <view class="notice-card">
        <view class="notice-item" v-for="notice in notices" :key="notice.id" @click="viewNotice(notice)">
          <view class="notice-left">
            <view class="notice-icon" :class="notice.type">
              <uni-icons :type="notice.icon" size="20" :color="notice.color"/>
            </view>
            <view class="notice-content">
              <text class="notice-title">{{ notice.title }}</text>
              <text class="notice-time">{{ notice.time }}</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#d1d5db"/>
        </view>
        <view class="notice-empty" v-if="notices.length === 0">
          <uni-icons type="info" size="48" color="#d1d5db"/>
          <text class="empty-text">暂无公告通知</text>
        </view>
      </view>
    </view>

    <ParentTabBar activeTab="home"/>
  </view>
</template>

<script setup>
import {computed, ref} from 'vue'
import ParentTabBar from '@/components/ParentTabBar.vue'

const stats = ref({
  completedHours: 13,
  pendingHours: 5,
  totalHours: 18,
  completedHomework: 28,
  pendingHomework: 2,
  voicePractice: 6,
  readingCount: 12,
  latestScore: 92,
  teacherComments: 5
})

const homeworkRate = computed(() => {
  const total = stats.value.completedHomework + stats.value.pendingHomework
  if (total === 0) return 0
  return Math.round((stats.value.completedHomework / total) * 100)
})

const notices = ref([
  {
    id: 1,
    type: 'important',
    icon: 'info',
    color: '#ef4444',
    title: '周五家长会提醒',
    time: '2小时前'
  },
  {
    id: 2,
    type: 'normal',
    icon: 'chatbubble',
    color: '#3b82f6',
    title: '课程调整通知',
    time: '昨天'
  }
])

const viewNotice = (notice) => {
  uni.showModal({
    title: notice.title,
    content: '这里显示公告详细内容...',
    showCancel: false,
    confirmText: '确认'
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-bottom: 128rpx;
}

.header {
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  padding: 48rpx;
  margin-bottom: 32rpx;
  border-radius: 0 0 32rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(29, 78, 216, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32rpx;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.logo-icon {
  width: 96rpx;
  height: 96rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.app-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.app-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
}


.content {
  padding: 0 48rpx 48rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.section-title .title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1f2937;
}

.section-notice {
  margin-top: 32rpx;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280rpx, 1fr));
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.stat-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}


.stat-blue {
  border-left: 8rpx solid #2563eb;
}

.stat-green {
  border-left: 8rpx solid #059669;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 28rpx;
  color: #4b5563;
  font-weight: 500;
}

.icon-box {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue {
  background: #dbeafe;
}

.icon-green {
  background: #dcfce7;
}

.value {
  font-size: 56rpx;
  font-weight: bold;
  color: #111827;
}

.desc {
  font-size: 26rpx;
  color: #6b7280;
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}

.notice-card {
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  padding: 24rpx;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-radius: 24rpx;
  transition: background 0.2s;
}

.notice-item:active {
  background: #f3f4f6;
}

.notice-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.notice-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
}

.notice-time {
  font-size: 24rpx;
  color: #6b7280;
}

.notice-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 48rpx 0;
}
</style>
