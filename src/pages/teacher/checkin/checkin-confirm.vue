<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="签到确认" />

    <!-- 选中学生列表 -->
    <view class="student-section">
      <view class="section-title">
        <text>已选学生 ({{students.length}}人)</text>
      </view>
      <view class="student-tags">
        <view v-for="student in students" :key="student.id" class="student-tag">
          <text>{{student.name}}</text>
        </view>
      </view>
    </view>

    <!-- 照片操作区域 -->
    <view class="photo-section">
      <view class="section-title">
        <text>签到照片</text>
      </view>

      <!-- 照片展示区域 -->
      <view class="photo-display" v-if="photoUrl">
        <image :src="photoUrl" class="photo-image" mode="aspectFill"></image>
        <view class="photo-remove" @click="removePhoto">
          <text>✕</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="photo-actions">
        <button class="photo-btn upload-btn" @click="choosePhoto">
          <view class="btn-icon">📁</view>
          <text>上传照片</text>
        </button>
        <button class="photo-btn camera-btn" @click="takePhoto">
          <view class="btn-icon">📷</view>
          <text>拍照</text>
        </button>
      </view>
    </view>

    <!-- 底部确认按钮 -->
    <view class="bottom-actions">
      <button class="confirm-btn-circle" @click="confirmCheckin">
        <text class="check-icon">✓</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'

// 学生列表数据
const students = ref([])

// 照片URL
const photoUrl = ref('')

/**
 * 页面加载时从本地存储获取学生数据
 */
onMounted(() => {
  try {
    const checkinStudents = uni.getStorageSync('checkinStudents')
    if (checkinStudents) {
      students.value = checkinStudents
      console.log('接收到的学生数据:', students.value)
    } else {
      uni.showToast({
        title: '未找到学生数据',
        icon: 'none'
      })
      // 返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } catch (e) {
    console.error('读取学生数据失败:', e)
    uni.showToast({
      title: '数据加载失败',
      icon: 'none'
    })
  }
})

/**
 * 上传照片（从相册选择）
 */
const choosePhoto = () => {
  uni.chooseImage({
    count: 1, // 只选择一张图片
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
    sourceType: ['album'], // 从相册选择
    success: (res) => {
      console.log('选择照片成功:', res)
      photoUrl.value = res.tempFilePaths[0]
      uni.showToast({
        title: '照片上传成功',
        icon: 'success'
      })
    },
    fail: (err) => {
      console.error('选择照片失败:', err)
      uni.showToast({
        title: '照片上传失败',
        icon: 'none'
      })
    }
  })
}

/**
 * 拍照（调用微信小程序摄像头）
 */
const takePhoto = () => {
  uni.chooseImage({
    count: 1, // 只拍一张照片
    sizeType: ['original', 'compressed'],
    sourceType: ['camera'], // 使用相机拍照
    success: (res) => {
      console.log('拍照成功:', res)
      photoUrl.value = res.tempFilePaths[0]
      uni.showToast({
        title: '拍照成功',
        icon: 'success'
      })
    },
    fail: (err) => {
      console.error('拍照失败:', err)
      uni.showToast({
        title: '拍照失败',
        icon: 'none'
      })
    }
  })
}

/**
 * 删除照片
 */
const removePhoto = () => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这张照片吗？',
    success: (res) => {
      if (res.confirm) {
        photoUrl.value = ''
        uni.showToast({
          title: '照片已删除',
          icon: 'success'
        })
      }
    }
  })
}

/**
 * 确认签到
 */
const confirmCheckin = () => {
  // 验证是否已上传照片
  if (!photoUrl.value) {
    uni.showToast({
      title: '请先上传或拍摄签到照片',
      icon: 'none'
    })
    return
  }

  // TODO: 这里应该调用后端API上传签到数据和照片
  console.log('签到数据:', {
    students: students.value,
    photo: photoUrl.value
  })

  // 清除本地存储的学生数据
  uni.removeStorageSync('checkinStudents')

  // 显示成功提示
  uni.showToast({
    title: `${students.value.length}位学生签到成功`,
    icon: 'success',
    duration: 2000
  })

  // 延迟返回上一页
  setTimeout(() => {
    uni.navigateBack()
  }, 2000)
}
</script>

<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 80rpx;
}

/* 学生列表区域 */
.student-section {
  margin: 32rpx 48rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 24rpx;
}

.student-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.student-tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 16rpx 28rpx;
  border-radius: 32rpx;
  font-size: 28rpx;
}

/* 照片操作区域 */
.photo-section {
  margin: 32rpx 48rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

/* 照片展示区域 */
.photo-display {
  position: relative;
  width: 100%;
  height: 400rpx;
  margin-bottom: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: #f9fafb;
}

.photo-image {
  width: 100%;
  height: 100%;
}

.photo-remove {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  width: 56rpx;
  height: 56rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
}

/* 照片操作按钮 */
.photo-actions {
  display: flex;
  gap: 24rpx;
}

.photo-btn {
  flex: 1;
  padding: 32rpx;
  border-radius: 16rpx;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.btn-icon {
  font-size: 48rpx;
}

.upload-btn {
  background: #e0f2fe;
  color: #0369a1;
}

.camera-btn {
  background: #dcfce7;
  color: #15803d;
}

/* 底部确认按钮区域 */
.bottom-actions {
  position: fixed;
  bottom: 48rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

/* 圆形签到按钮 */
.confirm-btn-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.confirm-btn-circle:active {
  transform: scale(0.95);
  box-shadow: 0 6rpx 20rpx rgba(16, 185, 129, 0.5);
}

.check-icon {
  font-size: 56rpx;
  font-weight: bold;
  color: #fff;
}
</style>
