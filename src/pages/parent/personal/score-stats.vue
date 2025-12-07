<template>
  <view class="page">
    <PageHeader title="成绩统计" :showBack="true" />

    <!-- 筛选区域 -->
    <view class="filter-section">
      <picker :range="studentList" range-key="name" @change="onStudentChange">
        <view class="filter-item">
          <text class="filter-label">学生</text>
          <view class="filter-value">
            <text>{{ currentStudent }}</text>
            <uni-icons type="down" size="16" color="#9ca3af"></uni-icons>
          </view>
        </view>
      </picker>
    </view>

    <!-- 成绩列表 -->
    <view class="score-list">
      <view v-if="loading" class="empty-state">
        <text class="empty-text">加载中...</text>
      </view>
      <view v-else-if="scoreList.length === 0" class="empty-state">
        <text class="empty-text">暂无成绩记录</text>
      </view>
      <view v-else class="score-item" v-for="item in scoreList" :key="item.id">
        <view class="score-header">
          <view class="score-info">
            <text class="student-name">{{ item.studentName }}</text>
            <text class="teacher-name">教师：{{ item.teacherName }}</text>
          </view>
          <view class="exam-info">
            <text v-if="item.name" class="exam-name">{{ item.name }}</text>
            <text class="score-month">{{ item.yearmonth }}</text>
          </view>
        </view>

        <view class="score-grid">
          <view class="score-subject">
            <text class="subject-name">语文</text>
            <text class="subject-score">{{ item.chineseScore }}</text>
          </view>
          <view class="score-subject">
            <text class="subject-name">数学</text>
            <text class="subject-score">{{ item.mathScore }}</text>
          </view>
          <view class="score-subject">
            <text class="subject-name">英语</text>
            <text class="subject-score">{{ item.englishScore }}</text>
          </view>
          <view class="score-subject">
            <text class="subject-name">物理</text>
            <text class="subject-score">{{ item.physicsScore }}</text>
          </view>
          <view class="score-subject">
            <text class="subject-name">化学</text>
            <text class="subject-score">{{ item.chemistryScore }}</text>
          </view>
          <view class="score-subject">
            <text class="subject-name">生物</text>
            <text class="subject-score">{{ item.organismScore }}</text>
          </view>
          <view class="score-subject">
            <text class="subject-name">历史</text>
            <text class="subject-score">{{ item.historyScore }}</text>
          </view>
          <view class="score-subject">
            <text class="subject-name">地理</text>
            <text class="subject-score">{{ item.geographyScore }}</text>
          </view>
          <view class="score-subject">
            <text class="subject-name">政治</text>
            <text class="subject-score">{{ item.politicsScore }}</text>
          </view>
        </view>

        <view v-if="item.description" class="score-description">
          <text class="description-label">备注：</text>
          <text class="description-text">{{ item.description }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { getScoreList } from '@/api/parent/score'
import { getParentHomeOverview } from '@/api/parent/home'

// 学生列表
const studentList = ref([{ id: '', name: '全部' }])
const currentStudent = ref('全部')
const currentStudentId = ref('')

// 成绩列表
const scoreList = ref([])
const loading = ref(false)

/**
 * 加载学生列表
 */
const loadStudentList = async () => {
  try {
    const res = await getParentHomeOverview()
    if (res.code === 200 && res.data.students) {
      studentList.value = [
        { id: '', name: '全部' },
        ...res.data.students.map((s) => ({ id: s.id, name: s.name })),
      ]
    }
  } catch (error) {
    console.error('加载学生列表失败:', error)
  }
}

/**
 * 加载成绩列表
 */
const loadScoreList = async () => {
  loading.value = true
  try {
    const res = await getScoreList({
      studentId: currentStudentId.value,
      page: 1,
      pageSize: 100,
    })
    if (res.code === 200) {
      scoreList.value = res.data.rows || []
    }
  } catch (error) {
    console.error('加载成绩列表失败:', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

/**
 * 学生筛选变化
 */
const onStudentChange = (e) => {
  const index = e.detail.value
  const student = studentList.value[index]
  currentStudent.value = student.name
  currentStudentId.value = student.id
  loadScoreList()
}

onMounted(() => {
  loadStudentList()
  loadScoreList()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 128rpx;
}

/* 筛选区域 */
.filter-section {
  margin: 32rpx 48rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
}

.filter-label {
  font-size: 28rpx;
  color: #6b7280;
}

.filter-value {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: #111827;
}

/* 成绩列表 */
.score-list {
  padding: 0 48rpx 32rpx;
}

.empty-state {
  padding: 120rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}

.score-item {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f3f4f6;
}

.score-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.student-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #111827;
}

.teacher-name {
  font-size: 24rpx;
  color: #6b7280;
}

.exam-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.exam-name {
  font-size: 26rpx;
  color: #111827;
}

.score-month {
  font-size: 28rpx;
  color: #0ea5e9;
  font-weight: 600;
}

/* 成绩网格 */
.score-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.score-subject {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx;
  background: #f9fafb;
  border-radius: 12rpx;
}

.subject-name {
  font-size: 24rpx;
  color: #6b7280;
}

.subject-score {
  font-size: 32rpx;
  font-weight: 600;
  color: #0ea5e9;
}

/* 备注 */
.score-description {
  padding-top: 24rpx;
  border-top: 1rpx solid #f3f4f6;
}

.description-label {
  font-size: 24rpx;
  color: #6b7280;
}

.description-text {
  font-size: 28rpx;
  color: #374151;
  line-height: 1.6;
}
</style>
