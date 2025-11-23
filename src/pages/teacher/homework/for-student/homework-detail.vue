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
          <view class="time-chip">布置 {{ homework.homeworkDate || '-' }}</view>
          <view v-if="homework.finishDate" class="time-chip done"
            >完成 {{ homework.finishDate }}</view
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

      <view class="section-card" v-if="homework.isCompleted">
        <view class="section-header section-green">
          <text class="section-title">完成情况</text>
        </view>
        <view class="section-body">
          <view v-if="homework.finishImages.length" class="image-grid">
            <view
              v-for="(img, index) in homework.finishImages"
              :key="`fin-${img.id || index}`"
              class="image-item"
              @click="previewImages(homework.finishImages, index)"
            >
              <image :src="img.url" mode="aspectFill" />
            </view>
          </view>
          <view v-else class="empty-section">暂无提交图片</view>
          <view class="evaluation">
            <text class="evaluation-label">教师评价</text>
            <text class="evaluation-text">{{ displayEvaluation }}</text>
            <text v-if="homework.studentState" class="evaluation-text"
              >学生状态：{{ homework.studentState }}</text
            >
          </view>
        </view>
      </view>

      <view class="section-card" v-else>
        <view class="section-header section-orange">
          <text class="section-title">等待完成</text>
        </view>
        <view class="section-body form-body">
          <textarea
            v-model="completionForm.evaluation"
            class="input-area"
            placeholder="填写批改意见或完成备注"
            rows="4"
          />
          <view class="field">
            <text class="field-label">学生状态</text>
            <picker
              class="status-picker"
              :range="studentStateLabels"
              @change="onStudentStateChange"
              :value="studentStateIndex"
            >
              <view class="picker-box">
                <text>{{ currentStudentStateLabel }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
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

    <TeacherTabBar activeTab="homework" />
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'
import { addHomeworkEvaluation, getTeacherHomeworkDetail } from '@/api/teacher/homework'
import { getStudentStatusComboxList } from '@/api/common/dictionary'

const DEFAULT_EVALUATION =
  '学生晚托纪律很好，没有交头接耳，自己专注做作业，能够按要求独立完成作业。理解能力强，计算准确率高，书写比较美观，继续加油！'

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

const studentStates = ref([{ id: '', name: '不选择状态' }])
const studentStateIndex = ref(0)

const studentStateLabels = computed(() => studentStates.value.map((item) => item.name || ''))
const currentStudentStateLabel = computed(
  () => studentStateLabels.value[studentStateIndex.value] || '不选择状态'
)

const isCompleted = computed(() => homework.value?.isCompleted || homework.value?.state === 1)
const displayEvaluation = computed(() => homework.value?.evaluation || DEFAULT_EVALUATION)
const displayHomeworkImages = computed(() => (homework.value?.homeworkImages || []).slice(0, 3))

const finishPicIds = computed(() =>
  (homework.value?.finishImages || [])
    .map((item) => item.id)
    .filter((id) => id || id === 0)
    .join(',')
)

const loadStudentStates = async () => {
  try {
    const res = await getStudentStatusComboxList()
    studentStates.value = [
      { id: '', name: '不选择状态' },
      ...(res || []).map((item) => ({
        id: item.id ?? item.value ?? '',
        name: item.name ?? item.label ?? item.text ?? '',
      })),
    ].filter((item) => item.name)
  } catch (error) {
    console.error('获取学生状态失败', error)
  }
}

const syncStudentStateIndex = () => {
  const idx = studentStates.value.findIndex((item) => item.id == completionForm.studentState)
  studentStateIndex.value = idx >= 0 ? idx : 0
}

const loadDetail = async (id) => {
  try {
    const res = await getTeacherHomeworkDetail(id)
    homework.value = res?.data || null
    completionForm.evaluation = res?.data?.evaluation || DEFAULT_EVALUATION
    completionForm.studentState = res?.data?.studentState ?? ''
    syncStudentStateIndex()
  } catch (error) {
    console.error('获取作业详情失败', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

const previewImages = async (list, index = 0) => {
  const urls = (list || []).map((img) => img.url || img.path).filter(Boolean)
  if (!urls.length) return
  uni.previewImage({
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
  submitting.value = true
  try {
    await addHomeworkEvaluation({
      homeworkId: homework.value.id,
      evaluation: completionForm.evaluation || DEFAULT_EVALUATION,
      studentState: completionForm.studentState || undefined,
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

.empty-section {
  text-align: center;
  color: #9ca3af;
  font-size: 26rpx;
}

.evaluation {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  color: #374151;
}

.evaluation-label {
  font-weight: 600;
  font-size: 26rpx;
}

.evaluation-text {
  font-size: 26rpx;
  color: #111827;
}

.evaluation-text.muted {
  color: #9ca3af;
}

.form-body {
  gap: 24rpx;
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
