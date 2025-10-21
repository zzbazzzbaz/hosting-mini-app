<template>
  <view class="page">
    <view class="header">
      <view class="teacher-info">
        <view class="avatar-wrapper">
          <view class="avatar"><text class="avatar-icon">👨‍🏫</text></view>
          <view class="online-badge"></view>
        </view>
        <view class="info">
          <text class="name">{{teacherName}}</text>
          <text class="role">👨‍🏫 教师</text>
        </view>
      </view>
      <view class="edit-btn"><text>✏️</text></view>
    </view>
    <view class="content">
      <view class="section-title"><text class="icon">📊</text><text class="title">数据统计</text></view>
      <view class="stats-row-3">
        <view class="stat-card stat-blue" @click="goToCheckin"><view class="icon-box icon-blue"><text>👥</text></view><text class="value">{{stats.totalStudents}}</text><text class="label">学生总数</text></view>
        <view class="stat-card stat-green" @click="goToCheckin"><view class="icon-box icon-green"><text>✓</text></view><text class="value">{{stats.todayChecked}}</text><text class="label">今日签到</text></view>
        <view class="stat-card stat-red" @click="goToCheckin"><view class="icon-box icon-red"><text>✗</text></view><text class="value">{{stats.todayUnchecked}}</text><text class="label">今日未签到</text></view>
      </view>
      <view class="stats-row-2">
        <view class="stat-card stat-green" @click="goToHomework"><text class="label-text">已完成作业</text><view class="icon-box icon-green"><text>✓</text></view><text class="value">{{stats.completedHomework}}</text><text class="label">累计完成数</text></view>
        <view class="stat-card stat-red" @click="goToHomework"><text class="label-text">未完成作业</text><view class="icon-box icon-red"><text>⚠️</text></view><text class="value">{{stats.pendingHomework}}</text><text class="label">待完成数量</text></view>
      </view>
      <view class="stats-row-2">
        <view class="stat-card stat-green"><text class="label-text">今日已完成</text><view class="icon-box icon-green"><text>✓</text></view><text class="value">{{stats.todayCompleted}}</text><text class="label">今天完成</text></view>
        <view class="stat-card stat-orange"><text class="label-text">今日未完成</text><view class="icon-box icon-orange"><text>⏰</text></view><text class="value">{{stats.todayPending}}</text><text class="label">今天待完成</text></view>
      </view>
    </view>
    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="home" />
  </view>
</template>
<script setup>
import {ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'
const teacherName=ref('张三')
const stats=ref({totalStudents:20,todayChecked:18,todayUnchecked:2,completedHomework:186,pendingHomework:32,todayCompleted:15,todayPending:6})
const goToCheckin=()=>uni.navigateTo({url:'/pages/teacher/checkin'})
const goToHomework=()=>uni.navigateTo({url:'/pages/teacher/homework'})
const goToPublish=()=>uni.navigateTo({url:'/pages/teacher/publish'})
</script>
<style scoped>
.page{min-height:100vh;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);padding-bottom:128rpx}

.teacher-info{display:flex;align-items:center;gap:32rpx}
.avatar-wrapper{position:relative}
.avatar{width:128rpx;height:128rpx;border-radius:50%;background:#fff;box-shadow:0 8rpx 24rpx rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center}
.avatar-icon{font-size:80rpx}
.online-badge{position:absolute;bottom:-4rpx;right:-4rpx;width:40rpx;height:40rpx;background:#10b981;border-radius:50%;border:4rpx solid #fff}
.info{color:#fff}
.name{display:block;font-size:48rpx;font-weight:bold;margin-bottom:8rpx}
.role{display:block;font-size:28rpx;color:#bae6fd}
.edit-btn{padding:16rpx;background:rgba(255,255,255,0.2);border-radius:16rpx;font-size:48rpx}
.content{padding:0 48rpx}
.section-title{display:flex;align-items:center;gap:16rpx;margin-bottom:32rpx}
.section-title 
.section-title 
.stats-row-3,.stats-row-2{display:grid;gap:24rpx;margin-bottom:24rpx}
.stats-row-3{grid-template-columns:repeat(3,1fr)}
.stats-row-2{grid-template-columns:repeat(2,1fr)}
.stat-card{background:#fff;border-radius:32rpx;box-shadow:0 4rpx 16rpx rgba(0,0,0,0.06);padding:32rpx;transition:all 0.3s}
.stat-card:active{transform:scale(0.98)}
.stat-blue{border-left:8rpx solid #3b82f6}
.stat-green{border-left:8rpx solid #10b981}
.stat-red{border-left:8rpx solid #ef4444}
.stat-orange{border-left:8rpx solid #f97316}

.value{display:block;font-size:60rpx;font-weight:bold;margin-bottom:8rpx}
.stat-blue .value{color:#3b82f6}
.stat-green .value{color:#10b981}
.stat-red .value{color:#ef4444}
.stat-orange .value{color:#f97316}

</style>
