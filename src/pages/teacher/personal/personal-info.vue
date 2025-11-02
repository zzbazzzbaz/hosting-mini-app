<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="个人信息" :showBack="true" />

    <!-- 头像区域 -->
    <view class="avatar-section">
      <view class="avatar-wrapper">
        <view class="avatar">
          <text class="avatar-text">{{teacherInfo.name[0]}}</text>
        </view>
        <view class="camera-icon" @tap="handleChangeAvatar">
          <uni-icons type="camera" size="20" color="#fff"></uni-icons>
        </view>
      </view>
      <text class="avatar-hint">点击更换头像</text>
    </view>

    <!-- 基本信息卡片 -->
    <view class="info-section">
      <view class="info-group single-group">
        <view class="group-title">
          <view class="title-line"></view>
          <text class="title-text">基本信息</text>
        </view>

        <view class="info-item" @tap="handleEdit('name')">
          <text class="item-label">姓名</text>
          <view class="item-right">
            <text class="item-value">{{teacherInfo.name}}</text>
            <uni-icons type="forward" size="16" color="#d1d5db"></uni-icons>
          </view>
        </view>

        <view class="info-item" @tap="handleEdit('phone')">
          <text class="item-label">手机号码</text>
          <view class="item-right">
            <text class="item-value">{{teacherInfo.phone}}</text>
            <uni-icons type="forward" size="16" color="#d1d5db"></uni-icons>
          </view>
        </view>

        <view class="info-item" @tap="handleChangePassword">
          <text class="item-label">修改密码</text>
          <view class="item-right">
            <text class="item-value placeholder">点击修改</text>
            <uni-icons type="forward" size="16" color="#d1d5db"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'

/**
 * 教师个人信息
 */
const teacherInfo = ref({
  name: '张三',
  phone: '138****5678'
})

/**
 * 处理更换头像
 */
const handleChangeAvatar = () => {
  uni.showActionSheet({
    itemList: ['拍照', '从相册选择'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 拍照
        uni.chooseImage({
          count: 1,
          sourceType: ['camera'],
          success: (res) => {
            console.log('拍照成功:', res.tempFilePaths)
            uni.showToast({
              title: '头像上传功能开发中',
              icon: 'none'
            })
          }
        })
      } else if (res.tapIndex === 1) {
        // 从相册选择
        uni.chooseImage({
          count: 1,
          sourceType: ['album'],
          success: (res) => {
            console.log('选择照片成功:', res.tempFilePaths)
            uni.showToast({
              title: '头像上传功能开发中',
              icon: 'none'
            })
          }
        })
      }
    }
  })
}

/**
 * 处理编辑信息
 * @param {string} field - 要编辑的字段
 */
const handleEdit = (field) => {
  const fieldNames = {
    name: '姓名',
    phone: '手机号码'
  }

  // 其他字段使用输入框编辑
  uni.showModal({
    title: `修改${fieldNames[field]}`,
    editable: true,
    placeholderText: `请输入${fieldNames[field]}`,
    content: teacherInfo.value[field],
    success: (res) => {
      if (res.confirm && res.content) {
        teacherInfo.value[field] = res.content
        uni.showToast({
          title: `${fieldNames[field]}已更新`,
          icon: 'success'
        })
      }
    }
  })
}

/**
 * 处理修改密码
 */
const handleChangePassword = () => {
  uni.showModal({
    title: '修改密码',
    content: '密码修改功能将跳转到密码修改页面',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '密码修改功能开发中',
          icon: 'none'
        })
      }
    }
  })
}

</script>

<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 160rpx;
}

/* 头像区域 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 0;
  margin: 0 48rpx 32rpx;
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 16rpx;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(14, 165, 233, 0.3);
}

.avatar-text {
  font-size: 72rpx;
  font-weight: bold;
  color: #fff;
}

.camera-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 56rpx;
  height: 56rpx;
  background: #10b981;
  border-radius: 50%;
  border: 4rpx solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.4);
}

.avatar-hint {
  font-size: 24rpx;
  color: #9ca3af;
}

/* 信息区域 */
.info-section {
  padding: 0 48rpx;
}

/* 信息组 */
.info-group {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  padding: 32rpx;
  margin-bottom: 24rpx;
}

/* 组标题 */
.group-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.title-line {
  width: 8rpx;
  height: 32rpx;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  border-radius: 4rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
}

/* 信息项 */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 28rpx;
  color: #6b7280;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.item-value {
  font-size: 28rpx;
  color: #1f2937;
  font-weight: 500;
}

.item-value.placeholder {
  color: #0ea5e9;
}

</style>
