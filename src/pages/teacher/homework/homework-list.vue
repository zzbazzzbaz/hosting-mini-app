<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业信息"/>

    <!-- 筛选区域：教师、学校、年级、班级四个筛选项 -->
    <view class="filter-section">
      <!-- 第一行：教师、学校 -->
      <view class="filter-row">
        <picker class="filter-picker" :range="teacherOptions" @change="onTeacherChange">
          <view class="picker-box">
            <text class="label">{{ currentTeacher === '全部' ? '请选择教师' : currentTeacher }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker class="filter-picker" :range="schoolOptions" @change="onSchoolChange">
          <view class="picker-box">
            <text class="label">{{ currentSchool === '全部' ? '请选择学校' : currentSchool }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
      <!-- 第二行：年级、班级 -->
      <view class="filter-row">
        <picker class="filter-picker" :range="gradeOptions" @change="onGradeChange">
          <view class="picker-box">
            <text class="label">{{ currentGrade === '全部' ? '请选择年级' : currentGrade }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <picker class="filter-picker" :range="classOptions" @change="onClassChange">
          <view class="picker-box">
            <text class="label">{{ currentClass === '全部' ? '请选择班级' : currentClass }}</text>
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
      <view v-for="item in filteredHomeworkList" :key="item.id" class="item" @click="goDetail(item)">
        <!-- 左侧学生信息 -->
        <view class="student-info">
          <text class="name">{{ item.name }}</text>
          <view class="detail-row">
            <text class="detail">{{ item.school }}</text>
            <text class="detail grade">{{ item.grade }}</text>
            <text class="detail">{{ item.class }}</text>
          </view>
        </view>
        <!-- 右侧作业统计 -->
        <view class="homework-stats">
          <text class="num completed">已完成: {{ item.completed }}</text>
          <text class="num pending">未完成: {{ item.pending }}</text>
        </view>
      </view>
    </view>
    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="homework"/>
  </view>
</template>
<script setup>
import {ref, computed} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'

// 当前选择的筛选项
const currentTeacher = ref('全部')
const currentSchool = ref('全部')
const currentGrade = ref('全部')
const currentClass = ref('全部')
const searchName = ref('')  // 名称搜索关键词

// 筛选选项数据
const teacherOptions = ['全部', '张三', '李四', '王五']
const schoolOptions = ['全部', '实验小学', '第二小学', '第三小学']
const gradeOptions = ['全部', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
const classOptions = ['全部', '1班', '2班', '3班', '4班']

// 作业列表数据
const homeworkList = ref([
  {
    id: 1,
    name: '喜洋洋',
    teacher: '张三',
    school: '实验小学',
    grade: '一年级',
    class: '1班',
    completed: 10,
    pending: 2
  },
  {id: 2, name: '美羊羊', teacher: '张三', school: '实验小学', grade: '一年级', class: '2班', completed: 8, pending: 4},
  {
    id: 3,
    name: '懒羊羊',
    teacher: '李四',
    school: '第二小学',
    grade: '二年级',
    class: '3班',
    completed: 12,
    pending: 0
  },
  {id: 4, name: '沸羊羊', teacher: '王五', school: '第三小学', grade: '三年级', class: '1班', completed: 6, pending: 5}
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

// 根据筛选条件过滤作业列表
const filteredHomeworkList = computed(() => {
  let filtered = homeworkList.value

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

  // 按名称搜索
  if (searchName.value.trim()) {
    filtered = filtered.filter(item => item.name.includes(searchName.value.trim()))
  }

  return filtered
})

// 跳转到作业详情页面
const goDetail = (item) => uni.navigateTo({url: `/pages/teacher/homework/homework?id=${item.id}`})
</script>
<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 128rpx
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
  gap: 4rpx
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

</style>
