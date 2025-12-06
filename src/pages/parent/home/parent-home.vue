<template>
  <view class="page">
    <view class="header">
      <view class="header-content">
        <view class="logo-area">
          <view class="logo-icon">
            <uni-icons type="home" size="28" color="#fff" />
          </view>
          <view class="app-info">
            <text class="app-name">开来伴学管家</text>
          </view>
        </view>
      </view>
      <view class="header-footer">
        <text class="pill">孩子 {{ students.length }} 名</text>
        <text v-if="loading" class="pill loading">同步中...</text>
      </view>
    </view>

    <view class="content">
      <view class="section-title">
        <uni-icons type="person" size="24" color="#1f2937" />
        <text class="title">孩子学习进度</text>
      </view>

      <view v-if="students.length" class="student-list">
        <view v-for="student in students" :key="student.id" class="student-group">
          <!-- 学生姓名标题 -->
          <view class="student-name-header">
            <text class="student-name-text">{{ student.name }}</text>
          </view>

          <!-- 课时进度卡片 -->
          <view class="progress-card hours-card">
            <view class="card-header">
              <view class="card-title-wrap">
                <uni-icons type="calendar" size="20" color="#2563eb" />
                <text class="card-title">课时进度</text>
              </view>
              <text class="hours-text"
                >已上 {{ student.hours.used }} / 总计 {{ student.hours.total }}</text
              >
            </view>
            <view class="card-body">
              <view class="progress-wrapper">
                <view class="progress slim">
                  <view
                    class="progress-fill blue"
                    :style="{ width: `${getStudentHourRate(student)}%` }"
                  ></view>
                </view>
                <text class="progress-percent">{{ getStudentHourRate(student) }}%</text>
              </view>
            </view>
          </view>

          <!-- 作业进度卡片 -->
          <view class="progress-card homework-card">
            <view class="card-header">
              <view class="card-title-wrap">
                <uni-icons type="compose" size="20" color="#059669" />
                <text class="card-title">作业进度</text>
              </view>
            </view>
            <view class="card-body">
              <view class="homework-stats">
                <view class="stat-item">
                  <text class="stat-label">已完成</text>
                  <text class="stat-value success">{{ student.homework.finished }}</text>
                </view>
                <view class="stat-divider"></view>
                <view class="stat-item">
                  <text class="stat-label">未完成</text>
                  <text class="stat-value warn">{{ student.homework.pending }}</text>
                </view>
                <view class="stat-divider"></view>
                <view class="stat-item">
                  <text class="stat-label">总计</text>
                  <text class="stat-value total">{{
                    student.homework.finished + student.homework.pending
                  }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <uni-icons type="contact" size="46" color="#9ca3af" />
        <text class="empty-text">暂未绑定孩子信息</text>
      </view>

      <view class="section-title section-notice">
        <uni-icons type="sound" size="24" color="#1f2937" />
        <text class="title">公告通知</text>
      </view>
      <NoticeCard :notices="notices" />
    </view>

    <ParentTabBar activeTab="home" />
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ParentTabBar from '@/components/ParentTabBar.vue'
import NoticeCard from '@/pages/common/components/NoticeCard.vue'
import { getParentHomeOverview } from '@/api/parent/home'

const loading = ref(false)
const notices = ref([])
const students = ref([])

const overallHours = computed(() => {
  return students.value.reduce(
    (acc, student) => {
      const used = Number(student.hours?.used || 0)
      const remaining = Number(student.hours?.remaining || 0)
      const total = Number(student.hours?.total || used + remaining)

      acc.used += used
      acc.remaining += remaining
      acc.total += total
      return acc
    },
    { used: 0, remaining: 0, total: 0 }
  )
})

const hoursCompletionRate = computed(() => {
  if (!overallHours.value.total) return 0
  return Math.min(100, Math.round((overallHours.value.used / overallHours.value.total) * 100))
})

const homeworkTotals = computed(() => {
  return students.value.reduce(
    (acc, student) => {
      const finished = Number(student.homework?.finished || 0)
      const pending = Number(student.homework?.pending || 0)
      const total = Number(student.homework?.total || finished + pending)

      acc.finished += finished
      acc.pending += pending
      acc.total += total
      return acc
    },
    { finished: 0, pending: 0, total: 0 }
  )
})

const homeworkRate = computed(() => {
  if (!homeworkTotals.value.total) return 0
  return Math.min(
    100,
    Math.round((homeworkTotals.value.finished / homeworkTotals.value.total) * 100)
  )
})

const getStudentHourRate = (student) => {
  if (!student) return 0

  const total = Number(student.hours?.total || 0)
  const used = Number(student.hours?.used || 0)

  if (!total) return 0
  return Math.min(100, Math.round((used / total) * 100))
}

const getHomeworkRate = (student) => {
  if (!student) return 0

  const finished = Number(student.homework?.finished || 0)
  const pending = Number(student.homework?.pending || 0)
  const total = Number(student.homework?.total || finished + pending)

  if (!total) return 0
  return Math.min(100, Math.round((finished / total) * 100))
}

const fetchHomeData = async () => {
  loading.value = true
  try {
    const response = await getParentHomeOverview()
    const data = response?.data || {}

    notices.value = data.notices || []
    students.value = data.students || []
  } catch (error) {
    console.error('获取首页数据失败', error)
    await uni.showToast({
      title: '获取首页数据失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHomeData()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff, #e0f2fe);
  padding-bottom: 128rpx;
}

.header {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  padding: 48rpx;
  margin-bottom: 32rpx;
  border-radius: 0 0 36rpx 36rpx;
  box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.28);
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
  gap: 20rpx;
}

.logo-icon {
  width: 96rpx;
  height: 96rpx;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
}

.app-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.app-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
}

.app-sub {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.summary-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6rpx;
  color: #fff;
}

.summary-label {
  font-size: 26rpx;
  opacity: 0.9;
}

.summary-value {
  font-size: 56rpx;
  font-weight: 700;
}

.summary-sub {
  font-size: 24rpx;
  opacity: 0.8;
}

.header-footer {
  margin-top: 28rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.pill {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 24rpx;
}

.pill.secondary {
  background: rgba(255, 255, 255, 0.14);
}

.pill.loading {
  background: rgba(255, 255, 255, 0.12);
}

.content {
  padding: 0 48rpx 48rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin: 32rpx 0 20rpx;
}

.section-title .title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1f2937;
}

.section-notice {
  margin-top: 36rpx;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280rpx, 1fr));
  gap: 24rpx;
}

