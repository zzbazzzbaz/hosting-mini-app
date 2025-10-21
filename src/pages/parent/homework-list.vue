<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业信息" />

    <!-- 筛选器区域 -->
    <view class="filter-section">
      <view class="filter-row">
        <!-- 科目筛选 -->
        <view class="filter-item">
          <picker :range="subjects" @change="onSubjectChange" class="picker">
            <view class="picker-view">
              <text class="picker-text">{{ currentSubject }}</text>
              <text class="picker-icon">▼</text>
            </view>
          </picker>
        </view>

        <!-- 状态筛选 -->
        <view class="filter-item">
          <picker :range="statuses" @change="onStatusChange" class="picker">
            <view class="picker-view">
              <text class="picker-text">{{ currentStatus }}</text>
              <text class="picker-icon">▼</text>
            </view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 作业列表 -->
    <view class="list-container">
      <view
        v-for="(item, index) in homeworkList"
        :key="index"
        :class="['homework-item', item.status === 'pending' ? 'homework-item-pending' : '']"
        @click="gotoDetail(item)"
      >
        <view class="homework-header">
          <view class="homework-left">
            <view :class="['homework-icon', `homework-icon-${item.color}`]">
              <text class="icon-text">{{ item.icon }}</text>
            </view>
            <view class="homework-info">
              <text class="homework-subject">{{ item.subject }}</text>
              <text class="homework-date">{{ item.date }}</text>
            </view>
          </view>
          <view :class="['status-badge', `status-${item.status}`]">
            <text class="status-icon">{{ item.status === 'completed' ? '✓' : '✗' }}</text>
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
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'

// 科目列表
const subjects = ['请选择科目', '语文', '数学', '英语', '物理', '化学']
const currentSubject = ref('请选择科目')

// 状态列表
const statuses = ['请选择状态', '全部', '已完成', '未完成']
const currentStatus = ref('请选择状态')

// 作业列表数据
const homeworkList = ref([
  { subject: '数学', date: '2025-10-15', status: 'completed', icon: '🔢', color: 'blue' },
  { subject: '英语', date: '2025-10-15', status: 'pending', icon: '📖', color: 'red' },
  { subject: '语文', date: '2025-10-15', status: 'completed', icon: '✏️', color: 'green' },
  { subject: '语文', date: '2025-10-14', status: 'completed', icon: '✏️', color: 'purple' }
])

const onSubjectChange = (e) => {
  currentSubject.value = subjects[e.detail.value]
}

const onStatusChange = (e) => {
  currentStatus.value = statuses[e.detail.value]
}

const gotoDetail = (item) => {
  uni.navigateTo({
    url: '/pages/parent/homework-detail'
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding-top:144rpx;padding-bottom: 128rpx;
}

.filter-section {
  padding: 32rpx 48rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.filter-item {
  position: relative;
}

.picker {
  width: 100%;
}

.picker-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 24rpx;
  padding: 28rpx 32rpx;
  transition: all 0.2s;
}

.picker-text {
  font-size: 28rpx;
  color: #374151;
}

.picker-icon {
  font-size: 24rpx;
  color: #9ca3af;
}

.list-container {
  padding: 32rpx 48rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.homework-item {
  background-color: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s;
}

.homework-item:active {
  transform: scale(0.98);
}

.homework-item-pending {
  border-left: 8rpx solid #ef4444;
}

.homework-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx;
  padding-bottom: 24rpx;
}

.homework-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.homework-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.homework-icon-blue {
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
}

.homework-icon-red {
  background: linear-gradient(135deg, #ef4444, #ec4899);
}

.homework-icon-green {
  background: linear-gradient(135deg, #10b981, #059669);
}

.homework-icon-purple {
  background: linear-gradient(135deg, #a855f7, #ec4899);
}

.icon-text {
  font-size: 48rpx;
}

.homework-info {
  display: flex;
  flex-direction: column;
}

.homework-subject {
  font-size: 36rpx;
  font-weight: bold;
  color: #1f2937;
}

.homework-date {
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

.status-pending {
  background-color: #fee2e2;
}

.status-icon {
  font-size: 32rpx;
}

.status-text {
  font-size: 28rpx;
  font-weight: 600;
}

.status-completed .status-icon,
.status-completed .status-text {
  color: #10b981;
}

.status-pending .status-icon,
.status-pending .status-text {
  color: #ef4444;
}

.homework-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx 40rpx;
  font-size: 28rpx;
}

.footer-text-normal {
  color: #9ca3af;
}

.footer-text-warning {
  color: #ef4444;
  font-weight: 500;
}

.arrow-icon {
  font-size: 40rpx;
  color: #d1d5db;
}

.load-more {
  text-align: center;
  padding: 32rpx 0;
}

.load-more-btn {
  padding: 16rpx 48rpx;
  font-size: 28rpx;
  color: #0ea5e9;
  font-weight: 500;
  background-color: transparent;
  border: none;
}
</style>
