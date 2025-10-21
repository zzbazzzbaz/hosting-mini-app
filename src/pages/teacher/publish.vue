<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="发布作业"  />
    <view class="list">
      <view v-for="item in studentList" :key="item.id" class="item">
        <view class="left"><view class="avatar"><text>{{item.name[0]}}</text></view><view class="info"><text class="name">{{item.name}}</text><text class="grade">{{item.grade}}</text></view></view>
        <button class="btn" @click="publish(item)">发布</button>
      </view>
    </view>
    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="publish" />
  </view>
</template>
<script setup>
import {ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'
const studentList=ref([
  {id:1,name:'喜洋洋',grade:'一年级'},
  {id:2,name:'美羊羊',grade:'一年级'}
])
const publish=(item)=>uni.navigateTo({url:`/pages/teacher/publish-detail?id=${item.id}&name=${item.name}`})
const goHome=()=>uni.navigateTo({url:'/pages/teacher/home'})
const goCheckin=()=>uni.navigateTo({url:'/pages/teacher/checkin'})
const goHomework=()=>uni.navigateTo({url:'/pages/teacher/homework'})
</script>
<style scoped>
.page{min-height:100vh;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);padding-top:144rpx;padding-bottom:128rpx}


.list{padding:32rpx 48rpx;display:flex;flex-direction:column;gap:24rpx}
.item{background:#fff;border-radius:32rpx;box-shadow:0 4rpx 16rpx rgba(0,0,0,0.06);padding:40rpx;display:flex;justify-content:space-between;align-items:center}
.left{display:flex;align-items:center;gap:32rpx}
.avatar{width:96rpx;height:96rpx;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:48rpx;color:#fff;font-weight:bold}
.info{display:flex;flex-direction:column}
.name{font-size:36rpx;font-weight:bold;color:#1f2937}
.grade{font-size:28rpx;color:#6b7280;margin-top:8rpx}
.btn{padding:24rpx 32rpx;background:#0ea5e9;color:#fff;font-size:28rpx;border-radius:16rpx;border:none}





</style>
