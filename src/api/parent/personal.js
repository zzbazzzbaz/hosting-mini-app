import request from '@/utils/request'
import { getUserId } from '@/utils/util'

/**
 * 标准化个人信息响应数据
 * @param {Object} response - 后端原始响应
 * @returns {Object} 标准化后的数据
 */
const adaptMyInfoResponse = (response) => {
  if (!response || !response.data) {
    return response
  }

  const data = response.data
  const info = data.info || {}
  const studentList = (data.studentList || []).map((item, index) => ({
    id: item.id ?? `student-${index}`,
    studentName: item.studentName ?? '',
    teacherName: item.teacherName ?? '',
    hours: {
      usedHours: item.hours?.usedHours ?? 0,
      remainingHours: item.hours?.remainingHours ?? 0,
      sumHours: item.hours?.sumHours ?? 0,
    },
  }))

  return {
    code: response.code,
    message: response.message,
    data: {
      info: {
        id: info.id,
        name: info.name ?? '',
        phone: info.phone ?? '',
      },
      studentCount: data.studentCount ?? 0,
      finishTotalCount: data.finishTotalCount ?? 0,
      nofinishTotalCount: data.nofinishTotalCount ?? 0,
      studentList,
    },
  }
}

/**
 * 获取家长个人信息
 * @param {number} parentId - 家长ID
 * @returns {Promise} 返回个人信息数据
 */
export const getMyInfo = async (parentId) => {
  const response = await request({
    url: '/api/parent/home/myInfo',
    method: 'GET',
    params: {
      parentId: parentId ?? getUserId(),
    },
  })

  return adaptMyInfoResponse(response)
}

/**
 * 修改家长密码
 * @param {Object} data - 密码修改数据
 * @param {number} data.parentId - 家长ID
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise} 返回修改结果
 */
export const editPassword = async (data) => {
  return request({
    url: '/api/parent/home/editPassword',
    method: 'POST',
    params: {
      parentId: data.parentId ?? getUserId(),
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    },
  })
}
