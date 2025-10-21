<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业详情" :showBack="true" /><text class="title">作业详情</text><view class="placeholder"></view>
    <view class="content">
      <view class="student-card"><view class="avatar"><text>喜</text></view><view class="info"><text class="name">喜洋洋</text><text class="grade">一年级</text></view></view>
      <view class="list">
        <view v-for="item in list" :key="item.id" class="item" :class="item.status==='completed'?'':'item-pending'">
          <view class="top"><text class="subject">{{item.subject}}</text><text class="date">{{item.date}}</text></view>
          <view :class="['status',item.status==='completed'?'status-done':'status-pending']"><text>{{item.status==='completed'?'✓ 已完成':'✗ 未完成'}}</text></view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import {ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'
const list=ref([
  {id:1,subject:'数学',date:'2025-10-21',status:'completed'},
  {id:2,subject:'语文',date:'2025-10-21',status:'pending'}
])
const goBack=()=>uni.navigateBack()
</script>
<style scoped>
.page{min-height:100vh;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);padding-top:144rpx}
.placeholder{width:64rpx}
.content{padding:48rpx}
.student-card{background:#fff;border-radius:32rpx;box-shadow:0 4rpx 16rpx rgba(0,0,0,0.06);padding:40rpx;margin-bottom:32rpx;display:flex;align-items:center;gap:32rpx}
.avatar{width:96rpx;height:96rpx;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:48rpx;color:#fff;font-weight:bold}
.info{display:flex;flex-direction:column}
.name{font-size:36rpx;font-weight:bold;color:#1f2937}
.grade{font-size:28rpx;color:#6b7280;margin-top:8rpx}
.list{display:flex;flex-direction:column;gap:24rpx}
.item{background:#fff;border-radius:32rpx;box-shadow:0 4rpx 16rpx rgba(0,0,0,0.06);padding:40rpx}
.item-pending{border-left:8rpx solid #ef4444}
.top{display:flex;justify-content:space-between;margin-bottom:16rpx}
.subject{font-size:36rpx;font-weight:bold;color:#1f2937}
.date{font-size:28rpx;color:#6b7280}
.status{display:inline-block;padding:12rpx 24rpx;border-radius:999rpx;font-size:28rpx}
</style>
