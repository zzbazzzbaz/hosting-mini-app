<template>
  <view class="page">
    <view class="header">
      <view class="header-content">
        <view class="logo-area">
          <view class="logo-icon">
            <uni-icons type="home" size="28" color="#fff" />
          </view>
          <view class="app-info">
            <text class="app-name">托管小程序</text>
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
        <view class="student-card" v-for="student in students" :key="student.id">
          <view class="student-header">
            <text class="student-name">{{ student.name }}</text>
            <text class="chip">余 {{ student.hours.remaining }} 课时</text>
          </view>

          <view class="student-body">
            <view class="row">
              <text class="muted">已上 {{ student.hours.used }}</text>
              <text class="muted">总计 {{ student.hours.total }}</text>
            </view>
            <view class="progress slim">
              <view
                class="progress-fill blue"
                :style="{ width: `${getStudentHourRate(student)}%` }"
              ></view>
            </view>
            <view class="row between">
              <text class="muted">作业完成 {{ getHomeworkRate(student) }}%</text>
              <view class="homework-tags">
                <text class="tag success">完成 {{ student.homework.finished }}</text>
                <text class="tag warn">未完 {{ student.homework.pending }}</text>
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
      <view class="notice-card">
        <view
          class="notice-item"
          v-for="notice in notices"
          :key="notice.id"
          @click="viewNotice(notice)"
        >
          <view class="notice-left">
            <view class="notice-icon" :class="{ muted: notice.status !== 0 }">
              <uni-icons type="chatbubble" size="20" color="#0ea5e9" />
            </view>
            <view class="notice-content">
              <text class="notice-title">{{ notice.title }}</text>
              <text class="notice-preview">{{ notice.content || '点击查看详情' }}</text>
              <text class="notice-time">{{ notice.time || '刚刚' }}</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#d1d5db" />
        </view>
        <view class="notice-empty" v-if="notices.length === 0">
          <uni-icons type="info" size="48" color="#d1d5db" />
          <text class="empty-text">暂无公告通知</text>
        </view>
      </view>
    </view>

    <ParentTabBar activeTab="home" />
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ParentTabBar from '@/components/ParentTabBar.vue'
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
    uni.showToast({
      title: '获取首页数据失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

const viewNotice = (notice) => {
  uni.showModal({
    title: notice.title,
    content: notice.content || '暂无公告详情',
    showCancel: false,
    confirmText: '知道了',
  })
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
  gap: 20rpx;
}

.student-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.06);
}

.student-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.student-name {
  font-size: 34rpx;
  font-weight: 700;
  color: #0f172a;
}

.chip {
  background: #eef2ff;
  color: #4338ca;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
}

.student-body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row.between {
  margin-top: 6rpx;
}

.muted {
  font-size: 26rpx;
  color: #6b7280;
}

.homework-tags {
  display: flex;
  gap: 10rpx;
}

.tag {
  font-size: 24rpx;
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
}

.tag.success {
  background: #ecfdf3;
  color: #15803d;
}

.tag.warn {
  background: #fff7ed;
  color: #c2410c;
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

.notice-card {
  background: #fff;
  border-radius: 28rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.06);
  padding: 24rpx;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 16rpx;
  border-radius: 20rpx;
  transition: background 0.2s;
}

.notice-item:active {
  background: #f3f4f6;
}

.notice-left {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.notice-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0f2fe;
}

.notice-icon.muted {
  background: #f3f4f6;
}

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.notice-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #0f172a;
}

.notice-preview {
  font-size: 26rpx;
  color: #4b5563;
  line-height: 1.4;
}

.notice-time {
  font-size: 24rpx;
  color: #9ca3af;
}

.notice-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 44rpx 0;
}
</style>
