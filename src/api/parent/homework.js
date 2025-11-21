import request, { BASE_URL } from '@/utils/request'
import { getToken } from '@/store/auth'
import { getUserId } from '@/utils/util'

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const buildImageUrl = (path) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${BASE_URL}${path}`
}

const adaptChildren = (response) => {
  const list = (response?.data || []).map((item, index) => ({
    id: item.id ?? `student-${index}`,
    name: item.studentName ?? '',
  }))

  return {
    code: response?.code,
    message: response?.message,
    data: list,
  }
}

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

const adaptHomeworkDetail = (response) => {
  const data = response?.data || {}
  const normalizeImages = (list = []) => {
    return list
      .filter((item) => !!item)
      .map((item, index) => ({
        id: item.id ?? `img-${index}`,
        path: item.imgpath ?? '',
        url: buildImageUrl(item.imgpath ?? ''),
        createTime: item.createTime ?? '',
      }))
  }

  return {
    code: response?.code,
    message: response?.message,
    data: {
      id: data.id,
      subjectName: data.subjectName ?? '',
      homeworkDate: formatDate(data.homeworkTime),
      finishDate: data.finishTime ? formatDate(data.finishTime) : '',
      state: Number(data.state ?? 0),
      evaluation: data.evaluation ?? '',
      content: data.content ?? '',
      studentState: data.studentState ?? '',
      homeworkImages: normalizeImages(data.homeworkpicList),
      finishImages: normalizeImages(data.finishpicList),
    },
  }
}

/**
 * 获取家长的孩子列表
 */
export const getChildrenByParentId = async (parentId) => {
  const response = await request({
    url: '/parent/home/getListByParentId',
    method: 'GET',
    params: {
      parentId: parentId ?? getUserId(),
    },
  })

  return adaptChildren(response)
}

/**
 * 获取家长作业列表
 */
export const getParentHomeworkList = async (params = {}) => {
  const { page = 1, pageSize = 10, parentId, studentId, subjectId, state } = params
  const query = {
    page,
    pageSize,
    parentId: parentId ?? getUserId(),
    studentId,
    subjectId,
    state,
  }
  // 移除 undefined/null/空字符串，避免出现 key=undefined
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (value === undefined || value === null || value === '') {
      delete query[key]
    }
  })

  const response = await request({
    url: '/parent/home/getHomeworkList',
    method: 'GET',
    params: query,
  })

  return adaptHomeworkList(response)
}

/**
 * 根据作业ID获取详情
 */
export const getHomeworkDetail = async (homeworkId) => {
  const response = await request({
    url: '/parent/home/getHomeworkById',
    method: 'GET',
    params: { homeworkId },
  })

  return adaptHomeworkDetail(response)
}

/**
 * 上传作业图片
 * @param {string} filePath - 本地文件路径
 * @returns {Promise<{code:number,message:string,data:Object}>}
 */
export const uploadHomeworkImage = (filePath) => {
  const token = getToken()
  const header = token ? { Authorization: `Bearer ${token}` } : {}

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BASE_URL}/parent/home/addPic`,
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
export const publishHomework = async ({
  studentId,
  homeworkTime,
  content,
  workpicids,
  subjectId,
}) => {
  const params = {
    'student.id': studentId,
    homeworkTime,
    content,
    workpicids,
    subjectId,
  }
  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (value === undefined || value === null || value === '') {
      delete params[key]
    }
  })

  return request({
    url: '/parent/home/addHomework',
    method: 'POST',
    params,
  })
}

export { buildImageUrl }
