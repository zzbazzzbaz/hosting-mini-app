<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="签到确认" :showBack="true" />

    <!-- 学生列表 - 单行紧凑型 -->
    <view class="student-section">
      <view class="student-section-header">
        <text class="student-section-title">签到学生 ({{ students.length }}人)</text>
      </view>
      <view class="student-list">
        <view class="student-item" v-for="item in students" :key="item.id">
          <text class="student-name">{{ item.studentName }}</text>
          <text class="student-info">{{ item.schoolName }}</text>
          <text class="student-info">{{ item.gradeName }}</text>
          <text class="student-info">{{ item.clazzName }}</text>
        </view>
      </view>
    </view>

    <!-- 图片上传区域 -->
    <view class="upload-section">
      <view class="section-header">
        <text class="section-title">签到照片</text>
        <text class="section-subtitle">最多可上传9张图片</text>
      </view>
      <view class="upload-grid">
        <view v-for="(img, index) in imageList" :key="index" class="upload-item">
          <image :src="img.url" mode="aspectFill" class="upload-image" @tap="previewImage(index)" />
          <view class="remove" @tap.stop="deleteImage(index)">✕</view>
        </view>
        <view v-if="imageList.length < 9" class="upload-item upload-placeholder" @tap="chooseImage">
          <view class="upload-placeholder-inner">
            <text class="upload-plus">+</text>
            <text class="upload-text">上传图片</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部提交按钮 -->
    <view class="bottom-action">
      <button
        class="submit-btn"
        @tap="handleSubmit"
        :disabled="submitting || imageList.length === 0"
      >
        {{ submitting ? '提交中...' : '确认签到' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { uploadSigninPic, addSignin } from '@/api/teacher/checkin'
import { getCheckinStudents, clearCheckinStudents } from '@/store/checkin'

/**
 * 学生列表
 */
const students = ref([])

/**
 * 图片列表
 */
const imageList = ref([])

/**
 * 提交状态
 */
const submitting = ref(false)

/**
 * 加载学生数据
 */
onMounted(() => {
  const checkinStudents = getCheckinStudents()
  if (checkinStudents && checkinStudents.length > 0) {
    students.value = checkinStudents
  } else {
    uni.showToast({
      title: '未选择学生',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})

/**
 * 选择图片
 */
const chooseImage = () => {
  const remainCount = 9 - imageList.value.length
  uni.chooseImage({
    count: remainCount,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths
      tempFilePaths.forEach((path) => {
        imageList.value.push({
          url: path,
          uploaded: false,
          picId: null,
        })
      })
    },
  })
}

/**
 * 删除图片
 */
const deleteImage = (index) => {
  imageList.value.splice(index, 1)
}

/**
 * 预览图片
 */
const previewImage = (index) => {
  const urls = imageList.value.map((item) => item.url)
  uni.previewImage({
    current: index,
    urls: urls,
  })
}

/**
 * 提交签到
 */
const handleSubmit = async () => {
  if (imageList.value.length === 0) {
    await uni.showToast({ title: '请至少上传一张照片', icon: 'none' })
    return
  }

  submitting.value = true

  try {
    const uploadResults = []
    for (const img of imageList.value) {
      const res = await uploadSigninPic(img.url)
      if (res?.data?.id) {
        uploadResults.push(res.data.id)
      }
    }

    await addSignin({
      studentIds: students.value.map((s) => s.id).join(','),
      picIds: uploadResults.join(','),
    })

    await uni.showToast({ title: '签到成功', icon: 'success' })
    clearCheckinStudents()
    setTimeout(() => {
      uni.navigateBack()
    }, 1200)
  } catch (error) {
    console.error('提交签到失败:', error)
    await uni.showToast({ title: '提交失败，请重试', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 176rpx;
  padding-bottom: 160rpx;
}

/* 学生区域 */
.student-section {
  padding: 0 48rpx;
  margin-bottom: 32rpx;
}

/* 学生区块标题 */
.student-section-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 24rpx;
}

.student-section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
}

/* 学生列表 - 单行紧凑型 */
.student-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.student-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #1f2937;
  flex-shrink: 0;
  white-space: nowrap;
}

.student-info {
  font-size: 22rpx;
  color: #6b7280;
  flex-shrink: 0;
  white-space: nowrap;
}

/* 上传区域 */
.upload-section {
  padding: 0 48rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  margin: 0 48rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
}

/* 区块标题容器 - 左右布局 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.section-subtitle {
  font-size: 24rpx;
  color: #6b7280;
}

/* 图片网格 */
.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.upload-item {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 12rpx;
  overflow: hidden;
  background: #f9fafb;
  border: 2rpx dashed #d1d5db;
}

.upload-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  position: relative;
  border-style: dashed;
}

.upload-placeholder-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 0 12rpx;
  color: #9ca3af;
  text-align: center;
}

.upload-plus {
  font-size: 48rpx;
  line-height: 1;
}

.upload-text {
  font-size: 24rpx;
}

.remove {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
}

/* 底部操作区域 */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 48rpx;
  background: #fff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.submit-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(14, 165, 233, 0.3);
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.submit-btn::after {
  border: none;
}

.submit-btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}

.submit-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  box-shadow: none;
}
</style>
