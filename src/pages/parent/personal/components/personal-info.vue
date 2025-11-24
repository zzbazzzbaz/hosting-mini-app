<template>
  <view class="page">
    <PageHeader title="个人信息" :showBack="true" />

    <view class="avatar-section">
      <view class="avatar-wrapper">
        <view class="avatar">
          <text class="avatar-text">{{ parentInfo.name.slice(0, 1) }}</text>
        </view>
        <view class="camera-icon" @tap="handleChangeAvatar">
          <uni-icons type="camera" size="20" color="#fff"></uni-icons>
        </view>
      </view>
      <text class="avatar-hint">点击更换头像</text>
    </view>

    <view class="info-section">
      <view class="info-group">
        <view class="group-title">
          <view class="title-line"></view>
          <text class="title-text">监护人信息</text>
        </view>

        <view class="info-item">
          <text class="item-label">姓名</text>
          <view class="item-right">
            <text class="item-value">{{ parentInfo.name }}</text>
          </view>
        </view>

        <view class="info-item">
          <text class="item-label">手机号码</text>
          <view class="item-right">
            <text class="item-value">{{ parentInfo.phone }}</text>
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
import { getMyInfo, editPassword } from '@/api/parent/personal'

const parentInfo = ref({
  name: '李女士',
  phone: '138****1234',
})

/**
 * 加载个人信息
 */
const loadMyInfo = async () => {
  try {
    const res = await getMyInfo()
    if (res.code === 200) {
      parentInfo.value = res.data.info
    }
  } catch (error) {
    console.error('加载个人信息失败:', error)
  }
}

const handleChangeAvatar = () => {
  uni.showActionSheet({
    itemList: ['拍照', '从相册选择'],
    success: (res) => {
      const sourceType = res.tapIndex === 0 ? ['camera'] : ['album']
      uni.chooseImage({
        count: 1,
        sourceType,
        success: () => {
          uni.showToast({ title: '头像上传功能开发中', icon: 'none' })
        },
      })
    },
  })
}

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
                  await uni.showToast({ title: '密码修改成功', icon: 'success' })
                } else {
                  await uni.showToast({ title: result.message || '密码修改失败', icon: 'none' })
                }
              } catch (error) {
                console.error('修改密码失败:', error)
                await uni.showToast({ title: '修改密码失败', icon: 'none' })
              }
            }
          },
        })
      }
    },
  })
}

onMounted(() => {
  loadMyInfo()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 160rpx;
}

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
  background: linear-gradient(135deg, #0ea5e9, #60a5fa);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(14, 165, 233, 0.25);
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
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.35);
}

.avatar-hint {
  font-size: 24rpx;
  color: #9ca3af;
}

.info-section {
  padding: 0 48rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.info-group {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  padding: 32rpx;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.title-line {
  width: 8rpx;
  height: 32rpx;
  background: linear-gradient(135deg, #0ea5e9, #60a5fa);
  border-radius: 4rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
}

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
