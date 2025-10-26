<template>
  <!-- 主容器 -->
  <view class="container">
    <!-- Logo区域 -->
    <view class="logo-section">
      <view class="logo-circle">
        <!-- Logo图片 -->
        <image src="/static/logo.png" class="logo-image" mode="aspectFit"></image>
      </view>
      <text class="app-title">托管小程序</text>
      <text class="app-subtitle">家长与教师的沟通桥梁</text>
    </view>

    <!-- 登录表单卡片 -->
    <view class="login-card">
      <!-- 角色切换 -->
      <view class="role-switch">
        <view
          :class="['role-btn', selectedRole === 'parent' ? 'role-btn-active' : 'role-btn-inactive']"
          @click="selectRole('parent')"
        >
          <uni-icons type="person" :size="22" :color="selectedRole === 'parent' ? '#ffffff' : '#0369a1'"></uni-icons>
          <text>家长</text>
        </view>
        <view
          :class="['role-btn', selectedRole === 'teacher' ? 'role-btn-active' : 'role-btn-inactive']"
          @click="selectRole('teacher')"
        >
          <uni-icons type="staff" :size="22" :color="selectedRole === 'teacher' ? '#ffffff' : '#0369a1'"></uni-icons>
          <text>教师</text>
        </view>
      </view>

      <!-- 表单 -->
      <view class="form-container">
        <!-- 手机号输入框 -->
        <view class="form-field">
          <text class="form-label">手机号</text>
          <view class="input-wrapper">
            <view class="input-icon">
              <uni-icons type="phone" size="20" color="#6b7280"></uni-icons>
            </view>
            <input
              v-model="phone"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              class="input-field"
            />
          </view>
        </view>

        <!-- 密码输入框 -->
        <view class="form-field">
          <text class="form-label">密码</text>
          <view class="input-wrapper">
            <view class="input-icon">
              <uni-icons type="locked" size="20" color="#6b7280"></uni-icons>
            </view>
            <input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              class="input-field"
            />
          </view>
        </view>

        <!-- 登录按钮 -->
        <button class="login-btn" @click="handleLogin">登录</button>

        <!-- 其他选项 -->
        <view class="options-row">
          <text class="option-link">忘记密码?</text>
          <text class="option-link">联系管理员</text>
        </view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="footer-text">
      <text class="footer-normal">登录即表示您同意我们的</text>
      <text class="footer-link">服务条款</text>
      <text class="footer-normal">和</text>
      <text class="footer-link">隐私政策</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const selectedRole = ref('parent') // 默认选中家长
const phone = ref('')
const password = ref('')

/**
 * 选择角色
 * @param {string} role - 角色类型: 'parent' 或 'teacher'
 */
const selectRole = (role) => {
  selectedRole.value = role
}

/**
 * 处理登录逻辑
 */
const handleLogin = () => {
  // 表单验证
  if (!phone.value) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
    return
  }

  // 手机号格式验证（已注释，方便测试）
  // if (phone.value.length !== 11 || !/^1[3-9]\d{9}$/.test(phone.value)) {
  //   uni.showToast({
  //     title: '请输入正确的手机号格式',
  //     icon: 'none'
  //   })
  //   return
  // }

  if (!password.value) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return
  }

  // 根据角色跳转到对应页面
  if (selectedRole.value === 'parent') {
    // 家长端登录成功后跳转到家长首页
    uni.reLaunch({
      url: '/pages/parent/home/home'
    })
  } else {
    // 教师端登录成功后跳转到教师首页
    uni.reLaunch({
      url: '/pages/teacher/home/home'
    })
  }
}
</script>

<style scoped>
/* 主容器 - 浅紫色渐变背景 */
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
}

/* Logo区域 */
.logo-section {
  text-align: center;
  margin-bottom: 64rpx;
}

.logo-circle {
  width: 192rpx;
  height: 192rpx;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
  border: 8rpx solid #f3e8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32rpx;
}

.logo-image {
  width: 120rpx;
  height: 120rpx;
}


.app-title {
  display: block;
  font-size: 60rpx;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16rpx;
}

.app-subtitle {
  display: block;
  font-size: 28rpx;
  color: #6b7280;
}

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 520rpx;
  background-color: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.1);
  padding: 56rpx;
}

/* 角色切换按钮组 */
.role-switch {
  display: flex;
  gap: 32rpx;
  margin-bottom: 48rpx;
}

.role-btn {
  flex: 1;
  padding: 24rpx 32rpx;
  border-radius: 24rpx;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}


/* 未选中状态 - 浅蓝色 */
.role-btn-inactive {
  background-color: #e0f2fe;
  color: #0369a1;
}

/* 选中状态 - 深蓝色 */
.role-btn-active {
  background-color: #0ea5e9;
  color: #ffffff;
}

/* 表单容器 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

/* 表单字段 */
.form-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #374151;
  margin-bottom: 16rpx;
}

/* 输入框包装器 */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 24rpx;
  transition: all 0.2s;
}

.input-wrapper:focus-within {
  background-color: #ffffff;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6rpx rgba(14, 165, 233, 0.1);
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 32rpx;
}

.input-field {
  flex: 1;
  padding: 28rpx 32rpx;
  font-size: 30rpx;
  border: none;
  background-color: transparent;
  outline: none;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  background: linear-gradient(to right, #0ea5e9, #3b82f6);
  color: #ffffff;
  padding: 32rpx;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 20rpx 40rpx rgba(14, 165, 233, 0.2);
  border: none;
  margin-top: 16rpx;
  transition: all 0.2s;
}

.login-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 16rpx 32rpx rgba(14, 165, 233, 0.3);
}

/* 选项行 */
.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  color: #6b7280;
  margin-top: 8rpx;
}

.option-link {
  color: #0ea5e9;
  transition: color 0.2s;
}

/* 底部提示文字 */
.footer-text {
  text-align: center;
  font-size: 24rpx;
  color: #9ca3af;
  margin-top: 48rpx;
}

.footer-normal {
  color: #9ca3af;
}

.footer-link {
  color: #0ea5e9;
}
</style>
