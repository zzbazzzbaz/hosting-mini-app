<template>
  <view class="page">
    <PageHeader title="隐私政策" :showBack="true" />
    <view class="content-spacing">
      <PrivacyPolicyContent />
    </view>
  </view>
</template>

<script setup>
import PageHeader from '@/components/PageHeader.vue'
import PrivacyPolicyContent from './components/PrivacyPolicyContent.vue'
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f0f9ff;
  display: flex;
  flex-direction: column;
}

.content-spacing {
  margin-top: 36rpx;
  padding: 0 20rpx 24rpx;
  flex: 1;
  display: flex;
  box-sizing: border-box;
}
</style>
