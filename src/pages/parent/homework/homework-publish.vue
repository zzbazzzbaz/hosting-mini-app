<template>
  <view class="page">
    <PageHeader title="发布作业" :showBack="true" />
    <view class="content">
      <PublishHomeworkForm
        :student-name="childName"
        :subjects="subjects"
        :initial-form="initialForm"
        :submitting="submitting"
        @submit="handleSubmit"
      />
    </view>
  </view>
</template>

<script setup>
import {ref} from 'vue'
import {onLoad} from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import PublishHomeworkForm from '@/components/PublishHomeworkForm.vue'

const childName = ref('')
const submitting = ref(false)
const subjects = ['语文', '数学', '英语', '科学', '美术', '音乐']
const initialForm = ref({})

const handleSubmit = (payload) => {
  if (submitting.value) return
  submitting.value = true

  uni.showToast({title: '发布成功', icon: 'success'})

  setTimeout(() => {
    submitting.value = false
    uni.navigateBack()
  }, 1200)
}

onLoad((options) => {
  childName.value = options.name ? decodeURIComponent(options.name) : ''
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
