<template>
  <view class="notice-card">
    <!-- 公告列表 -->
    <view
      class="notice-item"
      v-for="(notice, index) in notices"
      :key="notice.id || index"
      @tap="handleNoticeClick(notice)"
    >
      <view class="notice-left">
        <!-- 图标区域 -->
        <view class="notice-icon">
          <uni-icons
            :type="notice.icon || 'chatbubble'"
            size="20"
            :color="notice.color || '#3b82f6'"
          />
        </view>

        <!-- 内容区域 -->
        <view class="notice-content">
          <text class="notice-title">{{ notice.title }}</text>
          <text class="notice-time">{{ notice.time || '刚刚' }}</text>
        </view>
      </view>

      <!-- 右侧箭头图标 -->
      <uni-icons type="forward" size="16" color="#d1d5db" />
    </view>

    <!-- 空状态 -->
    <view class="notice-empty" v-if="notices.length === 0">
      <uni-icons type="info" size="48" color="#d1d5db" />
      <text class="empty-text">{{ emptyText }}</text>
    </view>
  </view>
</template>

<script setup>
/**
 * 公告通知卡片组件
 * 统一的公告通知显示组件，支持教师端和家长端
 */
const props = defineProps({
  /**
   * 公告列表数据
   * 每项包含：id, title, content, time, icon(可选), color(可选)
   */
  notices: {
    type: Array,
    default: () => [],
  },

  /**
   * 空状态提示文字
   */
  emptyText: {
    type: String,
    default: '暂无公告通知',
  },
})

const emit = defineEmits(['notice-click'])

/**
 * 处理公告点击事件
 * 弹出模态框显示详细内容
 */
const handleNoticeClick = (notice) => {
  uni.showModal({
    title: notice.title,
    content: notice.content || '暂无详细内容',
    showCancel: false,
    confirmText: '知道了',
  })

  // 触发父组件事件，用于统计、埋点等
  emit('notice-click', notice)
}
</script>

<style scoped>
/* 公告通知卡片 */
.notice-card {
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  padding: 32rpx;
}

/* 公告项 */
.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f3f4f6;
  transition: all 0.3s;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-item:active {
  background: #f9fafb;
  border-radius: 16rpx;
}

/* 左侧区域 */
.notice-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
  /* 限制宽度，使内部省略号生效 */
  min-width: 0;
  overflow: hidden;
}

/* 图标容器 */
.notice-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0f2fe;
  flex-shrink: 0;
}

/* 内容区域 */
.notice-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
  /* 限制宽度，使内部省略号生效 */
  min-width: 0;
  overflow: hidden;
}

/* 公告标题 */
.notice-title {
  font-size: 28rpx;
  color: #1f2937;
  font-weight: 500;
  /* 单行显示，超出显示省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 时间 */
.notice-time {
  font-size: 24rpx;
  color: #9ca3af;
}

/* 空状态 */
.notice-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  gap: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}
</style>
