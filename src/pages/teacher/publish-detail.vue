<template>
  <view class="page">
    <view class="header"><view class="back" @click="goBack"><text>‹</text></view><text class="title">发布作业给 {{studentName}}</text><view class="placeholder"></view></view>
    <view class="form">
      <view class="card"><text class="label">📅 日期</text><picker mode="date" :value="form.date" @change="onDateChange"><view class="picker"><text>{{form.date}}</text></view></picker></view>
      <view class="card"><text class="label">📚 科目</text><picker :range="subjects" @change="onSubjectChange"><view class="picker"><text>{{form.subject||'请选择科目'}}</text></view></picker></view>
      <view class="card"><text class="label">✏️ 作业内容</text><textarea v-model="form.content" class="textarea" placeholder="请输入作业内容..." rows="4"></textarea></view>
      <view class="card"><text class="label">🖼️ 上传图片</text><view class="upload" @click="chooseImage"><text class="plus">+</text><text>点击上传</text></view></view>
      <button class="submit" @click="submit">✓ 发布作业</button>
    </view>
  </view>
</template>
<script setup>
import {ref} from 'vue'
import {onLoad} from '@dcloudio/uni-app'
const studentName=ref('')
const form=ref({date:'2025-10-21',subject:'',content:''})
const subjects=['语文','数学','英语','物理','化学']
onLoad((options)=>{studentName.value=options.name||''})
const onDateChange=(e)=>form.value.date=e.detail.value
const onSubjectChange=(e)=>form.value.subject=subjects[e.detail.value]
const chooseImage=()=>uni.chooseImage({count:9,success:(res)=>console.log(res)})
const submit=()=>{if(!form.value.subject)return uni.showToast({title:'请选择科目',icon:'none'});if(!form.value.content)return uni.showToast({title:'请输入作业内容',icon:'none'});uni.showToast({title:'发布成功',icon:'success'});setTimeout(()=>uni.navigateBack(),1500)}
const goBack=()=>uni.navigateBack()
</script>
<style scoped>
.page{min-height:100vh;background:linear-gradient(135deg,#f0f9ff,#e0f2fe)}
.header{background:linear-gradient(to right,#0ea5e9,#3b82f6);padding:48rpx;display:flex;align-items:center;justify-content:space-between}
.back{width:64rpx;height:64rpx;display:flex;align-items:center;justify-content:center;font-size:64rpx;color:#fff;font-weight:bold}
.title{flex:1;font-size:40rpx;font-weight:bold;color:#fff;text-align:center}
.placeholder{width:64rpx}
.form{padding:48rpx}
.card{background:#fff;border-radius:32rpx;box-shadow:0 4rpx 16rpx rgba(0,0,0,0.06);padding:40rpx;margin-bottom:32rpx}
.label{display:block;font-size:28rpx;font-weight:600;color:#374151;margin-bottom:24rpx}
.picker,.textarea{width:100%;background:#f9fafb;border:2rpx solid #e5e7eb;border-radius:24rpx;padding:28rpx 32rpx;font-size:28rpx;color:#374151}
.textarea{line-height:1.6}
.upload{background:linear-gradient(to right,#dbeafe,#bfdbfe);border:4rpx dashed #0ea5e9;border-radius:24rpx;padding:64rpx;text-align:center;display:flex;flex-direction:column;align-items:center;gap:16rpx}
.plus{width:96rpx;height:96rpx;background:#0ea5e9;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:64rpx;color:#fff}
.submit{width:100%;background:linear-gradient(to right,#0ea5e9,#3b82f6);color:#fff;padding:32rpx;border-radius:24rpx;font-size:32rpx;font-weight:600;border:none}
</style>
