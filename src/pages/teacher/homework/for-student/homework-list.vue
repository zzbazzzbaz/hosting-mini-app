<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业详情列表" :showBack="true"/>

    <!-- 学生信息卡片 -->
    <view class="student-card">
      <view class="student-basic">
        <text class="name">{{ studentInfo.name }}</text>
        <view class="detail-row">
          <text class="detail">{{ studentInfo.school }}</text>
          <text class="detail grade">{{ studentInfo.grade }}</text>
          <text class="detail">{{ studentInfo.class }}</text>
        </view>
      </view>
      <view class="student-stats">
        <text class="stat completed">已完成: {{ studentInfo.completed }}</text>
        <text class="stat pending">未完成: {{ studentInfo.pending }}</text>
      </view>
    </view>

    <!-- 发布作业按钮 -->
    <view class="publish-button-container">
      <button class="publish-button" @click="onPublishHomework">发布作业</button>
    </view>

    <!-- 筛选区域 -->
    <view class="filter-section">
      <!-- 第一行：科目和状态 -->
      <view class="filter-row">
        <picker class="filter-picker" :range="subjectOptions" @change="onSubjectChange">
          <view class="picker-box">
            <text class="label">{{ currentSubject }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker class="filter-picker" :range="statusOptions" @change="onStatusChange">
          <view class="picker-box">
            <text class="label">{{ currentStatus }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      <!-- 第二行：日期 -->
      <view class="filter-row">
        <picker class="filter-picker" mode="date" :value="currentDate" @change="onDateChange">
          <view class="picker-box">
            <text class="label">{{ currentDate }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 作业列表 -->
    <view class="homework-list">
      <view
        v-if="filteredHomeworkList.length > 0"
        v-for="item in filteredHomeworkList"
        :key="item.id"
        class="homework-item"
        @tap="openHomeworkDetail(item)"
      >
        <!-- 第一行：科目 | 作业标题 | 状态 -->
        <view class="homework-main">
          <text class="subject">{{ item.subject }}</text>
          <text class="title">{{ item.title }}</text>
          <view :class="['status-badge', item.status === 'completed' ? 'status-completed' : 'status-pending']">
            <text>{{ item.status === 'completed' ? '已完成' : '未完成' }}</text>
          </view>
        </view>
        <!-- 第二行：发布时间 | 需要完成时间 -->
        <view class="homework-time">
          <text class="time-text">发布: {{ item.publishTime }}</text>
          <text class="time-text">截止: {{ item.deadline }}</text>
        </view>
      </view>

      <!-- 没有作业时显示空状态 -->
      <view v-else class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">今日暂无作业</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref, computed} from 'vue'
import {onLoad} from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'

// 学生信息
const studentInfo = ref({
  name: '张同学',
  school: '实验小学',
  grade: '一年级',
  class: '1班',
  completed: 10,
  pending: 2
})

// 当前选择的筛选项
const currentSubject = ref('请选择科目')
const currentStatus = ref('请选择状态')

// 获取当前年月和日期
const now = new Date()
const currentYear = now.getFullYear()
const currentMonthNum = now.getMonth() + 1
const currentDay = now.getDate()

// 时间筛选 - 默认为当天日期
const currentDate = ref(`${currentYear}-${String(currentMonthNum).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`)

// 筛选选项
const subjectOptions = ['请选择科目', '语文', '数学', '英语', '科学', '美术', '音乐', '体育']
const statusOptions = ['请选择状态', '已完成', '未完成']

// 作业列表数据
const homeworkList = ref([
  {
    id: 1,
    subject: '数学',
    title: '完成课后练习题1-10',
    date: '2025-10-26',
    publishTime: '10-25 14:30',
    deadline: '10-26 18:00',
    status: 'pending'
  },
  {
    id: 2,
    subject: '语文',
    title: '背诵古诗 字符很多怎么办',
    date: '2025-10-26',
    publishTime: '10-25 15:00',
    deadline: '10-26 20:00',
    status: 'completed'
  },
  {
    id: 3,
    subject: '英语',
    title: '抄写单词表Unit 3 wwwwwwwwwwwwwwwwwww',
    date: '2025-10-26',
    publishTime: '10-26 08:00',
    deadline: '10-26 17:00',
    status: 'pending'
  },
  {
    id: 4,
    subject: '数学',
    title: '预习下一章节内容',
    date: '2025-10-25',
    publishTime: '10-24 14:00',
    deadline: '10-25 19:00',
    status: 'completed'
  },
  {
    id: 5,
    subject: '科学',
    title: '观察植物生长并记录',
    date: '2025-10-25',
    publishTime: '10-24 10:00',
    deadline: '10-25 18:00',
    status: 'completed'
  },
  {
    id: 6,
    subject: '语文',
    title: '阅读课外书并写读后感',
    date: '2025-10-24',
    publishTime: '10-23 15:30',
    deadline: '10-24 21:00',
    status: 'pending'
  }
])

// 科目筛选器变化事件
const onSubjectChange = (e) => {
  const index = e.detail.value
  currentSubject.value = subjectOptions[index]
}

// 状态筛选器变化事件
const onStatusChange = (e) => {
  const index = e.detail.value
  currentStatus.value = statusOptions[index]
}

// 日期筛选器变化事件
const onDateChange = (e) => {
  currentDate.value = e.detail.value
}

// 根据筛选条件过滤作业列表
const filteredHomeworkList = computed(() => {
  let filtered = homeworkList.value

  // 按科目筛选
  if (currentSubject.value !== '请选择科目') {
    filtered = filtered.filter(item => item.subject === currentSubject.value)
  }

  // 按状态筛选
  if (currentStatus.value !== '请选择状态') {
    const statusValue = currentStatus.value === '已完成' ? 'completed' : 'pending'
    filtered = filtered.filter(item => item.status === statusValue)
  }

  // 按日期筛选
  if (currentDate.value) {
    filtered = filtered.filter(item => item.date === currentDate.value)
  }

  return filtered
})

const openHomeworkDetail = (item) => {
  if (!item?.id) return
  uni.navigateTo({
    url: `/pages/teacher/homework/for-student/homework-detail?id=${item.id}`
  })
}

// 发布作业按钮点击事件
const onPublishHomework = () => {
  // 跳转到发布作业页面
  uni.navigateTo({
    url: `/pages/teacher/homework/for-student/homework-publish?name=${encodeURIComponent(studentInfo.value.name || '')}`
  })
}

// 页面加载时获取学生ID（从URL参数）
onLoad((options) => {
  if (options.id) {
    // TODO: 根据ID从后端获取学生信息和作业列表
  }
})
</script>

<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 48rpx;
}

/* 学生信息卡片 */
.student-card {
  margin: 32rpx 48rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 学生基本信息 */
.student-basic {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

/* 学生姓名 */
.name {
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
}

/* 详细信息行 */
.detail-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

/* 详细信息 */
.detail {
  font-size: 26rpx;
  color: #6b7280;
}

/* 年级信息 */
.detail.grade {
  color: #0ea5e9;
  font-weight: 500;
}

/* 学生作业统计 */
.student-stats {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  text-align: right;
}

.stat {
  font-size: 26rpx;
  font-weight: 500;
}

.stat.completed {
  color: #10b981;
}

.stat.pending {
  color: #ef4444;
}

/* 发布作业按钮容器 */
.publish-button-container {
  margin: 0 48rpx 24rpx;
  padding: 0;
}

/* 发布作业按钮 */
.publish-button {
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
  border-radius: 24rpx;
  padding: 28rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
  transition: all 0.3s;
}

.publish-button::after {
  border: none;
}

/* 筛选区域 */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 24rpx 48rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 筛选行 */
.filter-row {
  display: flex;
  gap: 24rpx;
}

.filter-picker {
  flex: 1;
}

.picker-box {
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  font-size: 28rpx;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  font-size: 20rpx;
  color: #9ca3af;
  margin-left: 12rpx;
  flex-shrink: 0;
}

/* 作业列表 */
.homework-list {
  padding: 24rpx 48rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 作业列表项 */
.homework-item {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

/* 作业主要信息行 */
.homework-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

/* 科目（左对齐）*/
.subject {
  font-size: 28rpx;
  font-weight: bold;
  color: #1f2937;
  flex-shrink: 0;
  min-width: 80rpx;
}

/* 作业标题（居中，占据剩余空间）*/
.title {
  flex: 1;
  font-size: 30rpx;
  color: #374151;
  text-align: center;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 时间信息行 */
.homework-time {
  display: flex;
  justify-content: space-between;
  padding: 0 8rpx;
}

/* 时间文字（小字）*/
.time-text {
  font-size: 24rpx;
  color: #9ca3af;
}

/* 状态标签（右对齐）*/
.status-badge {
  display: inline-block;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;
}

/* 已完成状态 */
.status-completed {
  background: #dcfce7;
  color: #15803d;
}

/* 未完成状态 */
.status-pending {
  background: #fee2e2;
  color: #dc2626;
}

/* 空状态容器 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
  gap: 24rpx;
}

/* 空状态图标 */
.empty-icon {
  font-size: 120rpx;
  opacity: 0.3;
}

/* 空状态文字 */
.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
  font-weight: 500;
}
</style>
