import request, { BASE_URL } from '@/utils/request'
import { getToken } from '@/store/auth'
import { getUserId } from '@/utils/util'

/**
 * 适配学生列表响应数据
 * @param {Object} response - 后端原始响应
 * @returns {Object} 标准化后的数据
 */
const adaptStudentListResponse = (response) => {
  if (!response || !response.data) {
    return response
  }

  return {
    code: response.code,
    message: response.message,
    data: response.data.map((item) => ({
      id: item.id,
      studentName: item.studentName ?? '',
      schoolName: item.schoolName ?? '',
      gradeName: item.gradeName ?? '',
      clazzName: item.clazzName ?? '',
      isSignin: item.isSignin ?? 0,
    })),
  }
}

/**
 * 获取学生列表
 * @param {number} teacherId - 教师ID
 * @returns {Promise} 返回学生列表数据
 */
export const getStudentList = async (teacherId) => {
  const response = await request({
    url: '/teacher/home/getStudentList',
    method: 'GET',
    params: {
      teacherId: teacherId ?? getUserId(),
    },
  })

  return adaptStudentListResponse(response)
}

/**
 * 上传签到图片
 * @param {string} filePath - 本地文件路径
 * @returns {Promise} 返回上传结果
 */
export const uploadSigninPic = (filePath) => {
  const token = getToken()
  const header = token ? { Authorization: `Bearer ${token}` } : {}

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BASE_URL}/teacher/home/addPic`,
      filePath,
      name: 'file',
      header,
      success: (res) => {
        try {
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          resolve(data)
        } catch (error) {
          reject(error)
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

/**
 * 提交签到
 * @param {Object} data - 签到数据
 * @param {number} data.teacherId - 教师ID
 * @param {string} data.studentIds - 学生ID列表（逗号分隔）
 * @param {string} data.picIds - 图片ID列表（逗号分隔）
 * @returns {Promise} 返回签到结果
 */
export const addSignin = async (data) => {
  return request({
    url: '/teacher/home/addSignin',
    method: 'POST',
    params: {
      teacherId: data.teacherId ?? getUserId(),
      studentIds: data.studentIds,
      picIds: data.picIds,
    },
  })
}
