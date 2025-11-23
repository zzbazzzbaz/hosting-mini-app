<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业详情列表" :showBack="true" />

    <!-- 学生信息卡片 -->
    <view class="student-card">
      <view class="student-basic">
        <text class="name">{{ studentInfo.name || '学生姓名' }}</text>
        <view class="detail-row">
          <text class="detail">{{ studentInfo.school || '学校未填' }}</text>
          <text class="detail grade">{{ studentInfo.grade || '年级未填' }}</text>
          <text class="detail">{{ studentInfo.class || '班级未填' }}</text>
        </view>
      </view>
      <view class="student-stats">
        <text class="stat completed">已完成: {{ studentInfo.completed }}</text>
        <text class="stat pending">未完成: {{ studentInfo.pending }}</text>
      </view>
    </view>

    <!-- 发布作业按钮 -->
    <view class="publish-button-container">
      <button class="publish-button" @click="onPublishHomework">发布作业</button>
    </view>

    <!-- 筛选区域 -->
    <view class="filter-section">
      <!-- 第一行：科目和状态 -->
      <view class="filter-row">
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
        <picker class="filter-picker" :range="statusLabels" @change="onStatusChange">
          <view class="picker-box">
            <text class="label">{{ currentStatus }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      <!-- 第二行：日期 -->
      <view class="filter-row">
        <picker class="filter-picker" mode="date" :value="filters.date" @change="onDateChange">
          <view class="picker-box">
            <text class="label">{{ filters.date || '作业日期' }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
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
          <!-- 第一行：科目 | 作业标题 | 状态 -->
          <view class="homework-main">
            <text class="subject">{{ item.subjectName || '未分科目' }}</text>
            <text class="title">{{ item.studentName || studentInfo.name || '学生' }}</text>
            <view
              :class="[
                'status-badge',
                item.status === 'completed' ? 'status-completed' : 'status-pending',
              ]"
            >
              <text>{{ item.status === 'completed' ? '已完成' : '未完成' }}</text>
            </view>
          </view>
          <view class="homework-time">
            <text class="time-text">布置: {{ item.homeworkDate || '-' }}</text>
            <text class="time-text">{{
              item.finishDate ? `完成: ${item.finishDate}` : '未完成'
            }}</text>
          </view>
        </view>
      </template>

      <!-- 没有作业时显示空状态 -->
      <view v-else class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">今日暂无作业</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import { getTeacherHomeworkList } from '@/api/teacher/homework'
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

const subjects = ref([{ id: '', name: '全部科目' }])
const statuses = [
  { label: '全部状态', value: '' },
  { label: '未完成', value: 0 },
  { label: '已完成', value: 1 },
]

const homeworkList = ref([])
const loading = ref(false)

const subjectOptions = computed(() => subjects.value)
const subjectIds = computed(() => subjectOptions.value.map((item) => item.id))
const subjectNames = computed(() => subjectOptions.value.map((item) => item.name || ''))
const statusLabels = statuses.map((item) => item.label)

const currentSubject = computed(() => subjectNames.value[filters.subjectIndex] || '全部科目')
const currentStatus = computed(() => statusLabels[filters.statusIndex] || '全部状态')

const currentSubjectId = computed(() => subjectIds.value[filters.subjectIndex] || '')
const currentState = computed(() => statuses[filters.statusIndex]?.value ?? '')

const filteredHomeworkList = computed(() => {
  if (!filters.date) return homeworkList.value
  return homeworkList.value.filter((item) => item.homeworkDate === filters.date)
})

const normalizeOptions = (list = []) =>
  [{ id: '', name: '全部科目' }, ...list]
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

const fetchHomeworkList = async () => {
  if (!studentId.value) return
  loading.value = true
  try {
    const res = await getTeacherHomeworkList({
      studentId: studentId.value,
      subjectId: currentSubjectId.value || undefined,
      state: currentState.value === '' ? undefined : currentState.value,
      page: 1,
      pageSize: 100,
    })
    homeworkList.value = res?.data?.list || []
  } catch (error) {
    console.error('获取作业列表失败', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onPullDownRefresh(async () => {
  await fetchHomeworkList()
  uni.stopPullDownRefresh()
})

const onSubjectChange = (e) => {
  const index = e.detail.value
  filters.subjectIndex = Number(index)
  fetchHomeworkList()
}

const onStatusChange = (e) => {
  const index = e.detail.value
  filters.statusIndex = Number(index)
  fetchHomeworkList()
}

const onDateChange = (e) => {
  filters.date = e.detail.value
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
  fetchSubjects()
  fetchHomeworkList()
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
  gap: 12rpx;
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

/* 发布作业按钮容器 */
.publish-button-container {
  margin: 0 48rpx 24rpx;
  padding: 0;
}

/* 发布作业按钮 */
.publish-button {
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
  border-radius: 24rpx;
  padding: 28rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
  transition: all 0.3s;
}

.publish-button::after {
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

/* 作业列表 */
.homework-list {
  padding: 24rpx 48rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 作业列表项 */
.homework-item {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

/* 作业主要信息行 */
.homework-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

/* 科目（左对齐）*/
.subject {
  font-size: 28rpx;
  font-weight: bold;
  color: #1f2937;
  flex-shrink: 0;
  min-width: 80rpx;
}

/* 作业标题（居中，占据剩余空间）*/
.title {
  flex: 1;
  font-size: 30rpx;
  color: #374151;
  text-align: center;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 时间信息行 */
.homework-time {
  display: flex;
  justify-content: space-between;
  padding: 0 8rpx;
}

/* 时间文字（小字）*/
.time-text {
  font-size: 24rpx;
  color: #9ca3af;
}

/* 状态标签（右对齐）*/
.status-badge {
  display: inline-block;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;
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
</style>
