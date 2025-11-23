<template>
  <view class="publish-form">
    <view class="section">
      <view class="section-header">
        <text class="section-title">基础信息</text>
        <text class="section-subtitle">{{ sectionSubtitle }}</text>
      </view>
      <view class="field">
        <text class="field-label">布置对象</text>
        <picker
          v-if="normalizedTargets.length"
          :range="normalizedTargets"
          range-key="name"
          :value="targetIndex"
          @change="onTargetChange"
        >
          <view class="picker">
            <text>{{ targetName }}</text>
            <text class="picker-icon">▼</text>
          </view>
        </picker>
        <text v-else class="field-value">{{ targetName }}</text>
      </view>
      <view v-if="showDate" class="field">
        <text class="field-label">布置日期</text>
        <picker mode="date" :value="form.date" @change="onDateChange">
          <view class="picker">
            <text>{{ form.date }}</text>
            <text class="picker-icon">📅</text>
          </view>
        </picker>
      </view>
      <view class="field">
        <text class="field-label">科目</text>
        <picker :range="subjectNames" @change="onSubjectChange">
          <view class="picker">
            <text>{{ form.subject || '请选择科目' }}</text>
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
        <text class="section-subtitle">上传配图或附件（可选）</text>
      </view>
      <view class="upload-grid">
        <view v-for="(img, index) in form.images" :key="img" class="upload-item">
          <image :src="img" mode="aspectFill" class="upload-image" />
          <view class="remove" @click="removeImage(index)">✕</view>
        </view>
        <view class="upload-item upload-placeholder" @click="chooseImage">
          <text class="upload-plus">+</text>
          <text class="upload-text">上传图片</text>
        </view>
      </view>
    </view>

    <button class="submit" :disabled="isSubmitting" @click="handleSubmit">
      {{ isSubmitting ? '发布中...' : '发布作业' }}
    </button>
  </view>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  studentName: {
    type: String,
    default: '',
  },
  initialForm: {
    type: Object,
    default: () => ({}),
  },
  subjects: {
    type: Array,
    default: () => ['语文', '数学', '英语', '科学', '美术', '音乐'],
  },
  submitting: {
    type: Boolean,
    default: false,
  },
  targetOptions: {
    type: Array,
    default: () => [],
  },
  showDate: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['submit', 'choose-image', 'remove-image', 'target-change'])

const sectionSubtitle = computed(() =>
  props.showDate ? '确认布置对象与时间' : '确认布置对象'
)

const normalizedTargets = computed(() =>
  (props.targetOptions || [])
    .map((item) => ({
      id: item.id ?? item.value ?? item.key ?? '',
      name: item.name ?? item.label ?? item.text ?? '',
    }))
    .filter((item) => item.id || item.name)
)

const normalizedSubjects = computed(() =>
  (props.subjects || []).map((item) => ({
    id: typeof item === 'string' ? item : (item.id ?? item.value ?? ''),
    name: typeof item === 'string' ? item : (item.name ?? item.label ?? ''),
  }))
)

const subjectNames = computed(() => normalizedSubjects.value.map((item) => item.name))

const createDefaultForm = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return {
    date: `${year}-${month}-${day}`,
    subject: '',
    subjectId: '',
    content: '',
    images: [],
  }
}

const form = reactive(createDefaultForm())

const selectedTargetName = ref('')
const targetIndex = ref(0)

const targetName = computed(() => {
  const picked = selectedTargetName.value || props.studentName
  if (picked) return picked
  return normalizedTargets.value[targetIndex.value]?.name || '请选择布置对象'
})

const applyInitialForm = (payload) => {
  const next = { ...createDefaultForm(), ...(payload || {}) }
  Object.assign(form, next)
}

watch(
  () => props.initialForm,
  (value) => {
    applyInitialForm(value)
  },
  { immediate: true, deep: true }
)

const isSubmitting = computed(() => props.submitting)

const onDateChange = (event) => {
  form.date = event.detail.value
}