.stat-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.06);
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
  font-weight: 600;
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
  font-size: 52rpx;
  font-weight: bold;
  color: #0f172a;
}

.desc {
  font-size: 26rpx;
  color: #6b7280;
}

.progress {
  width: 100%;
  height: 18rpx;
  background: #f3f4f6;
  border-radius: 999rpx;
  overflow: hidden;
}

.progress.slim {
  height: 14rpx;
}

.progress-fill {
  height: 100%;
  border-radius: 999rpx;
  transition: width 0.25s ease;
}

.progress-fill.blue {
  background: #2563eb;
}

.progress-fill.green {
  background: #059669;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

/* 学生分组容器 */
.student-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

/* 学生姓名标题 */
.student-name-header {
  display: flex;
  align-items: center;
  padding: 0 8rpx;
}

.student-name-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #0f172a;
  position: relative;
  padding-left: 16rpx;
}

.student-name-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 28rpx;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  border-radius: 3rpx;
}

/* 进度卡片 */
.progress-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title-wrap {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
}

.hours-text {
  font-size: 24rpx;
  color: #6b7280;
  white-space: nowrap;
}

.progress-rate {
  font-size: 28rpx;
  font-weight: 700;
  color: #059669;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

/* 进度条包装 */
.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.progress-percent {
  font-size: 26rpx;
  font-weight: 600;
  color: #2563eb;
  min-width: 60rpx;
  text-align: right;
}

/* 作业统计 */
.homework-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 12rpx 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  flex: 1;
}

.stat-label {
  font-size: 24rpx;
  color: #9ca3af;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 700;
}

.stat-value.success {
  color: #059669;
}

.stat-value.warn {
  color: #ea580c;
}

.stat-value.total {
  color: #2563eb;
}

.stat-divider {
  width: 2rpx;
  height: 48rpx;
  background: #e5e7eb;
}

.empty-state {
  background: #fff;
  border-radius: 24rpx;
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}
</style>
