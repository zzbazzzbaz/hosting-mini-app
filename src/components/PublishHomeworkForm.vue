<template>
  <view class="publish-form">
    <view class="section">
      <view class="section-header">
        <text class="section-title">基础信息</text>
        <text class="section-subtitle">确认布置对象与时间</text>
      </view>
      <view class="field">
        <text class="field-label">布置对象</text>
        <text class="field-value">{{ targetName }}</text>
      </view>
      <view class="field">
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
        <picker :range="subjects" @change="onSubjectChange">
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
import { computed, reactive, watch } from 'vue'

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
})

const emit = defineEmits(['submit', 'choose-image', 'remove-image'])

const createDefaultForm = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return {
    date: `${year}-${month}-${day}`,
    subject: '',
    content: '',
    images: [],
  }
}

const form = reactive(createDefaultForm())

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

const targetName = computed(() => (props.studentName ? `${props.studentName}` : '请选择布置对象'))

const isSubmitting = computed(() => props.submitting)

const onDateChange = (event) => {
  form.date = event.detail.value
}

const onSubjectChange = (event) => {
  const index = event.detail.value
  form.subject = props.subjects[index] || ''
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
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  font-size: 28rpx;
  color: #0f172a;
  box-sizing: border-box;
}

.picker-icon {
  font-size: 28rpx;
  color: #0ea5e9;
  margin-left: 16rpx;
}

.textarea {
  width: 100%;
  min-height: 240rpx;
  background: #f8fafc;
  border: 2rpx solid #e2e8f0;
  border-radius: 20rpx;
  padding: 28rpx 32rpx;
  font-size: 28rpx;
  color: #1f2937;
  box-sizing: border-box;
  line-height: 1.6;
}

.counter {
  display: flex;
  justify-content: flex-end;
  font-size: 22rpx;
  color: #94a3b8;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.upload-item {
  position: relative;
  height: 200rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background: #f8fafc;
  border: 2rpx dashed #bae6fd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8rpx;
}

.upload-placeholder {
  color: #38bdf8;
}

.upload-plus {
  font-size: 60rpx;
  line-height: 1;
}

.upload-text {
  font-size: 24rpx;
}

.upload-image {
  width: 100%;
  height: 100%;
}

.remove {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.65);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.submit {
  width: 100%;
  background: linear-gradient(120deg, #38bdf8, #0ea5e9);
  border: none;
  border-radius: 24rpx;
  padding: 32rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(14, 165, 233, 0.35);
}

.submit:disabled {
  opacity: 0.7;
}
</style>
