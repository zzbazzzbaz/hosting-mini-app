<template>
  <view class="page">
    <!-- 使用PageHeader组件 -->
    <PageHeader title="作业信息" />

    <!-- 操作栏：全选 + 批量发布 + 筛选 -->
    <view class="action-bar">
      <view class="select-all" @click="toggleSelectAll">
        <view class="checkbox" :class="{ checked: isAllSelected }">
          <text v-if="isAllSelected" class="check-icon">✓</text>
        </view>
        <text class="select-all-text">全选</text>
        <text class="selected-count">({{ selectedStudents.length }})</text>
      </view>
      <button
        class="batch-publish-btn"
        :disabled="selectedStudents.length === 0"
        @click="openBatchPublish"
      >
        批量发布
      </button>
      <button class="filter-button" @click="openFilterPopup">
        <text>筛选</text>
        <text v-if="hasActiveFilters" class="filter-badge">●</text>
      </button>
    </view>

    <!-- 筛选弹窗 -->
    <view v-if="showFilterPopup" class="filter-popup-mask" @tap="showFilterPopup = false">
      <view class="filter-popup" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">筛选条件</text>
          <text class="popup-close" @tap="showFilterPopup = false">✕</text>
        </view>
        <view class="popup-content">
          <!-- 教师选择 -->
          <view class="filter-item">
            <text class="filter-label">教师</text>
            <picker
              class="filter-picker"
              :range="teacherOptions"
              range-key="name"
              :value="tempFilters.teacherIndex"
              @change="onTempTeacherChange"
            >
              <view class="picker-box">
                <text class="label">{{ tempTeacherLabel }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          <!-- 学校选择 -->
          <view class="filter-item">
            <text class="filter-label">学校</text>
            <picker
              class="filter-picker"
              :range="schoolOptions"
              range-key="name"
              :value="tempFilters.schoolIndex"
              @change="onTempSchoolChange"
            >
              <view class="picker-box">
                <text class="label">{{ tempSchoolLabel }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          <!-- 年级选择 -->
          <view class="filter-item">
            <text class="filter-label">年级</text>
            <picker
              class="filter-picker"
              :range="gradeOptions"
              range-key="name"
              :value="tempFilters.gradeIndex"
              @change="onTempGradeChange"
            >
              <view class="picker-box">
                <text class="label">{{ tempGradeLabel }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          <!-- 班级选择 -->
          <view class="filter-item">
            <text class="filter-label">班级</text>
            <picker
              class="filter-picker"
              :range="classOptions"
              range-key="name"
              :value="tempFilters.classIndex"
              @change="onTempClassChange"
            >
              <view class="picker-box">
                <text class="label">{{ tempClassLabel }}</text>
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
        </view>
        <view class="popup-footer">
          <button class="reset-button" @click="onResetFilters">重置</button>
          <button class="confirm-button" @click="onConfirmFilters">确定</button>
        </view>
      </view>
    </view>

    <!-- 作业列表 - 单行紧凑型 -->
    <view class="list">
      <view
        v-for="item in filteredHomeworkList"
        :key="item.id"
        class="item"
      >
        <!-- 复选框 -->
        <view class="checkbox-wrapper" @click.stop="toggleSelect(item)">
          <view class="checkbox" :class="{ checked: isSelected(item.id) }">
            <text v-if="isSelected(item.id)" class="check-icon">✓</text>
          </view>
        </view>
        <!-- 左侧：姓名 学校 年级 班级 -->
        <view class="left-info" @click="goDetail(item)">
          <text class="name">{{ item.studentName || '未命名' }}</text>
          <text class="detail">{{ item.schoolName || '学校未填' }}</text>
          <text class="detail">{{ item.gradeName || '年级未填' }}</text>
          <text class="detail">{{ item.clazzName || '班级未填' }}</text>
        </view>
        <!-- 右侧：已完成/未完成统计 -->
        <view class="right-stats" @click="goDetail(item)">
          <text class="stat completed">已完成: {{ item.finishCount }}</text>
          <text class="stat pending">未完成: {{ item.noFinishCount }}</text>
        </view>
      </view>
      <view v-if="!filteredHomeworkList.length" class="empty-state">
        <text class="empty-icon">📘</text>
        <text class="empty-text">暂无作业数据，调整筛选试试</text>
      </view>
      <!-- 底部加载状态提示 -->
      <view v-if="filteredHomeworkList.length > 0" class="load-status">
        <text v-if="loading" class="status-text">加载中...</text>
        <text v-else-if="noMore" class="status-text">没有更多数据了</text>
      </view>
    </view>

    <!-- 批量发布作业弹窗 -->
    <view v-if="showBatchModal" class="modal-overlay" @click="closeBatchPublish">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">批量发布作业</text>
          <text class="modal-close" @click="closeBatchPublish">✕</text>
        </view>
        <view class="modal-body">
          <view class="selected-info">
            <text>已选择 {{ selectedStudents.length }} 名学生</text>
          </view>
          <!-- 科目选择 -->
          <view class="field">
            <text class="field-label">科目<text style="color: #ef4444">*</text></text>
            <picker :range="subjectNames" @change="onSubjectChange">
              <view class="picker">
                <text class="picker-label" :style="{ color: batchForm.subject ? '#111827' : '#9ca3af' }">
                  {{ batchForm.subject || '请选择科目' }}
                </text>
                <text class="picker-icon">▼</text>
              </view>
            </picker>
          </view>
          <!-- 作业完成时间 -->
          <view class="field">
            <text class="field-label">完成时间<text style="color: #ef4444">*</text></text>
            <picker mode="date" :value="batchForm.homeworkTime" @change="onDateChange">
              <view class="picker">
                <text class="picker-label" :style="{ color: batchForm.homeworkTime ? '#111827' : '#9ca3af' }">
                  {{ batchForm.homeworkTime || '请选择日期' }}
                </text>
                <text class="picker-icon">▼</text>
              </view>
            </picker>
          </view>
          <!-- 作业内容 -->
          <view class="field-column">
            <text class="field-label">作业内容<text style="color: #ef4444">*</text></text>
            <textarea
              v-model="batchForm.content"
              class="textarea"
              placeholder="请输入作业内容"
              :maxlength="1000"
            ></textarea>
            <view class="counter">{{ batchForm.content.length }}/1000</view>
          </view>
          <!-- 图片上传 -->
          <view class="field-column">
            <text class="field-label">作业图片</text>
            <view class="upload-grid">
              <view v-for="(img, index) in batchForm.images" :key="img" class="upload-item">
                <image :src="img" mode="aspectFill" class="upload-image" />
                <view class="remove" @click="removeImage(index)">✕</view>
              </view>
              <view
                v-if="batchForm.images.length < 9"
                class="upload-item upload-placeholder"
                @click="chooseImage"
              >
                <view class="upload-placeholder-inner">
                  <text class="upload-plus">+</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeBatchPublish">取消</button>
          <button class="submit-btn" :disabled="submitting" @click="handleBatchSubmit">
            {{ submitting ? '发布中...' : '确认发布' }}
          </button>
        </view>
      </view>
    </view>

    <!-- 使用TeacherTabBar组件 -->
    <TeacherTabBar activeTab="homework" />
  </view>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import PageHeader from '@/components/PageHeader.vue'
import TeacherTabBar from '@/components/TeacherTabBar.vue'
import { addBatchHomeworks, getHomeworkStudentList, uploadTeacherHomeworkImage } from '@/api/teacher/homework'
import {
  getClassComboxList,
  getGradeComboxList,
  getSchoolComboxList,
  getSubjectComboxList,
  getTeacherComboxList,
} from '@/api/common/dictionary'
import { getUserInfo } from '@/store/auth'

const teacherOptions = ref([])
const schoolOptions = ref([{ id: '', name: '全部学校' }])
const gradeOptions = ref([{ id: '', name: '全部年级' }])
const classOptions = ref([{ id: '', name: '全部班级' }])
const subjectOptions = ref([])

const teacherIndex = ref(0)
const schoolIndex = ref(0)
const gradeIndex = ref(0)
const classIndex = ref(0)

const showFilterPopup = ref(false)
const tempFilters = reactive({
  teacherIndex: 0,
  schoolIndex: 0,
  gradeIndex: 0,
  classIndex: 0,
})

const homeworkList = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

// 批量选择相关
const selectedStudents = ref([])
const showBatchModal = ref(false)
const submitting = ref(false)
const imageIdMap = ref({})

const formatToday = () => {
  const now = new Date()
  const pad = (n) => `${n}`.padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

const createDefaultBatchForm = () => ({
  subject: '',
  subjectId: '',
  homeworkTime: formatToday(),
  content: '',
  images: [],
})

const batchForm = reactive(createDefaultBatchForm())

/**
 * 标准化选项列表（带"全部"选项）
 */
const normalizeOptions = (list = [], allLabel) =>
  [
    { id: '', name: allLabel },
    ...list
      .map((item) => ({
        id: item.id ?? item.value ?? '',
        name: item.name ?? item.label ?? item.text ?? '',
      }))
      .filter((item) => item.id || item.name),
  ].filter((item) => item.name)

/**
 * 标准化教师选项列表（不含"全部"选项）
 */
const normalizeTeacherOptions = (list = []) =>
  list
    .map((item) => ({
      id: item.id ?? item.value ?? '',
      name: item.name ?? item.label ?? item.text ?? '',
    }))
    .filter((item) => (item.id || item.name) && item.name)

const normalizeSubjectOptions = (list = []) =>
  list
    .map((item) => ({
      id: item.id ?? item.value ?? '',
      name: item.name ?? item.label ?? item.text ?? '',
    }))
    .filter((item) => item.id || item.name)

/**
 * 计算当前选中的标签文本
 */
const currentTeacherLabel = computed(
  () => teacherOptions.value[teacherIndex.value]?.name || '请选择教师'
)
const currentSchoolLabel = computed(
  () => schoolOptions.value[schoolIndex.value]?.name || '全部学校'
)
const currentGradeLabel = computed(() => gradeOptions.value[gradeIndex.value]?.name || '全部年级')
const currentClassLabel = computed(() => classOptions.value[classIndex.value]?.name || '全部班级')

const selectedTeacherId = computed(() => teacherOptions.value[teacherIndex.value]?.id || '')
const selectedSchoolId = computed(() => schoolOptions.value[schoolIndex.value]?.id || '')
const selectedGradeId = computed(() => gradeOptions.value[gradeIndex.value]?.id || '')
const selectedClassId = computed(() => classOptions.value[classIndex.value]?.id || '')

const hasActiveFilters = computed(() => {
  // 教师默认选中当前用户，所以不算激活筛选
  return schoolIndex.value !== 0 || gradeIndex.value !== 0 || classIndex.value !== 0
})

const tempTeacherLabel = computed(() => teacherOptions.value[tempFilters.teacherIndex]?.name || '请选择教师')
const tempSchoolLabel = computed(() => schoolOptions.value[tempFilters.schoolIndex]?.name || '全部学校')
const tempGradeLabel = computed(() => gradeOptions.value[tempFilters.gradeIndex]?.name || '全部年级')
const tempClassLabel = computed(() => classOptions.value[tempFilters.classIndex]?.name || '全部班级')

const subjectNames = computed(() => subjectOptions.value.map((item) => item.name))

/**
 * 过滤后的作业列表
 */
const filteredHomeworkList = computed(() => homeworkList.value)

/**
 * 是否全选
 */
const isAllSelected = computed(() => {
  if (filteredHomeworkList.value.length === 0) return false
  return filteredHomeworkList.value.every((item) => selectedStudents.value.includes(item.id))
})

/**
 * 检查学生是否被选中
 */
const isSelected = (id) => selectedStudents.value.includes(id)

/**
 * 切换单个学生选中状态
 */
const toggleSelect = (item) => {
  const index = selectedStudents.value.indexOf(item.id)
  if (index > -1) {
    selectedStudents.value.splice(index, 1)
  } else {
    selectedStudents.value.push(item.id)
  }
}

/**
 * 切换全选
 */
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedStudents.value = []
  } else {
    selectedStudents.value = filteredHomeworkList.value.map((item) => item.id)
  }
}

/**
 * 打开批量发布弹窗
 */
const openBatchPublish = () => {
  if (selectedStudents.value.length === 0) {
    uni.showToast({ title: '请先选择学生', icon: 'none' })
    return
  }
  Object.assign(batchForm, createDefaultBatchForm())
  imageIdMap.value = {}
  showBatchModal.value = true
}

/**
 * 关闭批量发布弹窗
 */
const closeBatchPublish = () => {
  showBatchModal.value = false
}

/**
 * 科目选择变化
 */
const onSubjectChange = (event) => {
  const index = Number(event.detail.value)
  const subject = subjectOptions.value[index] || {}
  batchForm.subject = subject.name || ''
  batchForm.subjectId = subject.id || ''
}

/**
 * 日期选择变化
 */
const onDateChange = (event) => {
  batchForm.homeworkTime = event.detail.value
}

/**
 * 选择图片
 */
const chooseImage = () => {
  if (batchForm.images.length >= 9) {
    uni.showToast({ title: '最多上传9张图片', icon: 'none' })
    return
  }
  uni.chooseImage({
    count: 9 - batchForm.images.length,
    success: async (res) => {
      const paths = res.tempFilePaths || []
      batchForm.images = [...batchForm.images, ...paths].slice(0, 9)
      try {
        await uploadMissingImages(batchForm.images)
      } catch (error) {
        console.error('上传图片失败', error)
        await uni.showToast({ title: '图片上传失败', icon: 'none' })
      }
    },
  })
}

/**
 * 移除图片
 */
const removeImage = (index) => {
  const next = [...batchForm.images]
  next.splice(index, 1)
  batchForm.images = next
  syncImageMap(batchForm.images)
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

  await uni.showLoading({ title: '上传图片中', mask: true })
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

/**
 * 批量发布作业
 */
const handleBatchSubmit = async () => {
  if (submitting.value) return

  if (!batchForm.subject) {
    await uni.showToast({ title: '请选择科目', icon: 'none' })
    return
  }
  if (!batchForm.homeworkTime) {
    await uni.showToast({ title: '请选择完成时间', icon: 'none' })
    return
  }
  if (!batchForm.content.trim()) {
    await uni.showToast({ title: '请输入作业内容', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    const images = batchForm.images || []
    await uploadMissingImages(images)
    const workpicids = images
      .map((path) => imageIdMap.value[path])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .join(',')

    await addBatchHomeworks({
      studentIds: selectedStudents.value.join(','),
      homeworkTime: batchForm.homeworkTime,
      content: batchForm.content.trim(),
      workpicids,
      subjectId: batchForm.subjectId,
    })

    await uni.showToast({ title: '发布成功', icon: 'success' })
    closeBatchPublish()
    selectedStudents.value = []
    await fetchHomeworkStudents(true)
  } catch (error) {
    console.error('批量发布作业失败', error)
    await uni.showToast({ title: '发布失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

/**
 * 获取筛选选项并设置默认值
 */
const fetchOptions = async () => {
  try {
    const [teachers, schools, grades, classes, subjects] = await Promise.all([
      getTeacherComboxList(),
      getSchoolComboxList(),
      getGradeComboxList(),
      getClassComboxList(),
      getSubjectComboxList(),
    ])
    teacherOptions.value = normalizeTeacherOptions(teachers || [])
    schoolOptions.value = normalizeOptions(schools || [], '全部学校')
    gradeOptions.value = normalizeOptions(grades || [], '全部年级')
    classOptions.value = normalizeOptions(classes || [], '全部班级')
    subjectOptions.value = normalizeSubjectOptions(subjects || [])

    const userInfo = getUserInfo()
    const userName = userInfo?.userName || userInfo?.name

    if (userName && teacherOptions.value.length > 0) {
      const idx = teacherOptions.value.findIndex((item) => item.name === userName)
      if (idx >= 0) {
        teacherIndex.value = idx
      } else {
        teacherIndex.value = 0
      }
    } else if (teacherOptions.value.length > 0) {
      teacherIndex.value = 0
    }
  } catch (error) {
    console.error('加载筛选项失败', error)
    await uni.showToast({ title: '筛选项加载失败', icon: 'none' })
  }
}

/**
 * 获取作业学生列表
 */
const fetchHomeworkStudents = async (reset = false) => {
  if (loading.value) return
  if (reset) {
    page.value = 1
    noMore.value = false
    homeworkList.value = []
    selectedStudents.value = []
  }
  loading.value = true
  try {
    const res = await getHomeworkStudentList({
      teacherId: selectedTeacherId.value || undefined,
      schoolId: selectedSchoolId.value || undefined,
      gradeId: selectedGradeId.value || undefined,
      clazzId: selectedClassId.value || undefined,
      page: page.value,
      pageSize,
    })
    const list = res?.data || []
    homeworkList.value = reset ? list : [...homeworkList.value, ...list]
    if (!list.length || list.length < pageSize) {
      noMore.value = true
    } else {
      page.value += 1
    }
  } catch (error) {
    console.error('获取作业学生列表失败', error)
    await uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const handlePublishedRefresh = () => {
  fetchHomeworkStudents(true)
}

onMounted(async () => {
  uni.$on('teacher-homework-published', handlePublishedRefresh)
  await fetchOptions()
  await fetchHomeworkStudents(true)
})

onPullDownRefresh(async () => {
  await fetchHomeworkStudents(true)
  uni.stopPullDownRefresh()
})

onUnmounted(() => {
  uni.$off('teacher-homework-published', handlePublishedRefresh)
})

onReachBottom(() => {
  if (loading.value || noMore.value) return
  fetchHomeworkStudents()
})

const onTeacherChange = (e) => {
  teacherIndex.value = Number(e.detail.value)
  fetchHomeworkStudents(true)
}

const onSchoolChange = (e) => {
  schoolIndex.value = Number(e.detail.value)
  fetchHomeworkStudents(true)
}

const onGradeChange = (e) => {
  gradeIndex.value = Number(e.detail.value)
  fetchHomeworkStudents(true)
}

const onClassChange = (e) => {
  classIndex.value = Number(e.detail.value)
  fetchHomeworkStudents(true)
}

const onTempTeacherChange = (e) => {
  tempFilters.teacherIndex = Number(e.detail.value)
}

const onTempSchoolChange = (e) => {
  tempFilters.schoolIndex = Number(e.detail.value)
}

const onTempGradeChange = (e) => {
  tempFilters.gradeIndex = Number(e.detail.value)
}

const onTempClassChange = (e) => {
  tempFilters.classIndex = Number(e.detail.value)
}

const onResetFilters = () => {
  tempFilters.teacherIndex = 0
  tempFilters.schoolIndex = 0
  tempFilters.gradeIndex = 0
  tempFilters.classIndex = 0
}

const onConfirmFilters = () => {
  teacherIndex.value = tempFilters.teacherIndex
  schoolIndex.value = tempFilters.schoolIndex
  gradeIndex.value = tempFilters.gradeIndex
  classIndex.value = tempFilters.classIndex
  showFilterPopup.value = false
  fetchHomeworkStudents(true)
}

const openFilterPopup = () => {
  tempFilters.teacherIndex = teacherIndex.value
  tempFilters.schoolIndex = schoolIndex.value
  tempFilters.gradeIndex = gradeIndex.value
  tempFilters.classIndex = classIndex.value
  showFilterPopup.value = true
}

const goDetail = (item) => {
  if (!item?.id) return
  const query = [
    `studentId=${item.id}`,
    `studentName=${encodeURIComponent(item.studentName || '')}`,
    `schoolName=${encodeURIComponent(item.schoolName || '')}`,
    `gradeName=${encodeURIComponent(item.gradeName || '')}`,
    `clazzName=${encodeURIComponent(item.clazzName || '')}`,
    `finishCount=${item.finishCount ?? 0}`,
    `noFinishCount=${item.noFinishCount ?? 0}`,
  ].join('&')
  uni.navigateTo({
    url: `/pages/teacher/homework/for-student/homework-list?${query}`,
  })
}
</script>
<style scoped>
/* 页面容器 */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 128rpx;
}

/* 操作栏 */
.action-bar {
  position: fixed;
  top: 144rpx;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 全选 */
.select-all {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.select-all-text {
  font-size: 26rpx;
  color: #374151;
}

.selected-count {
  font-size: 24rpx;
  color: #6b7280;
}

/* 批量发布按钮 - 白色 */
.batch-publish-btn {
  flex: 1;
  background: #fff;
  color: #374151;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  font-size: 26rpx;
  font-weight: 400;
}

.batch-publish-btn::after {
  border: none;
}

.batch-publish-btn:disabled {
  opacity: 0.5;
}

/* 筛选按钮 */
.filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  background: #fff;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 16rpx 28rpx;
  font-size: 26rpx;
  color: #374151;
}

.filter-button::after {
  border: none;
}

.filter-badge {
  color: #10b981;
  font-size: 20rpx;
}

/* 批量操作 */
.batch-action {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

/* 筛选弹窗遮罩 */
.filter-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

/* 筛选弹窗 */
.filter-popup {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
}

.popup-close {
  font-size: 36rpx;
  color: #9ca3af;
  padding: 8rpx;
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.filter-label {
  font-size: 26rpx;
  color: #6b7280;
}

.popup-footer {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
}

.reset-button,
.confirm-button {
  flex: 1;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.reset-button {
  background: #f3f4f6;
  color: #6b7280;
  border: none;
}

.reset-button::after,
.confirm-button::after {
  border: none;
}

.confirm-button {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
}

/* 筛选区域：支持多行布局，固定在顶部 */
.filter-section {
  position: fixed;
  top: 144rpx;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 筛选行 */
.filter-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.filter-picker {
  min-width: 0;
  width: 100%;
}

.picker-box {
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 20rpx 16rpx;
  font-size: 24rpx;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow {
  font-size: 18rpx;
  color: #9ca3af;
  margin-left: 8rpx;
  flex-shrink: 0;
}

/* 批量操作栏 */
.batch-action-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24rpx;
  padding-top: 8rpx;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.select-all-text {
  font-size: 26rpx;
  color: #374151;
}

.selected-count {
  font-size: 24rpx;
  color: #6b7280;
}

/* 复选框样式 */
.checkbox-wrapper {
  padding: 8rpx;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #d1d5db;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.checkbox.checked {
  background: #2563eb;
  border-color: #2563eb;
}

.check-icon {
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
}

/* 作业列表 - 单行紧凑型，添加顶部间距避免被固定的操作栏遮挡 */
.list {
  padding: 200rpx 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

/* 列表项 - 单行布局 */
.item {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  padding: 20rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

/* 左侧信息区域 */
.left-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
  overflow: hidden;
}

/* 学生姓名 */
.name {
  font-size: 26rpx;
  font-weight: 600;
  color: #1f2937;
  flex-shrink: 0;
  white-space: nowrap;
}

/* 详细信息文字 */
.detail {
  font-size: 22rpx;
  color: #6b7280;
  flex-shrink: 0;
  white-space: nowrap;
}

/* 右侧统计区域 */
.right-stats {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}

/* 统计数字 */
.stat {
  font-size: 22rpx;
  font-weight: 500;
  white-space: nowrap;
}

/* 已完成作业 - 绿色 */
.completed {
  color: #10b981;
}

/* 未完成作业 - 红色 */
.pending {
  color: #ef4444;
}

.empty-state {
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  color: #9ca3af;
}

.empty-icon {
  font-size: 52rpx;
}

.empty-text {
  font-size: 26rpx;
}

.load-status {
  text-align: center;
  padding: 32rpx 0;
}

.status-text {
  font-size: 24rpx;
  color: #94a3b8;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 90%;
  max-width: 680rpx;
  max-height: 85vh;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #e5e7eb;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #111827;
}

.modal-close {
  font-size: 36rpx;
  color: #9ca3af;
  padding: 8rpx;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.selected-info {
  background: #eff6ff;
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
  color: #2563eb;
  font-size: 26rpx;
}

.field {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.field-column {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.field-label {
  font-size: 26rpx;
  color: #374151;
  min-width: 140rpx;
}

.picker {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
}

.picker-label {
  font-size: 26rpx;
}

.picker-icon {
  font-size: 20rpx;
  color: #9ca3af;
}

.textarea {
  width: 100%;
  min-height: 160rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 16rpx;
  font-size: 26rpx;
  box-sizing: border-box;
}

.counter {
  text-align: right;
  font-size: 22rpx;
  color: #9ca3af;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.upload-item {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 8rpx;
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

.upload-placeholder-inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-plus {
  font-size: 48rpx;
  color: #9ca3af;
}

.remove {
  position: absolute;
  top: 4rpx;
  right: 4rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
}

.modal-footer {
  display: flex;
  gap: 24rpx;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #e5e7eb;
}

.cancel-btn {
  flex: 1;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.submit-btn {
  flex: 1;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.submit-btn:disabled {
  opacity: 0.7;
}
</style>
