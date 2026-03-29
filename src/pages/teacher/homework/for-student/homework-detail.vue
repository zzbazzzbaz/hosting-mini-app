<template>
  <view class="page">
    <PageHeader title="作业详情" :showBack="true" />

    <view v-if="homework" class="content">
      <view class="summary-card compact">
        <view class="summary-top compact-row">
          <view class="subject-chip">{{ homework.subjectName || '未分科目' }}</view>
          <view
            :class="['status-badge', homework.state === 1 ? 'status-completed' : 'status-pending']"
          >
            <text>{{ homework.state === 1 ? '已完成' : '未完成' }}</text>
          </view>
        </view>
        <view class="compact-meta time-row">
          <view class="time-chip">布置时间 {{ homework.homeworkDate || '-' }}</view>
          <view v-if="homework.finishDate" class="time-chip done"
            >实际完成 {{ homework.finishDate }}</view
          >
        </view>
      </view>

      <view class="section-card">
        <view class="section-header section-blue">
          <text class="section-title">作业内容</text>
        </view>
        <view class="section-body">
          <text class="content-text">{{ homework.content || '暂无作业内容' }}</text>
          <view v-if="displayHomeworkImages.length" class="image-grid">
            <view
              v-for="(img, index) in displayHomeworkImages"
              :key="`hw-${img.id || index}`"
              class="image-item"
              @click="previewImages(homework.homeworkImages, index)"
            >
              <image :src="img.url" mode="aspectFill" />
            </view>
          </view>
          <view v-else class="empty-section">暂无作业图片</view>
        </view>
      </view>

      <!-- 完成情况卡片 - 显示完成图片 -->
      <view class="section-card" v-if="homework.isCompleted">
        <view class="section-header section-green">
          <text class="section-title">完成情况</text>
        </view>
        <view class="section-body">
          <view v-if="displayFinishImages.length" class="image-grid">
            <view
              v-for="(img, index) in displayFinishImages"
              :key="`fin-${img.id || index}`"
              class="image-item"
              @click="previewImages(displayFinishImages, index)"
            >
              <image :src="img.url" mode="aspectFill" />
            </view>
          </view>
          <view v-else class="empty-section">暂无提交图片</view>
        </view>
      </view>

      <!-- 教师评语卡片 - 独立显示 -->
      <view class="section-card" v-if="homework.isCompleted">
        <view class="section-header section-blue">
          <text class="section-title">教师评语</text>
        </view>
        <view class="section-body">
          <text class="content-text">{{ displayEvaluation }}</text>
          <view v-if="homework.studentState" class="student-state-row">
            <text class="state-label">学生状态：</text>
            <text class="state-value">{{ homework.studentState }}</text>
          </view>
        </view>
      </view>

      <!-- 未完成状态 - 批改作业表单 -->
      <view class="section-card" v-else>
        <view class="section-header section-orange">
          <text class="section-title">批改作业</text>
        </view>
        <view class="section-body form-body pending-body">
          <!-- 上传完成图片 - 使用3列网格布局 -->
          <view class="section-sub-header">
            <text class="section-sub-title">完成图片</text>
            <text class="section-subtitle">最多可上传9张图片</text>
          </view>
          <view class="upload-grid">
            <view
              v-for="(img, index) in displayFinishImages"
              :key="`up-${img.id || index}`"
              class="upload-item"
            >
              <image
                :src="img.url"
                mode="aspectFill"
                class="upload-image"
                @click="previewImages(displayFinishImages, index)"
              />
              <view class="remove" @tap.stop="removeFinishImage(index)">✕</view>
            </view>
            <view
              v-if="displayFinishImages.length < 9"
              class="upload-item upload-placeholder"
              @tap.stop="chooseFinishImages"
            >
              <view class="upload-placeholder-inner">
                <text class="upload-plus">+</text>
                <text class="upload-text">上传图片</text>
              </view>
            </view>
          </view>

          <!-- 批改意见输入框 -->
          <view class="section-sub-title">批改意见</view>
          <textarea
            v-model="completionForm.evaluation"
            class="input-area"
            placeholder="填写批改意见或完成备注"
            rows="4"
          />

          <!-- 学生状态选择 -->
          <view class="field">
            <text class="field-label">学生状态</text>
            <picker
              class="status-picker"
              :range="studentStateLabels"
              @change="onStudentStateChange"
              :value="pickerValue"
            >
              <view class="picker-box">
                <text>{{ currentStudentStateLabel }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>

          <!-- 提交按钮 -->
          <button class="complete-btn" :disabled="submitting" @tap="handleComplete">
            {{ submitting ? '提交中...' : '作业完成' }}
          </button>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">📄</text>
      <text class="empty-text">未找到对应的作业信息</text>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import {
  addHomeworkEvaluation,
  getTeacherHomeworkDetail,
  uploadTeacherHomeworkImage,
} from '@/api/teacher/homework'
import { getStudentStatusComboxList } from '@/api/common/dictionary'

const DEFAULT_EVALUATION =
  '学生'

const homeworkId = ref('')
const homework = ref(null)
const submitting = ref(false)

const studentInfo = ref({
  name: '',
  school: '',
  grade: '',
  class: '',
})

const completionForm = reactive({
  evaluation: '',
  studentState: '',
})

const studentStates = ref([])
const studentStateIndex = ref(-1)
const finishImages = ref([])

const studentStateLabels = computed(() => studentStates.value.map((item) => item.name || ''))
const currentStudentStateLabel = computed(() => {
  if (studentStateIndex.value < 0) return '请选择学生状态'
  return studentStateLabels.value[studentStateIndex.value] || '请选择学生状态'
})
const pickerValue = computed(() =>
  studentStateIndex.value >= 0 ? studentStateIndex.value : 0
)

const isCompleted = computed(() => homework.value?.isCompleted || homework.value?.state === 1)
const displayEvaluation = computed(() => homework.value?.evaluation || DEFAULT_EVALUATION)
const displayHomeworkImages = computed(() => (homework.value?.homeworkImages || []).slice(0, 9))
const displayFinishImages = computed(() => finishImages.value || [])

const finishPicIds = computed(() =>
  (finishImages.value || [])
    .map((item) => item.id)
    .filter((id) => id || id === 0)
    .join(',')
)

const loadStudentStates = async () => {
  try {
    const res = await getStudentStatusComboxList()
    studentStates.value = (res || [])
      .map((item) => ({
        id: item.id ?? item.value ?? '',
        name: item.name ?? item.label ?? item.text ?? '',
      }))
      .filter((item) => item.name)
  } catch (error) {
    console.error('获取学生状态失败', error)
  }
}

const syncStudentStateIndex = () => {
  const idx = studentStates.value.findIndex((item) => item.id === completionForm.studentState)
  studentStateIndex.value = idx >= 0 ? idx : -1
}

const loadDetail = async (id) => {
  try {
    const res = await getTeacherHomeworkDetail(id)
    homework.value = res?.data || null
    completionForm.evaluation = res?.data?.evaluation || DEFAULT_EVALUATION
    completionForm.studentState = res?.data?.studentState ?? ''
    finishImages.value = res?.data?.finishImages || []
    syncStudentStateIndex()
  } catch (error) {
    console.error('获取作业详情失败', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

const previewImages = async (list, index = 0) => {
  const urls = (list || []).map((img) => img.url || img.path).filter(Boolean)
  if (!urls.length) return
  await uni.previewImage({
    current: urls[index] || urls[0],
    urls,
  })
}

const onStudentStateChange = (e) => {
  studentStateIndex.value = Number(e.detail.value)
  completionForm.studentState = studentStates.value[studentStateIndex.value]?.id ?? ''
}

const handleComplete = async () => {
  if (!homework.value?.id) return
  if (isCompleted.value) {
    await uni.showToast({ title: '该作业已完成', icon: 'none' })
    return
  }
  const hasStudentState =
    completionForm.studentState !== '' &&
    completionForm.studentState !== null &&
    completionForm.studentState !== undefined
  if (!hasStudentState) {
    await uni.showToast({ title: '请选择学生状态', icon: 'none' })
    return
  }
  submitting.value = true
  try {
    await addHomeworkEvaluation({
      homeworkId: homework.value.id,
      evaluation: completionForm.evaluation || DEFAULT_EVALUATION,
      studentState: completionForm.studentState,
      finishpicids: finishPicIds.value || undefined,
    })
    await uni.showToast({ title: '作业已完成', icon: 'success' })
    await loadDetail(homework.value.id)
  } catch (error) {
    console.error('提交作业完成状态失败', error)
    await uni.showToast({ title: '提交失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

const chooseFinishImages = () => {
  const remain = 9 - finishImages.value.length
  if (remain <= 0) {
    uni.showToast({ title: '最多上传9张图片', icon: 'none' })
    return
  }
  uni.chooseImage({
    count: remain,
    success: async (res) => {
      const paths = res.tempFilePaths || []
      if (!paths.length) return
      await uni.showLoading({ title: '上传中', mask: true })
      try {
        for (const path of paths) {
          const uploadRes = await uploadTeacherHomeworkImage(path)
          if (uploadRes?.data?.id) {
            finishImages.value = [
              ...finishImages.value,
              {
                id: uploadRes.data.id,
                url: uploadRes.data.url || uploadRes.data.imgpath,
                path: uploadRes.data.imgpath,
              },
            ]
          }
        }
      } catch (error) {
        console.error('上传完成图片失败', error)
        await uni.showToast({ title: '上传失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
  })
}

const removeFinishImage = (index) => {
  const next = [...finishImages.value]
  next.splice(index, 1)
  finishImages.value = next
}

onLoad(async (options) => {
  homeworkId.value = options.id || options.homeworkId || ''
  studentInfo.value = {
    name: options.studentName ? decodeURIComponent(options.studentName) : '',
    school: options.schoolName ? decodeURIComponent(options.schoolName) : '',
    grade: options.gradeName ? decodeURIComponent(options.gradeName) : '',
    class: options.clazzName ? decodeURIComponent(options.clazzName) : '',
  }

  await loadStudentStates()
  if (homeworkId.value) {
    await loadDetail(homeworkId.value)
  }
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
  gap: 12rpx;
}

.summary-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
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

.student-row {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.student-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
}

.student-meta {
  font-size: 26rpx;
  color: #6b7280;
}

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
  line-height: 1.5;
  white-space: pre-wrap;
}

.section-blue {
  background: linear-gradient(135deg, #60a5fa, #2563eb);
}

.section-green {
  background: linear-gradient(135deg, #34d399, #059669);
}

.section-orange {
  background: linear-gradient(135deg, #fb923c, #f97316);
}

/* 学生状态行样式 - 与其他内容保持一致 */
.student-state-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-top: 8rpx;
}

.student-state-row .state-label {
  font-size: 26rpx;
  font-weight: 600;
  color: #6b7280;
}

.student-state-row .state-value {
  font-size: 26rpx;
  color: #0ea5e9;
  font-weight: 500;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

/* 上传图片网格 - 3列布局 */
.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

/* 上传项容器 */
.upload-item {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 12rpx;
  overflow: hidden;
  background: #f9fafb;
  border: 2rpx dashed #d1d5db;
}

/* 已上传的图片 */
.upload-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 上传占位符 */
.upload-placeholder {
  position: relative;
  border-style: dashed;
}

.upload-placeholder-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 0 12rpx;
  color: #9ca3af;
  text-align: center;
}

.upload-plus {
  font-size: 48rpx;
  line-height: 1;
}

.upload-text {
  font-size: 24rpx;
}

/* 删除图片按钮 */
.remove {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
}

/* 小节标题 */
.section-sub-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4rpx;
}

/* 小节标题容器 - 左右布局 */
.section-sub-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

/* 副标题样式 - 右对齐的灰色小字 */
.section-subtitle {
  font-size: 24rpx;
  color: #6b7280;
}

.image-item {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 12rpx;
}

.image-item image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12rpx;
}

.upload-area {
  width: 100%;
  border: 2rpx dashed #f59e0b;
  border-radius: 12rpx;
  background: #fffaf0;
  padding: 12rpx;
}

.empty-section {
  text-align: center;
  color: #9ca3af;
  font-size: 26rpx;
}

.form-body {
  gap: 24rpx;
}

.pending-body {
  gap: 32rpx;
}

.pending-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.6;
}

.input-area {
  width: 100%;
  min-height: 160rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 16rpx;
  font-size: 26rpx;
  color: #111827;
  box-sizing: border-box;
}

.field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 26rpx;
  color: #374151;
}

.status-picker {
  flex: 1;
  margin-left: 16rpx;
}

.picker-box {
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #374151;
}

.arrow {
  font-size: 22rpx;
  color: #9ca3af;
  margin-left: 12rpx;
}

.complete-btn {
  width: 100%;
  background: linear-gradient(135deg, #34d399, #10b981);
  color: #fff;
  border: none;
  border-radius: 16rpx;
  padding: 16rpx;
  font-size: 28rpx;
}

.complete-btn:disabled {
  opacity: 0.7;
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
