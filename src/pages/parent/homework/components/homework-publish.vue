<template>
  <view class="page">
    <PageHeader title="发布作业" :showBack="true" />
    <view class="content">
      <PublishHomeworkForm
        :student-name="childName"
        :subjects="subjects"
        :target-options="childOptions"
        :initial-form="initialForm"
        :submitting="submitting"
        @submit="handleSubmit"
        @target-change="onTargetChange"
      />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import PublishHomeworkForm from '@/components/PublishHomeworkForm.vue'
import { getChildrenByParentId, publishHomework, uploadHomeworkImage } from '@/api/parent/homework'
import { getSubjectComboxList } from '@/api/common/dictionary'

const childName = ref('')
const childOptions = ref([])
const selectedChild = ref(null)
const submitting = ref(false)
const subjects = ref([])
const initialForm = ref({})

const normalizeOptions = (list = []) =>
  list
    .map((item) => ({
      id: item.id ?? item.value ?? item.key ?? '',
      name: item.name ?? item.label ?? item.text ?? item.value ?? '',
    }))
    .filter((item) => item.id || item.name)

const setSelectedChild = (child) => {
  selectedChild.value = child || null
  childName.value = child?.name || ''
}

const loadChildren = async (preferredId, preferredName) => {
  try {
    const res = await getChildrenByParentId()
    childOptions.value = res?.data || []

    if (!childOptions.value.length) {
      uni.showToast({ title: '请先绑定孩子', icon: 'none' })
      return
    }

    const matchedById = childOptions.value.find(
      (item) => String(item.id) === String(preferredId || '')
    )
    const matchedByName = childOptions.value.find((item) => item.name === preferredName)
    setSelectedChild(matchedById || matchedByName || childOptions.value[0])
  } catch (error) {
    console.error('加载孩子列表失败', error)
    uni.showToast({ title: '孩子列表获取失败', icon: 'none' })
  }
}

const loadSubjects = async () => {
  try {
    const res = await getSubjectComboxList()
    subjects.value = normalizeOptions(res || [])
  } catch (error) {
    console.error('加载科目失败', error)
    uni.showToast({ title: '科目获取失败', icon: 'none' })
  }
}

const onTargetChange = (target) => {
  setSelectedChild(target)
}

const findSubjectId = (payload) => {
  if (payload.subjectId) return payload.subjectId
  const matched = subjects.value.find((item) => item.name === payload.subject) || null
  return matched?.id || ''
}

const handleSubmit = async (payload) => {
  if (submitting.value) return
  if (!selectedChild.value?.id) {
    uni.showToast({ title: '请选择布置对象', icon: 'none' })
    return
  }

  const subjectId = findSubjectId(payload)
  if (!subjectId) {
    uni.showToast({ title: '请选择科目', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    const uploadResults = []
    for (const path of payload.images || []) {
      const res = await uploadHomeworkImage(path)
      if (res?.data?.id) {
        uploadResults.push(res.data.id)
      }
    }

    await publishHomework({
      studentId: selectedChild.value.id,
      homeworkTime: payload.date,
      content: payload.content.trim(),
      workpicids: uploadResults.join(','),
      subjectId,
    })

    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1200)
  } catch (error) {
    console.error('发布作业失败', error)
    uni.showToast({ title: '发布失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

onLoad(async (options) => {
  const preferredId = options?.studentId
  const preferredName = options?.studentName ? decodeURIComponent(options.studentName) : ''
  const preferredSubject = options?.subject ? decodeURIComponent(options.subject) : ''

  initialForm.value = preferredSubject ? { subject: preferredSubject } : {}

  await Promise.all([loadChildren(preferredId, preferredName), loadSubjects()])
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
