<template>
  <view class="page">
    <PageHeader title="签到信息" />
    <view class="content">
      <view class="filter-section">
        <view class="filter-row">
          <picker
            class="filter-picker"
            :range="studentNames"
            :value="filters.studentIndex"
            @change="onStudentChange"
          >
            <view class="picker-box">
              <text class="label">{{ currentStudentName }}</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
          <picker
            class="filter-picker"
            mode="date"
            :value="filters.signDate"
            @change="onDateChange"
          >
            <view class="picker-box">
              <text class="label">{{ dateLabel }}</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="list-container">
        <view v-if="!checkinList.length && !loading" class="empty-state">
          <text class="empty-title">暂无签到记录</text>
          <text class="empty-subtitle">调整筛选条件试试</text>
        </view>

        <view v-for="record in checkinList" :key="record.id" class="checkin-card">
          <view class="card-header">
            <view class="title-wrap">
              <text class="student-name">{{ record.studentName }}</text>
              <text class="grade">{{ record.gradeName }}</text>
            </view>
            <text class="timestamp">{{ record.createTime || '-' }}</text>
          </view>

          <view class="photo-row" v-if="record.photos.length">
            <view
              v-for="(photo, index) in record.photos"
              :key="photo.id || index"
              class="photo-wrap"
              @click="previewPhotos(record.photos, index)"
            >
              <image :src="photo.url" class="photo" mode="aspectFill" />
            </view>
          </view>
          <view v-else class="empty-inline">未上传签到照片</view>
        </view>

        <!-- 底部加载状态提示 -->
        <view v-if="checkinList.length > 0" class="load-status">
          <text v-if="loading" class="status-text">加载中...</text>
          <text v-else-if="noMore" class="status-text">没有更多数据了</text>
        </view>
      </view>
    </view>
    <ParentTabBar activeTab="checkin" />
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'
import { getChildrenByParentId } from '@/api/parent/homework'
import { getParentSigninList } from '@/api/parent/checkin'

const students = ref([{ id: '', name: '全部学生' }])
const filters = reactive({
  studentIndex: 0,
  signDate: '',
})
const checkinList = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const studentNames = computed(() => students.value.map((item) => item.name || ''))
const currentStudentName = computed(() => studentNames.value[filters.studentIndex] || '全部学生')
const currentStudentId = computed(() => students.value[filters.studentIndex]?.id || '')
const dateLabel = computed(() => filters.signDate || '请选择日期')

const normalizeChildren = (list = []) =>
  list
    .map((item, index) => ({
      id: item.id ?? `student-${index}`,
      name: item.studentName ?? item.name ?? '',
    }))
    .filter((item) => item.name)

const fetchStudents = async () => {
  try {
    const res = await getChildrenByParentId()
    students.value = [{ id: '', name: '全部学生' }, ...normalizeChildren(res?.data || [])]
    filters.studentIndex = 0
  } catch (error) {
    console.error('获取学生列表失败', error)
    await uni.showToast({ title: '学生列表获取失败', icon: 'none' })
  }
}

const fetchCheckins = async (reset = false) => {
  if (loading.value) return
  if (reset) {
    page.value = 1
    noMore.value = false
    checkinList.value = []
  }
  loading.value = true
  try {
    const res = await getParentSigninList({
      page: page.value,
      pageSize,
      studentId: currentStudentId.value || undefined,
      signDate: filters.signDate || undefined,
    })
    const list = res?.data?.list || []
    checkinList.value = reset ? list : [...checkinList.value, ...list]
    if (!list.length || list.length < pageSize) {
      noMore.value = true
    } else {
      page.value += 1
    }
  } catch (error) {
    console.error('获取签到列表失败', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
    if (reset) uni.stopPullDownRefresh()
  }
}

const previewPhotos = (photos, current) => {
  if (!photos || !photos.length) {
    uni.showToast({ title: '无可预览图片', icon: 'none' })
    return
  }
  uni.previewImage({
    current: photos[current]?.url || photos[0]?.url,
    urls: photos.map((item) => item.url).filter(Boolean),
  })
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  fetchCheckins()
}

const onStudentChange = (event) => {
  filters.studentIndex = Number(event.detail.value)
  fetchCheckins(true)
}

const onDateChange = (event) => {
  filters.signDate = event.detail.value
  fetchCheckins(true)
}

onLoad(() => {
  fetchStudents()
  fetchCheckins(true)
})

onPullDownRefresh(() => {
  fetchCheckins(true)
})

// 滑动到底部自动加载更多
onReachBottom(() => {
  loadMore()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 128rpx;
}

.content {
  padding-bottom: 48rpx;
}

.filter-section {
  position: fixed;
  top: 144rpx;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  border-radius: 0 0 28rpx 28rpx;
  box-shadow: 0 6rpx 18rpx rgba(15, 23, 42, 0.08);
  padding: 16rpx 32rpx 8rpx;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.filter-picker {
  flex: 1;
}

.picker-box {
  background: #f8fafc;
  border: 2rpx solid #e2e8f0;
  border-radius: 20rpx;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  font-size: 26rpx;
  color: #1f2937;
}

.arrow {
  font-size: 22rpx;
  color: #94a3b8;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 140rpx 32rpx 32rpx;
}

.checkin-card {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(15, 23, 42, 0.06);
  padding: 16rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  transition: transform 0.2s;
}

.checkin-card:active {
  transform: scale(0.99);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrap {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
}

.student-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #0f172a;
}

.grade {
  font-size: 24rpx;
  color: #22c55e;
  background: #ecfdf3;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
}

.timestamp {
  font-size: 24rpx;
  color: #94a3b8;
}

.photo-row {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.photo-wrap {
  width: 118rpx;
  height: 118rpx;
  border-radius: 14rpx;
  overflow: hidden;
  background: #f1f5f9;
  border: 2rpx solid #e2e8f0;
}

.photo {
  width: 100%;
  height: 100%;
}

.empty-state {
  background: rgba(148, 163, 184, 0.12);
  border-radius: 32rpx;
  padding: 64rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.empty-title {
  font-size: 32rpx;
  color: #475569;
  font-weight: 600;
}

.empty-subtitle {
  font-size: 26rpx;
  color: #94a3b8;
}

.empty-inline {
  font-size: 26rpx;
  color: #94a3b8;
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
