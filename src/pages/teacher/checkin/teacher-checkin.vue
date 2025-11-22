<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="学生签到" />

    <!-- 筛选卡片 -->
    <view class="filter-section">
      <view class="filter-card">
        <view class="filter-item">
          <text class="filter-label">教师</text>
          <picker mode="selector" :range="teacherList" @change="onTeacherChange">
            <view class="filter-value">
              <text>{{ currentTeacher }}</text>
              <uni-icons type="arrowdown" size="16" color="#9ca3af"></uni-icons>
            </view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 全选区域 -->
    <view class="select-all-section">
      <view class="select-all-box" @tap="toggleSelectAll">
        <view class="checkbox" :class="{ checked: isAllSelected }">
          <uni-icons v-if="isAllSelected" type="checkmarkempty" size="18" color="#fff"></uni-icons>
        </view>
        <text class="select-all-text">全选</text>
      </view>
      <text class="selected-count">已选 {{ selectedCount }} 人</text>
    </view>

    <!-- 学生列表 -->
    <view class="student-list">
      <view
        class="student-item"
        v-for="item in filteredStudentList"
        :key="item.id"
      >
        <view
          class="checkbox"
          :class="{ checked: item.checked, disabled: item.isSignin === 1 }"
          @tap.stop="item.isSignin !== 1 && toggleCheck(item)"
        >
          <uni-icons v-if="item.checked" type="checkmarkempty" size="18" color="#fff"></uni-icons>
        </view>
        <view class="student-info">
          <view class="info-row">
            <text class="student-name">{{ item.studentName }}</text>
            <view class="status-badge" :class="item.isSignin ? 'signed' : 'unsigned'">
              {{ item.isSignin ? '已签到' : '未签到' }}
            </view>
          </view>
          <view class="info-row">
            <text class="info-text">{{ item.schoolName }} · {{ item.gradeName }} · {{ item.clazzName }}</text>
          </view>
        </view>
      </view>
      <view class="empty-state" v-if="filteredStudentList.length === 0">
        <uni-icons type="info" size="48" color="#d1d5db"></uni-icons>
        <text class="empty-text">暂无学生数据</text>
      </view>
    </view>

    <!-- 底部签到按钮 -->
    <view class="bottom-action">
      <button class="checkin-btn" @tap="handleBatchCheckin" :disabled="selectedCount === 0">
        批量签到 ({{ selectedCount }})
      </button>
    </view>

    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="checkin" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'
import { getStudentList } from '@/api/teacher/checkin'
import { getTeacherComboxList } from '@/api/common/dictionary'
import { getUserInfo } from '@/store/auth'
import { setCheckinStudents } from '@/store/checkin'

/**
 * 教师列表
 */
const teacherList = ref(['全部'])
const currentTeacher = ref(getUserInfo()?.userName || '全部')

/**
 * 学生列表
 */
const studentList = ref([])

/**
 * 筛选后的学生列表
 */
const filteredStudentList = computed(() => studentList.value)

/**
 * 是否全选
 */
const isAllSelected = computed(() => {
  return (
    filteredStudentList.value.length > 0 &&
    filteredStudentList.value.every((item) => item.checked)
  )
})

/**
 * 已选择数量
 */
const selectedCount = computed(() => {
  return filteredStudentList.value.filter((item) => item.checked).length
})

/**
 * 加载教师列表
 */
const loadTeacherList = async () => {
  try {
    const data = await getTeacherComboxList()
    if (data && data.length > 0) {
      const names = data.map((item) => item.name)
      teacherList.value = ['全部', ...names]

      // 设置当前教师为登录用户
      const userName = getUserInfo()?.userName
      if (userName && names.includes(userName)) {
        currentTeacher.value = userName
      }
    }
  } catch (error) {
    console.error('加载教师列表失败:', error)
    await uni.showToast({
      title: '教师列表加载失败',
      icon: 'none',
    })
  }
}

/**
 * 加载学生列表
 */
const loadStudentList = async (teacherName) => {
  try {
    // 根据教师名称查找对应的 teacherId
    let teacherId = undefined
    if (teacherName && teacherName !== '全部') {
      const data = await getTeacherComboxList()
      const teacher = data.find((item) => item.name === teacherName)
      teacherId = teacher?.id
    }

    const response = await getStudentList(teacherId)
    if (response.code === 200 && response.data) {
      studentList.value = response.data.map((item) => ({
        ...item,
        checked: false,
      }))
    }
  } catch (error) {
    console.error('加载学生列表失败:', error)
    await uni.showToast({
      title: '数据加载失败',
      icon: 'none',
    })
  }
}

onMounted(() => {
  loadTeacherList()
  loadStudentList(currentTeacher.value)
})

/**
 * 下拉刷新
 */
onPullDownRefresh(async () => {
  await loadStudentList(currentTeacher.value)
  uni.stopPullDownRefresh()
})

/**
 * 教师筛选变化
 */
const onTeacherChange = (e) => {
  currentTeacher.value = teacherList.value[e.detail.value]
  loadStudentList(currentTeacher.value)
}

/**
 * 切换全选状态
 */
const toggleSelectAll = () => {
  const newState = !isAllSelected.value
  filteredStudentList.value.forEach((item) => {
    item.checked = newState
  })
}

/**
 * 切换单个学生选中状态
 */
const toggleCheck = (item) => {
  item.checked = !item.checked
}

/**
 * 批量签到
 */
const handleBatchCheckin = () => {
  const checkedStudents = filteredStudentList.value.filter((item) => item.checked)
  if (checkedStudents.length === 0) {
    uni.showToast({
      title: '请选择学生',
      icon: 'none',
    })
    return
  }

  // 将选中的学生数据存储到 store
  setCheckinStudents(checkedStudents)
  uni.navigateTo({
    url: '/pages/teacher/checkin/components/checkin-confirm',
  })
}
</script>

<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 240rpx;
}

/* 筛选区域 */
.filter-section {
  padding: 0 48rpx;
  margin-bottom: 24rpx;
}

.filter-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-label {
  font-size: 28rpx;
  color: #6b7280;
  font-weight: 500;
}

.filter-value {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 28rpx;
  color: #1f2937;
}

/* 全选区域 */
.select-all-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 48rpx;
  margin-bottom: 24rpx;
}

.select-all-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.select-all-text {
  font-size: 28rpx;
  color: #1f2937;
  font-weight: 500;
}

.selected-count {
  font-size: 24rpx;
  color: #0ea5e9;
  font-weight: 500;
}

/* 学生列表 */
.student-list {
  padding: 0 48rpx;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #d1d5db;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox.checked {
  background: #0ea5e9;
  border-color: #0ea5e9;
}

.checkbox.disabled {
  background: #f3f4f6;
  border-color: #e5e7eb;
  opacity: 0.5;
  cursor: not-allowed;
}

.student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.student-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 500;
}

.status-badge.signed {
  background: #d1fae5;
  color: #10b981;
}

.status-badge.unsigned {
  background: #fee2e2;
  color: #ef4444;
}

.info-text {
  font-size: 24rpx;
  color: #6b7280;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  gap: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}

/* 底部操作区域 */
.bottom-action {
  position: fixed;
  bottom: 128rpx;
  left: 0;
  right: 0;
  padding: 24rpx 48rpx;
  background: #fff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.checkin-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(14, 165, 233, 0.3);
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.checkin-btn::after {
  border: none;
}

.checkin-btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}

.checkin-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  box-shadow: none;
}
</style>
