<template>
  <view class="page">
    <PageHeader title="孩子信息" :showBack="true" />

    <view class="content">
      <view v-for="child in studentList" :key="child.id" class="child-card">
        <view class="card-top">
          <text class="child-name">{{ child.studentName }}</text>
        </view>

        <view class="info-grid">
          <view class="info-item">
            <text class="item-label">已用课时</text>
            <text class="item-value completed">{{ child.hours.usedHours }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">剩余课时</text>
            <text class="item-value pending">{{ child.hours.remainingHours }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">总课时</text>
            <text class="item-value">{{ child.hours.sumHours }}</text>
          </view>
        </view>

        <view class="teacher-info">
          <text class="teacher-label">托管教师：</text>
          <text class="teacher-name">{{ child.teacherName }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { getMyInfo } from '@/api/parent/personal'

const studentList = ref([])

/**
 * 加载学生列表
 */
const loadStudentList = async () => {
  try {
    const res = await getMyInfo()
    if (res.code === 200) {
      studentList.value = res.data.studentList
    }
  } catch (error) {
    console.error('加载学生列表失败:', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

onMounted(() => {
  loadStudentList()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 144rpx 48rpx 48rpx;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 24rpx;
}

.child-card {
  background: #ffffff;
  border-radius: 28rpx;
  box-shadow: 0 6rpx 18rpx rgba(14, 165, 233, 0.15);
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.child-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #1f2937;
}

.contact {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 26rpx;
  color: #0ea5e9;
}

.contact-text {
  font-weight: 600;
}

.info-grid {
  display: flex;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 20rpx;
  padding: 24rpx 32rpx;
  gap: 24rpx;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  align-items: flex-start;
  flex: 1;
}

.item-label {
  font-size: 24rpx;
  color: #6b7280;
}

.item-value {
  font-size: 34rpx;
  font-weight: 700;
  color: #1f2937;
}

.completed {
  color: #0ea5e9;
}

.pending {
  color: #f97316;
}

.info-item:not(:last-child) {
  border-right: 1rpx solid rgba(59, 130, 246, 0.2);
  padding-right: 24rpx;
}

.teacher-info {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: #f9fafb;
  border-radius: 16rpx;
}

.teacher-label {
  font-size: 26rpx;
  color: #6b7280;
}

.teacher-name {
  font-size: 26rpx;
  color: #1f2937;
  font-weight: 600;
}
</style>
