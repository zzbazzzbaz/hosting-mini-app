<template>
  <view class="page">
    <PageHeader :title="headerTitle" :showBack="true" />
    <view class="content">
      <PublishHomeworkForm
        :student-name="studentName"
        :subjects="subjects"
        :initial-form="initialForm"
        :submitting="submitting"
        :target-options="targetOptions"
        :show-date="false"
        @submit="onSubmit"
        @choose-image="onChooseImage"
        @remove-image="onRemoveImage"
      />
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import PublishHomeworkForm from '../components/PublishHomeworkForm.vue'
import { addTeacherHomework, uploadTeacherHomeworkImage } from '@/api/teacher/homework'
import { getSubjectComboxList } from '@/api/common/dictionary'

const studentName = ref('')
const studentId = ref('')
const submitting = ref(false)
const subjectOptions = ref([])
const initialForm = ref({})
const imageIdMap = ref({})

const headerTitle = computed(() =>
  studentName.value ? `发布作业给 ${studentName.value}` : '发布作业'
)

const subjects = computed(() => subjectOptions.value)

const targetOptions = computed(() =>
  studentId.value
    ? [
        {
          id: studentId.value,
          name: studentName.value || '选中学生',
        },
      ]
    : []
)

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

const onChooseImage = async (images) => {
  try {
    await uploadMissingImages(images)
  } catch (error) {
    console.error('上传图片失败', error)
    await uni.showToast({ title: '图片上传失败', icon: 'none' })
  }
}

const onRemoveImage = (images) => {
  syncImageMap(images || [])
}

const onSubmit = async (form) => {
  if (submitting.value) return
  if (!studentId.value) {
    await uni.showToast({ title: '缺少学生信息', icon: 'none' })
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
      subjectId: form.subjectId,
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
</style>
