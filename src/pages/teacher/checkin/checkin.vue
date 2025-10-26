<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="签到信息"  />

    <!-- 筛选区域：教师、学校、年级、班级、日期、签到状态 -->
    <view class="filter-section">
      <!-- 第一行：教师、学校、年级、班级 -->
      <view class="filter-row">
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
      <!-- 第二行：日期、签到状态 -->
      <view class="filter-row">
        <picker class="filter-picker" mode="date" :value="currentDate" @change="onDateChange">
          <view class="picker-box">
            <text class="label">{{currentDate}}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker class="filter-picker" :range="statusOptions" @change="onStatusChange">
          <view class="picker-box">
            <text class="label">{{currentStatus}}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 全选按钮区域 -->
    <view class="select-all-section">
      <view class="select-all-box" @tap="toggleSelectAll">
        <view :class="['checkbox-inner', isAllSelected ? 'checked' : '']">
          <text v-if="isAllSelected" class="check-icon">✓</text>
        </view>
        <text class="select-all-text">全选</text>
      </view>
    </view>

    <!-- 学生列表：紧凑布局，所有信息在一行 -->
    <view class="list">
      <view v-for="item in filteredStudentList" :key="item.id" class="student-item">
        <!-- 复选框 -->
        <view class="checkbox" @tap.stop="toggleCheck(item)">
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
import {ref, computed} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'

// 获取当前日期
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
const currentDay = String(now.getDate()).padStart(2, '0')
const todayDate = `${currentYear}-${currentMonth}-${currentDay}`

// 当前选择的筛选项
const currentTeacher = ref('张三')  // 默认为当前登录教师
const currentSchool = ref('全部')
const currentGrade = ref('全部')
const currentClass = ref('全部')
const currentDate = ref(todayDate)  // 默认为今天
const currentStatus = ref('未签到')  // 默认显示未签到的学生，便于签到操作

