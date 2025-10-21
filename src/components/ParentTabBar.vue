<template>
  <!-- 家长端底部导航栏组件 -->
  <view class="tabbar">
    <!-- 首页 -->
    <view
      :class="['tabbar-item', activeTab === 'home' ? 'tabbar-item-active' : '']"
      @click="goToPage('home')"
    >
      <text :class="activeTab === 'home' ? 'tabbar-icon-active' : 'tabbar-icon'">🏠</text>
      <text :class="activeTab === 'home' ? 'tabbar-label-active' : 'tabbar-label'">首页</text>
    </view>

    <!-- 作业信息 -->
    <view
      :class="['tabbar-item', activeTab === 'homework' ? 'tabbar-item-active' : '']"
      @click="goToPage('homework')"
    >
      <text :class="activeTab === 'homework' ? 'tabbar-icon-active' : 'tabbar-icon'">📝</text>
      <text :class="activeTab === 'homework' ? 'tabbar-label-active' : 'tabbar-label'">作业信息</text>
    </view>

    <!-- 签到信息 -->
    <view
      :class="['tabbar-item', activeTab === 'checkin' ? 'tabbar-item-active' : '']"
      @click="goToPage('checkin')"
    >
      <text :class="activeTab === 'checkin' ? 'tabbar-icon-active' : 'tabbar-icon'">✅</text>
      <text :class="activeTab === 'checkin' ? 'tabbar-label-active' : 'tabbar-label'">签到信息</text>
    </view>

    <!-- 发布作业 -->
    <view
      :class="['tabbar-item', activeTab === 'publish' ? 'tabbar-item-active' : '']"
      @click="goToPage('publish')"
    >
      <text :class="activeTab === 'publish' ? 'tabbar-icon-active' : 'tabbar-icon'">➕</text>
      <text :class="activeTab === 'publish' ? 'tabbar-label-active' : 'tabbar-label'">发布作业</text>
    </view>
  </view>
</template>

<script setup>
/**
 * 家长端底部导航栏组件
 * @props activeTab - 当前激活的标签页: 'home' | 'homework' | 'checkin' | 'publish'
 */
const props = defineProps({
  activeTab: {
    type: String,
    default: 'home'
  }
})

/**
 * 导航到指定页面
 * @param {string} page - 页面标识
 */
const goToPage = (page) => {
  // 路由映射
  const routes = {
    home: '/pages/parent/home',
    homework: '/pages/parent/homework-list',
    checkin: '/pages/parent/checkin',
    publish: '/pages/parent/publish-homework'
  }

  // 如果点击的不是当前页面，则跳转
  if (routes[page] && page !== props.activeTab) {
    uni.navigateTo({
      url: routes[page]
    })
  }
}
</script>

<style scoped>
/* 底部导航栏 */
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1rpx solid #e5e7eb;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
  display: flex;
  padding: 16rpx 0;
}

/* 导航项 */
.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 0;
  color: #9ca3af;
}

.tabbar-item-active {
  color: #0ea5e9;
}

/* 图标 */
.tabbar-icon,
.tabbar-icon-active {
  font-size: 48rpx;
}

/* 标签文字 */
.tabbar-label {
  font-size: 24rpx;
}

.tabbar-label-active {
  font-weight: 500;
  color: #0ea5e9;
  font-size: 24rpx;
}
</style>
