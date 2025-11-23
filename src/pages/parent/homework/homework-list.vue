<template>
  <view class="page">
    <PageHeader title="作业信息" />

    <view class="filter-section">
      <view class="filter-row">
        <picker class="filter-picker" :range="childNames" @change="onChildChange">
          <view class="picker-box">
            <text class="label">{{ currentChildName }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker class="filter-picker" :range="subjectNames" @change="onSubjectChange">
          <view class="picker-box">
            <text class="label">{{ currentSubjectName }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="filter-row">
        <picker class="filter-picker" :range="statusLabels" @change="onStatusChange">
          <view class="picker-box">
            <text class="label">{{ currentStatusLabel }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker
          class="filter-picker"
          mode="date"
          :value="filters.homeworkDate"
          @change="onDateChange"
        >
          <view class="picker-box">
            <text class="label">{{ filters.homeworkDate || '作业日期' }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <view class="list-container">
      <view class="publish-button-container">
        <button class="publish-button" @tap="onPublishHomework">发布作业</button>
      </view>

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

      <view class="load-more">
        <button class="load-more-btn" :disabled="loading || noMore" @tap="loadMore">
          {{ noMore ? '没有更多了' : loading ? '加载中...' : '加载更多' }}
        </button>
      </view>
    </view>

    <ParentTabBar activeTab="homework" />
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
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

const filteredList = computed(() => {
  if (!filters.homeworkDate) return homeworkList.value
  return homeworkList.value.filter((item) => item.homeworkDate === filters.homeworkDate)
})

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
}

const onPublishHomework = () => {
  const student = children.value[filters.childIndex]
  const query = student?.id
    ? `?studentId=${student.id}&studentName=${encodeURIComponent(student.name)}`
    : ''
  uni.navigateTo({
    url: `/pages/parent/homework/components/homework-publish${query}`,
  })
}

const gotoDetail = (item) => {
  uni.navigateTo({
    url: `/pages/parent/homework/components/homework-detail?homeworkId=${item.id}`,
  })
}

const initPage = async () => {
  await Promise.all([fetchChildren(), fetchSubjects()])
  await fetchHomework(true)
}

onLoad(() => {
  initPage()
})

onPullDownRefresh(() => {
  fetchHomework(true)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding-bottom: 128rpx;
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
  padding: 360rpx 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.publish-button-container {
  margin-bottom: 12rpx;
}

.publish-button {
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
  border-radius: 24rpx;
  padding: 28rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.25);
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

.load-more {
  text-align: center;
  padding: 32rpx 0;
}

.load-more-btn {
  padding: 20rpx 56rpx;
  font-size: 28rpx;
  color: #0ea5e9;
  font-weight: 500;
  background-color: transparent;
  border: none;
}

.load-more-btn:active {
  opacity: 0.7;
}
</style>
