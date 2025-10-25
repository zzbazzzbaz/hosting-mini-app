<template>
  <view class="page">
    <view class="header">
      <view class="teacher-info">
        <view class="avatar-wrapper">
          <view class="avatar">
            <uni-icons type="staff" size="48" color="#0ea5e9"></uni-icons>
          </view>
          <view class="online-badge"></view>
        </view>
        <view class="info">
          <text class="name">{{teacherName}}</text>
          <text class="role">👨‍🏫 教师</text>
        </view>
      </view>
      <view class="edit-btn">
        <uni-icons type="compose" size="24" color="#ffffff"></uni-icons>
      </view>
    </view>
    <view class="content">
      <view class="section-title">
        <uni-icons type="bars" size="24" color="#1f2937"></uni-icons>
        <text class="title">数据统计</text>
      </view>
      <view class="stats-row-3">
        <view class="stat-card stat-blue" @click="goToCheckin">
          <view class="icon-box icon-blue">
            <uni-icons type="person" size="24" color="#3b82f6"></uni-icons>
          </view>
          <text class="value">{{stats.totalStudents}}</text>
          <text class="label">学生总数</text>
        </view>
        <view class="stat-card stat-green" @click="goToCheckin">
          <view class="icon-box icon-green">
            <uni-icons type="checkmarkempty" size="24" color="#10b981"></uni-icons>
          </view>
          <text class="value">{{stats.todayChecked}}</text>
          <text class="label">今日签到</text>
        </view>
        <view class="stat-card stat-red" @click="goToCheckin">
          <view class="icon-box icon-red">
            <uni-icons type="closeempty" size="24" color="#ef4444"></uni-icons>
          </view>
          <text class="value">{{stats.todayUnchecked}}</text>
          <text class="label">今日未签到</text>
        </view>
      </view>
      <view class="stats-row-2">
        <view class="stat-card stat-green" @click="goToHomework">
          <text class="label-text">已完成作业</text>
          <view class="icon-box icon-green">
            <uni-icons type="checkmarkempty" size="24" color="#10b981"></uni-icons>
          </view>
          <text class="value">{{stats.completedHomework}}</text>
          <text class="label">累计完成数</text>
        </view>
        <view class="stat-card stat-red" @click="goToHomework">
          <text class="label-text">未完成作业</text>
          <view class="icon-box icon-red">
            <uni-icons type="info" size="24" color="#ef4444"></uni-icons>
          </view>
          <text class="value">{{stats.pendingHomework}}</text>
          <text class="label">待完成数量</text>
        </view>
      </view>
      <view class="stats-row-2">
        <view class="stat-card stat-green">
          <text class="label-text">今日已完成</text>
          <view class="icon-box icon-green">
            <uni-icons type="checkmarkempty" size="24" color="#10b981"></uni-icons>
          </view>
          <text class="value">{{stats.todayCompleted}}</text>
          <text class="label">今天完成</text>
        </view>
        <view class="stat-card stat-orange">
          <text class="label-text">今日未完成</text>
          <view class="icon-box icon-orange">
            <uni-icons type="loop" size="24" color="#f97316"></uni-icons>
          </view>
          <text class="value">{{stats.todayPending}}</text>
          <text class="label">今天待完成</text>
        </view>
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
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-bottom: 128rpx;
}

/* 顶部Header区域 */
.header {
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  padding: 48rpx;
  margin-bottom: 48rpx;
  border-radius: 0 0 48rpx 48rpx;
  box-shadow: 0 8rpx 24rpx rgba(14, 165, 233, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 教师信息区域 */
.teacher-info {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.online-badge {
  position: absolute;
  bottom: -4rpx;
  right: -4rpx;
  width: 40rpx;
  height: 40rpx;
  background: #10b981;
  border-radius: 50%;
  border: 4rpx solid #fff;
}

.info {
  color: #fff;
}

.name {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.role {
  display: block;
  font-size: 28rpx;
  color: #bae6fd;
}

.edit-btn {
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 内容区域 */
.content {
  padding: 0 48rpx;
}

/* 区块标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.section-title .icon {
  font-size: 48rpx;
}

.section-title .title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1f2937;
}

/* 统计卡片行布局 */
.stats-row-3,
.stats-row-2 {
  display: grid;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.stats-row-3 {
  grid-template-columns: repeat(3, 1fr);
}

.stats-row-2 {
  grid-template-columns: repeat(2, 1fr);
}

/* 统计卡片 */
.stat-card {
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  padding: 32rpx;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.stat-card:active {
  transform: scale(0.98);
}

/* 卡片左侧边框颜色 */
.stat-blue {
  border-left: 8rpx solid #3b82f6;
}

.stat-green {
  border-left: 8rpx solid #10b981;
}

.stat-red {
  border-left: 8rpx solid #ef4444;
}

.stat-orange {
  border-left: 8rpx solid #f97316;
}

/* 卡片顶部标签文字（用于大卡片） */
.label-text {
  position: absolute;
  top: 24rpx;
  left: 32rpx;
  font-size: 28rpx;
  color: #6b7280;
  font-weight: 500;
}

/* 图标盒子 */
.icon-box {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.icon-blue {
  background: #dbeafe;
  color: #3b82f6;
}

.icon-green {
  background: #d1fae5;
  color: #10b981;
}

.icon-red {
  background: #fee2e2;
  color: #ef4444;
}

.icon-orange {
  background: #ffedd5;
  color: #f97316;
}

/* 数值 */
.value {
  display: block;
  font-size: 60rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.stat-blue .value {
  color: #3b82f6;
}

.stat-green .value {
  color: #10b981;
}

.stat-red .value {
  color: #ef4444;
}

.stat-orange .value {
  color: #f97316;
}

/* 标签 */
.label {
  font-size: 24rpx;
  color: #9ca3af;
  text-align: center;
}
</style>
