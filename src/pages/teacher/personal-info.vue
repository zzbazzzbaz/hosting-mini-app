<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="个人信息" />

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

    <!-- 信息列表 -->
    <view class="info-section">
      <!-- 基本信息组 -->
      <view class="info-group">
        <view class="group-title">
          <view class="title-line"></view>
          <text class="title-text">基本信息</text>
        </view>

        <view class="info-item" @tap="handleEdit('name')">
          <view class="item-left">
            <view class="item-icon-box icon-blue">
              <uni-icons type="person" size="20" color="#3b82f6"></uni-icons>
            </view>
            <text class="item-label">姓名</text>
          </view>
          <view class="item-right">
            <text class="item-value">{{teacherInfo.name}}</text>
            <uni-icons type="forward" size="16" color="#d1d5db"></uni-icons>
          </view>
        </view>

        <view class="info-item" @tap="handleEdit('phone')">
          <view class="item-left">
            <view class="item-icon-box icon-green">
              <uni-icons type="phone" size="20" color="#10b981"></uni-icons>
            </view>
            <text class="item-label">手机号码</text>
          </view>
          <view class="item-right">
            <text class="item-value">{{teacherInfo.phone}}</text>
            <uni-icons type="forward" size="16" color="#d1d5db"></uni-icons>
          </view>
        </view>

        <view class="info-item" @tap="handleEdit('email')">
          <view class="item-left">
            <view class="item-icon-box icon-orange">
              <uni-icons type="email" size="20" color="#f97316"></uni-icons>
            </view>
            <text class="item-label">邮箱</text>
          </view>
          <view class="item-right">
            <text class="item-value">{{teacherInfo.email}}</text>
            <uni-icons type="forward" size="16" color="#d1d5db"></uni-icons>
          </view>
        </view>
      </view>

      <!-- 工作信息组 -->
      <view class="info-group">
        <view class="group-title">
          <view class="title-line"></view>
          <text class="title-text">工作信息</text>
        </view>

        <view class="info-item">
          <view class="item-left">
            <view class="item-icon-box icon-cyan">
              <uni-icons type="staff" size="20" color="#06b6d4"></uni-icons>
            </view>
            <text class="item-label">教师编号</text>
          </view>
          <view class="item-right">
            <text class="item-value readonly">{{teacherInfo.teacherId}}</text>
          </view>
        </view>
      </view>

      <!-- 账号信息组 -->
      <view class="info-group">
        <view class="group-title">
          <view class="title-line"></view>
          <text class="title-text">账号信息</text>
        </view>

        <view class="info-item">
          <view class="item-left">
            <view class="item-icon-box icon-gray">
              <uni-icons type="person" size="20" color="#6b7280"></uni-icons>
            </view>
            <text class="item-label">用户名</text>
          </view>
          <view class="item-right">
            <text class="item-value readonly">{{teacherInfo.username}}</text>
          </view>
        </view>

        <view class="info-item" @tap="handleChangePassword">
          <view class="item-left">
            <view class="item-icon-box icon-red">
              <uni-icons type="locked" size="20" color="#ef4444"></uni-icons>
            </view>
            <text class="item-label">修改密码</text>
          </view>
          <view class="item-right">
            <text class="item-value placeholder">点击修改</text>
            <uni-icons type="forward" size="16" color="#d1d5db"></uni-icons>
          </view>
        </view>

        <view class="info-item">
          <view class="item-left">
            <view class="item-icon-box icon-yellow">
              <uni-icons type="calendar" size="20" color="#eab308"></uni-icons>
            </view>
            <text class="item-label">注册时间</text>
          </view>
          <view class="item-right">
            <text class="item-value readonly">{{teacherInfo.registerTime}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-section">
      <button class="save-btn" @tap="handleSave">保存修改</button>
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
  gender: '男',
  phone: '138****5678',
  email: 'zhangsan@example.com',
  teacherId: 'T2025001',
  subject: '语文、数学',
  classes: '一年级1班、2班',
  username: 'zhangsan',
  registerTime: '2025-01-15'
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
    gender: '性别',
    phone: '手机号码',
    email: '邮箱地址',
    subject: '任教科目'
  }

  // 性别选择特殊处理
  if (field === 'gender') {
    uni.showActionSheet({
      itemList: ['男', '女'],
      success: (res) => {
        teacherInfo.value.gender = res.tapIndex === 0 ? '男' : '女'
        uni.showToast({
          title: '性别已更新',
          icon: 'success'
        })
      }
    })
    return
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

/**
 * 处理保存修改
 */
const handleSave = () => {
  uni.showLoading({
    title: '保存中...'
  })

  // 模拟保存延迟
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })

    // 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  }, 1000)
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

.item-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.item-icon-box {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue {
  background: #dbeafe;
}

.icon-green {
  background: #d1fae5;
}

.icon-orange {
  background: #fed7aa;
}

.icon-cyan {
  background: #cffafe;
}

.icon-gray {
  background: #f3f4f6;
}

.icon-red {
  background: #fee2e2;
}

.icon-yellow {
  background: #fef3c7;
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

.item-value.readonly {
  color: #9ca3af;
}

.item-value.placeholder {
  color: #0ea5e9;
}

/* 保存按钮区域 */
.save-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 48rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #e5e7eb;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.save-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  border-radius: 24rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(14, 165, 233, 0.3);
  transition: all 0.3s;
  border: none;
}

.save-btn::after {
  border: none;
}

.save-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(14, 165, 233, 0.3);
}
</style>
