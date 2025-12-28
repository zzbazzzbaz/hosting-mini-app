<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业详情列表" :showBack="true" />

    <!-- 学生信息卡片 -->
    <view class="student-card">
      <view class="student-basic">
        <view class="detail-row name-row">
          <text class="name">{{ studentInfo.name || '学生姓名' }}</text>
          <text class="detail grade">{{ studentInfo.grade || '年级未填' }}</text>
          <text class="detail">{{ studentInfo.class || '班级未填' }}</text>
        </view>
        <view class="detail-row school-row">
          <text class="detail school">{{ studentInfo.school || '学校未填' }}</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮行 -->
    <view class="action-buttons">
      <button class="publish-button" @click="onPublishHomework">发布作业</button>
      <button class="filter-button" @click="showFilterPopup = true">
        <text>筛选</text>
        <text v-if="hasActiveFilters" class="filter-badge">●</text>
      </button>
    </view>

    <!-- 筛选弹窗 -->
    <view v-if="showFilterPopup" class="filter-popup-mask" @tap="showFilterPopup = false">
      <view class="filter-popup" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">筛选条件</text>
          <text class="popup-close" @tap="showFilterPopup = false">✕</text>
        </view>
        <view class="popup-content">
          <!-- 科目选择 -->
          <view class="filter-item">
            <text class="filter-label">科目</text>
            <picker
              class="filter-picker"
              :range="subjectOptions"
              range-key="name"
              @change="onSubjectChange"
            >
              <view class="picker-box">
                <text class="label">{{ currentSubject }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          <!-- 状态选择 -->
          <view class="filter-item">
            <text class="filter-label">状态</text>
            <picker class="filter-picker" :range="statusLabels" @change="onStatusChange">
              <view class="picker-box">
                <text class="label">{{ currentStatus }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          <!-- 日期选择 -->
          <view class="filter-item">
            <text class="filter-label">作业日期</text>
            <picker class="filter-picker" mode="date" :value="filters.date" @change="onDateChange">
              <view class="picker-box">
                <text class="label">{{ filters.date || '请选择日期' }}</text>
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

    <!-- 作业列表 -->
    <view class="homework-list">
      <template v-if="filteredHomeworkList.length > 0">
        <view
          v-for="item in filteredHomeworkList"
          :key="item.id"
          class="homework-item"
          @tap="openHomeworkDetail(item)"
        >
          <!-- 主信息行：科目 | 状态 -->
          <view class="homework-main">
            <text class="subject">{{ item.subjectName || '未分科目' }}</text>
            <view class="homework-actions">
              <view
                :class="[
                  'status-badge',
                  item.status === 'completed' ? 'status-completed' : 'status-pending',
                ]"
              >
                <text>{{ item.status === 'completed' ? '已完成' : '未完成' }}</text>
              </view>
              <view
                v-if="item.status !== 'completed'"
                class="delete-action"
                @tap.stop="onDeleteHomework(item)"
              >删除</view>
            </view>
          </view>
          <!-- 时间信息行 -->
          <view class="homework-time">
            <text class="time-text">布置时间: {{ item.homeworkDate || '-' }}</text>
            <text class="time-text">{{
              item.finishDate ? `完成时间: ${item.finishDate}` : ''
            }}</text>
          </view>
        </view>
      </template>

      <!-- 没有作业时显示空状态 -->
      <view v-else class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">今日暂无作业</text>
      </view>
      <!-- 底部加载状态提示 -->
      <view v-if="filteredHomeworkList.length > 0" class="load-status">
        <text v-if="loading" class="status-text">加载中...</text>
        <text v-else-if="noMore" class="status-text">没有更多数据了</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref, onUnmounted } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import { deleteTeacherHomework, getTeacherHomeworkList } from '@/api/teacher/homework'
import { getSubjectComboxList } from '@/api/common/dictionary'

const studentId = ref('')

// 学生信息
const studentInfo = ref({
  name: '',
  school: '',
  grade: '',
  class: '',
  completed: 0,
  pending: 0,
})

const filters = reactive({
  subjectIndex: 0,
  statusIndex: 0,
  date: '',
})

const subjects = ref([{ id: '', name: '请选择科目' }])
const statuses = [
  { label: '全部状态', value: '' },
  { label: '未完成', value: 0 },
  { label: '已完成', value: 1 },
]

