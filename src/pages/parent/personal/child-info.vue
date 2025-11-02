<template>
  <view class="page">
    <PageHeader title="孩子信息" :showBack="true" />

    <view class="content">
      <view v-for="child in children" :key="child.id" class="child-card">
        <view class="card-top">
          <text class="child-name">{{ child.name }}</text>
          <view class="contact">
            <uni-icons type="phone" size="18" color="#0ea5e9" />
            <text class="contact-text">{{ child.teacherPhone }}</text>
          </view>
        </view>

        <view class="info-grid">
          <view class="info-item">
            <text class="item-label">已修课时</text>
            <text class="item-value completed">{{ child.completedHours }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">未修课时</text>
            <text class="item-value pending">{{ child.pendingHours }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">班主任</text>
            <text class="item-value">{{ child.teacherName }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'

const children = ref([
  {
    id: 1,
    name: '李华',
    completedHours: 26,
    pendingHours: 4,
    teacherName: '王老师',
    teacherPhone: '138****2222'
  },
  {
    id: 2,
    name: '张明',
    completedHours: 18,
    pendingHours: 8,
    teacherName: '赵老师',
    teacherPhone: '139****7788'
  }
])
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
</style>
