import request from '@/utils/request'
import { getUserId } from '@/utils/util'

/**
 * 适配教师个人信息响应数据
 * @param {Object} response - 后端原始响应
 * @returns {Object} 标准化后的数据
 */
const adaptMyInfoResponse = (response) => {
  if (!response || !response.data) {
    return response
  }

  const data = response.data
  const info = data.info || {}

  return {
    code: response.code,
    message: response.message,
    data: {
      info: {
        id: info.id,
        name: info.name ?? '',
        phone: info.phone ?? '',
      },
      signinCount: data.signinCount ?? 0,
      studentCount: data.studentCount ?? 0,
      homeworkCount: data.homeworkCount ?? 0,
    },
  }
}

/**
 * 获取教师个人信息
 * @param {number} teacherId - 教师ID
 * @returns {Promise} 返回个人信息数据
 */
export const getMyInfo = async (teacherId) => {
  const response = await request({
    url: '/api/teacher/home/myInfo',
    method: 'GET',
    params: {
      teacherId: teacherId ?? getUserId(),
    },
  })

  return adaptMyInfoResponse(response)
}

/**
 * 修改教师密码
 * @param {Object} data - 密码修改数据
 * @param {number} data.teacherId - 教师ID
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise} 返回修改结果
 */
export const editPassword = async (data) => {
  return request({
    url: '/api/teacher/home/editPassword',
    method: 'POST',
    params: {
      teacherId: data.teacherId ?? getUserId(),
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    },
  })
}
