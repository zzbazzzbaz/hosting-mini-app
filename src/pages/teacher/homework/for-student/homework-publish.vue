<template>
  <view class="page">
    <PageHeader :title="headerTitle" :showBack="true" />
    <view class="content">
      <view class="publish-form">
        <!-- 基本信息 -->
        <view class="section">
          <!-- 科目选择（必填） -->
          <view class="field">
            <text class="field-label">科目<text style="color: #ef4444">*</text></text>
            <picker :range="subjectNames" @change="onSubjectChange">
              <view class="picker subject-picker">
                <text class="picker-label" :style="{ color: form.subject ? '#111827' : '#9ca3af' }">
                  {{ form.subject || '请选择科目' }}
                </text>
                <text class="picker-icon">▼</text>
              </view>
            </picker>
          </view>

          <!-- 作业完成时间（必填） -->
          <view class="field">
            <text class="field-label">作业完成时间<text style="color: #ef4444">*</text></text>
            <picker mode="date" :value="form.homeworkTime" @change="onDateChange">
              <view class="picker date-picker">
                <text
                  class="picker-label"
                  :style="{ color: form.homeworkTime ? '#111827' : '#9ca3af' }"
                >
                  {{ form.homeworkTime || '请选择日期' }}
                </text>
                <text class="picker-icon">▼</text>
              </view>
            </picker>
          </view>
        </view>

        <view class="section">
          <view class="section-header">
            <text class="section-title">作业内容</text>
            <text class="section-subtitle">描述具体任务与要求</text>
          </view>
          <textarea
            v-model="form.content"
            class="textarea"
            placeholder="请输入作业内容，例如需要完成的题目、提交方式等"
            rows="5"
          ></textarea>
          <view class="counter">
            <text>{{ form.content.length }}/500</text>
          </view>
        </view>

        <view class="section">
          <view class="section-header">
            <text class="section-title">参考资料</text>
            <text class="section-subtitle">最多可上传9张图片</text>
          </view>
          <view class="upload-grid">
            <view v-for="(img, index) in form.images" :key="img" class="upload-item">
              <image :src="img" mode="aspectFill" class="upload-image" />
              <view class="remove" @click="removeImage(index)">✕</view>
            </view>
            <view
              v-if="form.images.length < 9"
              class="upload-item upload-placeholder"
              @click="chooseImage"
            >
              <view class="upload-placeholder-inner">
                <text class="upload-plus">+</text>
                <text class="upload-text">上传图片</text>
              </view>
            </view>
          </view>
        </view>

        <button class="submit" :disabled="submitting" @click="handleSubmit">
          {{ submitting ? '发布中...' : '发布作业' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import { addTeacherHomework, uploadTeacherHomeworkImage } from '@/api/teacher/homework'
import { getSubjectComboxList } from '@/api/common/dictionary'

const studentName = ref('')
const studentId = ref('')
const submitting = ref(false)
const subjectOptions = ref([])
const initialForm = ref({})
const imageIdMap = ref({})

// 创建默认表单数据
const createDefaultForm = () => ({
  subject: '', // 默认为空，显示占位文本
  subjectId: '', // 科目ID
  homeworkTime: '', // 作业完成时间（必填）
  content: '', // 作业内容
  images: [], // 图片列表
})

const form = reactive(createDefaultForm())

const headerTitle = computed(() =>
  studentName.value ? `发布作业给 ${studentName.value}` : '发布作业'
)

const subjects = computed(() => subjectOptions.value)

const normalizedSubjects = computed(() =>
  (subjects.value || []).map((item) => ({
    id: item.id ?? item.value ?? '',
    name: item.name ?? item.label ?? item.text ?? '',
  }))
)

const subjectNames = computed(() => normalizedSubjects.value.map((item) => item.name))

const normalizeOptions = (list = []) =>
  list
    .map((item) => ({
      id: item.id ?? item.value ?? '',
      name: item.name ?? item.label ?? item.text ?? '',
    }))
    .filter((item) => item.id || item.name)

const fetchSubjects = async () => {
  try {
    const res = await getSubjectComboxList()
    subjectOptions.value = normalizeOptions(res || [])
  } catch (error) {
    console.error('获取科目失败', error)
    await uni.showToast({ title: '科目加载失败', icon: 'none' })
  }
}

const syncImageMap = (images = []) => {
  const current = { ...imageIdMap.value }
  Object.keys(current).forEach((path) => {
    if (!images.includes(path)) {
      delete current[path]
    }
  })
  imageIdMap.value = current
}

const uploadMissingImages = async (paths = []) => {
  const missing = paths.filter((path) => !imageIdMap.value[path])
  if (!missing.length) return

  uni.showLoading({ title: '上传图片中', mask: true })
  try {
    for (const path of missing) {
      const res = await uploadTeacherHomeworkImage(path)
      const id = res?.data?.id
      if (id !== undefined && id !== null) {
        imageIdMap.value = { ...imageIdMap.value, [path]: id }
      }
    }
  } finally {
    uni.hideLoading()
  }
}

const findSubjectId = () => {
  if (form.subjectId) return form.subjectId
  const matched = normalizedSubjects.value.find((item) => item.name === form.subject) || {}
  return matched.id || ''
}

/**
 * 处理表单提交
 * 验证必填字段并发布作业
 */
const handleSubmit = async () => {
  // 防止重复提交
  if (submitting.value) return

  // 验证学生信息
  if (!studentId.value) {
    await uni.showToast({ title: '缺少学生信息', icon: 'none' })
    return
  }

  // 验证科目必选
  if (!form.subject || !form.subject.trim()) {
    await uni.showToast({ title: '请选择科目', icon: 'none' })
    return
  }

  // 验证作业完成时间必选
  if (!form.homeworkTime || !form.homeworkTime.trim()) {
    await uni.showToast({ title: '请选择作业完成时间', icon: 'none' })
    return
  }

  // 验证作业内容必填
  if (!form.content.trim()) {
    await uni.showToast({ title: '请输入作业内容', icon: 'none' })
    return
  }

  // 获取并验证科目ID
  const subjectId = findSubjectId()
  if (!subjectId) {
    await uni.showToast({ title: '科目信息无效，请重新选择', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    const images = form.images || []
    await uploadMissingImages(images)
    const workpicids = images
      .map((path) => imageIdMap.value[path])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .join(',')

    await addTeacherHomework({
      studentId: studentId.value,
      content: (form.content || '').trim(),
      workpicids,
      subjectId,
      homeworkTime2: form.homeworkTime,
    })

    await uni.showToast({ title: '发布成功', icon: 'success' })

    uni.navigateBack()
  } catch (error) {
    console.error('发布作业失败', error)
    await uni.showToast({ title: '发布失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

onLoad((options) => {
  studentId.value = options.studentId || ''
  studentName.value = options.studentName
    ? decodeURIComponent(options.studentName)
    : options.name
      ? decodeURIComponent(options.name)
      : ''

  if (options.subject) {
    initialForm.value = {
      ...initialForm.value,
      subject: decodeURIComponent(options.subject),
    }
  }

  fetchSubjects()
})

watch(
  () => initialForm.value,
  (value) => {
    Object.assign(form, { ...createDefaultForm(), ...(value || {}) })
  },
  { immediate: true, deep: true }
)

/**
 * 处理科目选择变化
 * 更新表单中的科目名称和ID
 */
const onSubjectChange = (event) => {
  const index = Number(event.detail.value)
  const subject = normalizedSubjects.value[index] || {}
  form.subject = subject.name || ''
  form.subjectId = subject.id || ''
}

/**
 * 处理日期选择变化
 * 更新作业完成时间
 */
const onDateChange = (event) => {
  form.homeworkTime = event.detail.value
}

watch(
  () => form.content,
  (value) => {
    if (value.length > 500) {
      form.content = value.slice(0, 500)
      uni.showToast({ title: '内容最多500字', icon: 'none' })
    }
  }
)

const chooseImage = () => {
  if (form.images.length >= 9) {
    uni.showToast({ title: '最多上传9张图片', icon: 'none' })
    return
  }
  uni.chooseImage({
    count: 9 - form.images.length,
    success: async (res) => {
      const paths = res.tempFilePaths || []
      const next = [...form.images, ...paths].slice(0, 9)
      form.images = next
      try {
        await uploadMissingImages(form.images)
      } catch (error) {
        console.error('上传图片失败', error)
        await uni.showToast({ title: '图片上传失败', icon: 'none' })
      }
    },
  })
}

const removeImage = (index) => {
  const next = [...form.images]
  next.splice(index, 1)
  form.images = next
  syncImageMap(form.images)
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
}

.content {
  padding-bottom: 120rpx;
}

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding: 48rpx 40rpx 80rpx;
  box-sizing: border-box;
}

.section {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.section-subtitle {
  font-size: 24rpx;
  color: #6b7280;
}

.field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.field-label {
  min-width: 140rpx;
  font-size: 26rpx;
  color: #374151;
}

/* 下拉选择器 - 优化后的样式 */
.picker {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  background: linear-gradient(135deg, #f0f9ff, #ffffff);
  border: 2rpx solid #bfdbfe;
  border-radius: 20rpx;
  color: #111827;
  font-size: 28rpx;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(14, 165, 233, 0.08);
}

.subject-picker {
  position: relative;
}

/* 悬停效果（H5端） */
.picker:hover {
  border-color: #0ea5e9;
  box-shadow: 0 6rpx 16rpx rgba(14, 165, 233, 0.15);
}

.picker-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: #111827;
}

/* 未选择状态的占位文本样式 */
.picker-label:empty::after {
  content: attr(data-placeholder);
  color: #9ca3af;
  font-weight: 400;
}

.picker-icon {
  font-size: 24rpx;
  color: #0ea5e9;
  margin-left: 16rpx;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.textarea {
  width: 100%;
  min-height: 220rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  padding: 16rpx;
  font-size: 26rpx;
  color: #111827;
  box-sizing: border-box;
}

.counter {
  text-align: right;
  color: #9ca3af;
  font-size: 22rpx;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

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

.upload-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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

.submit {
  width: 100%;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  border-radius: 16rpx;
  padding: 18rpx;
  font-size: 30rpx;
  box-shadow: 0 8rpx 16rpx rgba(37, 99, 235, 0.25);
}

.submit:disabled {
  opacity: 0.7;
}
</style>
