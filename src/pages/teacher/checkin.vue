<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="签到信息"  />
    <view class="filter"><picker :range="dateOptions" @change="onDateChange"><view class="picker-box"><text>📅 {{currentDate}}</text></view></picker></view>
    <view class="list">
      <view v-for="item in studentList" :key="item.id" :class="['item',item.checked?'':'item-unchecked']">
        <view class="left"><view :class="['icon',item.checked?'icon-green':'icon-red']"><text>{{item.checked?'✓':'✗'}}</text></view><view class="info"><text class="name">{{item.name}}</text><text class="grade">{{item.grade}}</text></view></view>
        <button v-if="!item.checked" class="btn" @click="checkIn(item)">签到</button>
        <view v-else class="time"><text>{{item.checkTime}}</text></view>
      </view>
    </view>
    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="checkin" />
  </view>
</template>
<script setup>
import {ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'
const currentDate=ref('2025-10-21')
const dateOptions=['今天','昨天','前天']
const studentList=ref([
  {id:1,name:'喜洋洋',grade:'一年级',checked:true,checkTime:'08:30'},
  {id:2,name:'美羊羊',grade:'一年级',checked:false}
])
const onDateChange=(e)=>console.log(e)
const checkIn=(item)=>{item.checked=true;item.checkTime='09:00';uni.showToast({title:'签到成功',icon:'success'})}
const goHome=()=>uni.navigateTo({url:'/pages/teacher/home'})
const goHomework=()=>uni.navigateTo({url:'/pages/teacher/homework'})
const goPublish=()=>uni.navigateTo({url:'/pages/teacher/publish'})
</script>
<style scoped>
.page{min-height:100vh;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);padding-top:144rpx;padding-bottom:128rpx}


.filter{padding:32rpx 48rpx;background:#fff;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.05)}
.picker-box{background:#f9fafb;border:2rpx solid #e5e7eb;border-radius:24rpx;padding:28rpx 32rpx;font-size:28rpx}
.list{padding:32rpx 48rpx;display:flex;flex-direction:column;gap:24rpx}
.item{background:#fff;border-radius:32rpx;box-shadow:0 4rpx 16rpx rgba(0,0,0,0.06);padding:40rpx;display:flex;justify-content:space-between;align-items:center}
.left{display:flex;align-items:center;gap:32rpx}



.info{display:flex;flex-direction:column}
.name{font-size:36rpx;font-weight:bold;color:#1f2937}
.grade{font-size:28rpx;color:#6b7280;margin-top:8rpx}
.btn{padding:24rpx 32rpx;background:#0ea5e9;color:#fff;font-size:28rpx;border-radius:16rpx;border:none}
.time{font-size:28rpx;color:#6b7280}





</style>
