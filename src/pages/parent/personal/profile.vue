<template>
  <view class="page">
    <PageHeader title="我的" />

    <view class="profile-section">
      <view class="profile-header">
        <view class="profile-base">
          <view class="avatar-wrapper">
            <view class="avatar">
              <text class="avatar-text">{{ parentInitial }}</text>
            </view>
            <view class="relation-badge">{{ parentInfo.relation }}</view>
          </view>
          <view class="profile-info">
            <text class="username">{{ parentInfo.name }}</text>
            <text class="contact">绑定手机 {{ parentPhoneMasked }}</text>
          </view>
        </view>
        <view class="edit-btn" @tap="handleEditProfile">完善资料</view>
      </view>

      <view class="child-overview">
        <view class="child-left">
          <view class="child-avatar">
            <text class="child-avatar-text">{{ childInfo.avatar }}</text>
          </view>
          <view class="child-meta">
            <text class="child-name">{{ childInfo.name }}</text>
            <text class="child-desc">{{ childInfo.grade }} · {{ childInfo.className }}</text>
          </view>
        </view>
        <view class="teacher-chip" @tap="contactTeacher">
          <text class="chip-icon">👨‍🏫</text>
          <text class="chip-text">{{ childInfo.teacher }}</text>
        </view>
      </view>

      <view class="child-stats">
        <view class="stat-item" v-for="item in childStats" :key="item.label">
          <text class="stat-value">{{ item.value }}</text>
          <text class="stat-label">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <view class="quick-actions">
      <view class="section-header">
        <text class="section-title">快捷功能</text>
        <text class="section-subtitle">常用操作一键到达</text>
      </view>
      <view class="action-grid">
        <view
          class="action-card"
          v-for="action in actions"
          :key="action.type"
          @tap="handleAction(action)"
        >
          <view :class="['action-icon', action.style]">
            <text class="action-emoji">{{ action.emoji }}</text>
          </view>
          <text class="action-title">{{ action.title }}</text>
          <text class="action-desc">{{ action.desc }}</text>
        </view>
      </view>
    </view>

    <view class="reminder-section" v-if="reminders.length">
      <view class="section-header">
        <text class="section-title">本周提醒</text>
        <text class="section-subtitle">不遗漏任何重要事项</text>
      </view>
      <view class="reminder-list">
        <view class="reminder-item" v-for="(item, index) in reminders" :key="index">
          <view :class="['reminder-dot', item.type]" />
          <view class="reminder-content">
            <text class="reminder-title">{{ item.title }}</text>
            <text class="reminder-time">{{ item.time }}</text>
          </view>
          <view class="reminder-action" @tap="handleReminder(item)">
            <text class="reminder-action-text">查看</text>
            <uni-icons type="forward" size="18" color="#93c5fd"></uni-icons>
          </view>
        </view>
      </view>
    </view>

    <view class="support-card">
      <view class="support-left">
        <text class="support-title">学习服务顾问</text>
        <text class="support-desc">{{ supportInfo.name }}</text>
        <text class="support-phone">联系电话 {{ supportPhoneMasked }}</text>
        <text class="support-time">工作时间 {{ supportInfo.serviceTime }}</text>
      </view>
      <view class="support-actions">
        <view class="support-btn primary" @tap="callSupport">电话咨询</view>
        <view class="support-btn ghost" @tap="messageSupport">在线留言</view>
      </view>
    </view>

    <ParentTabBar activeTab="publish" />
  </view>
</template>

<script setup>
import {computed, ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import ParentTabBar from '@/components/ParentTabBar.vue'

const parentInfo = ref({
  name: '李女士',
  phone: '13800138000',
  relation: '妈妈'
})

const childInfo = ref({
  name: '李昱辰',
  grade: '四年级',
  className: '1班',
  teacher: '王老师',
  avatar: '🧒'
})

const childStats = ref([
  {label: '出勤率', value: '98%'},
  {label: '作业完成', value: '23/24'},
  {label: '综合评估', value: 'A-'}
])

const actions = [
  {type: 'childProfile', title: '孩子档案', desc: '成长轨迹与课程安排', emoji: '📘', style: 'icon-blue'},
  {type: 'studyReport', title: '学习报告', desc: '查看周报与老师评语', emoji: '📈', style: 'icon-indigo'},
  {type: 'attendance', title: '签到记录', desc: '每日到校情况明细', emoji: '✅', style: 'icon-green'},
  {type: 'tuition', title: '课时余额', desc: '剩余课时与续费提醒', emoji: '💳', style: 'icon-orange'}
]

const reminders = ref([
  {title: '周五家长会', time: '3月18日 · 18:30 教室C203', type: 'warning'},
  {title: '第11周学习报告已更新', time: '3月16日 · 21:00', type: 'info'},
  {title: '课时余额剩余 6 节', time: '本周建议提前续费', type: 'danger'}
])

const supportInfo = ref({
  name: '学管师 王老师',
  phone: '18012345678',
  serviceTime: '周一-周六 09:00-18:00'
})

const parentInitial = computed(() => parentInfo.value.name.slice(0, 1))
const parentPhoneMasked = computed(() => maskPhone(parentInfo.value.phone))
const supportPhoneMasked = computed(() => maskPhone(supportInfo.value.phone))

function maskPhone(phone) {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const handleEditProfile = () => {
  uni.showToast({
    title: '个人资料完善中',
    icon: 'none'
  })
}

const contactTeacher = () => {
  uni.showActionSheet({
    itemList: ['拨打老师电话', '发送微信消息'],
    success: (res) => {
      const labels = ['电话联系功能开发中', '微信联系功能开发中']
      uni.showToast({
        title: labels[res.tapIndex],
        icon: 'none'
      })
    }
  })
}

const handleAction = (action) => {
  const map = {
    childProfile: '孩子档案',
    studyReport: '学习报告',
    attendance: '签到记录',
    tuition: '课时余额'
  }

  uni.showToast({
    title: `${map[action.type]}功能开发中`,
    icon: 'none'
  })
}

const handleReminder = () => {
  uni.showToast({
    title: '详情即将上线',
    icon: 'none'
  })
}

const callSupport = () => {
  uni.showModal({
    title: '拨打电话',
    content: `是否拨打 ${supportPhoneMasked.value}？`,
    success: (res) => {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: supportInfo.value.phone
        })
      }
    }
  })
}

