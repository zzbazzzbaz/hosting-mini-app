<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业信息" />

    <!-- 筛选器区域（固定） -->
    <view class="filter-section">
      <!-- 第一行：科目、状态 -->
      <view class="filter-row">
        <picker class="filter-picker" :range="subjects" @change="onSubjectChange">
          <view class="picker-box">
            <text class="label">{{ currentSubject || '请选择科目'}}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker class="filter-picker" :range="statuses" @change="onStatusChange">
          <view class="picker-box">
            <text class="label">{{ currentStatus || '请选择状态'}}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      <!-- 第二行：发布时间、完成时间 -->
      <view class="filter-row">
        <picker class="filter-picker" mode="date" :value="currentPublishDate" @change="onPublishDateChange">
          <view class="picker-box">
            <text class="label">{{ currentPublishDate || '发布时间' }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker class="filter-picker" mode="date" :value="currentCompleteDate" @change="onCompleteDateChange">
          <view class="picker-box">
            <text class="label">{{ currentCompleteDate || '完成时间' }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 作业列表 -->
    <view class="list-container">
      <view
        v-for="(item, index) in filteredHomeworkList"
        :key="index"
        :class="['homework-item', item.status === 'pending' ? 'homework-item-pending' : '']"
        @tap="gotoDetail(item)"
      >
        <view class="homework-header">
          <view class="homework-left">
            <!-- 科目图标 -->
            <view :class="['homework-icon', `homework-icon-${item.color}`]">
              <text class="icon-text">{{ item.iconText }}</text>
            </view>
            <view class="homework-info">
              <text class="homework-subject">{{ item.subject }}</text>
              <text class="homework-date">发布：{{ item.publishDate }}</text>
              <text v-if="item.completeDate" class="homework-date">完成：{{ item.completeDate }}</text>
            </view>
          </view>
          <view :class="['status-badge', `status-${item.status}`]">
            <view class="status-dot"></view>
            <text class="status-text">{{ item.status === 'completed' ? '已完成' : '未完成' }}</text>
          </view>
        </view>
        <view class="homework-footer">
          <text :class="['footer-text', item.status === 'pending' ? 'footer-text-warning' : 'footer-text-normal']">
            {{ item.status === 'pending' ? '请尽快完成' : '点击查看详情' }}
          </text>
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more">
        <button class="load-more-btn">加载更多</button>
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

// 科目列表
const subjects = ['全部', '语文', '数学', '英语', '物理', '化学']
const currentSubject = ref('')

// 状态列表
const statuses = ['全部', '已完成', '未完成']
const currentStatus = ref('')

// 发布时间（日期选择器）
const currentPublishDate = ref('')

// 完成时间（日期选择器）
const currentCompleteDate = ref('')

// 作业列表数据（完整数据）
const homeworkList = ref([
  {
    subject: '数学',
    publishDate: '2025-10-15',
    completeDate: '2025-10-16',
    status: 'completed',
    iconText: '数',
    color: 'blue'
  },
  {
    subject: '英语',
    publishDate: '2025-10-15',
    completeDate: null,
    status: 'pending',
    iconText: '英',
    color: 'red'
  },
  {
    subject: '语文',
    publishDate: '2025-10-14',
    completeDate: '2025-10-15',
    status: 'completed',
    iconText: '语',
    color: 'green'
  },
  {
    subject: '物理',
    publishDate: '2025-10-13',
    completeDate: '2025-10-14',
    status: 'completed',
    iconText: '物',
    color: 'purple'
  },
  {
    subject: '化学',
    publishDate: '2025-10-12',
    completeDate: null,
    status: 'pending',
    iconText: '化',
    color: 'orange'
  }
])

/**
 * 筛选后的作业列表
 * 根据科目、状态、发布时间、完成时间进行过滤
 */
const filteredHomeworkList = computed(() => {
  let filtered = homeworkList.value

  // 按科目筛选（只有选择了具体科目时才筛选）
  if (currentSubject.value && currentSubject.value !== '全部') {
    filtered = filtered.filter(item => item.subject === currentSubject.value)
  }

  // 按状态筛选（只有选择了具体状态时才筛选）
  if (currentStatus.value && currentStatus.value !== '全部') {
    const statusValue = currentStatus.value === '已完成' ? 'completed' : 'pending'
    filtered = filtered.filter(item => item.status === statusValue)
  }

  // 按发布时间筛选
  if (currentPublishDate.value) {
    filtered = filtered.filter(item => item.publishDate === currentPublishDate.value)
  }

  // 按完成时间筛选
  if (currentCompleteDate.value) {
    filtered = filtered.filter(item => item.completeDate === currentCompleteDate.value)
  }

  return filtered
})

/**
 * 科目筛选变化事件
 */
const onSubjectChange = (e) => {
  currentSubject.value = subjects[e.detail.value]
}

/**
 * 状态筛选变化事件
 */
const onStatusChange = (e) => {
  currentStatus.value = statuses[e.detail.value]
}

/**
 * 发布时间筛选变化事件
 */
const onPublishDateChange = (e) => {
  currentPublishDate.value = e.detail.value
}

/**
 * 完成时间筛选变化事件
 */
const onCompleteDateChange = (e) => {
  currentCompleteDate.value = e.detail.value
}

/**
 * 跳转到作业详情页
 */
const gotoDetail = (item) => {
  uni.navigateTo({
    url: '/pages/parent/homework/homework-detail'
  })
}
</script>

<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding-bottom: 128rpx;
}

/* 筛选器区域 - 固定在页面顶部 */
.filter-section {
  position: fixed;
  top: 144rpx; /* PageHeader高度 */
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 筛选器行布局 */
.filter-row {
  display: flex;
  gap: 16rpx;
}

.filter-picker {
  flex: 1;
  min-width: 0;
}

/* 筛选器选择框样式 */
.picker-box {
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 20rpx 16rpx;
  font-size: 24rpx;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  transition: all 0.2s;
}

.picker-box:active {
  background-color: #f3f4f6;
  border-color: #0ea5e9;
}

/* 筛选器标签文本 */
.label {
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

/* 筛选器下拉箭头 */
.arrow {
  font-size: 18rpx;
  color: #9ca3af;
  margin-left: 8rpx;
  flex-shrink: 0;
}

/* 作业列表容器 */
.list-container {
  /* PageHeader + 筛选区域高度 + 额外间距 */
  padding: 380rpx 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 作业卡片 */
.homework-item {
  background-color: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s;
}

.homework-item:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

/* 未完成作业左侧红色标记 */
.homework-item-pending {
  border-left: 6rpx solid #ef4444;
}

/* 作业头部 */
.homework-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 32rpx;
  padding-bottom: 20rpx;
}

.homework-left {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  flex: 1;
}

/* 科目图标（文字图标） */
.homework-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-text {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
}

/* 不同科目的图标颜色 */
.homework-icon-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.homework-icon-red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.homework-icon-green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.homework-icon-purple {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
}

.homework-icon-orange {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

/* 作业信息 */
.homework-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.homework-subject {
  font-size: 36rpx;
  font-weight: bold;
  color: #1f2937;
  line-height: 1.2;
}

.homework-date {
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.4;
}

/* 状态标签 */
.status-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 20rpx;
  border-radius: 999rpx;
  flex-shrink: 0;
}

/* 状态点 */
.status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}

.status-text {
  font-size: 26rpx;
  font-weight: 600;
  white-space: nowrap;
}

/* 已完成状态 */
.status-completed {
  background-color: #d1fae5;
}

.status-completed .status-dot {
  background-color: #10b981;
}

.status-completed .status-text {
  color: #10b981;
}

/* 未完成状态 */
.status-pending {
  background-color: #fee2e2;
}

.status-pending .status-dot {
  background-color: #ef4444;
}

.status-pending .status-text {
  color: #ef4444;
}

/* 作业底部 */
.homework-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx 32rpx;
  font-size: 28rpx;
}

.footer-text {
  font-size: 26rpx;
}

.footer-text-warning {
  color: #ef4444;
  font-weight: 500;
}

.footer-text-normal {
  color: #9ca3af;
}

.arrow-icon {
  font-size: 40rpx;
  color: #d1d5db;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 32rpx 0;
}

.load-more-btn {
  padding: 20rpx 56rpx;
  font-size: 28rpx;
  color: #0ea5e9;
  font-weight: 500;
  background-color: transparent;
  border: none;
}

.load-more-btn:active {
  opacity: 0.7;
}
</style>
