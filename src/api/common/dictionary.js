import request from '@/utils/request'

// ========== 数据适配器（防腐层）==========

/**
 * 适配下拉框列表响应数据
 */
const adaptComboxResponse = (response) => {
  if (!response?.data) return []
  const list = Array.isArray(response.data) ? response.data : [response.data]
  return list
    .map((item, index) => ({
      id: item.id ?? `dict-${index}`,
      name: item.dicName ?? item.teacherName ?? item.parentName ?? item.studentName ?? '',
    }))
    .filter((item) => item.name)
}

// ========== API 接口 ==========

/**
 * 获取教师下拉框列表
 *
 * {
 *     "code": 200,
 *     "message": "数据查询成功",
 *     "data": [
 *         {
 *             "teacherName": "teacher2",
 *             "id": 1
 *         }
 *     ]
 * }
 */
export const getTeacherComboxList = async () => {
  const response = await request({
    url: '/common/teacher/getComboxList',
    method: 'GET',
  })
  return adaptComboxResponse(response)
}

/**
 * 获取家长下拉框列表
 *
 * {
 *     "code": 200,
 *     "message": "数据查询成功",
 *     "data": [
 *         {
 *             "parentName": "李妈妈",
 *             "id": 1
 *         }
 *     ]
 * }
 */
export const getParentComboxList = async () => {
  const response = await request({
    url: '/common/parent/getComboxList',
    method: 'GET',
  })
  return adaptComboxResponse(response)
}

/**
 * 获取所有学生下拉框列表
 *
 * {
 *     "code": 200,
 *     "message": "数据查询成功",
 *     "data": [
 *         {
 *             "studentName": "李老大",
 *             "id": 1
 *         }
 *     ]
 * }
 */
export const getStudentComboxList = async () => {
  const response = await request({
    url: '/common/student/getComboxList',
    method: 'GET',
  })
  return adaptComboxResponse(response)
}

/**
 * 获取数据字典下拉框列表
 * @param {number} type - 字典类型 1:年级 2:科目 3:学校 4:校区 5:教师评级分类 6:班级 7:学生今日状态
 *
 * {
 *     "code": 200,
 *     "message": "数据查询成功",
 *     "data": [
 *         {
 *             "id": 1,
 *             "dicName": "一年级",
 *             "type": 1,
 *             "status": 0
 *         }
 *     ]
 * }
 */
export const getDictionaryComboxList = async (type) => {
  const response = await request({
    url: '/common/dictionary/getComboxList',
    method: 'GET',
    params: { type },
  })
  return adaptComboxResponse(response)
}

// ========== 数据字典便捷方法 ==========

/**
 * 获取年级下拉框列表
 */
export const getGradeComboxList = async () => getDictionaryComboxList(1)

/**
 * 获取科目下拉框列表
 */
export const getSubjectComboxList = async () => getDictionaryComboxList(2)

/**
 * 获取学校下拉框列表
 */
export const getSchoolComboxList = async () => getDictionaryComboxList(3)

/**
 * 获取校区下拉框列表
 */
export const getCampusComboxList = async () => getDictionaryComboxList(4)

/**
 * 获取教师评级分类下拉框列表
 */
export const getTeacherRatingComboxList = async () => getDictionaryComboxList(5)

/**
 * 获取班级下拉框列表
 */
export const getClassComboxList = async () => getDictionaryComboxList(6)

/**
 * 获取学生今日状态下拉框列表
 */
export const getStudentStatusComboxList = async () => getDictionaryComboxList(7)
