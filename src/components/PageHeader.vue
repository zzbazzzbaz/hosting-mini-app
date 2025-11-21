<template>
  <!-- 页面头部组件 -->
  <view class="header">
    <!-- 返回按钮（可选） -->
    <view v-if="showBack" class="back" @click="handleBack">
      <text class="back-icon">‹</text>
    </view>

    <!-- 无返回按钮时的占位 -->
    <view v-else class="back-placeholder"></view>

    <!-- 标题文字 -->
    <text class="title">{{ title }}</text>

    <!-- 右侧占位元素，用于居中标题 -->
    <view class="placeholder"></view>
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
    default: '',
  },
  showBack: {
    type: Boolean,
    default: false,
  },
})

/**
 * 处理返回操作
 */
const handleBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
/* 头部容器 - 固定在顶部 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
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
  cursor: pointer;
  transition: opacity 0.2s;
}

.back:active {
  opacity: 0.7;
}

.back-icon {
  font-size: 80rpx;
  color: #fff;
  font-weight: bold;
  line-height: 1;
}

/* 无返回按钮时的占位 */
.back-placeholder {
  width: 64rpx;
}

/* 标题文字 */
.title {
  flex: 1;
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

/* 右侧占位元素 */
.placeholder {
  width: 64rpx;
}
</style>
