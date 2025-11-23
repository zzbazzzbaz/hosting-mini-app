<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="签到确认" :showBack="true" />

    <!-- 学生列表 -->
    <view class="student-section">
      <view class="section-title">
        <text class="title-text">签到学生 ({{ students.length }}人)</text>
      </view>
      <view class="student-list">
        <view class="student-item" v-for="item in students" :key="item.id">
          <text class="student-name">{{ item.studentName }}</text>
          <text class="student-info"
            >{{ item.schoolName }} · {{ item.gradeName }} · {{ item.clazzName }}</text
          >
        </view>
      </view>
    </view>

    <!-- 图片上传区域 -->
    <view class="upload-section">
      <view class="section-title">
        <text class="title-text">签到照片</text>
        <text class="title-tip">（最多9张）</text>
      </view>
      <view class="image-grid">
        <view class="image-item" v-for="(img, index) in imageList" :key="index">
          <image class="image" :src="img.url" mode="aspectFill" @tap="previewImage(index)" />
          <view class="delete-btn" @tap.stop="deleteImage(index)">
            <uni-icons type="close" size="16" color="#fff"></uni-icons>
          </view>
        </view>
        <view class="upload-btn" v-if="imageList.length < 9" @tap="chooseImage">
          <uni-icons type="camera" size="32" color="#9ca3af"></uni-icons>
          <text class="upload-text">添加照片</text>
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

/* 区块标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 24rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
}

.title-tip {
  font-size: 24rpx;
  color: #9ca3af;
}

/* 学生列表 */
.student-list {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.student-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f3f4f6;
}

.student-item:last-child {
  border-bottom: none;
}

.student-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #1f2937;
}

.student-info {
  font-size: 24rpx;
  color: #6b7280;
}

/* 上传区域 */
.upload-section {
  padding: 0 48rpx;
}

/* 图片网格 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.image-item {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 16rpx;
  overflow: hidden;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 48rpx;
  height: 48rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  background: #f9fafb;
  border: 2rpx dashed #d1d5db;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-text {
  font-size: 24rpx;
  color: #9ca3af;
  margin-top: 8rpx;
  position: absolute;
  bottom: 30%;
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
