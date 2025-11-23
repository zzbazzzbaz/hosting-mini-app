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
      <!-- 顶部卡片行 -->
      <view class="top-cards">
        <!-- 学生总数卡片 -->
        <view class="student-card">
          <view class="card-icon-wrapper student-bg">
            <uni-icons type="person-filled" size="28" color="#3b82f6"></uni-icons>
          </view>
          <text class="card-title">学生总数</text>
          <text class="student-value">{{ stats.totalStudents }}</text>
        </view>

        <!-- 签到卡片 -->
        <view class="checkin-card">
          <view class="card-icon-wrapper checkin-bg">
            <uni-icons type="calendar-filled" size="28" color="#10b981"></uni-icons>
          </view>
          <text class="card-title">今日签到</text>
          <view class="card-stats">
            <view class="stat-item">
              <text class="stat-num green">{{ stats.todayChecked }}</text>
              <text class="stat-text">已签到</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item">
              <text class="stat-num red">{{ stats.todayUnchecked }}</text>
              <text class="stat-text">未签到</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 作业卡片 -->
      <view class="homework-card">
        <view class="card-icon-wrapper homework-bg">
          <uni-icons type="compose" size="28" color="#8b5cf6"></uni-icons>
        </view>
        <text class="card-title">作业统计</text>
        <view class="card-stats-grid">
          <view class="grid-item">
            <text class="grid-num green">{{ stats.completedHomework }}</text>
            <text class="grid-label">累计完成</text>
          </view>
          <view class="grid-item">
            <text class="grid-num red">{{ stats.pendingHomework }}</text>
            <text class="grid-label">累计未完成</text>
          </view>
          <view class="grid-item">
            <text class="grid-num green">{{ stats.todayCompleted }}</text>
            <text class="grid-label">今日完成</text>
          </view>
          <view class="grid-item">
            <text class="grid-num orange">{{ stats.todayPending }}</text>
            <text class="grid-label">今日待完成</text>
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
import { ref, onMounted, onUnmounted } from 'vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'
import { getTeacherHomeData } from '@/api/teacher/home'

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
  totalStudents: 0, // 学生总数
  todayChecked: 0, // 今日已签到
  todayUnchecked: 0, // 今日未签到
  completedHomework: 0, // 累计完成作业
  pendingHomework: 0, // 累计未完成作业
  todayCompleted: 0, // 今日完成作业
  todayPending: 0, // 今日待完成作业
})

// 公告通知数据
const notices = ref([])

/**
 * 加载首页数据
 */
const loadHomeData = async () => {
  try {
    const response = await getTeacherHomeData()
    if (response.code === 200 && response.data) {
      const data = response.data
      // 更新统计数据
      stats.value = {
        totalStudents: data.studentCount,
        todayChecked: data.signinCount,
        todayUnchecked: data.noSigninCount,
        completedHomework: data.sumFinishCount,
        pendingHomework: data.noSumFinishCount,
        todayCompleted: data.finishCount,
        todayPending: data.noFinishCount,
      }
      // 更新通知列表
      notices.value = data.notices.map((item) => ({
        id: item.id,
        type: 'normal',
        icon: 'chatbubble',
        color: '#3b82f6',
        title: item.title,
        time: item.time,
        content: item.content,
      }))
    }
  } catch (error) {
    console.error('加载首页数据失败:', error)
    await uni.showToast({
      title: '数据加载失败',
      icon: 'none',
    })
  }
}

// 查看公告详情
const viewNotice = (notice) => {
  uni.showModal({
    title: notice.title,
    content: notice.content || '暂无详细内容',
    showCancel: false,
    confirmText: '确认',
  })
}

/**
 * 组件挂载时启动定时器并加载数据
 */
onMounted(() => {
  updateTime()
  // 每分钟更新一次时间
  timer = setInterval(updateTime, 60000)
  // 加载首页数据
  loadHomeData()
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
  padding: 0 32rpx;
}

/* 顶部卡片行 */
.top-cards {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

/* 学生总数卡片 */
.student-card {
  flex: 1;
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.student-bg {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.student-value {
  font-size: 56rpx;
  font-weight: bold;
  color: #1f2937;
  margin-top: 8rpx;
}

/* 签到卡片 */
.checkin-card {
  flex: 1;
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 作业卡片 */
.homework-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  margin-bottom: 32rpx;
}

.card-icon-wrapper {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.checkin-bg {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
}

.homework-bg {
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
}

.card-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 20rpx;
}

/* 签到卡片统计 */
.card-stats {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1;
  align-items: center;
}

.stat-num {
  font-size: 40rpx;
  font-weight: bold;
}

.stat-text {
  font-size: 22rpx;
  color: #6b7280;
}

.stat-divider {
  width: 2rpx;
  height: 48rpx;
  background: #e5e7eb;
}

/* 作业卡片统计 */
.card-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx 32rpx;
}

.grid-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.grid-num {
  font-size: 40rpx;
  font-weight: bold;
}

.grid-label {
  font-size: 24rpx;
  color: #6b7280;
}

/* 颜色类 */
.green {
  color: #10b981;
}

.red {
  color: #ef4444;
}

.orange {
  color: #f97316;
}

/* 区块标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.section-title .title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
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
