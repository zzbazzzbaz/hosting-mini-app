<template>
  <view class="page">
    <PageHeader title="作业详情" :showBack="true" />

    <view class="content">
      <view v-if="loading" class="card placeholder">
        <text class="placeholder-text">正在加载作业...</text>
      </view>

      <view v-else-if="!detail" class="card placeholder">
        <text class="placeholder-text">未找到作业信息</text>
      </view>

      <view v-else>
        <view class="hero">
          <view class="hero-left">
            <view class="subject-badge">{{ subjectShort }}</view>
            <view class="subject-info">
              <text class="subject-title">{{ detail.subjectName || '未分科目' }}</text>
              <text class="subject-sub">{{ detail.studentName || '未指定学生' }}</text>
            </view>
          </view>
          <view :class="['status-chip', statusBadge.className]">
            <text class="status-icon">{{ statusBadge.icon }}</text>
            <text class="status-text">{{ statusBadge.text }}</text>
          </view>
        </view>

        <view class="info-grid card">
          <view class="info-item">
            <text class="info-label">布置日期</text>
            <text class="info-value">{{ detail.homeworkDate || '-' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">完成时间</text>
            <text class="info-value">{{ detail.finishDate || '未完成' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">学生状态</text>
            <text class="info-value">{{ detail.studentState || '暂无' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">科目</text>
            <text class="info-value">{{ detail.subjectName || '-' }}</text>
          </view>
        </view>

        <view class="section card">
          <view class="section-header">
            <view class="section-title-wrap">
              <text class="section-dot dot-blue"></text>
              <text class="section-title">作业内容</text>
            </view>
            <text class="section-sub">{{ detail.homeworkDate || '' }}</text>
          </view>
          <text class="body-text">{{ detail.content || '暂无作业描述' }}</text>
          <view v-if="requirementImages.length" class="image-grid">
            <view
              v-for="(img, index) in requirementImages"
              :key="`req-${index}`"
              class="image-item bordered"
              @click="previewRequirementImage(index)"
            >
              <image :src="img" mode="aspectFill" class="image" />
            </view>
          </view>
          <view v-else class="empty-inline">未上传参考图</view>
        </view>

        <view class="section card">
          <view class="section-header">
            <view class="section-title-wrap">
              <text class="section-dot dot-green"></text>
              <text class="section-title">学生作答</text>
            </view>
            <text class="section-sub">{{ submitTimeText }}</text>
          </view>
          <view v-if="homeworkImages.length" class="image-grid">
            <view
              class="image-item"
              v-for="(img, index) in displayImages"
              :key="index"
              @click="previewHomeworkImage(index)"
            >
              <image :src="img" class="image" mode="aspectFill" />
              <view v-if="index === 6 && hasMoreImages" class="more-mask">
                <text class="more-text">+{{ remainingCount }}</text>
              </view>
            </view>
          </view>
          <view v-else class="empty-inline">学生尚未上传作答图片</view>
          <view v-if="hasMoreImages" class="view-all" @click="previewHomeworkImage(0)">
            <text class="view-all-icon">🖼️</text>
            <text>查看全部 {{ homeworkImages.length }} 张</text>
          </view>
        </view>

        <view class="section card">
          <view class="section-header">
            <view class="section-title-wrap">
              <text class="section-dot dot-purple"></text>
              <text class="section-title">教师评语</text>
            </view>
            <text class="section-sub">{{ detail.finishDate || '完成后显示时间' }}</text>
          </view>
          <view class="comment-box">
            <text class="body-text">{{ detail.evaluation || '老师暂未填写评语' }}</text>
          </view>
        </view>

        <view class="section card">
          <view class="section-header">
            <view class="section-title-wrap">
              <text class="section-dot dot-orange"></text>
              <text class="section-title">课堂状态</text>
            </view>
            <text class="section-sub">由老师记录</text>
          </view>
          <view class="status-row">
            <view class="status-icon">😊</view>
            <view class="status-detail">
              <text class="status-title">{{ detail.studentState || '暂无状态记录' }}</text>
              <text class="status-desc">课堂表现、精神状态等可在此查看</text>
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

const subjectShort = computed(() => {
  const text = detail.value?.subjectName || '作业'
  return text.slice(0, 1)
})

const displayImages = computed(() => homeworkImages.value.slice(0, 7))
const hasMoreImages = computed(() => homeworkImages.value.length > 7)
const remainingCount = computed(() => Math.max(0, homeworkImages.value.length - 7))

const statusBadge = computed(() => {
  const state = Number(detail.value?.state ?? 0)
  if (state === 1) {
    return { text: '已完成', className: 'completed', icon: '✓' }
  }
  return { text: '未完成', className: 'pending', icon: '⌛' }
})

const submitTimeText = computed(() => {
  if (detail.value?.finishDate) return `提交时间：${detail.value.finishDate}`
  return '尚未提交'
})

const previewImages = (images, current) => {
  if (!images.length) return
  uni.previewImage({
    current: images[current] || images[0],
    urls: images,
    fail: (err) => {
      console.error('预览图片失败:', err)
      uni.showToast({ title: '预览失败', icon: 'none' })
    },
  })
}

const previewHomeworkImage = (index) => previewImages(homeworkImages.value, index)
const previewRequirementImage = (index) => previewImages(requirementImages.value, index)

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
    uni.showToast({ title: '加载失败', icon: 'none' })
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
    uni.showToast({ title: '缺少作业ID', icon: 'none' })
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
  background: linear-gradient(135deg, #eef7ff 0%, #e0f2fe 100%);
  padding-top: 144rpx;
  padding-bottom: 128rpx;
}

.content {
  padding: 40rpx 40rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.card {
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(14, 165, 233, 0.08);
  padding: 28rpx;
}

.placeholder {
  text-align: center;
  color: #6b7280;
}

.placeholder-text {
  font-size: 28rpx;
}

.hero {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  border-radius: 28rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10rpx 26rpx rgba(37, 99, 235, 0.28);
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.subject-badge {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42rpx;
  font-weight: 700;
}

.subject-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  color: #e0ecff;
}

.subject-title {
  font-size: 36rpx;
  font-weight: 800;
  color: #fff;
}

.subject-sub {
  font-size: 26rpx;
}

.status-chip {
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-weight: 700;
  color: #0f172a;
  background: #f8fafc;
}

.status-chip.completed {
  background: #dcfce7;
  color: #166534;
}

.status-chip.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-icon {
  font-size: 30rpx;
}

.status-text {
  font-size: 26rpx;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
}

.info-item {
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 18rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.info-label {
  font-size: 24rpx;
  color: #64748b;
}

.info-value {
  font-size: 28rpx;
  color: #0f172a;
  font-weight: 600;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.section-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}

.dot-blue {
  background: #2563eb;
}

.dot-green {
  background: #10b981;
}

.dot-purple {
  background: #a855f7;
}

.dot-orange {
  background: #f59e0b;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #0f172a;
}

.section-sub {
  font-size: 24rpx;
  color: #94a3b8;
}

.body-text {
  font-size: 28rpx;
  color: #0f172a;
  line-height: 1.6;
  white-space: pre-line;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.image-item {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 16rpx;
  overflow: hidden;
  background: #f1f5f9;
  box-shadow: inset 0 0 0 2rpx #e2e8f0;
}

.image-item.bordered {
  box-shadow: inset 0 0 0 2rpx #bfdbfe;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.more-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-text {
  font-size: 44rpx;
  color: #fff;
  font-weight: 700;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  color: #2563eb;
  font-size: 26rpx;
  font-weight: 600;
}

.view-all-icon {
  font-size: 32rpx;
}

.comment-box {
  background: linear-gradient(135deg, #fdf4ff, #eef2ff);
  border-radius: 18rpx;
  padding: 18rpx;
  border: 2rpx solid #e9d5ff;
}

.status-row {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.status-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: linear-gradient(135deg, #10b981, #22d3ee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #fff;
}

.status-detail {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.status-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #0f172a;
}

.status-desc {
  font-size: 24rpx;
  color: #94a3b8;
}

.empty-inline {
  font-size: 26rpx;
  color: #94a3b8;
}
</style>
