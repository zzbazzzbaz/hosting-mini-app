<template>
  <view class="page">
    <PageHeader title="用户协议" :showBack="true" />
    <view class="content-spacing">
      <UserAgreementContent />
    </view>
  </view>
</template>

<script setup>
import PageHeader from '@/components/PageHeader.vue'
import UserAgreementContent from './components/UserAgreementContent.vue'
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f0f9ff;
  display: flex;
  flex-direction: column;
}

.content-spacing {
  margin-top: 24rpx;
  flex: 1;
  display: flex;
}
</style>
