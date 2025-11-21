<template>
  <view class="page">
    <PageHeader title="作业详情" :showBack="true" />

    <view v-if="homework" class="content">
      <view class="summary-card">
        <view class="summary-top">
          <view class="subject-icon">{{ homework.icon }}</view>
          <view class="subject-info">
            <text class="subject-name">{{ homework.subject }}</text>
            <text class="subject-title">{{ homework.title }}</text>
            <text class="subject-meta"
              >布置：{{ homework.publishDate }} · 截止：{{ homework.deadline }}</text
            >
          </view>
          <view
            :class="[
              'status-badge',
              homework.status === 'completed' ? 'status-completed' : 'status-pending',
            ]"
          >
            <text>{{ homework.status === 'completed' ? '已完成' : '未完成' }}</text>
          </view>
        </view>

        <view class="summary-bottom">
          <view class="student">
            <text class="student-name">{{ homework.student.name }}</text>
            <text class="student-detail"
              >{{ homework.student.school }} · {{ homework.student.grade }} ·
              {{ homework.student.class }}</text
            >
          </view>
          <view class="stats">
            <text class="stat submitted">提交 {{ homework.metrics.submitted }}</text>
            <text class="divider">|</text>
            <text class="stat pending">未交 {{ homework.metrics.pending }}</text>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-header section-blue">
          <text class="section-title">作业要求</text>
        </view>
        <view class="section-body">
          <text class="section-text">{{ homework.requirement }}</text>
          <view v-if="homework.requirementImages.length" class="image-grid small">
            <view
              v-for="(img, index) in homework.requirementImages"
              :key="`req-${index}`"
              class="image-item"
              @click="previewRequirement(index)"
            >
              <image :src="img" mode="aspectFill" />
            </view>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-header section-green">
          <text class="section-title">学生作答</text>
          <text class="section-sub">提交时间 {{ homework.submitTime }}</text>
        </view>
        <view class="section-body">
          <view class="image-grid">
            <view
              v-for="(img, index) in displaySubmissionImages"
              :key="`sub-${index}`"
              class="image-item"
              @click="previewSubmission(index)"
            >
              <image :src="img" mode="aspectFill" />
              <view v-if="index === 5 && homework.submissionImages.length > 6" class="overlay">
                <text class="overlay-text">+{{ homework.submissionImages.length - 6 }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-header section-orange">
          <text class="section-title">批改反馈</text>
        </view>
        <view class="section-body">
          <text class="section-text">{{ homework.comment.text }}</text>
          <view class="comment-footer">
            <text>批改老师：{{ homework.comment.teacher }}</text>
            <text class="dot">•</text>
            <text>{{ homework.comment.time }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">📄</text>
      <text class="empty-text">未找到对应的作业信息</text>
    </view>

    <TeacherTabBar activeTab="homework" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'

const assignments = [
  {
    id: 1,
    subject: '数学',
    icon: '🔢',
    title: '完成课后练习题1-10',
    publishDate: '2025-10-25 14:30',
    deadline: '2025-10-26 18:00',
    status: 'pending',
    student: {
      name: '喜洋洋',
      school: '实验小学',
      grade: '一年级',
      class: '1班',
    },
    metrics: {
      submitted: 8,
      pending: 4,
    },
    requirement:
      '完成课本第3章练习题，重点关注乘法运算。\n1. 练习题3-1~3-6\n2. 应用题3-7~3-9\n3. 思考题请写出解题过程。',
    requirementImages: ['/static/test/1.jpg', '/static/test/2.jpg'],
    submissionImages: ['/static/test/3.jpg', '/static/test/4.jpg', '/static/test/5.jpg'],
    submitTime: '2025-10-26 17:20',
    comment: {
      text: '整体完成较好，注意第3-8题的列式步骤，下次再接再厉。',
      teacher: '张老师',
      time: '2025-10-26 21:05',
    },
  },
  {
    id: 2,
    subject: '语文',
    icon: '📖',
    title: '背诵古诗《望庐山瀑布》',
    publishDate: '2025-10-24 16:00',
    deadline: '2025-10-25 21:00',
    status: 'completed',
    student: {
      name: '美羊羊',
      school: '实验小学',
      grade: '一年级',
      class: '2班',
    },
    metrics: {
      submitted: 12,
      pending: 0,
    },
    requirement: '熟读并背诵《望庐山瀑布》，录音发送至班级群。\n写出古诗中的生僻字并注音。',
    requirementImages: ['/static/test/6.jpg'],
    submissionImages: ['/static/test/7.jpg'],
    submitTime: '2025-10-25 20:10',
    comment: {
      text: '背诵流利，字迹工整，继续保持！',
      teacher: '李老师',
      time: '2025-10-25 22:18',
    },
  },
]

const homework = ref(null)

onLoad((options) => {
  const id = Number(options?.id)
  homework.value = assignments.find((item) => item.id === id) || assignments[0]
})

const displaySubmissionImages = computed(() => {
  if (!homework.value) return []
  return homework.value.submissionImages.slice(0, 6)
})

const previewImages = async (images, index) => {
  if (!images.length) return

  const tasks = images.map(
    (src) =>
      new Promise((resolve) => {
        uni.getImageInfo({
          src,
          success: (res) => resolve(res.path),
          fail: () => resolve(src),
        })
      })
  )

  const urls = await Promise.all(tasks)

  uni.previewImage({
    current: urls[index] || urls[0],
    urls,
  })
}

const previewRequirement = (index) => {
  if (!homework.value) return
  previewImages(homework.value.requirementImages, index)
}

const previewSubmission = (index) => {
  if (!homework.value) return
  previewImages(homework.value.submissionImages, index)
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 144rpx 0 120rpx;
}

.content {
  padding: 0 48rpx 48rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.summary-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  box-shadow: 0 8rpx 22rpx rgba(14, 165, 233, 0.18);
}

.summary-top {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.subject-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  color: #fff;
  box-shadow: 0 8rpx 16rpx rgba(14, 165, 233, 0.2);
}

.subject-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.subject-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #0f172a;
}

.subject-title {
  font-size: 30rpx;
  color: #334155;
}

.subject-meta {
  font-size: 24rpx;
  color: #64748b;
}

.status-badge {
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.status-completed {
  background: #dcfce7;
  color: #15803d;
}

.status-pending {
  background: #fee2e2;
  color: #dc2626;
}

.summary-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #e2e8f0;
}

.student {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.student-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #0f172a;
}

.student-detail {
  font-size: 24rpx;
  color: #64748b;
}

.stats {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  color: #475569;
}

.stats .submitted {
  color: #0ea5e9;
}

.stats .pending {
  color: #f97316;
}

.stats .divider {
  color: #cbd5f5;
}

.section-card {
  background: #fff;
  border-radius: 28rpx;
  overflow: hidden;
  box-shadow: 0 6rpx 18rpx rgba(14, 165, 233, 0.12);
}

.section-header {
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #fff;
}

.section-sub {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.section-blue {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.section-green {
  background: linear-gradient(135deg, #10b981, #22c55e);
}

.section-orange {
  background: linear-gradient(135deg, #f97316, #fb923c);
}

.section-body {
  padding: 28rpx 32rpx 36rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.section-text {
  font-size: 26rpx;
  color: #475569;
  line-height: 1.6;
  white-space: pre-line;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20rpx;
}

.image-grid.small .image-item {
  height: 160rpx;
}

.image-item {
  position: relative;
  height: 200rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background: #f1f5f9;
}

.image-item image {
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-text {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}

.comment-footer {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  color: #94a3b8;
}

.dot {
  color: #cbd5f5;
}

.empty-state {
  margin: 200rpx auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  color: #94a3b8;
}

.empty-icon {
  font-size: 72rpx;
}

.empty-text {
  font-size: 28rpx;
}
</style>
