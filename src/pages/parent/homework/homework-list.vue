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
      <view class="publish-button-container">
        <button class="publish-button" @tap="onPublishHomework">发布作业</button>
      </view>
      <view
        v-for="(item, index) in filteredHomeworkList"
        :key="index"
        :class="['homework-item', item.status === 'pending' ? 'homework-item-pending' : '']"
        @tap="gotoDetail(item)"
      >
        <!-- 第一行：科目 | 作业标题 | 状态 -->
        <view class="homework-main">
          <text class="subject">{{ item.subject }}</text>
          <text class="title">{{ item.title }}</text>
          <view :class="['status-badge', item.status === 'completed' ? 'status-completed' : 'status-pending']">
            <text class="status-text">{{ item.status === 'completed' ? '已完成' : '未完成' }}</text>
          </view>
        </view>
        <!-- 第二行：发布时间 | 截止时间 -->
        <view class="homework-time">
          <text class="time-text">发布: {{ item.publishDate }}</text>
          <text class="time-text">截止: {{ item.deadline }}</text>
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
    title: '完成课本第3章习题',
    publishDate: '2025-10-15',
    deadline: '2025-10-20',
    completeDate: '2025-10-16',
    status: 'completed',
    iconText: '数',
    color: 'blue'
  },
  {
    subject: '英语',
    title: '背诵Unit 5单词并完成练习册',
    publishDate: '2025-10-15',
    deadline: '2025-10-22',
    completeDate: null,
    status: 'pending',
    iconText: '英',
    color: 'red'
  },
  {
    subject: '语文',
    title: '阅读《朝花夕拾》并写读后感',
    publishDate: '2025-10-14',
    deadline: '2025-10-21',
    completeDate: '2025-10-15',
    status: 'completed',
    iconText: '语',
    color: 'green'
  },
  {
    subject: '物理',
    title: '实验报告：光的折射',
    publishDate: '2025-10-13',
    deadline: '2025-10-18',
    completeDate: '2025-10-14',
    status: 'completed',
    iconText: '物',
    color: 'purple'
  },
  {
    subject: '化学',
    title: '整理元素周期表前20个元素',
    publishDate: '2025-10-12',
    deadline: '2025-10-19',
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
 * 跳转到发布作业页面
 */
const onPublishHomework = () => {
  uni.navigateTo({
    url: '/pages/parent/homework/homework-publish'
  })
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

.publish-button-container {
  margin-bottom: 12rpx;
}

.publish-button {
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
  border-radius: 24rpx;
  padding: 28rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.25);
}

/* 作业卡片 */
.homework-item {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
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

.status-text {
  font-size: 24rpx;
  font-weight: 500;
}

/* 已完成状态 */
.status-completed {
  background: #dcfce7;
  color: #15803d;
}

.status-completed .status-text {
  color: #15803d;
}

/* 未完成状态 */
.status-pending {
  background: #fee2e2;
  color: #dc2626;
}

.status-pending .status-text {
  color: #dc2626;
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
