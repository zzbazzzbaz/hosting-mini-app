<template>
  <!-- 家长端底部导航栏组件 -->
  <view class="tabbar">
    <!-- 首页 -->
    <view
      :class="['tabbar-item', activeTab === 'home' ? 'tabbar-item-active' : '']"
      @click="goToPage('home')"
    >
      <uni-icons
        type="home-filled"
        :size="26"
        :color="activeTab === 'home' ? '#0ea5e9' : '#9ca3af'"
      ></uni-icons>
      <text :class="activeTab === 'home' ? 'tabbar-label-active' : 'tabbar-label'">首页</text>
    </view>

    <!-- 作业信息 -->
    <view
      :class="['tabbar-item', activeTab === 'homework' ? 'tabbar-item-active' : '']"
      @click="goToPage('homework')"
    >
      <uni-icons
        type="compose"
        :size="26"
        :color="activeTab === 'homework' ? '#0ea5e9' : '#9ca3af'"
      ></uni-icons>
      <text :class="activeTab === 'homework' ? 'tabbar-label-active' : 'tabbar-label'">作业</text>
    </view>

    <!-- 签到信息 -->
    <view
      :class="['tabbar-item', activeTab === 'checkin' ? 'tabbar-item-active' : '']"
      @click="goToPage('checkin')"
    >
      <uni-icons
        type="checkmarkempty"
        :size="26"
        :color="activeTab === 'checkin' ? '#0ea5e9' : '#9ca3af'"
      ></uni-icons>
      <text :class="activeTab === 'checkin' ? 'tabbar-label-active' : 'tabbar-label'">签到</text>
    </view>

    <!-- 我的 -->
    <view
      :class="['tabbar-item', activeTab === 'publish' ? 'tabbar-item-active' : '']"
      @click="goToPage('publish')"
    >
      <uni-icons
        type="plusempty"
        :size="26"
        :color="activeTab === 'publish' ? '#0ea5e9' : '#9ca3af'"
      ></uni-icons>
      <text :class="activeTab === 'publish' ? 'tabbar-label-active' : 'tabbar-label'">我的</text>
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
    default: 'home',
  },
})

/**
 * 导航到指定页面
 * @param {string} page - 页面标识
 */
const goToPage = (page) => {
  // 路由映射
  const routes = {
    home: '/pages/parent/home/parent-home',
    homework: '/pages/parent/homework/homework-list',
    checkin: '/pages/parent/checkin/student-checkin',
    publish: '/pages/parent/personal/user-profile',
  }

  // 如果点击的不是当前页面，则跳转
  if (routes[page] && page !== props.activeTab) {
    uni.reLaunch({
      url: routes[page],
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
