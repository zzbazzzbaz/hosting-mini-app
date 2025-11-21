<template>
  <view class="page">
    <PageHeader title="作业详情" :showBack="true" />

    <view class="content">
      <view v-if="loading" class="loading-box">
        <text class="loading-text">正在加载作业...</text>
      </view>

      <view v-else-if="!detail" class="loading-box">
        <text class="loading-text">未找到作业信息</text>
      </view>

      <view v-else>
        <view class="card">
          <view class="card-header">
            <view class="subject-info">
              <view class="subject-icon">
                <text class="icon-text">📘</text>
              </view>
              <view class="subject-detail">
                <text class="subject-name">{{ detail.subjectName || '未分科目' }}</text>
                <text class="subject-date">{{ detail.homeworkDate || '日期未填写' }}</text>
              </view>
            </view>
            <view :class="['status-badge', statusBadge.className]">
              <text class="badge-icon">{{ statusBadge.icon }}</text>
              <text class="badge-text">{{ statusBadge.text }}</text>
            </view>
          </view>
        </view>

        <view class="section-card">
          <view class="section-header section-header-blue">
            <text class="section-icon">📝</text>
            <text class="section-title">作业内容</text>
          </view>
          <view class="section-content">
            <view class="requirement-box">
              <text class="requirement-text">{{ detail.content || '暂无作业描述' }}</text>

              <view v-if="requirementImages.length" class="requirement-media">
                <view class="image-grid requirement-grid">
                  <view
                    class="image-item requirement-image-item"
                    v-for="(img, index) in requirementImages"
                    :key="`requirement-${index}`"
                    @click="previewRequirementImage(index)"
                  >
                    <image :src="img" class="homework-image" mode="aspectFill" />
                  </view>
                </view>
              </view>
              <view v-else class="placeholder-text">未上传作业参考图</view>
            </view>
          </view>
        </view>

        <view class="section-card">
          <view class="section-header section-header-green">
            <text class="section-icon">✏️</text>
            <text class="section-title">学生作答</text>
          </view>
          <view class="section-content">
            <view v-if="homeworkImages.length" class="image-grid">
              <view
                class="image-item"
                v-for="(img, index) in displayImages"
                :key="index"
                @click="previewHomeworkImage(index)"
              >
                <image :src="img" class="homework-image" mode="aspectFill" />
                <view v-if="index === 6 && hasMoreImages" class="more-badge">
                  <text class="more-text">+{{ remainingCount }}</text>
                </view>
              </view>
            </view>
            <view v-else class="placeholder-text">学生还未上传作答图片</view>

            <view v-if="hasMoreImages" class="view-all-btn" @click="previewHomeworkImage(0)">
              <text class="btn-icon">🖼️</text>
              <text class="btn-text">查看全部{{ homeworkImages.length }}张图片</text>
            </view>

            <text class="submit-time">
              {{ submitTimeText }}
            </text>
          </view>
        </view>

        <view class="section-card">
          <view class="section-header section-header-purple">
            <text class="section-icon">💬</text>
            <text class="section-title">教师评语</text>
          </view>
          <view class="section-content">
            <view class="comment-box">
              <text class="comment-text">{{ detail.evaluation || '老师暂未填写评语' }}</text>
              <view class="teacher-info">
                <text class="teacher-icon">👨‍🏫</text>
                <text class="teacher-name">{{ detail.subjectName || '教师' }}</text>
                <text class="divider">•</text>
                <text class="comment-time">
                  {{ detail.finishDate || '等待提交后点评' }}
                </text>
              </view>
            </view>
          </view>
        </view>

        <view class="section-card">
          <view class="section-header section-header-orange">
            <text class="section-icon">😊</text>
            <text class="section-title">今日学生状态</text>
          </view>
          <view class="section-content">
            <view class="status-display">
              <view class="status-icon-wrapper">
                <text class="status-icon-large">😊</text>
              </view>
              <view class="status-info">
                <text class="status-label">{{ detail.studentState || '暂无状态' }}</text>
                <text class="status-desc">由老师记录的学生课堂表现</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <ParentTabBar activeTab="homework" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'
import { getHomeworkDetail } from '@/api/parent/homework'

const detail = ref(null)
const loading = ref(false)
const homeworkImages = ref([])
const requirementImages = ref([])

const displayImages = computed(() => {
  return homeworkImages.value.slice(0, 7)
})

const hasMoreImages = computed(() => {
  return homeworkImages.value.length > 7
})

const remainingCount = computed(() => {
  return Math.max(0, homeworkImages.value.length - 7)
})

const statusBadge = computed(() => {
  const state = Number(detail.value?.state ?? 0)
  if (state === 1) {
    return { text: '已完成', className: 'status-completed', icon: '✓' }
  }
  return { text: '未完成', className: 'status-pending', icon: '⌛' }
})

