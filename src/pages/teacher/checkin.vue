<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="签到信息"  />

    <!-- 筛选区域：教师、学校、年级、班级四个筛选项 -->
    <view class="filter-section">
      <picker class="filter-picker" :range="teacherOptions" @change="onTeacherChange">
        <view class="picker-box">
          <text class="label">{{currentTeacher}}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
      <picker class="filter-picker" :range="schoolOptions" @change="onSchoolChange">
        <view class="picker-box">
          <text class="label">{{currentSchool}}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
      <picker class="filter-picker" :range="gradeOptions" @change="onGradeChange">
        <view class="picker-box">
          <text class="label">{{currentGrade}}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
      <picker class="filter-picker" :range="classOptions" @change="onClassChange">
        <view class="picker-box">
          <text class="label">{{currentClass}}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
    </view>

    <!-- 学生列表：紧凑布局，所有信息在一行 -->
    <view class="list">
      <view v-for="item in studentList" :key="item.id" class="student-item" @click="toggleCheck(item)">
        <!-- 复选框 -->
        <view class="checkbox">
          <view :class="['checkbox-inner', item.checked ? 'checked' : '']">
            <text v-if="item.checked" class="check-icon">✓</text>
          </view>
        </view>
        <!-- 学生信息：姓名、学校、年级、班级 -->
        <view class="student-info">
          <text class="name">{{item.name}}</text>
          <text class="detail">{{item.school}}</text>
          <text class="detail grade">{{item.grade}}</text>
          <text class="detail">{{item.class}}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="bottom-actions">
      <button class="action-btn checkin-btn" @click="handleBatchCheckin">
        <text>签到</text>
      </button>
    </view>

    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="checkin" />
  </view>
</template>

<script setup>
import {ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'

// 当前选择的筛选项
const currentTeacher = ref('张三')
const currentSchool = ref('实验小学')
const currentGrade = ref('一年级')
const currentClass = ref('1班')

// 筛选选项数据
const teacherOptions = ['全部', '张三', '李四', '王五']
const schoolOptions = ['全部', '实验小学', '第二小学', '第三小学']
const gradeOptions = ['全部', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
const classOptions = ['全部', '1班', '2班', '3班', '4班']

// 学生列表数据
const studentList = ref([
  {id: 1, name: '张同学', school: '实验小学', grade: '一年级', class: '1班', checked: false},
  {id: 2, name: '赵同学', school: '实验小学', grade: '二年级', class: '3班', checked: false},
  {id: 3, name: '刘同学', school: '第二小学', grade: '五年级', class: '2班', checked: false},
  {id: 4, name: '易同学', school: '第三小学', grade: '一年级', class: '4班', checked: false},
  {id: 5, name: '章同学', school: '实验小学', grade: '六年级', class: '1班', checked: false},
  {id: 6, name: '天同学', school: '第二小学', grade: '一年级', class: '2班', checked: false}
])

// 教师筛选器变化事件
const onTeacherChange = (e) => {
  const index = e.detail.value
  currentTeacher.value = teacherOptions[index]
  console.log('选择教师:', currentTeacher.value)
}

// 学校筛选器变化事件
const onSchoolChange = (e) => {
  const index = e.detail.value
  currentSchool.value = schoolOptions[index]
  console.log('选择学校:', currentSchool.value)
}

// 年级筛选器变化事件
const onGradeChange = (e) => {
  const index = e.detail.value
  currentGrade.value = gradeOptions[index]
  console.log('选择年级:', currentGrade.value)
}

// 班级筛选器变化事件
const onClassChange = (e) => {
  const index = e.detail.value
  currentClass.value = classOptions[index]
  console.log('选择班级:', currentClass.value)
}

// 切换学生的签到状态
const toggleCheck = (item) => {
  item.checked = !item.checked
}

// 批量签到按钮点击事件
const handleBatchCheckin = () => {
  const checkedStudents = studentList.value.filter(s => s.checked)
  if (checkedStudents.length === 0) {
    uni.showToast({
      title: '请至少选择一个学生',
      icon: 'none'
    })
    return
  }

  // 使用本地存储临时保存选中的学生数据
  uni.setStorageSync('checkinStudents', checkedStudents)

  // 跳转到签到确认页面
  uni.navigateTo({
    url: '/pages/teacher/checkin-confirm'
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

/* 筛选区域：四个筛选项在同一行 */
.filter-section {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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

/* 学生列表 */
.list {
  padding: 24rpx 48rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 学生列表项：紧凑单行布局 */
.student-item {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  padding: 28rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

/* 复选框 */
.checkbox {
  flex-shrink: 0;
}

.checkbox-inner {
  width: 40rpx;
  height: 40rpx;
  border: 3rpx solid #d1d5db;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.check-icon {
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
}

/* 学生信息区域 */
.student-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
  overflow: hidden;
}

/* 学生姓名 */
.name {
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
  flex-shrink: 0;
}

/* 其他详细信息 */
.detail {
  font-size: 26rpx;
  color: #6b7280;
  flex-shrink: 0;
}

/* 年级信息突出显示 */
.grade {
  color: #0ea5e9;
  font-weight: 500;
}

/* 底部操作按钮区域 */
.bottom-actions {
  position: fixed;
  bottom: 128rpx;
  left: 0;
  right: 0;
  padding: 24rpx 48rpx;
  background: #fff;
  border-top: 1rpx solid #e5e7eb;
  z-index: 10;
}

.action-btn {
  width: 100%;
  padding: 28rpx;
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

/* 签到按钮 */
.checkin-btn {
  background: #10b981;
  color: #fff;
}
</style>
