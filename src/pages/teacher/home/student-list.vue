<template>
  <view class="page">
    <PageHeader title="学生列表" :showBack="true" />
    <view class="content">
      <!-- 学生列表 -->
      <view class="list">
        <view v-for="item in studentList" :key="item.id" class="item">
          <view class="student-info">
            <text class="name">{{ item.studentName || '未命名' }}</text>
            <text class="detail">{{ item.schoolName || '学校未填' }}</text>
            <text class="detail">{{ item.gradeName || '年级未填' }}</text>
            <text class="detail">{{ item.clazzName || '班级未填' }}</text>
          </view>
        </view>
        <view v-if="!studentList.length && !loading" class="empty-state">
          <text class="empty-icon">👨‍🎓</text>
          <text class="empty-text">暂无学生数据</text>
        </view>
        <view v-if="studentList.length > 0" class="load-status">
          <text v-if="loading" class="status-text">加载中...</text>
          <text v-else-if="noMore" class="status-text">没有更多数据了</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import { getStudentList } from '@/api/teacher/checkin'

const studentList = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 20

const fetchStudentList = async (reset = false) => {
  if (loading.value) return
  if (reset) {
    page.value = 1
    noMore.value = false
    studentList.value = []
  }
  loading.value = true
  try {
    const res = await getStudentList({
      page: page.value,
      pageSize,
    })
    const list = res?.data || []
    studentList.value = reset ? list : [...studentList.value, ...list]
    if (!list.length || list.length < pageSize) {
      noMore.value = true
    } else {
      page.value += 1
    }
  } catch (error) {
    console.error('获取学生列表失败', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStudentList(true)
})

onPullDownRefresh(async () => {
  await fetchStudentList(true)
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  if (loading.value || noMore.value) return
  fetchStudentList()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
}

.content {
  padding: 32rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.item {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  padding: 24rpx;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-wrap: wrap;
}

.name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f2937;
}

.detail {
  font-size: 24rpx;
  color: #6b7280;
}

.empty-state {
  padding: 120rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  color: #9ca3af;
}

.empty-icon {
  font-size: 64rpx;
}

.empty-text {
  font-size: 28rpx;
}

.load-status {
  text-align: center;
  padding: 32rpx 0;
}

.status-text {
  font-size: 24rpx;
  color: #94a3b8;
}
</style>
