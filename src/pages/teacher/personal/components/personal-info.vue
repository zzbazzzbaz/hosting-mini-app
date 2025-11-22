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
 * 修改密码
 */
const handleChangePassword = () => {
  let oldPassword = ''
  let newPassword = ''

  // 第一步：输入旧密码
  uni.showModal({
    title: '修改密码',
    editable: true,
    placeholderText: '请输入旧密码',
    success: (res1) => {
      if (res1.confirm && res1.content) {
        oldPassword = res1.content

        // 第二步：输入新密码
        uni.showModal({
          title: '修改密码',
          editable: true,
          placeholderText: '请输入新密码',
          success: async (res2) => {
            if (res2.confirm && res2.content) {
              newPassword = res2.content

              // 调用API修改密码
              try {
                const result = await editPassword({
                  oldPassword,
                  newPassword,
                })

                if (result.code === 200) {
                  uni.showToast({ title: '密码修改成功', icon: 'success' })
                } else {
                  uni.showToast({ title: result.message || '密码修改失败', icon: 'none' })
                }
              } catch (error) {
                console.error('修改密码失败:', error)
                uni.showToast({ title: '修改密码失败', icon: 'none' })
              }
            }
          },
        })
      }
    },
  })
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
</style>
