<template>
  <view class="page">
    <!-- 头部导航 -->
    <view class="header">
      <view class="header-content">
        <view class="logo-area">
          <view class="logo-icon">
            <uni-icons type="home-filled" size="32" color="#fff"></uni-icons>
          </view>
          <view class="app-info">
            <text class="app-name">托管小程序</text>
            <text class="app-slogan">教师工作台</text>
          </view>
        </view>
        <view class="header-time">
          <text class="time-text">{{ currentTime }}</text>
          <text class="date-text">{{ currentDate }}</text>
        </view>
      </view>
    </view>
    <view class="content">
      <!-- 关键数据概览 -->
      <view class="section-title">
        <uni-icons type="bars" size="24" color="#1f2937"></uni-icons>
        <text class="title">数据概览</text>
      </view>
      <view class="stats-row-3">
        <view class="stat-card stat-blue">
          <view class="icon-box icon-blue">
            <uni-icons type="person" size="24" color="#3b82f6"></uni-icons>
          </view>
          <text class="value">{{ stats.totalStudents }}</text>
          <text class="label">学生总数</text>
        </view>
        <view class="stat-card stat-green" @click="goToCheckin">
          <view class="icon-box icon-green">
            <uni-icons type="checkmarkempty" size="24" color="#10b981"></uni-icons>
          </view>
          <text class="value">{{ checkinRate }}%</text>
          <text class="label">今日签到率</text>
        </view>
        <view class="stat-card stat-purple" @click="goToHomework">
          <view class="icon-box icon-purple">
            <uni-icons type="paperplane" size="24" color="#8b5cf6"></uni-icons>
          </view>
          <text class="value">{{ homeworkRate }}%</text>
          <text class="label">作业完成率</text>
        </view>
      </view>

      <!-- 签到详情卡片 -->
      <view class="detail-card checkin-card" @click="goToCheckin">
        <view class="card-header">
          <view class="header-left">
            <uni-icons type="calendar" size="24" color="#3b82f6"></uni-icons>
            <text class="card-title">今日签到详情</text>
          </view>
          <uni-icons type="forward" size="20" color="#9ca3af"></uni-icons>
        </view>
        <view class="detail-stats">
          <view class="detail-item">
            <view class="detail-icon-box icon-green">
              <uni-icons type="checkmarkempty" size="20" color="#10b981"></uni-icons>
            </view>
            <view class="detail-info">
              <text class="detail-value">{{ stats.todayChecked }}</text>
              <text class="detail-label">已签到</text>
            </view>
          </view>
          <view class="detail-divider"></view>
          <view class="detail-item">
            <view class="detail-icon-box icon-red">
              <uni-icons type="closeempty" size="20" color="#ef4444"></uni-icons>
            </view>
            <view class="detail-info">
              <text class="detail-value">{{ stats.todayUnchecked }}</text>
              <text class="detail-label">未签到</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 作业详情卡片 -->
      <view class="detail-card homework-card" @click="goToHomework">
        <view class="card-header">
          <view class="header-left">
            <uni-icons type="compose" size="24" color="#8b5cf6"></uni-icons>
            <text class="card-title">作业统计详情</text>
          </view>
          <uni-icons type="forward" size="20" color="#9ca3af"></uni-icons>
        </view>
        <view class="homework-grid">
          <view class="homework-item">
            <text class="homework-label">累计完成</text>
            <text class="homework-value green">{{ stats.completedHomework }}</text>
          </view>
          <view class="homework-item">
            <text class="homework-label">累计未完成</text>
            <text class="homework-value red">{{ stats.pendingHomework }}</text>
          </view>
          <view class="homework-item">
            <text class="homework-label">今日完成</text>
            <text class="homework-value green">{{ stats.todayCompleted }}</text>
          </view>
          <view class="homework-item">
            <text class="homework-label">今日待完成</text>
            <text class="homework-value orange">{{ stats.todayPending }}</text>
          </view>
        </view>
      </view>

      <!-- 公告通知卡片 -->
      <view class="section-title" style="margin-top: 32rpx">
        <uni-icons type="sound" size="24" color="#1f2937"></uni-icons>
        <text class="title">公告通知</text>
      </view>
      <view class="notice-card">
        <view
          class="notice-item"
          v-for="(notice, index) in notices"
          :key="index"
          @click="viewNotice(notice)"
        >
          <view class="notice-left">
            <view class="notice-icon" :class="notice.type">
              <uni-icons :type="notice.icon" size="20" :color="notice.color"></uni-icons>
            </view>
            <view class="notice-content">
              <text class="notice-title">{{ notice.title }}</text>
              <text class="notice-time">{{ notice.time }}</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#d1d5db"></uni-icons>
        </view>
        <view class="notice-empty" v-if="notices.length === 0">
          <uni-icons type="info" size="48" color="#d1d5db"></uni-icons>
          <text class="empty-text">暂无公告通知</text>
        </view>
      </view>
    </view>
    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="home" />
  </view>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'

/**
 * 当前时间和日期
 */
const currentTime = ref('')
const currentDate = ref('')
let timer = null

/**
 * 更新时间显示
 */
const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDay = weekDays[now.getDay()]
  currentDate.value = `${year}/${month}/${day} 周${weekDay}`
}

