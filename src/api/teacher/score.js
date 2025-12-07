import request from '@/utils/request'
import { getUserId } from '@/utils/util'

/**
 * 获取学生成绩列表
 */
export const getScoreList = async (params = {}) => {
  const query = {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
    teacherId: params.teacherId ?? getUserId(),
    'student.id': params.studentId,
  }
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (value === undefined || value === null || value === '') {
      delete query[key]
    }
  })

  return request({
    url: '/api/teacher/home/getScoreList',
    method: 'GET',
    params: query,
  })
}
