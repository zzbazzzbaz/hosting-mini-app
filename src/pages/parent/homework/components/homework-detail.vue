<template>
  <view class="page">
    <PageHeader title="作业详情" :showBack="true" />

    <view v-if="loading" class="content">
      <view class="empty-state">
        <text class="empty-text">正在加载作业...</text>
      </view>
    </view>

    <view v-else-if="!detail" class="content">
      <view class="empty-state">
        <text class="empty-icon">📄</text>
        <text class="empty-text">未找到作业信息</text>
      </view>
    </view>

    <view v-else class="content">
      <!-- 摘要卡片 -->
      <view class="summary-card compact">
        <view class="summary-top compact-row">
          <view class="subject-chip">{{ detail.subjectName || '未分科目' }}</view>
          <view
            :class="['status-badge', detail.state === 1 ? 'status-completed' : 'status-pending']"
          >
            <text>{{ detail.state === 1 ? '已完成' : '未完成' }}</text>
          </view>
        </view>
        <view class="compact-meta time-row">
          <view class="time-chip">期望完成 {{ detail.homeworkDate || '-' }}</view>
          <view v-if="detail.finishDate" class="time-chip done"
            >实际完成 {{ detail.finishDate }}</view
          >
        </view>
      </view>

      <!-- 作业内容卡片 -->
      <view class="section-card">
        <view class="section-header section-blue">
          <text class="section-title">作业内容</text>
        </view>
        <view class="section-body">
          <text class="content-text">{{ detail.content || '暂无作业内容' }}</text>
          <view v-if="requirementImages.length" class="image-grid">
            <view
              v-for="(img, index) in requirementImages"
              :key="`req-${index}`"
              class="image-item"
              @click="previewRequirementImage(index)"
            >
              <image :src="img" mode="aspectFill" />
            </view>
          </view>
          <view v-else class="empty-section">暂无作业图片</view>
        </view>
      </view>

      <!-- 学生作答卡片 - 仅已完成状态显示 -->
      <view v-if="detail.state === 1" class="section-card">
        <view class="section-header section-green">
          <text class="section-title">学生作答</text>
        </view>
        <view class="section-body">
          <view v-if="homeworkImages.length" class="image-grid">
            <view
              v-for="(img, index) in homeworkImages"
              :key="`hw-${index}`"
              class="image-item"
              @click="previewHomeworkImage(index)"
            >
              <image :src="img" mode="aspectFill" />
            </view>
          </view>
          <view v-else class="empty-section">学生尚未提交作答</view>
        </view>
      </view>

      <!-- 教师评语卡片 - 仅已完成状态显示 -->
      <view v-if="detail.state === 1" class="section-card">
        <view class="section-header section-purple">
          <text class="section-title">教师评语</text>
        </view>
        <view class="section-body">
          <text class="content-text">{{ detail.evaluation || '老师暂未填写评语' }}</text>
          <view v-if="detail.studentState" class="student-state-row">
            <text class="state-label">学生状态：</text>
            <text class="state-value">{{ detail.studentState }}</text>
          </view>
        </view>
      </view>
    </view>

    <ParentTabBar activeTab="homework" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'
import { getHomeworkDetail } from '@/api/parent/homework'

// 响应式数据
const detail = ref(null)
const loading = ref(false)
const homeworkImages = ref([])
const requirementImages = ref([])

/**
 * 预览图片列表
 * @param {Array} images - 图片URL数组
 * @param {Number} current - 当前索引
 */
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

// 预览学生作答图片
const previewHomeworkImage = (index) => previewImages(homeworkImages.value, index)
// 预览作业要求图片
const previewRequirementImage = (index) => previewImages(requirementImages.value, index)

/**
 * 加载作业详情
 * @param {String} homeworkId - 作业ID
 */
const fetchDetail = async (homeworkId) => {
  loading.value = true
  try {
    const res = await getHomeworkDetail(homeworkId)
    detail.value = res?.data || null
    // 解析作业要求图片（homeworkImages字段）
    requirementImages.value = (res?.data?.homeworkImages || []).map((item) => item.url || item.path)
    // 解析学生完成图片（finishImages字段）
    homeworkImages.value = (res?.data?.finishImages || []).map((item) => item.url || item.path)
  } catch (error) {
    console.error('加载作业详情失败', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1200)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取作业详情
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
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 144rpx 0 120rpx;
}

.content {
  padding: 0 48rpx 48rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 摘要卡片 */
.summary-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 22rpx rgba(14, 165, 233, 0.18);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.summary-card.compact {
  gap: 20rpx;
}

.summary-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
}

.subject-chip {
  padding: 10rpx 20rpx;
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
  color: #fff;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.status-badge {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
}

.status-completed {
  background: #10b981;
}

.status-pending {
  background: #f97316;
}

.compact-meta {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.time-row {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12rpx;
}

.time-chip {
  padding: 8rpx 16rpx;
  background: #f3f4f6;
  color: #374151;
  border-radius: 999rpx;
  font-size: 24rpx;
}

.time-chip.done {
  background: #dcfce7;
  color: #166534;
}

/* 卡片样式 */
.section-card {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.06);
}

.section-header {
  padding: 20rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
}

.section-sub {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.section-body {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.content-text {
  font-size: 28rpx;
  color: #0f172a;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 颜色主题 */
.section-blue {
  background: linear-gradient(135deg, #60a5fa, #2563eb);
}

.section-green {
  background: linear-gradient(135deg, #34d399, #059669);
}

.section-purple {
  background: linear-gradient(135deg, #c084fc, #a855f7);
}

/* 学生状态行 */
.student-state-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-top: 8rpx;
  padding-top: 16rpx;
  border-top: 2rpx solid #e5e7eb;
}

.state-label {
  font-size: 26rpx;
  font-weight: 600;
  color: #6b7280;
}

.state-value {
  font-size: 26rpx;
  color: #0ea5e9;
  font-weight: 500;
}

/* 图片网格 - 3列布局 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.image-item {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 12rpx;
  background: #f9fafb;
}

.image-item image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 空状态 */
.empty-section {
  text-align: center;
  color: #9ca3af;
  font-size: 26rpx;
  padding: 24rpx 0;
}

.empty-state {
  padding: 120rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  color: #9ca3af;
}

.empty-icon {
  font-size: 52rpx;
}

.empty-text {
  font-size: 26rpx;
}
</style>
