<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="个人信息" :showBack="true" />

    <!-- 基本信息卡片 -->
    <view class="info-section">
      <view class="info-group single-group">
        <view class="group-title">
          <view class="title-line"></view>
          <text class="title-text">基本信息</text>
        </view>

        <view class="info-item">
          <text class="item-label">姓名</text>
          <view class="item-right">
            <text class="item-value">{{ teacherInfo.name }}</text>
          </view>
        </view>

        <view class="info-item">
          <text class="item-label">手机号码</text>
          <view class="item-right">
            <text class="item-value">{{ teacherInfo.phone }}</text>
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

    <!-- 修改密码弹窗 -->
    <view v-if="showPasswordModal" class="modal-overlay" @tap="closePasswordModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">修改密码</text>
          <view class="modal-close" @tap="closePasswordModal">
            <uni-icons type="close" size="20" color="#6b7280"></uni-icons>
          </view>
        </view>

        <view class="modal-body">
          <!-- 旧密码 -->
          <view class="form-item">
            <text class="form-label">旧密码</text>
            <input
              class="form-input"
              type="text"
              password
              v-model="passwordForm.oldPassword"
              placeholder="请输入旧密码"
              placeholder-class="input-placeholder"
            />
          </view>

          <!-- 新密码 -->
          <view class="form-item">
            <text class="form-label">新密码</text>
            <input
              class="form-input"
              type="text"
              password
              v-model="passwordForm.newPassword"
              placeholder="请输入新密码"
              placeholder-class="input-placeholder"
            />
          </view>

          <!-- 重复输入新密码 -->
          <view class="form-item">
            <text class="form-label">确认密码</text>
            <input
              class="form-input"
              type="text"
              password
              v-model="passwordForm.confirmPassword"
              placeholder="请重复输入新密码"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <view class="modal-footer">
          <view class="modal-btn cancel" @tap="closePasswordModal">取消</view>
          <view class="modal-btn confirm" @tap="submitPasswordChange">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { getMyInfo, editPassword } from '@/api/teacher/personal'

/**
 * 教师个人信息
 */
const teacherInfo = ref({
  name: '',
  phone: '',
})

/**
 * 控制修改密码弹窗显示
 */
const showPasswordModal = ref(false)

/**
 * 修改密码表单数据
 */
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

/**
 * 加载个人信息
 */
const loadMyInfo = async () => {
  try {
    const response = await getMyInfo()
    if (response.code === 200 && response.data) {
      teacherInfo.value = {
        name: response.data.info.name,
        phone: response.data.info.phone,
      }
    }
  } catch (error) {
    console.error('加载个人信息失败:', error)
    await uni.showToast({
      title: '数据加载失败',
      icon: 'none',
    })
  }
}

onMounted(() => {
  loadMyInfo()
})

/**
 * 打开修改密码弹窗
 */
const handleChangePassword = () => {
  // 重置表单数据
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  // 显示弹窗
  showPasswordModal.value = true
}

/**
 * 关闭修改密码弹窗
 */
const closePasswordModal = () => {
  showPasswordModal.value = false
}

/**
 * 提交修改密码
 */
const submitPasswordChange = async () => {
  // 校验表单是否填写完整
  if (!passwordForm.value.oldPassword) {
    await uni.showToast({
      title: '请输入旧密码',
      icon: 'none',
    })
    return
  }

  if (!passwordForm.value.newPassword) {
    await uni.showToast({
      title: '请输入新密码',
      icon: 'none',
    })
    return
  }

  if (!passwordForm.value.confirmPassword) {
    await uni.showToast({
      title: '请重复输入新密码',
      icon: 'none',
    })
    return
  }

  // 校验新密码和确认密码是否一致
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    await uni.showToast({
      title: '两次输入的新密码不一致',
      icon: 'none',
    })
    return
  }

  // 调用API修改密码
  try {
    const result = await editPassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
    })

    if (result.code === 200) {
      await uni.showToast({
        title: '密码修改成功',
        icon: 'success',
      })
      // 关闭弹窗
      closePasswordModal()
    } else {
      await uni.showToast({
        title: result.message || '密码修改失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    await uni.showToast({
      title: '修改密码失败',
      icon: 'none',
    })
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

/* 修改密码弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #f3f4f6;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
}

.modal-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-body {
  padding: 32rpx;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #374151;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #1f2937;
  background: #f9fafb;
  border: 1rpx solid #e5e7eb;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.input-placeholder {
  color: #9ca3af;
}

.modal-footer {
  display: flex;
  border-top: 1rpx solid #f3f4f6;
}

.modal-btn {
  flex: 1;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 500;
  cursor: pointer;
}

.modal-btn.cancel {
  color: #6b7280;
  border-right: 1rpx solid #f3f4f6;
}

.modal-btn.confirm {
  color: #0ea5e9;
  font-weight: bold;
}
</style>
