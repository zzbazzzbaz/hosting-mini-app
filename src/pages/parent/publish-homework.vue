<template>
  <view class="page">
    <view class="header"><text class="header-title">发布作业</text></view>
    <view class="form-container">
      <view class="form-card">
        <text class="form-label">📅 日期组件(默认当天)</text>
        <picker mode="date" :value="formData.date" @change="onDateChange">
          <view class="picker-box"><text>{{ formData.date }}</text></view>
        </picker>
      </view>
      <view class="form-card">
        <text class="form-label">📚 请选择科目</text>
        <picker :range="subjects" @change="onSubjectChange">
          <view class="picker-box"><text>{{ formData.subject || '请选择科目' }}</text><text class="arrow">▼</text></view>
        </picker>
      </view>
      <view class="form-card">
        <text class="form-label">✏️ 作业说明</text>
        <textarea v-model="formData.description" class="textarea" placeholder="请输入作业相关说明或备注..." rows="4"></textarea>
      </view>
      <view class="form-card">
        <text class="form-label">🖼️ 上传作业图片</text>
        <view class="upload-area" @click="chooseImage">
          <view class="upload-btn">
            <view class="upload-icon"><text class="plus-icon">+</text></view>
            <text class="upload-title">点击上传图片</text>
            <text class="upload-desc">支持JPG、PNG格式,最多9张</text>
          </view>
        </view>
        <view v-if="imageList.length > 0" class="image-grid">
          <view v-for="(img, index) in imageList" :key="index" class="image-item">
            <image :src="img" class="preview-image" mode="aspectFill"></image>
            <view class="delete-btn" @click.stop="deleteImage(index)"><text class="delete-icon">✗</text></view>
          </view>
        </view>
      </view>
      <button class="submit-btn" @click="handleSubmit">✓ 发布</button>
      <view class="tip-card">
        <text class="tip-icon">ℹ️</text>
        <view class="tip-content">
          <text class="tip-title">温馨提示:</text>
          <text class="tip-text">• 请确保上传的图片清晰可见\n• 发布后老师会及时查看并给出反馈\n• 如需修改请联系辅导老师</text>
        </view>
      </view>
    </view>
    <view class="tabbar">
      <view class="tabbar-item" @click="goToPage('home')"><text class="tabbar-icon">🏠</text><text class="tabbar-label">首页</text></view>
      <view class="tabbar-item" @click="goToPage('homework')"><text class="tabbar-icon">📝</text><text class="tabbar-label">作业信息</text></view>
      <view class="tabbar-item" @click="goToPage('checkin')"><text class="tabbar-icon">✅</text><text class="tabbar-label">签到信息</text></view>
      <view class="tabbar-item tabbar-item-active"><text class="tabbar-icon-active">➕</text><text class="tabbar-label tabbar-label-active">发布作业</text></view>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'
const formData = ref({date: '2025-10-20', subject: '', description: ''})
const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理']
const imageList = ref([])
const onDateChange = (e) => formData.value.date = e.detail.value
const onSubjectChange = (e) => formData.value.subject = subjects[e.detail.value]
const chooseImage = () => {
  uni.chooseImage({
    count: 9 - imageList.value.length,
    success: (res) => imageList.value.push(...res.tempFilePaths)
  })
}
const deleteImage = (index) => imageList.value.splice(index, 1)
const handleSubmit = () => {
  if (!formData.value.subject) return uni.showToast({title: '请选择科目', icon: 'none'})
  if (!formData.value.description) return uni.showToast({title: '请填写作业说明', icon: 'none'})
  uni.showToast({title: '发布成功', icon: 'success'})
  setTimeout(() => uni.navigateBack(), 1500)
}
const goToPage = (page) => {
  const routes = {home: '/pages/parent/home', homework: '/pages/parent/homework-list', checkin: '/pages/parent/checkin'}
  if (routes[page]) uni.navigateTo({url: routes[page]})
}
</script>
<style scoped>
.page{min-height:100vh;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding-bottom:128rpx}
.header{background:linear-gradient(to right,#0ea5e9,#3b82f6);padding:48rpx}
.header-title{font-size:48rpx;font-weight:bold;color:#fff;text-align:center;display:block}
.form-container{padding:48rpx;display:flex;flex-direction:column;gap:40rpx}
.form-card{background:#fff;border-radius:32rpx;box-shadow:0 4rpx 16rpx rgba(0,0,0,0.06);padding:40rpx}
.form-label{display:block;font-size:28rpx;font-weight:600;color:#374151;margin-bottom:24rpx}
.picker-box{background:#f9fafb;border:2rpx solid #e5e7eb;border-radius:24rpx;padding:28rpx 32rpx;display:flex;justify-content:space-between;align-items:center;font-size:28rpx;color:#374151}
.arrow{font-size:24rpx;color:#9ca3af}
.textarea{width:100%;background:#f9fafb;border:2rpx solid #e5e7eb;border-radius:24rpx;padding:28rpx 32rpx;font-size:28rpx;color:#374151;line-height:1.6}
.upload-area{background:linear-gradient(to right,#dbeafe,#bfdbfe);border:4rpx dashed #0ea5e9;border-radius:24rpx;padding:64rpx;transition:all 0.3s}
.upload-btn{display:flex;flex-direction:column;align-items:center;gap:24rpx}
.upload-icon{width:128rpx;height:128rpx;background:#0ea5e9;border-radius:50%;display:flex;align-items:center;justify-content:center}
.plus-icon{font-size:64rpx;color:#fff;font-weight:bold}
.upload-title{font-size:32rpx;color:#0ea5e9;font-weight:600}
.upload-desc{font-size:24rpx;color:#6b7280}
.image-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24rpx;margin-top:32rpx}
.image-item{position:relative;aspect-ratio:1;border-radius:16rpx;overflow:hidden}
.preview-image{width:100%;height:100%;border:4rpx solid #10b981}
.delete-btn{position:absolute;top:8rpx;right:8rpx;width:48rpx;height:48rpx;background:#ef4444;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4rpx 8rpx rgba(0,0,0,0.2)}
.delete-icon{font-size:32rpx;color:#fff}
.submit-btn{width:100%;background:linear-gradient(to right,#0ea5e9,#3b82f6);color:#fff;padding:32rpx;border-radius:24rpx;font-size:32rpx;font-weight:600;box-shadow:0 16rpx 32rpx rgba(14,165,233,0.25);border:none}
.tip-card{background:linear-gradient(to right,#dbeafe,#bfdbfe);border:2rpx solid #93c5fd;border-radius:24rpx;padding:32rpx;display:flex;gap:24rpx}
.tip-icon{font-size:40rpx;flex-shrink:0}
.tip-content{flex:1}
.tip-title{display:block;font-size:28rpx;font-weight:600;color:#1e40af;margin-bottom:8rpx}
.tip-text{display:block;font-size:24rpx;color:#1e40af;line-height:1.6;white-space:pre-line}
.tabbar{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1rpx solid #e5e7eb;box-shadow:0 -4rpx 16rpx rgba(0,0,0,0.05);display:flex;padding:16rpx 0}
.tabbar-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:8rpx;padding:16rpx 0;color:#9ca3af}
.tabbar-item-active{color:#0ea5e9}
.tabbar-icon,.tabbar-icon-active{font-size:48rpx}
.tabbar-label{font-size:24rpx}
.tabbar-label-active{font-weight:500;color:#0ea5e9}
</style>