const homeworkList = ref([])
const deletingId = ref('')
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10
const showFilterPopup = ref(false)

const subjectOptions = computed(() => subjects.value)
const subjectIds = computed(() => subjectOptions.value.map((item) => item.id))
const subjectNames = computed(() => subjectOptions.value.map((item) => item.name || ''))
const statusLabels = statuses.map((item) => item.label)

const currentSubject = computed(() => subjectNames.value[filters.subjectIndex] || '请选择科目')
const currentStatus = computed(() => statusLabels[filters.statusIndex] || '全部状态')

const currentSubjectId = computed(() => subjectIds.value[filters.subjectIndex] || '')
const currentState = computed(() => statuses[filters.statusIndex]?.value ?? '')

const hasActiveFilters = computed(() => {
  return filters.subjectIndex !== 0 || filters.statusIndex !== 0 || filters.date !== ''
})

const filteredHomeworkList = computed(() => homeworkList.value)

const normalizeOptions = (list = []) =>
  [{ id: '', name: '请选择科目' }, ...list]
    .map((item) => ({
      id: item.id ?? item.value ?? '',
      name: item.name ?? item.label ?? item.text ?? '',
    }))
    .filter((item) => item.id || item.name)

const fetchSubjects = async () => {
  try {
    const res = await getSubjectComboxList()
    subjects.value = normalizeOptions(res || [])
    filters.subjectIndex = 0
  } catch (error) {
    console.error('获取科目列表失败', error)
    await uni.showToast({ title: '科目加载失败', icon: 'none' })
  }
}