const onSubjectChange = (event) => {
  const index = Number(event.detail.value)
  const subject = normalizedSubjects.value[index] || {}
  form.subject = subject.name || ''
  form.subjectId = subject.id || ''
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

watch(
  () => props.studentName,
  (value) => {
    selectedTargetName.value = value || ''
  },
  { immediate: true }
)

watch(
  normalizedTargets,
  (value) => {
    const idx = value.findIndex((item) => item.name === selectedTargetName.value)
    targetIndex.value = idx >= 0 ? idx : 0
  },
  { immediate: true }
)

const chooseImage = () => {
  if (form.images.length >= 6) {
    uni.showToast({ title: '最多上传6张图片', icon: 'none' })
    return
  }
  uni.chooseImage({
    count: 6 - form.images.length,
    success: (res) => {
      const paths = res.tempFilePaths || []
      form.images = [...form.images, ...paths].slice(0, 6)
      emit('choose-image', form.images)
    },
  })
}

const removeImage = (index) => {
  const next = [...form.images]
  next.splice(index, 1)
  form.images = next
  emit('remove-image', form.images)
}

const onTargetChange = (event) => {
  const index = Number(event.detail.value)
  targetIndex.value = index
  const target = normalizedTargets.value[index]
  selectedTargetName.value = target?.name || ''
  if (target) {
    emit('target-change', target)
  }
}

const handleSubmit = () => {
  if (!form.subject) {
    uni.showToast({ title: '请选择科目', icon: 'none' })
    return
  }
  if (!form.content.trim()) {
    uni.showToast({ title: '请输入作业内容', icon: 'none' })
    return
  }
  emit('submit', { ...form })
}
</script>

<style scoped>
.publish-form {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding: 48rpx 40rpx 80rpx;
  box-sizing: border-box;
}

.section {
  background: #ffffff;
  border-radius: 28rpx;
  box-shadow: 0 6rpx 24rpx rgba(14, 165, 233, 0.08);
  padding: 36rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #0f172a;
}

.section-subtitle {
  font-size: 24rpx;
  color: #64748b;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.field-label {
  font-size: 26rpx;
  font-weight: 500;
  color: #1f2937;
}

.field-value {
  font-size: 28rpx;
  color: #0ea5e9;
  font-weight: 600;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f9ff;
  border: 2rpx solid #bae6fd;
  border-radius: 16rpx;
  padding: 18rpx 20rpx;
  font-size: 28rpx;
  color: #0f172a;
}

.picker:active {
  border-color: #0ea5e9;
  background: #e0f2fe;
}

.picker-icon {
  font-size: 28rpx;
  color: #38bdf8;
}

.textarea {
  width: 100%;
  min-height: 240rpx;
  padding: 20rpx;
  border: 2rpx solid #e2e8f0;
  border-radius: 16rpx;
  background: #f8fafc;
  font-size: 28rpx;
  color: #0f172a;
  box-sizing: border-box;
}

.textarea:focus {
  border-color: #0ea5e9;
  background: #ffffff;
}

.counter {
  display: flex;
  justify-content: flex-end;
  font-size: 24rpx;
  color: #94a3b8;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
}

.upload-item {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 16rpx;
  overflow: hidden;
  background: #f8fafc;
  border: 2rpx dashed #e2e8f0;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  color: #94a3b8;
}

.upload-placeholder:active {
  border-color: #0ea5e9;
  color: #0ea5e9;
}

.upload-plus {
  font-size: 40rpx;
  font-weight: 700;
}

.upload-text {
  font-size: 24rpx;
  margin-top: 8rpx;
}

.upload-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.remove {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 18rpx;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.submit {
  margin-top: 12rpx;
  width: 100%;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 24rpx;
  font-size: 32rpx;
  font-weight: 700;
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.25);
}

.submit:active {
  opacity: 0.9;
}

.submit:disabled {
  opacity: 0.5;
}
</style>
