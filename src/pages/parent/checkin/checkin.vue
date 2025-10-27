<template>
  <view class="page">
    <PageHeader title="签到信息" />
    <view class="content">
      <view class="filter-card">
        <view class="filter-header">
          <text class="filter-title">筛选</text>
          <text class="filter-reset" @tap="resetFilters">重置</text>
        </view>
        <view class="filter-grid">
          <view class="filter-field">
            <text class="field-label">姓名</text>
            <picker class="field-picker" :range="nameOptions" :value="selectedNameIndex" @change="onNameChange">
              <view class="picker-display">
                <text class="picker-text">{{ nameOptions[selectedNameIndex] || '全部' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          <view class="filter-field">
            <text class="field-label">日期</text>
            <picker class="field-picker" mode="date" :value="pickerDateValue" @change="onDateChange">
              <view class="picker-display">
                <text class="picker-text">{{ selectedDateLabel }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
        </view>
      </view>
      <view class="list-container">
        <view v-if="filteredCheckins.length === 0" class="empty-state">
          <text class="empty-title">暂无签到记录</text>
          <text class="empty-subtitle">调整筛选条件试试</text>
        </view>
        <view v-for="record in filteredCheckins" :key="record.id" class="checkin-card">
          <view class="card-info">
            <text class="info-name">{{ record.name }}</text>
            <view class="info-row">
              <text class="info-label">日期</text>
              <text class="info-value">{{ record.date }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">时间</text>
              <text class="info-value">{{ record.time }}</text>
            </view>
          </view>
          <image class="card-photo" :src="record.photo" mode="aspectFill"></image>
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
const selectedDateLabel = computed(() => selectedDate.value || '全部日期')

const filteredCheckins = computed(() => {
  const targetName = nameOptions.value[selectedNameIndex.value] || '全部'
  return checkinRecords.value.filter((item) => {
    const matchName = targetName === '全部' || item.name === targetName
    const matchDate = !selectedDate.value || item.date === selectedDate.value
    return matchName && matchDate
  })
})

const onNameChange = (event) => {
  selectedNameIndex.value = Number(event.detail.value)
}

const onDateChange = (event) => {
  selectedDate.value = event.detail.value
}

const resetFilters = () => {
  selectedNameIndex.value = 0
  selectedDate.value = ''
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
  padding: 0 48rpx 48rpx;
  display: flex;
  flex-direction: column;
}

.filter-card {
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 118, 255, 0.1);
  padding: 40rpx;
  margin-top: 32rpx;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
}

.filter-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #0f172a;
}

.filter-reset {
  font-size: 28rpx;
  color: #0ea5e9;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32rpx;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.field-label {
  font-size: 28rpx;
  color: #475569;
}

.field-picker {
  width: 100%;
}

.picker-display {
  background: #f8fafc;
  border: 2rpx solid #e2e8f0;
  border-radius: 24rpx;
  padding: 28rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-text {
  font-size: 30rpx;
  color: #1f2937;
}

.picker-arrow {
  font-size: 24rpx;
  color: #94a3b8;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 32rpx;
}

.checkin-card {
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 6rpx 20rpx rgba(15, 23, 42, 0.08);
  padding: 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-name {
  font-size: 40rpx;
  font-weight: 600;
  color: #0f172a;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.info-label {
  font-size: 28rpx;
  color: #64748b;
  min-width: 80rpx;
}

.info-value {
  font-size: 32rpx;
  color: #1e293b;
  font-weight: 500;
}

.card-photo {
  width: 168rpx;
  height: 168rpx;
  border-radius: 24rpx;
  border: 4rpx solid #22c55e;
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