const fetchHomeworkList = async (reset = false) => {
  if (!studentId.value || loading.value) return
  if (reset) {
    page.value = 1
    noMore.value = false
    homeworkList.value = []
  }
  loading.value = true
  try {
    const res = await getTeacherHomeworkList({
      studentId: studentId.value,
      subjectId: currentSubjectId.value || undefined,
      state: currentState.value === '' ? undefined : currentState.value,
      homeworkTime: filters.date || undefined,
      page: page.value,
      pageSize,
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
  }
}

onPullDownRefresh(async () => {
  await fetchHomeworkList(true)
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  if (loading.value || noMore.value) return
  fetchHomeworkList()
})

const handlePublishedRefresh = (payload) => {
  // 如果未传 studentId 或与当前学生匹配，则刷新
  if (!payload?.studentId || payload.studentId === studentId.value) {
    fetchHomeworkList(true)
  }
}

const onSubjectChange = (e) => {
  const index = e.detail.value
  filters.subjectIndex = Number(index)
}

const onStatusChange = (e) => {
  const index = e.detail.value
  filters.statusIndex = Number(index)
}

const onDateChange = (e) => {
  filters.date = e.detail.value
}

const onResetFilters = () => {
  filters.subjectIndex = 0
  filters.statusIndex = 0
  filters.date = ''
}

const onConfirmFilters = () => {
  showFilterPopup.value = false
  fetchHomeworkList(true)
}

const onDeleteHomework = (item) => {
  if (!item?.id || deletingId.value) return
  uni.showModal({
    title: '删除作业',
    content: '确定要删除该作业吗？',
    success: async (res) => {
      if (!res.confirm) return
      deletingId.value = item.id
      uni.showLoading({ title: '删除中', mask: true })
      try {
        await deleteTeacherHomework(item.id)
        homeworkList.value = homeworkList.value.filter((homework) => homework.id !== item.id)
        await uni.showToast({ title: '作业删除成功', icon: 'success' })
        fetchHomeworkList(true)
      } catch (error) {
        console.error('删除作业失败', error)
      } finally {
        uni.hideLoading()
        deletingId.value = ''
      }
    },
  })
}

const openHomeworkDetail = (item) => {
  if (!item?.id) return
  uni.navigateTo({
    url: `/pages/teacher/homework/for-student/homework-detail?id=${item.id}&studentName=${encodeURIComponent(
      studentInfo.value.name || ''
    )}&schoolName=${encodeURIComponent(studentInfo.value.school || '')}&gradeName=${encodeURIComponent(
      studentInfo.value.grade || ''
    )}&clazzName=${encodeURIComponent(studentInfo.value.class || '')}`,
  })
}

const onPublishHomework = () => {
  uni.navigateTo({
    url: `/pages/teacher/homework/for-student/homework-publish?studentId=${studentId.value}&studentName=${encodeURIComponent(
      studentInfo.value.name || ''
    )}&subject=${encodeURIComponent(currentSubject.value || '')}`,
  })
}

onLoad((options) => {
  studentId.value = options.studentId || options.id || ''
  studentInfo.value = {
    name: options.studentName ? decodeURIComponent(options.studentName) : '',
    school: options.schoolName ? decodeURIComponent(options.schoolName) : '',
    grade: options.gradeName ? decodeURIComponent(options.gradeName) : '',
    class: options.clazzName ? decodeURIComponent(options.clazzName) : '',
    completed: Number(options.finishCount ?? 0),
    pending: Number(options.noFinishCount ?? 0),
  }
  uni.$on('teacher-homework-published', handlePublishedRefresh)
  fetchSubjects()
  fetchHomeworkList(true)
})

onUnmounted(() => {
  uni.$off('teacher-homework-published', handlePublishedRefresh)
})
</script>

<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 48rpx;
}

/* 学生信息卡片 */
.student-card {
  margin: 32rpx 48rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 学生基本信息 */
.student-basic {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

/* 学生姓名 */
.name {
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
}

/* 详细信息行 */
.detail-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex-wrap: wrap;
}

.name-row {
  flex-wrap: nowrap;
}

/* 详细信息 */
.detail {
  font-size: 26rpx;
  color: #6b7280;
}

/* 年级信息 */
.detail.grade {
  color: #0ea5e9;
  font-weight: 500;
}

.detail.school {
  color: #6b7280;
}

.school-row {
  margin-top: 4rpx;
}

/* 学生作业统计 */
.student-stats {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  text-align: right;
}

.stat {
  font-size: 26rpx;
  font-weight: 500;
}

.stat.completed {
  color: #10b981;
}

.stat.pending {
  color: #ef4444;
}

/* 操作按钮行 */
.action-buttons {
  display: flex;
  gap: 24rpx;
  margin: 0 48rpx 24rpx;
}

/* 发布作业按钮 */
.publish-button {
  flex: 1;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 28rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
}

.publish-button::after {
  border: none;
}

/* 筛选按钮 */
.filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  background: #fff;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  padding: 20rpx 32rpx;
  font-size: 28rpx;
  color: #374151;
}

.filter-button::after {
  border: none;
}

.filter-badge {
  color: #10b981;
  font-size: 20rpx;
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

/* 筛选区域 */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 24rpx 48rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 筛选行 */
.filter-row {
  display: flex;
  gap: 24rpx;
}

.filter-picker {
  flex: 1;
}

.picker-box {
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  font-size: 28rpx;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  font-size: 20rpx;
  color: #9ca3af;
  margin-left: 12rpx;
  flex-shrink: 0;
}

/* 作业列表 - 紧凑型 */
.homework-list {
  padding: 16rpx 48rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

/* 作业列表项 - 紧凑型 */
.homework-item {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

/* 作业主要信息行 - 紧凑型 */
.homework-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12rpx;
}

/* 科目标签 - 紧凑型 */
.subject {
  font-size: 26rpx;
  font-weight: 600;
  color: #1f2937;
  flex-shrink: 0;
}

/* 时间信息行 - 紧凑型 */
.homework-time {
  display: flex;
  justify-content: space-between;
  padding: 0;
}

/* 时间文字 - 紧凑型 */
.time-text {
  font-size: 22rpx;
  color: #9ca3af;
}

/* 状态标签 - 紧凑型 */
.status-badge {
  display: inline-block;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;
}

.homework-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.delete-action {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
  color: #ef4444;
  border: 2rpx solid #fecaca;
  background: #fff;
  flex-shrink: 0;
  white-space: nowrap;
}

.delete-action:active {
  opacity: 0.85;
}

/* 已完成状态 */
.status-completed {
  background: #dcfce7;
  color: #15803d;
}

/* 未完成状态 */
.status-pending {
  background: #fee2e2;
  color: #dc2626;
}

/* 空状态容器 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
  gap: 24rpx;
}

/* 空状态图标 */
.empty-icon {
  font-size: 120rpx;
  opacity: 0.3;
}

/* 空状态文字 */
.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
  font-weight: 500;
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
