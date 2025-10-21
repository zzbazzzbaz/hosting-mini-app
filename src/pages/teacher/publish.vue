<template>
  <view class="page">
    <view class="header"><text class="title">发布作业</text></view>
    <view class="list">
      <view v-for="item in studentList" :key="item.id" class="item">
        <view class="left"><view class="avatar"><text>{{item.name[0]}}</text></view><view class="info"><text class="name">{{item.name}}</text><text class="grade">{{item.grade}}</text></view></view>
        <button class="btn" @click="publish(item)">发布</button>
      </view>
    </view>
    <view class="tabbar">
      <view class="tab" @click="goHome"><text class="icon">🏠</text><text>首页</text></view>
      <view class="tab" @click="goCheckin"><text class="icon">✅</text><text>签到信息</text></view>
      <view class="tab" @click="goHomework"><text class="icon">📝</text><text>作业信息</text></view>
      <view class="tab tab-active"><text class="icon-active">➕</text><text class="label-active">发布作业</text></view>
    </view>
  </view>
</template>
<script setup>
import {ref} from 'vue'
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
.page{min-height:100vh;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);padding-bottom:128rpx}
.header{background:linear-gradient(to right,#0ea5e9,#3b82f6);padding:48rpx;text-align:center}
.title{font-size:48rpx;font-weight:bold;color:#fff;display:block}
.list{padding:32rpx 48rpx;display:flex;flex-direction:column;gap:24rpx}
.item{background:#fff;border-radius:32rpx;box-shadow:0 4rpx 16rpx rgba(0,0,0,0.06);padding:40rpx;display:flex;justify-content:space-between;align-items:center}
.left{display:flex;align-items:center;gap:32rpx}
.avatar{width:96rpx;height:96rpx;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:48rpx;color:#fff;font-weight:bold}
.info{display:flex;flex-direction:column}
.name{font-size:36rpx;font-weight:bold;color:#1f2937}
.grade{font-size:28rpx;color:#6b7280;margin-top:8rpx}
.btn{padding:24rpx 32rpx;background:#0ea5e9;color:#fff;font-size:28rpx;border-radius:16rpx;border:none}
.tabbar{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1rpx solid #e5e7eb;box-shadow:0 -4rpx 16rpx rgba(0,0,0,0.05);display:flex;padding:16rpx 0}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:8rpx;padding:16rpx 0;color:#9ca3af}
.tab-active{color:#0ea5e9}
.icon,.icon-active{font-size:48rpx}
.label-active{font-weight:500;color:#0ea5e9;font-size:24rpx}
</style>