// 筛选选项数据
const teacherOptions = ['全部', '张三', '李四', '王五']
const schoolOptions = ['全部', '实验小学', '第二小学', '第三小学']
const gradeOptions = ['全部', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
const classOptions = ['全部', '1班', '2班', '3班', '4班']
const statusOptions = ['全部', '未签到', '已签到']

// 学生列表数据（添加日期、教师、签到状态字段）
const studentList = ref([
  {id: 1, name: '张同学', teacher: '张三', school: '实验小学', grade: '一年级', class: '1班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 2, name: '赵同学', teacher: '张三', school: '实验小学', grade: '二年级', class: '3班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 3, name: '刘同学', teacher: '李四', school: '第二小学', grade: '五年级', class: '2班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 4, name: '易同学', teacher: '王五', school: '第三小学', grade: '一年级', class: '4班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 5, name: '章同学', teacher: '张三', school: '实验小学', grade: '六年级', class: '1班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 6, name: '天同学', teacher: '李四', school: '第二小学', grade: '一年级', class: '2班', date: '2025-10-25', checkInStatus: '已签到', checked: false},
  {id: 7, name: '王明', teacher: '张三', school: '实验小学', grade: '三年级', class: '1班', date: '2025-10-25', checkInStatus: '已签到', checked: false},
  {id: 8, name: '李华', teacher: '李四', school: '第二小学', grade: '四年级', class: '2班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 9, name: '陈静', teacher: '王五', school: '第三小学', grade: '二年级', class: '3班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 10, name: '林峰', teacher: '张三', school: '实验小学', grade: '五年级', class: '1班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 11, name: '周雨', teacher: '李四', school: '第二小学', grade: '一年级', class: '4班', date: '2025-10-25', checkInStatus: '未签到', checked: false},
  {id: 12, name: '吴晨', teacher: '张三', school: '实验小学', grade: '六年级', class: '2班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 13, name: '郑宇', teacher: '王五', school: '第三小学', grade: '三年级', class: '1班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 14, name: '孙涛', teacher: '张三', school: '实验小学', grade: '二年级', class: '3班', date: '2025-10-25', checkInStatus: '已签到', checked: false},
  {id: 15, name: '何敏', teacher: '李四', school: '第二小学', grade: '四年级', class: '1班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 16, name: '高强', teacher: '王五', school: '第三小学', grade: '五年级', class: '2班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 17, name: '马丽', teacher: '张三', school: '实验小学', grade: '一年级', class: '4班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 18, name: '朱亮', teacher: '李四', school: '第二小学', grade: '六年级', class: '3班', date: '2025-10-25', checkInStatus: '未签到', checked: false},
  {id: 19, name: '胡娟', teacher: '张三', school: '实验小学', grade: '三年级', class: '2班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 20, name: '郭伟', teacher: '王五', school: '第三小学', grade: '二年级', class: '1班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 21, name: '罗琪', teacher: '李四', school: '第二小学', grade: '四年级', class: '4班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 22, name: '梁洁', teacher: '张三', school: '实验小学', grade: '五年级', class: '3班', date: '2025-10-25', checkInStatus: '已签到', checked: false},
  {id: 23, name: '宋欢', teacher: '王五', school: '第三小学', grade: '一年级', class: '2班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 24, name: '唐军', teacher: '张三', school: '实验小学', grade: '六年级', class: '1班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 25, name: '韩冰', teacher: '李四', school: '第二小学', grade: '三年级', class: '4班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 26, name: '冯磊', teacher: '王五', school: '第三小学', grade: '二年级', class: '2班', date: '2025-10-25', checkInStatus: '未签到', checked: false},
  {id: 27, name: '于芳', teacher: '张三', school: '实验小学', grade: '四年级', class: '3班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 28, name: '董超', teacher: '李四', school: '第二小学', grade: '五年级', class: '1班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 29, name: '萧雪', teacher: '张三', school: '实验小学', grade: '一年级', class: '2班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 30, name: '程浩', teacher: '王五', school: '第三小学', grade: '六年级', class: '4班', date: '2025-10-25', checkInStatus: '已签到', checked: false},
  {id: 31, name: '曹慧', teacher: '李四', school: '第二小学', grade: '三年级', class: '3班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 32, name: '袁杰', teacher: '张三', school: '实验小学', grade: '二年级', class: '1班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 33, name: '邓蕾', teacher: '王五', school: '第三小学', grade: '四年级', class: '2班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 34, name: '许鹏', teacher: '张三', school: '实验小学', grade: '五年级', class: '4班', date: '2025-10-25', checkInStatus: '未签到', checked: false},
  {id: 35, name: '傅婷', teacher: '李四', school: '第二小学', grade: '一年级', class: '3班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 36, name: '沈刚', teacher: '王五', school: '第三小学', grade: '六年级', class: '1班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 37, name: '彭颖', teacher: '张三', school: '实验小学', grade: '三年级', class: '2班', date: todayDate, checkInStatus: '已签到', checked: false},
  {id: 38, name: '吕波', teacher: '李四', school: '第二小学', grade: '二年级', class: '4班', date: '2025-10-25', checkInStatus: '已签到', checked: false},
  {id: 39, name: '苏悦', teacher: '张三', school: '实验小学', grade: '四年级', class: '1班', date: todayDate, checkInStatus: '未签到', checked: false},
  {id: 40, name: '卢翔', teacher: '王五', school: '第三小学', grade: '五年级', class: '3班', date: todayDate, checkInStatus: '已签到', checked: false}
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

// 日期筛选器变化事件
const onDateChange = (e) => {
  currentDate.value = e.detail.value
  console.log('选择日期:', currentDate.value)
}

// 签到状态筛选器变化事件
const onStatusChange = (e) => {
  const index = e.detail.value
  currentStatus.value = statusOptions[index]
  console.log('选择签到状态:', currentStatus.value)
}

// 根据筛选条件过滤学生列表
const filteredStudentList = computed(() => {
  let filtered = studentList.value

  // 按教师筛选
  if (currentTeacher.value !== '全部') {
    filtered = filtered.filter(item => item.teacher === currentTeacher.value)
  }

  // 按学校筛选
  if (currentSchool.value !== '全部') {
    filtered = filtered.filter(item => item.school === currentSchool.value)
  }

  // 按年级筛选
  if (currentGrade.value !== '全部') {
    filtered = filtered.filter(item => item.grade === currentGrade.value)
  }

  // 按班级筛选
  if (currentClass.value !== '全部') {
    filtered = filtered.filter(item => item.class === currentClass.value)
  }

  // 按日期筛选
  if (currentDate.value) {
    filtered = filtered.filter(item => item.date === currentDate.value)
  }

  // 按签到状态筛选
  if (currentStatus.value !== '全部') {
    filtered = filtered.filter(item => item.checkInStatus === currentStatus.value)
  }

  return filtered
})

// 计算是否全选（基于筛选后的列表）
const isAllSelected = computed(() => {
  return filteredStudentList.value.length > 0 && filteredStudentList.value.every(item => item.checked)
})

// 切换学生的签到状态
const toggleCheck = (item) => {
  item.checked = !item.checked
}

// 全选/取消全选
const toggleSelectAll = () => {
  const newCheckedState = !isAllSelected.value
  filteredStudentList.value.forEach(item => {
    item.checked = newCheckedState
  })
}

// 批量签到按钮点击事件
const handleBatchCheckin = () => {
  const checkedStudents = filteredStudentList.value.filter(s => s.checked)
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

/* 全选区域，固定在筛选区域下方 */
.select-all-section {
  position: fixed;
  top: 344rpx;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 24rpx 48rpx;
  background: #fff;
  margin-top: 2rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.select-all-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.select-all-text {
  font-size: 28rpx;
  color: #374151;
  font-weight: 500;
}

/* 学生列表，添加顶部间距避免被固定区域遮挡 */
.list {
  padding: 320rpx 48rpx 140rpx;
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
  padding: 10rpx;
  cursor: pointer;
}

.checkbox-inner {
  width: 44rpx;
  height: 44rpx;
  border: 3rpx solid #d1d5db;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: #fff;
}

.checkbox-inner.checked {
  background: #0ea5e9;
  border-color: #0ea5e9;
}

.check-icon {
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  line-height: 1;
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
  bottom: 160rpx;
  left: 0;
  right: 0;
  padding: 20rpx 48rpx;
  background: transparent;
  z-index: 10;
}

.action-btn {
  width: 100%;
  padding: 20rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.2);
}

/* 签到按钮 */
.checkin-btn {
  background: #10b981;
  color: #fff;
}
</style>
