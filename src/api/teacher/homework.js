import request, { BASE_URL } from '@/utils/request'
import { getToken } from '@/store/auth'
import { buildImageUrl, formatDate, getUserId } from '@/utils/util'

/**
 * 适配教师查看学生作业列表
 */
const adaptHomeworkStudentList = (response) => {
  const list = (response?.data || []).map((item, index) => ({
    id: item.id ?? `student-${index}`,
    studentName: item.studentName ?? '',
    schoolName: item.schoolName ?? '',
    gradeName: item.gradeName ?? '',
    clazzName: item.clazzName ?? '',
    finishCount: Number(item.finishCount ?? 0),
    noFinishCount: Number(item.noFinishCount ?? 0),
  }))

  return {
    code: response?.code,
    message: response?.message,
    data: list,
  }
}

/**
 * 适配教师查看作业列表
 */
const adaptHomeworkList = (response) => {
  const list = (response?.data || []).map((item, index) => {
    const state = Number(item.state ?? 0)
    return {
      id: item.id ?? `homework-${index}`,
      homeworkDate: formatDate(item.homeworkTime),
      finishDate: item.finishTime ? formatDate(item.finishTime) : '',
      gradeName: item.gradeName ?? '',
      studentName: item.studentName ?? '',
      subjectName: item.subjectName ?? '',
      state,
      status: state === 1 ? 'completed' : 'pending',
    }
  })

  return {
    code: response?.code,
    message: response?.message,
    data: {
      list,
    },
  }
}

/**
 * 适配教师查看作业详情
 */
const adaptHomeworkDetail = (response) => {
  const data = response?.data || {}
  const normalizeImages = (list = []) => {
    const rawList = Array.isArray(list)
      ? list
      : typeof list === 'string' && list
        ? list.split(',').map((path) => ({ imgpath: path }))
        : []

    return rawList
      .filter((item) => item)
      .map((item, index) => {
        const path = typeof item === 'string' ? item : (item.imgpath ?? '')
        return {
          id: (typeof item === 'object' && item.id) || `img-${index}`,
          path,
          url: buildImageUrl(path),
          createTime: item.createTime ?? '',
        }
      })
      .filter((img) => img.url)
  }

  const state = Number(data.state ?? 0)

  return {
    code: response?.code,
    message: response?.message,
    data: {
      id: data.id,
      subjectName: data.subjectName ?? '',
      homeworkDate: formatDate(data.homeworkTime),
      finishDate: data.finishTime ? formatDate(data.finishTime) : '',
      state,
      isCompleted: state === 1,
      evaluation: data.evaluation ?? '',
      content: data.content ?? '',
      studentState: data.studentState ?? '',
      homeworkImages: normalizeImages(data.homeworkpicList),
      finishImages: normalizeImages(data.finishpicList),
    },
  }
}

/**
 * 获取教师名下学生作业列表
 */
export const getHomeworkStudentList = async (params = {}) => {
  const query = {
    teacherId: params.teacherId ?? getUserId(),
    schoolId: params.schoolId,
    gradeId: params.gradeId,
    clazzId: params.clazzId,
  }
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (value === undefined || value === null || value === '') {
      delete query[key]
    }
  })

  const response = await request({
    url: '/teacher/home/getHomeworkStudentList',
    method: 'GET',
    params: query,
  })

  return adaptHomeworkStudentList(response)
}

/**
 * 获取某学生的作业列表
 */
export const getTeacherHomeworkList = async (params = {}) => {
  const { studentId, subjectId, state, page = 1, pageSize = 20 } = params
  const query = {
    studentId,
    subjectId,
    state,
    page,
    pageSize,
  }
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (value === undefined || value === null || value === '') {
      delete query[key]
    }
  })

  const response = await request({
    url: '/teacher/home/getHomeworkList',
    method: 'GET',
    params: query,
  })

  return adaptHomeworkList(response)
}

/**
 * 根据作业ID获取详情
 */
export const getTeacherHomeworkDetail = async (homeworkId) => {
  const response = await request({
    url: '/teacher/home/getHomeworkById',
    method: 'GET',
    params: { homeworkId },
  })

  return adaptHomeworkDetail(response)
}

/**
 * 上传作业图片
 */
export const uploadTeacherHomeworkImage = (filePath) => {
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
          if (data.code === 200) {
            resolve({
              code: data.code,
              message: data.message,
              data: data.data
                ? {
                    ...data.data,
                    url: buildImageUrl(data.data.imgpath),
                  }
                : null,
            })
          } else {
            reject(new Error(data.message || '上传失败'))
          }
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
 * 发布作业
 */
export const addTeacherHomework = async ({
  studentId,
  content,
  workpicids,
  subjectId,
  homeworkTime2,
}) => {
  const params = {
    'student.id': studentId,
    content,
    workpicids,
    subjectId,
    homeworkTime2,
  }
  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (value === undefined || value === null || value === '') {
      delete params[key]
    }
  })

  return request({
    url: '/teacher/home/addHomework',
    method: 'POST',
    params,
  })
}

/**
 * 教师评价/完成作业
 */
export const addHomeworkEvaluation = async ({
  homeworkId,
  evaluation,
  finishpicids,
  studentState,
}) => {
  const params = {
    homeworkId,
    evaluation,
    finishpicids,
    studentState,
  }
  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (value === undefined || value === null || value === '') {
      delete params[key]
    }
  })

  return request({
    url: '/teacher/home/addHomeworkEvaluation',
    method: 'PUT',
    params,
  })
}

export { adaptHomeworkStudentList, adaptHomeworkList, adaptHomeworkDetail }