const submitTimeText = computed(() => {
  if (detail.value?.finishDate) {
    return `⏰ 提交时间: ${detail.value.finishDate}`
  }
  return '⏰ 尚未提交'
})

const previewImages = async (images, current) => {
  if (!images.length) return
  uni.previewImage({
    current: images[current] || images[0],
    urls: images,
    fail: (err) => {
      console.error('预览图片失败:', err)
      uni.showToast({
        title: '预览失败',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

const previewHomeworkImage = (index) => {
  previewImages(homeworkImages.value, index)
}

const previewRequirementImage = (index) => {
  previewImages(requirementImages.value, index)
}

const fetchDetail = async (homeworkId) => {
  loading.value = true
  try {
    const res = await getHomeworkDetail(homeworkId)
    detail.value = res?.data || null
    requirementImages.value = (res?.data?.homeworkImages || []).map(
      (item) => item.url || item.path
    )
    homeworkImages.value = (res?.data?.finishImages || []).map((item) => item.url || item.path)
  } catch (error) {
    console.error('加载作业详情失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1200)
  } finally {
    loading.value = false
  }
}

onLoad((options) => {
  const homeworkId = options?.homeworkId || options?.id
  if (!homeworkId) {
    uni.showToast({
      title: '缺少作业ID',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1200)
    return
  }
  fetchDetail(homeworkId)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding-top: 144rpx;
  padding-bottom: 128rpx;
}

.content {
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.loading-box {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 80rpx 40rpx;
  text-align: center;
  color: #6b7280;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.loading-text {
  font-size: 28rpx;
}

.card,
.section-card {
  background-color: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx;
}

.subject-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.subject-icon {
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 48rpx;
}

.subject-detail {
  display: flex;
  flex-direction: column;
}

.subject-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #1f2937;
}

.subject-date {
  font-size: 28rpx;
  color: #6b7280;
  margin-top: 8rpx;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
}

.status-completed {
  background-color: #d1fae5;
}

.status-pending {
  background-color: #fee2e2;
}

.badge-icon,
.badge-text {
  color: #10b981;
}

.status-pending .badge-icon,
.status-pending .badge-text {
  color: #dc2626;
}

.badge-icon {
  font-size: 32rpx;
}

.badge-text {
  font-size: 28rpx;
  font-weight: 600;
}

.section-header {
  padding: 24rpx 40rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.section-header-blue {
  background: linear-gradient(to right, #0ea5e9, #3b82f6);
}

.section-header-green {
  background: linear-gradient(to right, #10b981, #059669);
}

.section-header-purple {
  background: linear-gradient(to right, #a855f7, #ec4899);
}

.section-header-orange {
  background: linear-gradient(to right, #f59e0b, #f97316);
}

.section-icon,
.section-title {
  color: #ffffff;
}

.section-icon {
  font-size: 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
}

.section-content {
  padding: 40rpx;
}

.requirement-box {
  background-color: #f9fafb;
  border-radius: 24rpx;
  padding: 32rpx;
  border-left: 8rpx solid #0ea5e9;
}

.requirement-text {
  font-size: 28rpx;
  color: #374151;
  line-height: 1.6;
  white-space: pre-line;
}

.requirement-media {
  margin-top: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.requirement-grid {
  grid-template-columns: repeat(3, 1fr);
}

.requirement-image-item {
  border-color: #0ea5e9;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16rpx;
  overflow: hidden;
  border: 4rpx solid #10b981;
  cursor: pointer;
  transition: all 0.2s;
}

.image-item:active {
  transform: scale(0.95);
  opacity: 0.8;
}

.homework-image {
  width: 100%;
  height: 100%;
}

.more-badge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.more-text {
  font-size: 56rpx;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

.view-all-btn {
  background: linear-gradient(to right, #10b981, #059669);
  border-radius: 24rpx;
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.btn-icon {
  font-size: 36rpx;
}

.btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.submit-time {
  font-size: 28rpx;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.comment-box {
  background: linear-gradient(to right, #faf5ff, #fce7f3);
  border-radius: 24rpx;
  padding: 32rpx;
  border-left: 8rpx solid #a855f7;
}

.comment-text {
  font-size: 28rpx;
  color: #374151;
  line-height: 1.6;
  white-space: pre-line;
  display: block;
  margin-bottom: 24rpx;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: #a855f7;
}

.teacher-icon {
  font-size: 32rpx;
}

.teacher-name {
  color: #a855f7;
}

.divider {
  color: #d1d5db;
}

.comment-time {
  color: #6b7280;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.status-icon-wrapper {
  width: 128rpx;
  height: 128rpx;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-icon-large {
  font-size: 64rpx;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 48rpx;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8rpx;
}

.status-desc {
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.placeholder-text {
  font-size: 26rpx;
  color: #9ca3af;
  padding: 12rpx 0;
}
</style>
