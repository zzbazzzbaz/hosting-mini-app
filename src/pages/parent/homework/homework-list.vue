<template>
  <view class="page">
    <PageHeader title="作业信息" />

    <!-- 筛选浮窗按钮 -->
    <view class="filter-fab" @click="openFilterPopup">
      <text class="filter-fab-text">筛选</text>
      <text v-if="hasActiveFilters" class="filter-fab-badge">●</text>
    </view>

    <!-- 筛选弹窗 -->
    <view v-if="showFilterPopup" class="filter-popup-mask" @tap="showFilterPopup = false">
      <view class="filter-popup" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">筛选条件</text>
          <text class="popup-close" @tap="showFilterPopup = false">✕</text>
        </view>
        <view class="popup-content">
          <!-- 学生选择 -->
          <view class="filter-item">
            <text class="filter-label">学生</text>
            <picker class="filter-picker" :range="childNames" :value="tempFilters.childIndex" @change="onTempChildChange">
              <view class="picker-box">
                <text class="label">{{ tempChildName }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          <!-- 科目选择 -->
          <view class="filter-item">
            <text class="filter-label">科目</text>
            <picker class="filter-picker" :range="subjectNames" :value="tempFilters.subjectIndex" @change="onTempSubjectChange">
              <view class="picker-box">
                <text class="label">{{ tempSubjectName }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          <!-- 状态选择 -->
          <view class="filter-item">
            <text class="filter-label">状态</text>
            <picker class="filter-picker" :range="statusLabels" :value="tempFilters.statusIndex" @change="onTempStatusChange">
              <view class="picker-box">
                <text class="label">{{ tempStatusLabel }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          <!-- 日期选择 -->
          <view class="filter-item">
            <text class="filter-label">作业日期</text>
            <picker class="filter-picker" mode="date" :value="tempFilters.homeworkDate" @change="onTempDateChange">
              <view class="picker-box">
                <text class="label">{{ tempFilters.homeworkDate || '请选择日期' }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
        </view>
        <view class="popup-footer">
          <button class="reset-button" @click="onResetFilters">重置</button>
          <button class="confirm-button" @click="onConfirmFilters">确定</button>
        </view>
      </view>
    </view>

    <view class="list-container">
      <view v-if="!filteredList.length && !loading" class="empty-state">
        <text class="empty-text">暂无作业数据</text>
        <text class="empty-sub">调整筛选或下拉刷新试试</text>
      </view>

      <!-- 作业列表项 - 单行紧凑型 -->
      <view
        v-for="item in filteredList"
        :key="item.id"
        class="homework-item"
        @tap="gotoDetail(item)"
      >
        <!-- 左侧信息：科目 学生姓名 年级 -->
        <view class="left-info">
          <view class="subject-chip">
            <text class="subject-text">{{ item.subjectName || '未分科目' }}</text>
          </view>
          <text class="student-name">{{ item.studentName || '未命名' }}</text>
          <text class="grade-text">{{ item.gradeName || '年级未填' }}</text>
        </view>
        <!-- 右侧信息：完成状态 -->
        <view class="right-info">
          <text class="status-text" :class="item.finishDate ? 'status-done' : 'status-pending'">
            {{ item.finishDate ? '已完成' : '未完成' }}
          </text>
          <uni-icons type="arrowright" size="18" color="#d1d5db" />
        </view>
      </view>

      <!-- 底部加载状态提示 -->
      <view v-if="homeworkList.length > 0" class="load-status">
        <text v-if="loading" class="status-text">加载中...</text>
        <text v-else-if="noMore" class="status-text">没有更多数据了</text>
      </view>
    </view>

    <ParentTabBar activeTab="homework" />
  </view>
</template>

<script setup>
import { computed, reactive, ref, onUnmounted } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'
import { getChildrenByParentId, getParentHomeworkList } from '@/api/parent/homework'
import { getSubjectComboxList } from '@/api/common/dictionary'

const children = ref([{ id: '', name: '全部学生' }])
const subjects = ref([{ id: '', name: '请选择科目' }])
const statuses = [
  { label: '全部状态', value: '' },
  { label: '未完成', value: 0 },
  { label: '已完成', value: 1 },
]

const filters = reactive({
  childIndex: 0,
  subjectIndex: 0,
  statusIndex: 0,
  homeworkDate: '',
})

const showFilterPopup = ref(false)
const tempFilters = reactive({
  childIndex: 0,
  subjectIndex: 0,
  statusIndex: 0,
  homeworkDate: '',
})

const homeworkList = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const childNames = computed(() => children.value.map((item) => item.name || ''))
const subjectNames = computed(() => subjects.value.map((item) => item.name || ''))
const statusLabels = statuses.map((item) => item.label)
const currentChildName = computed(() => childNames.value[filters.childIndex] || '全部学生')
const currentSubjectName = computed(() => subjectNames.value[filters.subjectIndex] || '请选择科目')
const currentStatusLabel = computed(() => statusLabels[filters.statusIndex] || '全部状态')

const currentChildId = computed(() => children.value[filters.childIndex]?.id || '')
const currentSubjectId = computed(() => subjects.value[filters.subjectIndex]?.id || '')
const currentState = computed(() => statuses[filters.statusIndex]?.value ?? '')

const hasActiveFilters = computed(() => {
  return filters.childIndex !== 0 || filters.subjectIndex !== 0 || filters.statusIndex !== 0 || filters.homeworkDate !== ''
})

const tempChildName = computed(() => childNames.value[tempFilters.childIndex] || '全部学生')
const tempSubjectName = computed(() => subjectNames.value[tempFilters.subjectIndex] || '请选择科目')
const tempStatusLabel = computed(() => statusLabels[tempFilters.statusIndex] || '全部状态')

const filteredList = computed(() => homeworkList.value)

const normalizeOptions = (list = []) =>
  list
    .map((item) => ({
      id: item.id ?? item.value ?? item.key ?? '',
      name: item.name ?? item.label ?? item.text ?? item.value ?? '',
    }))
    .filter((item) => item.id || item.name)

const fetchChildren = async () => {
  try {
    const res = await getChildrenByParentId()
    children.value = [{ id: '', name: '全部学生' }, ...(res?.data || [])]
    filters.childIndex = 0
  } catch (error) {
    console.error('获取学生列表失败', error)
    await uni.showToast({ title: '学生列表获取失败', icon: 'none' })
  }
}

const fetchSubjects = async () => {
  try {
    const res = await getSubjectComboxList()
    subjects.value = [{ id: '', name: '请选择科目' }, ...normalizeOptions(res || [])]
    filters.subjectIndex = 0
  } catch (error) {
    console.error('获取科目列表失败', error)
    await uni.showToast({ title: '科目获取失败', icon: 'none' })
  }
}

const fetchHomework = async (reset = false) => {
  if (loading.value) return

  if (reset) {
    page.value = 1
    noMore.value = false
    homeworkList.value = []
  }

  loading.value = true
  try {
    const res = await getParentHomeworkList({
      page: page.value,
      pageSize,
      studentId: currentChildId.value || undefined,
      subjectId: currentSubjectId.value || undefined,
      state: currentState.value === '' ? undefined : currentState.value,
      homeworkTime: filters.homeworkDate || undefined,
    })
    const list = res?.data?.list || []
    homeworkList.value = reset ? list : [...homeworkList.value, ...list]
    if (!list.length || list.length < pageSize) {
      noMore.value = true
    } else {
      page.value += 1
    }
  } catch (error) {
    console.error('获取作业列表失败', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
    if (reset) {
      uni.stopPullDownRefresh()
    }
  }
}

const refreshList = () => {
  fetchHomework(true)
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  fetchHomework()
}

const onChildChange = (e) => {
  filters.childIndex = Number(e.detail.value)
  refreshList()
}

const onSubjectChange = (e) => {
  filters.subjectIndex = Number(e.detail.value)
  refreshList()
}

const onStatusChange = (e) => {
  filters.statusIndex = Number(e.detail.value)
  refreshList()
}

const onDateChange = (e) => {
  filters.homeworkDate = e.detail.value
  refreshList()
}

const onTempChildChange = (e) => {
  tempFilters.childIndex = Number(e.detail.value)
}

const onTempSubjectChange = (e) => {
  tempFilters.subjectIndex = Number(e.detail.value)
}

const onTempStatusChange = (e) => {
  tempFilters.statusIndex = Number(e.detail.value)
}

const onTempDateChange = (e) => {
  tempFilters.homeworkDate = e.detail.value
}

const openFilterPopup = () => {
  tempFilters.childIndex = filters.childIndex
  tempFilters.subjectIndex = filters.subjectIndex
  tempFilters.statusIndex = filters.statusIndex
  tempFilters.homeworkDate = filters.homeworkDate
  showFilterPopup.value = true
}

const onResetFilters = () => {
  tempFilters.childIndex = 0
  tempFilters.subjectIndex = 0
  tempFilters.statusIndex = 0
  tempFilters.homeworkDate = ''
}

const onConfirmFilters = () => {
  filters.childIndex = tempFilters.childIndex
  filters.subjectIndex = tempFilters.subjectIndex
  filters.statusIndex = tempFilters.statusIndex
  filters.homeworkDate = tempFilters.homeworkDate
  showFilterPopup.value = false
  refreshList()
}

const gotoDetail = (item) => {
  uni.navigateTo({
    url: `/pages/parent/homework/components/homework-detail?homeworkId=${item.id}`,
  })
}

const handlePublishedRefresh = (payload) => {
  // 如果未传 childId 或与当前筛选学生匹配，刷新列表
  if (!payload?.childId || payload.childId === currentChildId.value) {
    fetchHomework(true)
  }
}

const initPage = async () => {
  await Promise.all([fetchChildren(), fetchSubjects()])
  await fetchHomework(true)
}

onLoad(() => {
  uni.$on('parent-homework-published', handlePublishedRefresh)
  initPage()
})

onPullDownRefresh(() => {
  fetchHomework(true)
})

onUnmounted(() => {
  uni.$off('parent-homework-published', handlePublishedRefresh)
})

// 滚动到底部自动加载更多
onReachBottom(() => {
  loadMore()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding-bottom: 128rpx;
}

/* 筛选浮窗按钮 */
.filter-fab {
  position: fixed;
  right: 32rpx;
  bottom: 180rpx;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.4);
}

.filter-fab-text {
  font-size: 26rpx;
  color: #fff;
  font-weight: 500;
}

.filter-fab-badge {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  color: #fbbf24;
  font-size: 24rpx;
}

/* 筛选弹窗遮罩 */
.filter-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

/* 筛选弹窗 */
.filter-popup {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
}

.popup-close {
  font-size: 36rpx;
  color: #9ca3af;
  padding: 8rpx;
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.filter-label {
  font-size: 26rpx;
  color: #6b7280;
}

.popup-footer {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
}

.reset-button,
.confirm-button {
  flex: 1;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.reset-button {
  background: #f3f4f6;
  color: #6b7280;
  border: none;
}

.reset-button::after,
.confirm-button::after {
  border: none;
}

.confirm-button {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
}

.filter-section {
  position: fixed;
  top: 144rpx;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.filter-row {
  display: flex;
  gap: 16rpx;
}

.filter-picker {
  flex: 1;
  min-width: 0;
}

.picker-box {
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 20rpx 16rpx;
  font-size: 24rpx;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  transition: all 0.2s;
}

.picker-box:active {
  background-color: #f3f4f6;
  border-color: #0ea5e9;
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.arrow {
  font-size: 18rpx;
  color: #9ca3af;
  margin-left: 8rpx;
  flex-shrink: 0;
}

.list-container {
  padding: 160rpx 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.empty-state {
  background: #fff;
  border-radius: 20rpx;
  padding: 48rpx;
  text-align: center;
  color: #6b7280;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
}

.empty-text {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.empty-sub {
  font-size: 24rpx;
  color: #9ca3af;
}

/* 作业列表项 - 单行紧凑型 */
.homework-item {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  padding: 20rpx 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
  transition: all 0.2s;
}

.homework-item:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

/* 左侧信息区域 */
.left-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
  overflow: hidden;
}

/* 科目标签 - 紧凑型 */
.subject-chip {
  padding: 4rpx 12rpx;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12rpx;
  font-size: 22rpx;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;
}

.subject-text {
  display: inline-block;
  max-width: 120rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 学生姓名 */
.student-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #1f2937;
  flex-shrink: 0;
  white-space: nowrap;
}

/* 年级文字 */
.grade-text {
  font-size: 22rpx;
  color: #6b7280;
  flex-shrink: 0;
  white-space: nowrap;
}

/* 右侧信息区域 */
.right-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}

/* 状态文字 */
.status-text {
  font-size: 22rpx;
  font-weight: 500;
  white-space: nowrap;
}

.status-done {
  color: #10b981;
}

.status-pending {
  color: #ef4444;
}

/* 底部加载状态 */
.load-status {
  text-align: center;
  padding: 32rpx 0;
}

.status-text {
  font-size: 24rpx;
  color: #9ca3af;
}
</style>
