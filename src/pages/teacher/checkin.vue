<template>
  <view class="page">
    <view class="header"><text class="title">签到信息</text></view>
    <view class="filter"><picker :range="dateOptions" @change="onDateChange"><view class="picker-box"><text>📅 {{currentDate}}</text></view></picker></view>
    <view class="list">
      <view v-for="item in studentList" :key="item.id" :class="['item',item.checked?'':'item-unchecked']">
        <view class="left"><view :class="['icon',item.checked?'icon-green':'icon-red']"><text>{{item.checked?'✓':'✗'}}</text></view><view class="info"><text class="name">{{item.name}}</text><text class="grade">{{item.grade}}</text></view></view>
        <button v-if="!item.checked" class="btn" @click="checkIn(item)">签到</button>
        <view v-else class="time"><text>{{item.checkTime}}</text></view>
      </view>
    </view>
    <view class="tabbar">
      <view class="tab" @click="goHome"><text class="icon">🏠</text><text>首页</text></view>
      <view class="tab tab-active"><text class="icon-active">✅</text><text class="label-active">签到信息</text></view>
      <view class="tab" @click="goHomework"><text class="icon">📝</text><text>作业信息</text></view>
      <view class="tab" @click="goPublish"><text class="icon">➕</text><text>发布作业</text></view>
    </view>
  </view>
</template>
<script setup>
import {ref} from 'vue'
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
.page{min-height:100vh;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);padding-bottom:128rpx}
.header{background:linear-gradient(to right,#0ea5e9,#3b82f6);padding:48rpx;text-align:center}
.title{font-size:48rpx;font-weight:bold;color:#fff;display:block}
.filter{padding:32rpx 48rpx;background:#fff;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.05)}
.picker-box{background:#f9fafb;border:2rpx solid #e5e7eb;border-radius:24rpx;padding:28rpx 32rpx;font-size:28rpx}
.list{padding:32rpx 48rpx;display:flex;flex-direction:column;gap:24rpx}
.item{background:#fff;border-radius:32rpx;box-shadow:0 4rpx 16rpx rgba(0,0,0,0.06);padding:40rpx;display:flex;justify-content:space-between;align-items:center}
.item-unchecked{border-left:8rpx solid #ef4444}
.left{display:flex;align-items:center;gap:32rpx}
.icon{width:96rpx;height:96rpx;border-radius:24rpx;display:flex;align-items:center;justify-content:center;font-size:56rpx;color:#fff}
.icon-green{background:linear-gradient(135deg,#10b981,#059669)}
.icon-red{background:linear-gradient(135deg,#ef4444,#ec4899)}
.info{display:flex;flex-direction:column}
.name{font-size:36rpx;font-weight:bold;color:#1f2937}
.grade{font-size:28rpx;color:#6b7280;margin-top:8rpx}
.btn{padding:24rpx 32rpx;background:#0ea5e9;color:#fff;font-size:28rpx;border-radius:16rpx;border:none}
.time{font-size:28rpx;color:#6b7280}
.tabbar{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1rpx solid #e5e7eb;box-shadow:0 -4rpx 16rpx rgba(0,0,0,0.05);display:flex;padding:16rpx 0}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:8rpx;padding:16rpx 0;color:#9ca3af}
.tab-active{color:#0ea5e9}
.icon,.icon-active{font-size:48rpx}
.label-active{font-weight:500;color:#0ea5e9;font-size:24rpx}
</style>
