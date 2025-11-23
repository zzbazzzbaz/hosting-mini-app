<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业信息" />

    <!-- 筛选区域：教师、学校、年级、班级四个筛选项 -->
    <view class="filter-section">
      <!-- 第一行：教师、学校 -->
      <view class="filter-row">
        <picker
          class="filter-picker"
          :range="teacherOptions"
          range-key="name"
          @change="onTeacherChange"
        >
          <view class="picker-box">
            <text class="label">{{ currentTeacherLabel }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker
          class="filter-picker"
          :range="schoolOptions"
          range-key="name"
          @change="onSchoolChange"
        >
          <view class="picker-box">
            <text class="label">{{ currentSchoolLabel }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="filter-row">
        <picker
          class="filter-picker"
          :range="gradeOptions"
          range-key="name"
          @change="onGradeChange"
        >
          <view class="picker-box">
            <text class="label">{{ currentGradeLabel }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker
          class="filter-picker"
          :range="classOptions"
          range-key="name"
          @change="onClassChange"
        >
          <view class="picker-box">
            <text class="label">{{ currentClassLabel }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      <!-- 第三行：姓名搜索框 -->
      <view class="search-row">
        <input
          class="search-input"
          v-model="searchName"
          placeholder="搜索学生姓名"
          placeholder-style="color: #9ca3af"
        />
      </view>
    </view>

    <!-- 作业列表 -->
    <view class="list">
      <view
        v-for="item in filteredHomeworkList"
        :key="item.id"
        class="item"
        @click="goDetail(item)"
      >
        <view class="student-info">
          <text class="name">{{ item.studentName || '未命名学生' }}</text>
          <view class="detail-row">
            <text class="detail">{{ item.schoolName || '学校未填' }}</text>
            <text class="detail grade">{{ item.gradeName || '年级未填' }}</text>
            <text class="detail">{{ item.clazzName || '班级未填' }}</text>
          </view>
        </view>
        <view class="homework-stats">
          <text class="num completed">已完成: {{ item.finishCount }}</text>
          <text class="num pending">未完成: {{ item.noFinishCount }}</text>
        </view>
      </view>
      <view v-if="!filteredHomeworkList.length" class="empty-state">
        <text class="empty-icon">📘</text>
        <text class="empty-text">暂无作业数据，调整筛选试试</text>
      </view>
    </view>
    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="homework" />
  </view>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'
import { getHomeworkStudentList } from '@/api/teacher/homework'
import {
  getClassComboxList,
  getGradeComboxList,
  getSchoolComboxList,
  getTeacherComboxList,
} from '@/api/common/dictionary'
import { getUserInfo } from '@/store/auth'

const teacherOptions = ref([{ id: '', name: '全部教师' }])
const schoolOptions = ref([{ id: '', name: '全部学校' }])
const gradeOptions = ref([{ id: '', name: '全部年级' }])
const classOptions = ref([{ id: '', name: '全部班级' }])

const teacherIndex = ref(0)
const schoolIndex = ref(0)
const gradeIndex = ref(0)
const classIndex = ref(0)
const searchName = ref('')

const homeworkList = ref([])

const normalizeOptions = (list = [], allLabel) =>
  [
    { id: '', name: allLabel },
    ...list
      .map((item) => ({
        id: item.id ?? item.value ?? '',
        name: item.name ?? item.label ?? item.text ?? '',
      }))
      .filter((item) => item.id || item.name),
  ].filter((item) => item.name)

const currentTeacherLabel = computed(
  () => teacherOptions.value[teacherIndex.value]?.name || '全部教师'
)
const currentSchoolLabel = computed(
  () => schoolOptions.value[schoolIndex.value]?.name || '全部学校'
)
const currentGradeLabel = computed(() => gradeOptions.value[gradeIndex.value]?.name || '全部年级')
const currentClassLabel = computed(() => classOptions.value[classIndex.value]?.name || '全部班级')

const selectedTeacherId = computed(() => teacherOptions.value[teacherIndex.value]?.id || '')
const selectedSchoolId = computed(() => schoolOptions.value[schoolIndex.value]?.id || '')
const selectedGradeId = computed(() => gradeOptions.value[gradeIndex.value]?.id || '')
const selectedClassId = computed(() => classOptions.value[classIndex.value]?.id || '')

const filteredHomeworkList = computed(() => {
  const keyword = searchName.value.trim()
  if (!keyword) return homeworkList.value
  return homeworkList.value.filter(
    (item) =>
      item.studentName?.includes(keyword) ||
      item.schoolName?.includes(keyword) ||
      item.clazzName?.includes(keyword)
  )
})

/**
 * 获取筛选选项并设置默认值
 * 默认选中当前登录教师
 */
const fetchOptions = async () => {
  try {
    const [teachers, schools, grades, classes] = await Promise.all([
      getTeacherComboxList(),
      getSchoolComboxList(),
      getGradeComboxList(),
      getClassComboxList(),
    ])
    teacherOptions.value = normalizeOptions(teachers || [], '全部教师')
    schoolOptions.value = normalizeOptions(schools || [], '全部学校')
    gradeOptions.value = normalizeOptions(grades || [], '全部年级')
    classOptions.value = normalizeOptions(classes || [], '全部班级')

    // 获取当前登录用户信息，默认选中当前教师
    const userInfo = getUserInfo()
    const userName = userInfo?.userName || userInfo?.name

    if (userName) {
      const idx = teacherOptions.value.findIndex((item) => item.name === userName)
      if (idx >= 0) {
        teacherIndex.value = idx
        console.log(`默认选中当前教师: ${userName}`)
      } else {
        console.warn(`未找到当前教师: ${userName}，保持默认选择`)
        teacherIndex.value = 0
      }
    } else {
      console.warn('未获取到当前用户名，保持默认选择')
      teacherIndex.value = 0
    }
  } catch (error) {
    console.error('加载筛选项失败', error)
    await uni.showToast({ title: '筛选项加载失败', icon: 'none' })
  }
}

/**
 * 获取作业学生列表
 * 根据当前选中的筛选条件获取数据
 */
const fetchHomeworkStudents = async () => {
  try {
    const res = await getHomeworkStudentList({
      teacherId: selectedTeacherId.value || undefined,
      schoolId: selectedSchoolId.value || undefined,
      gradeId: selectedGradeId.value || undefined,
      clazzId: selectedClassId.value || undefined,
    })
    homeworkList.value = res?.data || []
  } catch (error) {
    console.error('获取作业学生列表失败', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

/**
 * 页面加载时的初始化逻辑
 * 1. 先加载筛选选项并设置默认教师
 * 2. 再根据默认教师获取作业数据
 */
onMounted(async () => {
  await fetchOptions() // 加载筛选选项并设置默认教师
  await fetchHomeworkStudents() // 获取当前教师的作业数据
})

onPullDownRefresh(async () => {
  await fetchHomeworkStudents()
  uni.stopPullDownRefresh()
})

const onTeacherChange = (e) => {
  teacherIndex.value = Number(e.detail.value)
  fetchHomeworkStudents()
}

const onSchoolChange = (e) => {
  schoolIndex.value = Number(e.detail.value)
  fetchHomeworkStudents()
}

const onGradeChange = (e) => {
  gradeIndex.value = Number(e.detail.value)
  fetchHomeworkStudents()
}

const onClassChange = (e) => {
  classIndex.value = Number(e.detail.value)
  fetchHomeworkStudents()
}

const goDetail = (item) => {
  if (!item?.id) return
  const query = [
    `studentId=${item.id}`,
    `studentName=${encodeURIComponent(item.studentName || '')}`,
    `schoolName=${encodeURIComponent(item.schoolName || '')}`,
    `gradeName=${encodeURIComponent(item.gradeName || '')}`,
    `clazzName=${encodeURIComponent(item.clazzName || '')}`,
    `finishCount=${item.finishCount ?? 0}`,
    `noFinishCount=${item.noFinishCount ?? 0}`,
  ].join('&')
  uni.navigateTo({
    url: `/pages/teacher/homework/for-student/homework-list?${query}`,
  })
}
</script>
<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 128rpx;
}

/* 筛选区域：支持多行布局，固定在顶部 */
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

/* 筛选行 */
.filter-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.filter-picker {
  min-width: 0;
  width: 100%;
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
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow {
  font-size: 18rpx;
  color: #9ca3af;
  margin-left: 8rpx;
  flex-shrink: 0;
}

/* 搜索行 */
.search-row {
  display: flex;
  width: 100%;
}

/* 搜索输入框 */
.search-input {
  flex: 1;
  height: 64rpx;
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
  color: #374151;
}

/* 作业列表，添加顶部间距避免被固定的筛选区域遮挡 */
.list {
  padding: 360rpx 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

/* 列表项 */
.item {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 左侧学生信息区域 */
.student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

/* 学生姓名 - 加粗显示 */
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

/* 年级信息 - 突出显示 */
.detail.grade {
  color: #0ea5e9;
  font-weight: 500;
}

/* 右侧作业统计区域 */
.homework-stats {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  text-align: right;
}

/* 作业数量文本 */
.num {
  font-size: 26rpx;
  font-weight: 500;
}

/* 已完成作业 - 绿色 */
.completed {
  color: #10b981;
}

/* 未完成作业 - 红色 */
.pending {
  color: #ef4444;
}

.empty-state {
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  color: #9ca3af;
}

.empty-icon {
  font-size: 52rpx;
}

.empty-text {
  font-size: 26rpx;
}
</style>
