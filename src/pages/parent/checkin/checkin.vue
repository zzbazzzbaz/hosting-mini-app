<template>
  <view class="page">
    <PageHeader title="签到信息" />
    <view class="content">
      <view class="filter-section">
        <view class="filter-row">
          <picker class="filter-picker" :range="nameOptions" :value="selectedNameIndex" @change="onNameChange">
            <view class="picker-box">
              <text class="label">{{ selectedNameLabel }}</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
          <picker class="filter-picker" mode="date" :value="pickerDateValue" @change="onDateChange">
            <view class="picker-box">
              <text class="label">{{ selectedDateLabel }}</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>
      <view class="list-container">
        <view v-if="filteredCheckins.length === 0" class="empty-state">
          <text class="empty-title">暂无签到记录</text>
          <text class="empty-subtitle">调整筛选条件试试</text>
        </view>
        <view v-for="record in filteredCheckins" :key="record.id" class="checkin-card">
          <view class="cell cell-name">
            <text class="cell-text">{{ record.name }}</text>
          </view>
          <view class="cell cell-date">
            <text class="cell-text single-line">{{ formatDate(record.date) }}</text>
          </view>
          <view class="cell cell-time">
            <text class="cell-text">{{ record.time }}</text>
          </view>
          <view class="cell cell-photo">
            <image class="photo-preview" :src="record.photo" mode="aspectFill"></image>
          </view>
        </view>
      </view>
    </view>
    <ParentTabBar activeTab="checkin" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'

const checkinRecords = ref([
  { id: 1, name: '张明', date: '2025-10-15', time: '08:25', photo: '/static/logo.png' },
  { id: 2, name: '张明', date: '2025-10-14', time: '08:27', photo: '/static/logo.png' },
  { id: 3, name: '李华', date: '2025-10-15', time: '08:22', photo: '/static/logo.png' },
  { id: 4, name: '李华', date: '2025-10-13', time: '08:19', photo: '/static/logo.png' }
])

const selectedNameIndex = ref(0)
const selectedDate = ref('')

const uniqueNames = computed(() => {
  const names = checkinRecords.value.map((item) => item.name)
  return Array.from(new Set(names))
})

const nameOptions = computed(() => ['全部', ...uniqueNames.value])

const selectedNameLabel = computed(() => {
  const current = nameOptions.value[selectedNameIndex.value]
  return selectedNameIndex.value === 0 || !current ? '请选择孩子' : current
})

const fallbackDate = computed(() => {
  if (checkinRecords.value.length > 0) {
    return checkinRecords.value[0].date
  }
  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
})

const pickerDateValue = computed(() => selectedDate.value || fallbackDate.value)
const selectedDateLabel = computed(() => selectedDate.value || '请选择日期')

const filteredCheckins = computed(() => {
  const targetName = nameOptions.value[selectedNameIndex.value] || '全部'
  return checkinRecords.value.filter((item) => {
    const matchName = targetName === '全部' || item.name === targetName
    const matchDate = !selectedDate.value || item.date === selectedDate.value
    return matchName && matchDate
  })
})

const formatDate = (value) => value.replace(/-/g, '/')

const onNameChange = (event) => {
  selectedNameIndex.value = Number(event.detail.value)
}

const onDateChange = (event) => {
  selectedDate.value = event.detail.value
}

</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 128rpx;
}

.content {
  padding-bottom: 48rpx;
}

.filter-section {
  position: fixed;
  top: 144rpx;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  border-radius: 0 0 28rpx 28rpx;
  box-shadow: 0 6rpx 18rpx rgba(15, 23, 42, 0.08);
  padding: 16rpx 32rpx 8rpx;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.filter-picker {
  flex: 1;
}

.picker-box {
  background: #f8fafc;
  border: 2rpx solid #e2e8f0;
  border-radius: 20rpx;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  font-size: 26rpx;
  color: #1f2937;
}

.arrow {
  font-size: 22rpx;
  color: #94a3b8;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 110rpx 32rpx 32rpx;
}

.checkin-card {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(15, 23, 42, 0.06);
  padding: 16rpx 20rpx;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
}

.checkin-card:active {
  transform: scale(0.99);
}

.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12rpx;
  text-align: center;
}

.cell:not(:first-child) {
  border-left: 2rpx solid #e2e8f0;
}

.cell-name,
.cell-date,
.cell-time {
  flex: 1 1 0;
}

.cell-photo {
  flex: 0 0 108rpx;
}

.cell-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #0f172a;
}

.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-preview {
  width: 88rpx;
  height: 88rpx;
  border-radius: 12rpx;
  border: 2rpx solid #22c55e;
  overflow: hidden;
}

.empty-state {
  background: rgba(148, 163, 184, 0.12);
  border-radius: 32rpx;
  padding: 64rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.empty-title {
  font-size: 32rpx;
  color: #475569;
  font-weight: 600;
}

.empty-subtitle {
  font-size: 26rpx;
  color: #94a3b8;
}
</style>
