import { ref } from 'vue'

/**
 * 签到数据管理
 * 用于管理批量签到时选中的学生数据
 */
const checkinStudents = ref(uni.getStorageSync('checkinStudents') || [])

/**
 * 设置待签到学生列表
 * @param {Array} students - 学生数据数组
 */
export const setCheckinStudents = (students) => {
  checkinStudents.value = students
  uni.setStorageSync('checkinStudents', students)
}

/**
 * 清除待签到学生列表
 */
export const clearCheckinStudents = () => {
  checkinStudents.value = []
  uni.removeStorageSync('checkinStudents')
}

/**
 * 获取待签到学生列表
 * @returns {Array} 学生数据数组
 */
export const getCheckinStudents = () => {
  return checkinStudents.value
}
