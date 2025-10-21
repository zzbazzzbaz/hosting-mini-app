<template>
  <!-- 页面头部组件 -->
  <view class="header">
    <!-- 返回按钮（可选） -->
    <view v-if="showBack" class="back" @click="handleBack">
      <text>‹</text>
    </view>

    <!-- 标题文字 -->
    <text class="title">{{ title }}</text>

    <!-- 占位元素，用于居中标题 -->
    <view v-if="showBack" class="placeholder"></view>
  </view>
</template>

<script setup>
/**
 * 页面头部组件
 * @props title - 标题文字
 * @props showBack - 是否显示返回按钮，默认false
 */
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  }
})

/**
 * 处理返回操作
 */
const handleBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
/* 头部容器 */
.header {
  background: linear-gradient(to right, #0ea5e9, #3b82f6);
  padding: 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 返回按钮 */
.back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  color: #fff;
  font-weight: bold;
}

/* 标题文字 */
.title {
  flex: 1;
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

/* 占位元素 */
.placeholder {
  width: 64rpx;
}
</style>