const messageSupport = () => {
  uni.showToast({
    title: '已为您记录需求',
    icon: 'success'
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding-top: 144rpx;
  padding-bottom: 160rpx;
}

.profile-section {
  margin: 32rpx 48rpx 24rpx;
  padding: 48rpx;
  border-radius: 32rpx;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  box-shadow: 0 12rpx 32rpx rgba(14, 165, 233, 0.25);
  color: #fff;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48rpx;
}

.profile-base {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 24rpx rgba(14, 165, 233, 0.3);
}

.avatar-text {
  font-size: 56rpx;
  font-weight: bold;
  color: #0ea5e9;
  background: #fff;
  width: 100rpx;
  height: 100rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.relation-badge {
  position: absolute;
  bottom: -16rpx;
  left: 50%;
  transform: translateX(-50%);
  background: #facc15;
  color: #854d0e;
  font-size: 22rpx;
  font-weight: 600;
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  box-shadow: 0 8rpx 16rpx rgba(250, 204, 21, 0.35);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.username {
  font-size: 44rpx;
  font-weight: 700;
}

.contact {
  font-size: 26rpx;
  color: #e0f2fe;
}

.edit-btn {
  padding: 16rpx 28rpx;
  border-radius: 999rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.6);
  font-size: 24rpx;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.child-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.child-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.child-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.child-avatar-text {
  font-size: 50rpx;
}

.child-meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.child-name {
  font-size: 36rpx;
  font-weight: 600;
}

.child-desc {
  font-size: 26rpx;
  color: #dbeafe;
}

.teacher-chip {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 18rpx 28rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.chip-icon {
  font-size: 26rpx;
}

.chip-text {
  font-size: 26rpx;
}

.child-stats {
  margin-top: 40rpx;
  display: flex;
  gap: 24rpx;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 24rpx;
  padding: 24rpx 32rpx;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  align-items: flex-start;
}

.stat-value {
  font-size: 40rpx;
  font-weight: 700;
}

.stat-label {
  font-size: 24rpx;
  color: #e0f2fe;
}

.quick-actions {
  margin: 0 48rpx 24rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.06);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1f2937;
}

.section-subtitle {
  font-size: 26rpx;
  color: #6b7280;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.action-card {
  background: #f9fafb;
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  box-shadow: inset 0 0 0 2rpx #f3f4f6;
}

.action-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue {
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
}

.icon-indigo {
  background: linear-gradient(135deg, #e0e7ff, #a5b4fc);
}

.icon-green {
  background: linear-gradient(135deg, #dcfce7, #86efac);
}

.icon-orange {
  background: linear-gradient(135deg, #ffedd5, #fbbf24);
}

.action-emoji {
  font-size: 38rpx;
}

.action-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
}

.action-desc {
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.5;
}

.reminder-section {
  margin: 0 48rpx 24rpx;
  background: linear-gradient(135deg, #eef2ff, #dbeafe);
  border-radius: 28rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 24rpx;
  padding: 24rpx 28rpx;
}

.reminder-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
}

.reminder-dot.info {
  background: #38bdf8;
}

.reminder-dot.warning {
  background: #facc15;
}

.reminder-dot.danger {
  background: #f97316;
}

.reminder-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.reminder-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1e293b;
}

.reminder-time {
  font-size: 24rpx;
  color: #475569;
}

.reminder-action {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.reminder-action-text {
  font-size: 24rpx;
  color: #2563eb;
}

.support-card {
  margin: 0 48rpx 32rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.05);
  display: flex;
  justify-content: space-between;
  gap: 32rpx;
  align-items: center;
}

.support-left {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.support-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
}

.support-desc {
  font-size: 28rpx;
  color: #4b5563;
}

.support-phone,
.support-time {
  font-size: 24rpx;
  color: #6b7280;
}

.support-actions {
  display: flex;
  gap: 16rpx;
}

.support-btn {
  padding: 20rpx 32rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 500;
  text-align: center;
}

.support-btn.primary {
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  color: #fff;
  box-shadow: 0 12rpx 24rpx rgba(59, 130, 246, 0.25);
}

.support-btn.ghost {
  background: #f1f5f9;
  color: #1d4ed8;
}
</style>
