<template>
  <!-- 主容器 -->
  <view class="container">
    <!-- Logo区域 -->
    <view class="logo-section">
      <view class="logo-circle">
        <!-- Logo图片 -->
        <image src="https://test.project.ri.chatgqt.top/static/logo.png" class="logo-image" mode="aspectFit"></image>
      </view>
      <text class="app-title">课后托管通</text>
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
          <uni-icons
            type="person"
            :size="22"
            :color="selectedRole === 'parent' ? '#ffffff' : '#0369a1'"
          ></uni-icons>
          <text>家长</text>
        </view>
        <view
          :class="[
            'role-btn',
            selectedRole === 'teacher' ? 'role-btn-active' : 'role-btn-inactive',
          ]"
          @click="selectRole('teacher')"
        >
          <uni-icons
            type="staff"
            :size="22"
            :color="selectedRole === 'teacher' ? '#ffffff' : '#0369a1'"
          ></uni-icons>
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

        <!-- 协议勾选 -->
        <view class="agreements">
          <label class="agreement-item" @click="togglePrivacyAgreement">
            <view :class="['checkbox', hasAgreedPrivacy ? 'checkbox-checked' : '']">
              <uni-icons
                v-if="hasAgreedPrivacy"
                type="checkmarkempty"
                size="18"
                color="#ffffff"
              ></uni-icons>
            </view>
            <text class="agreement-text">我已阅读并同意</text>
            <text class="agreement-link" @click.stop="showPrivacyPolicy">《隐私政策》</text>
          </label>
          <label class="agreement-item" @click="toggleUserAgreement">
            <view :class="['checkbox', hasAgreedUser ? 'checkbox-checked' : '']">
              <uni-icons
                v-if="hasAgreedUser"
                type="checkmarkempty"
                size="18"
                color="#ffffff"
              ></uni-icons>
            </view>
            <text class="agreement-text">我已阅读并同意</text>
            <text class="agreement-link" @click.stop="showUserAgreement">《用户协议》</text>
          </label>
        </view>

        <!-- 登录按钮 -->
        <button
          class="login-btn"
          :class="{ 'login-btn-disabled': !allAgreed || isLoading }"
          :disabled="isLoading"
          @click="handleLogin"
        >
          登录
        </button>

        <!-- 其他选项 -->
        <view class="options-row">
          <text class="option-link" @click="handleForgotPassword">忘记密码?</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { login } from '@/api/common/auth'
import { setAuth } from '@/store/auth'

// 响应式数据
const selectedRole = ref('parent') // 默认选中家长
const phone = ref('')
const password = ref('')
const isLoading = ref(false)
const hasAgreedPrivacy = ref(false)
const hasAgreedUser = ref(false)

const allAgreed = computed(() => hasAgreedPrivacy.value && hasAgreedUser.value)

const privacyContent = `一、引言
本隐私政策旨在说明我们如何收集、使用、存储和保护您的个人信息，以及您如何行使自己的隐私权利。请在使用本小程序前认真阅读并理解本政策。

二、信息收集
- 基本信息：注册时需提供手机号、昵称等基本信息。

三、信息使用
- 提供服务：用于实现本小程序的基本功能，如消息推送。
- 优化体验：分析用户使用习惯，提升服务质量。
- 安全保障：预防欺诈、维护网络安全。
- 法律要求：配合政府监管，响应司法调查。

四、信息共享与披露
除非得到您的明确同意，或基于法律规定、保护公共利益、维护平台安全等必要情形，我们不会向第三方共享您的个人信息。

五、信息安全
我们采用加密技术、防火墙等措施保护您的个人信息安全，但请注意，任何系统都无法完全避免安全风险，我们建议您定期更换密码，谨慎对待来自陌生人的请求。

六、您的权利
您有权查询、更正、删除自己的个人信息，撤回同意，投诉举报等。如需行使上述权利，请联系我们的客服进行操作。

七、政策更新
我们可能会适时更新本隐私政策，更新后的政策将通过公告形式告知用户，继续使用即视为接受新版本。`

