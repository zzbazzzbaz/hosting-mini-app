<template>
  <view class="page">
    <PageHeader :title="headerTitle" :showBack="true" />
    <view class="content">
      <PublishHomeworkForm
        :student-name="studentName"
        :subjects="subjects"
        :initial-form="initialForm"
        :submitting="submitting"
        @submit="onSubmit"
      />
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import PublishHomeworkForm from '@/components/PublishHomeworkForm.vue'

const studentName = ref('')
const submitting = ref(false)
const subjects = ['语文', '数学', '英语', '科学', '美术', '音乐', '体育']
const initialForm = ref({})

const headerTitle = computed(() =>
  studentName.value ? `发布作业给 ${studentName.value}` : '发布作业'
)

const onSubmit = () => {
  if (submitting.value) return
  submitting.value = true

  uni.showToast({ title: '发布成功', icon: 'success' })

  setTimeout(() => {
    submitting.value = false
    uni.navigateBack()
  }, 1200)
}

onLoad((options) => {
  studentName.value = options.name ? decodeURIComponent(options.name) : ''
  if (options.subject) {
    initialForm.value = {
      ...initialForm.value,
      subject: decodeURIComponent(options.subject),
    }
  }
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
