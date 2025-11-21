<template>
  <!-- 教师端底部导航栏组件 -->
  <view class="tabbar">
    <!-- 首页 -->
    <view :class="['tab', activeTab === 'home' ? 'tab-active' : '']" @click="goToPage('home')">
      <uni-icons
        type="home-filled"
        :size="26"
        :color="activeTab === 'home' ? '#0ea5e9' : '#9ca3af'"
      ></uni-icons>
      <text :class="activeTab === 'home' ? 'label-active' : 'label'">首页</text>
    </view>

    <!-- 签到 -->
    <view
      :class="['tab', activeTab === 'checkin' ? 'tab-active' : '']"
      @click="goToPage('checkin')"
    >
      <uni-icons
        type="checkmarkempty"
        :size="26"
        :color="activeTab === 'checkin' ? '#0ea5e9' : '#9ca3af'"
      ></uni-icons>
      <text :class="activeTab === 'checkin' ? 'label-active' : 'label'">签到</text>
    </view>

    <!-- 作业 -->
    <view
      :class="['tab', activeTab === 'homework' ? 'tab-active' : '']"
      @click="goToPage('homework')"
    >
      <uni-icons
        type="compose"
        :size="26"
        :color="activeTab === 'homework' ? '#0ea5e9' : '#9ca3af'"
      ></uni-icons>
      <text :class="activeTab === 'homework' ? 'label-active' : 'label'">作业</text>
    </view>

    <!-- 我的 -->
    <view
      :class="['tab', activeTab === 'publish' ? 'tab-active' : '']"
      @click="goToPage('publish')"
    >
      <uni-icons
        type="person-filled"
        :size="26"
        :color="activeTab === 'publish' ? '#0ea5e9' : '#9ca3af'"
      ></uni-icons>
      <text :class="activeTab === 'publish' ? 'label-active' : 'label'">我的</text>
    </view>
  </view>
</template>

<script setup>
/**
 * 教师端底部导航栏组件
 * @props activeTab - 当前激活的标签页: 'home' | 'checkin' | 'homework' | 'publish'(我的)
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
    home: '/pages/teacher/home/home',
    checkin: '/pages/teacher/checkin/checkin',
    homework: '/pages/teacher/homework/homework',
    publish: '/pages/teacher/personal/profile',
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
  background: #fff;
  border-top: 1rpx solid #e5e7eb;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
  display: flex;
  padding: 16rpx 0;
}

/* 导航项 */
.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 0;
  color: #9ca3af;
}

.tab-active {
  color: #0ea5e9;
}

/* 标签文字 */
.label {
  font-size: 24rpx;
}

.label-active {
  font-weight: 500;
  color: #0ea5e9;
  font-size: 24rpx;
}
</style>
