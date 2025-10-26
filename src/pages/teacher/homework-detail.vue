<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业详情列表" :showBack="true" />

    <!-- 学生信息卡片 -->
    <view class="student-card">
      <view class="student-basic">
        <text class="name">{{studentInfo.name}}</text>
        <view class="detail-row">
          <text class="detail">{{studentInfo.school}}</text>
          <text class="detail grade">{{studentInfo.grade}}</text>
          <text class="detail">{{studentInfo.class}}</text>
        </view>
      </view>
      <view class="student-stats">
        <text class="stat completed">已完成: {{studentInfo.completed}}</text>
        <text class="stat pending">未完成: {{studentInfo.pending}}</text>
      </view>
    </view>

    <!-- 筛选区域 -->
    <view class="filter-section">
      <picker class="filter-picker" :range="subjectOptions" @change="onSubjectChange">
        <view class="picker-box">
          <text class="label">{{currentSubject}}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
      <picker class="filter-picker" :range="statusOptions" @change="onStatusChange">
        <view class="picker-box">
          <text class="label">{{currentStatus}}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
    </view>

    <!-- 作业列表 -->
    <view class="homework-list">
      <view v-for="item in filteredHomeworkList" :key="item.id" class="homework-item">
        <view class="homework-top">
          <text class="subject">{{item.subject}}</text>
          <text class="date">{{item.date}}</text>
        </view>
        <view :class="['status-badge', item.status === 'completed' ? 'status-completed' : 'status-pending']">
          <text>{{item.status === 'completed' ? '✓ 已完成' : '✗ 未完成'}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
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

// 筛选选项
const subjectOptions = ['请选择科目', '语文', '数学', '英语', '科学', '美术', '音乐', '体育']
const statusOptions = ['请选择状态', '已完成', '未完成']

// 作业列表数据
const homeworkList = ref([
  {id: 1, subject: '数学', date: '2025-10-21', status: 'completed'},
  {id: 2, subject: '语文', date: '2025-10-21', status: 'pending'},
  {id: 3, subject: '英语', date: '2025-10-20', status: 'completed'},
  {id: 4, subject: '数学', date: '2025-10-20', status: 'pending'},
  {id: 5, subject: '科学', date: '2025-10-19', status: 'completed'},
  {id: 6, subject: '语文', date: '2025-10-19', status: 'pending'}
])

// 科目筛选器变化事件
const onSubjectChange = (e) => {
  const index = e.detail.value
  currentSubject.value = subjectOptions[index]
  console.log('选择科目:', currentSubject.value)
}

// 状态筛选器变化事件
const onStatusChange = (e) => {
  const index = e.detail.value
  currentStatus.value = statusOptions[index]
  console.log('选择状态:', currentStatus.value)
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

  return filtered
})

// 页面加载时获取学生ID（从URL参数）
onLoad((options) => {
  if (options.id) {
    console.log('学生ID:', options.id)
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

/* 筛选区域 */
.filter-section {
  display: flex;
  gap: 24rpx;
  padding: 24rpx 48rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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
}

/* 作业顶部信息 */
.homework-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

/* 科目 */
.subject {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
}

/* 日期 */
.date {
  font-size: 26rpx;
  color: #9ca3af;
}

/* 状态标签 */
.status-badge {
  display: inline-block;
  padding: 12rpx 24rpx;
  border-radius: 32rpx;
  font-size: 26rpx;
  font-weight: 500;
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
</style>