const userAgreementContent = `课后托管通用户协议

一、总则
（一）目的与范围
本用户协议（以下简称“协议”）旨在明确您（以下简称“用户”）在使用课后托管通（以下简称“本小程序”）服务过程中的权利与义务，以及我们提供的服务内容、方式及相关规则。请您在注册、登录及使用本小程序前仔细阅读本协议，一旦开始使用即表示您已充分理解并同意接受本协议的全部条款。
（二）协议生效
用户完成注册并登录本小程序，即视为同意本协议的全部内容，本协议即在用户与服务商之间产生法律效力。
（三）修改权
我们有权根据法律法规变化、业务发展需要或技术升级等原因对本协议进行修改，修改后的协议将在本小程序内公布，不再单独通知用户。继续使用本小程序则视为接受修改后的协议。

二、服务内容
本小程序提供的服务包括但不限于：信息查询、业务咨询、预约装修等功能，具体服务内容以实际提供为准。

三、用户账户管理
（一）账户注册与登录
用户需通过合法有效的手机号、微信号等方式完成注册与登录。
（二）信息真实性
用户应保证提供的个人信息真实有效，否则我们有权暂停或终止服务。
（三）账户安全
用户应妥善保管账号和密码，对因用户自身原因导致的账号被盗用、信息泄露等后果自行承担责任。

四、知识产权
本小程序内的所有内容（包括但不限于文字、图片、音频、视频等）的知识产权归我们或相关权利人所有，未经授权不得擅自复制、传播或使用。

五、法律责任与免责声明
我们不对因网络故障、第三方攻击等非我方因素导致的服务中断或数据丢失负责。
用户应遵守国家法律法规及平台规定，对于违法违规行为，我们有权采取相应措施直至追究法律责任。

六、争议解决
双方因执行本协议发生争议，应首先通过友好协商解决；协商不成时，可提交至中国山东仲裁委员会按照申请仲裁时该会现行有效的仲裁规则进行仲裁。仲裁裁决是终局的，对双方均有约束力。`

/**
 * 选择角色
 * @param {string} role - 角色类型: 'parent' 或 'teacher'
 */
const selectRole = (role) => {
  selectedRole.value = role
}

/**
 * 处理忘记密码
 */
const handleForgotPassword = () => {
  uni.showModal({
    title: '提示',
    content: '请联系管理员重置密码',
    showCancel: false,
  })
}

/**
 * 切换协议勾选
 */
const togglePrivacyAgreement = () => {
  hasAgreedPrivacy.value = !hasAgreedPrivacy.value
}

const toggleUserAgreement = () => {
  hasAgreedUser.value = !hasAgreedUser.value
}

/**
 * 查看隐私政策
 */
const showPrivacyPolicy = () => {
  uni.showModal({
    title: '隐私政策',
    content: privacyContent,
    showCancel: false,
  })
}

/**
 * 查看用户协议
 */
const showUserAgreement = () => {
  uni.showModal({
    title: '用户协议',
    content: userAgreementContent,
    showCancel: false,
  })
}

/**
 * 处理登录逻辑
 */
const handleLogin = async () => {
  if (!allAgreed.value) {
    await uni.showModal({
      title: '提示',
      content: '请阅读并勾选《隐私政策》和《用户协议》后再登录',
      showCancel: false,
    })
    return
  }

  // 表单验证
  if (!phone.value) {
    await uni.showToast({
      title: '请输入手机号',
      icon: 'none',
    })
    return
  }

  if (!password.value) {
    await uni.showToast({
      title: '请输入密码',
      icon: 'none',
    })
    return
  }

  // 防止重复提交
  if (isLoading.value) return
  isLoading.value = true

  try {
    // 调用登录接口
    const type = selectedRole.value === 'parent' ? 2 : 3
    const response = await login({
      phone: phone.value,
      password: password.value,
      type: type,
    })

    // 检查响应数据
    if (!response.data || !response.data.authToken) {
      throw new Error(response.message || '登录失败')
    }

    // 登录成功，保存 token 和用户信息
    const userInfo = {
      userId: response.data.userId,
      phone: response.data.phone,
      userName: response.data.userName,
      type: type,
    }

    // 家长端保存学生列表
    if (type === 2 && response.data.studentList) {
      userInfo.studentList = response.data.studentList
    }

    setAuth(response.data.authToken, userInfo)

    await uni.showToast({
      title: '登录成功',
      icon: 'success',
    })

    // 根据角色跳转到对应页面
    setTimeout(() => {
      if (selectedRole.value === 'parent') {
        uni.reLaunch({
          url: '/pages/parent/home/parent-home',
        })
      } else {
        uni.reLaunch({
          url: '/pages/teacher/home/teacher-home',
        })
      }
    }, 500)
  } catch (error) {
    console.error('登录失败:', error)
    // 显示登录失败提示
    await uni.showToast({
      title: error.message || '登录失败，请稍后重试',
      icon: 'none',
      duration: 2000,
    })
  } finally {
    isLoading.value = false
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

.agreements {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16rpx;
  font-size: 26rpx;
  color: #6b7280;
  margin-top: 8rpx;
}

.agreement-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border-radius: 8rpx;
  border: 2rpx solid #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: all 0.2s;
}

.checkbox-checked {
  background-color: #0ea5e9;
  border-color: #0ea5e9;
  box-shadow: 0 8rpx 16rpx rgba(14, 165, 233, 0.25);
}

.agreement-text {
  color: #6b7280;
}

.agreement-link {
  color: #0ea5e9;
  text-decoration: underline;
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

.login-btn-disabled {
  background: #d1d5db;
  box-shadow: none;
  color: #9ca3af;
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
</style>
