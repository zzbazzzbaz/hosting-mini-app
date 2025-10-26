<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="签到信息"  />
    <view class="stats-card">
      <view class="stat-item"><text class="stat-value stat-blue">15</text><text class="stat-label">本月签到</text></view>
      <view class="stat-item stat-bordered"><text class="stat-value stat-green">15</text><text class="stat-label">已签到</text></view>
      <view class="stat-item"><text class="stat-value stat-red">1</text><text class="stat-label">未签到</text></view>
    </view>
    <view class="list-container">
      <view v-for="item in checkinList" :key="item.id" :class="['checkin-item', item.status === 'absent' ? 'checkin-item-absent' : '']">
        <view class="checkin-info">
          <view :class="['checkin-icon', item.status === 'checked' ? 'icon-checked' : 'icon-absent']">
            <text class="icon-text">{{ item.status === 'checked' ? '✓' : '✗' }}</text>
          </view>
          <view class="checkin-details">
            <text class="checkin-date">{{ item.date }}</text>
            <text class="checkin-time">{{ item.time }}</text>
            <view :class="['status-tag', `status-${item.status}`]">
              <text class="status-text">{{ item.statusText }}</text>
            </view>
          </view>
        </view>
        <view v-if="item.status === 'checked'" class="photo-box">
          <view class="photo-placeholder"><text>📷</text></view>
        </view>
        <button v-else class="contact-btn">联系老师</button>
      </view>
    </view>
    <!-- 使用ParentTabBar组件 -->
    <ParentTabBar activeTab="checkin" />
  </view>
</template>
<script setup>
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'
const checkinList = ref([
  {id: 1, date: '2025-10-15', time: '签到时间:08:30', status: 'checked', statusText: '已签到'},
  {id: 2, date: '2025-10-14', time: '未签到', status: 'absent', statusText: '缺勤'}
])

</script>
<style scoped>
.page{min-height:100vh;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding-top:144rpx;padding-bottom:128rpx}


.stats-card{background:#fff;border-radius:32rpx;box-shadow:0 8rpx 24rpx rgba(0,0,0,0.1);padding:48rpx;margin:32rpx 48rpx;border-top:8rpx solid #0ea5e9;display:grid;grid-template-columns:repeat(3,1fr)}
.stat-item{text-align:center}
.stat-bordered{border-left:2rpx solid #e5e7eb;border-right:2rpx solid #e5e7eb}
.stat-value{display:block;font-size:60rpx;font-weight:bold}
.stat-blue{color:#0ea5e9}
.stat-green{color:#10b981}
.stat-red{color:#ef4444}
.stat-label{display:block;font-size:28rpx;color:#6b7280;margin-top:8rpx}
.list-container{padding:0 48rpx;display:flex;flex-direction:column;gap:24rpx}
.checkin-item{background:#fff;border-radius:32rpx;box-shadow:0 4rpx 16rpx rgba(0,0,0,0.06);padding:40rpx;display:flex;align-items:center;justify-content:space-between}
.checkin-info{display:flex;align-items:center;gap:32rpx;flex:1}
.checkin-icon{width:112rpx;height:112rpx;border-radius:24rpx;display:flex;align-items:center;justify-content:center}
.icon-text{font-size:56rpx;color:#fff}
.checkin-details{display:flex;flex-direction:column}
.checkin-date{font-size:36rpx;font-weight:bold;color:#1f2937}
.checkin-time{font-size:28rpx;color:#6b7280;margin-top:8rpx}
.status-tag{display:inline-block;margin-top:16rpx;padding:8rpx 24rpx;border-radius:999rpx}
.status-text{font-size:28rpx;font-weight:600}
.status-checked .status-text{color:#10b981}
.status-absent .status-text{color:#ef4444}
.photo-box{width:160rpx;height:160rpx;border-radius:24rpx;overflow:hidden;border:4rpx solid #10b981}
.photo-placeholder{width:100%;height:100%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:64rpx}
.contact-btn{padding:24rpx 32rpx;background:#0ea5e9;color:#fff;font-size:28rpx;font-weight:500;border-radius:16rpx;border:none}

</style>