// 统计数据
const stats = ref({
  totalStudents: 20, // 学生总数
  todayChecked: 18, // 今日已签到
  todayUnchecked: 2, // 今日未签到
  completedHomework: 186, // 累计完成作业
  pendingHomework: 32, // 累计未完成作业
  todayCompleted: 15, // 今日完成作业
  todayPending: 6, // 今日待完成作业
})

// 计算签到率
const checkinRate = computed(() => {
  if (stats.value.totalStudents === 0) return 0
  return Math.round((stats.value.todayChecked / stats.value.totalStudents) * 100)
})

// 计算作业完成率（基于累计数据）
const homeworkRate = computed(() => {
  const total = stats.value.completedHomework + stats.value.pendingHomework
  if (total === 0) return 0
  return Math.round((stats.value.completedHomework / total) * 100)
})

// 公告通知数据
const notices = ref([
  {
    id: 1,
    type: 'important',
    icon: 'info',
    color: '#ef4444',
    title: '关于期末考试安排的通知',
    time: '2小时前',
  },
  {
    id: 2,
    type: 'normal',
    icon: 'chatbubble',
    color: '#3b82f6',
    title: '下周一开始使用新教材',
    time: '5小时前',
  },
  {
    id: 3,
    type: 'normal',
    icon: 'calendar',
    color: '#10b981',
    title: '本周五下午教研活动',
    time: '1天前',
  },
])

// 导航方法
const goToCheckin = () => uni.navigateTo({ url: '/pages/teacher/checkin/teacher-checkin' })
const goToHomework = () => uni.navigateTo({ url: '/pages/teacher/homework/teacher-homework-list' })

// 查看公告详情
const viewNotice = (notice) => {
  uni.showModal({
    title: notice.title,
    content: '这里显示公告详细内容...',
    showCancel: false, // 不显示取消按钮
    confirmText: '确认',
  })
}

/**
 * 组件挂载时启动定时器
 */
onMounted(() => {
  updateTime()
  // 每分钟更新一次时间
  timer = setInterval(updateTime, 60000)
})

/**
 * 组件卸载时清除定时器
 */
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>
<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-bottom: 128rpx;
}

/* 顶部Header区域 */
.header {
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  padding: 48rpx;
  margin-bottom: 32rpx;
  border-radius: 0 0 32rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(14, 165, 233, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.app-slogan {
  font-size: 24rpx;
  color: #bae6fd;
}

.header-time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.time-text {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
  letter-spacing: 2rpx;
}

.date-text {
  font-size: 24rpx;
  color: #bae6fd;
}

/* 内容区域 */
.content {
  padding: 0 48rpx;
}

/* 区块标题 */
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

/* 统计卡片行布局 - 3列 */
.stats-row-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
  margin-bottom: 32rpx;
}

/* 统计卡片 */
.stat-card {
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  padding: 32rpx;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.stat-card:active {
  transform: scale(0.98);
}

/* 卡片左侧边框颜色 */
.stat-blue {
  border-left: 8rpx solid #3b82f6;
}

.stat-green {
  border-left: 8rpx solid #10b981;
}

.stat-purple {
  border-left: 8rpx solid #8b5cf6;
}

/* 图标盒子 */
.icon-box {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.icon-blue {
  background: #dbeafe;
}

.icon-green {
  background: #d1fae5;
}

.icon-purple {
  background: #ede9fe;
}

.icon-red {
  background: #fee2e2;
}

/* 数值 */
.value {
  display: block;
  font-size: 60rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.stat-blue .value {
  color: #3b82f6;
}

.stat-green .value {
  color: #10b981;
}

.stat-purple .value {
  color: #8b5cf6;
}

/* 标签 */
.label {
  font-size: 24rpx;
  color: #9ca3af;
  text-align: center;
}

/* 详情卡片样式 */
.detail-card {
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  padding: 32rpx;
  margin-bottom: 24rpx;
  transition: all 0.3s;
}

.detail-card:active {
  transform: scale(0.99);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
}

/* 签到详情卡片 */
.checkin-card {
  border-left: 8rpx solid #3b82f6;
}

.detail-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.detail-icon-box {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.detail-value {
  font-size: 48rpx;
  font-weight: bold;
}

.detail-label {
  font-size: 24rpx;
  color: #9ca3af;
}

.detail-divider {
  width: 2rpx;
  height: 80rpx;
  background: #e5e7eb;
}

/* 作业详情卡片 */
.homework-card {
  border-left: 8rpx solid #8b5cf6;
}

.homework-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx;
}

.homework-item {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.homework-label {
  font-size: 28rpx;
  color: #6b7280;
}

.homework-value {
  font-size: 56rpx;
  font-weight: bold;
}

.homework-value.green {
  color: #10b981;
}

.homework-value.red {
  color: #ef4444;
}

.homework-value.orange {
  color: #f97316;
}

/* 公告通知卡片 */
.notice-card {
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  padding: 32rpx;
  margin-bottom: 48rpx; /* 增加与底部导航的间距 */
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f3f4f6;
  transition: all 0.3s;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-item:active {
  background: #f9fafb;
  border-radius: 16rpx;
}

.notice-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
}

.notice-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-icon.important {
  background: #fee2e2;
}

.notice-icon.normal {
  background: #dbeafe;
}

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.notice-title {
  font-size: 28rpx;
  color: #1f2937;
  font-weight: 500;
}

.notice-time {
  font-size: 24rpx;
  color: #9ca3af;
}

/* 空状态 */
.notice-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  gap: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}
</style>
