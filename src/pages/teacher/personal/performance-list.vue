<template>
  <view class="page">
    <PageHeader title="绩效考核" :showBack="true" />

    <view class="list">
      <view v-if="loading && performanceList.length === 0" class="empty-state">
        <text class="empty-text">加载中...</text>
      </view>
      <view v-else-if="performanceList.length === 0" class="empty-state">
        <text class="empty-text">暂无绩效记录</text>
      </view>
      <view v-else>
        <view v-for="item in performanceList" :key="item.id" class="card">
          <view class="card-header">
            <text class="month">{{ item.yearmonth }}</text>
            <view class="badge">
              <text class="badge-text">{{ item.levelName }}</text>
            </view>
          </view>
          <text class="teacher">教师：{{ item.teacherName }}</text>
          <text v-if="item.descption" class="desc">{{ item.descption }}</text>
        </view>

        <view class="load-status">
          <text v-if="loading" class="status-text">加载中...</text>
          <text v-else-if="noMore" class="status-text">没有更多数据了</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import { getLevelList } from '@/api/teacher/home'

const performanceList = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const fetchPerformanceList = async (reset = false) => {
  if (loading.value) return
  if (reset) {
    page.value = 1
    noMore.value = false
    performanceList.value = []
  }
  loading.value = true
  try {
    const res = await getLevelList({
      page: page.value,
      pageSize,
    })
    const list = res?.data?.list || []
    performanceList.value = reset ? list : [...performanceList.value, ...list]

    if (!list.length || list.length < pageSize) {
      noMore.value = true
    } else {
      page.value += 1
    }
  } catch (error) {
    console.error('获取绩效考核列表失败:', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPerformanceList(true)
})

onPullDownRefresh(async () => {
  await fetchPerformanceList(true)
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  if (loading.value || noMore.value) return
  fetchPerformanceList()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 48rpx;
}

.list {
  padding: 32rpx 48rpx;
}

.empty-state {
  padding: 120rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.month {
  font-size: 28rpx;
  color: #0ea5e9;
  font-weight: 600;
}

.badge {
  padding: 8rpx 16rpx;
  background: #fef3c7;
  border-radius: 999rpx;
}

.badge-text {
  font-size: 24rpx;
  color: #b45309;
  font-weight: 600;
}

.teacher {
  display: block;
  font-size: 28rpx;
  color: #111827;
  margin-bottom: 12rpx;
}

.desc {
  display: block;
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.6;
}

.load-status {
  padding: 12rpx 0 0;
  text-align: center;
}

.status-text {
  font-size: 24rpx;
  color: #9ca3af;
}
</style>
