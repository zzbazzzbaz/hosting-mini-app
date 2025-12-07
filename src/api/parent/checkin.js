import request from '@/utils/request'
import { buildImageUrl, getUserId } from '@/utils/util'

const formatDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value.replace(/-/g, '/'))
  if (Number.isNaN(date.getTime())) return value
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return {
    date: `${y}-${m}-${d}`,
    time: `${hh}:${mm}:${ss}`,
    full: `${y}-${m}-${d} ${hh}:${mm}:${ss}`,
  }
}

const adaptSigninList = (response) => {
  const list = (response?.data || []).map((item, index) => {
    const stamp = formatDateTime(item.createTime || item.signDate)
    const photos = (item.picList || [])
      .map((pic, i) => ({
        id: pic.id ?? `photo-${i}`,
        path: pic.imgpath ?? '',
        url: buildImageUrl(pic.imgpath ?? ''),
        createTime: pic.createTime ?? '',
      }))
      .filter((pic) => !!pic.url)
    return {
      id: item.id ?? `signin-${index}`,
      studentName: item.studentName ?? '',
      gradeName: item.gradeName ?? '',
      createTime: stamp.full || item.createTime || '',
      date: stamp.date || '',
      time: stamp.time || '',
      photos,
    }
  })

  return {
    code: response?.code,
    message: response?.message,
    data: { list },
  }
}

export const getParentSigninList = async ({
  page = 1,
  pageSize = 10,
  parentId,
  studentId,
  signDate,
} = {}) => {
  const params = {
    page,
    pageSize,
    parentId: parentId ?? getUserId(),
    studentId,
    signDate,
  }
  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (value === undefined || value === null || value === '') {
      delete params[key]
    }
  })

  const response = await request({
    url: '/api/parent/home/getSigninList',
    method: 'GET',
    params,
  })

  return adaptSigninList(response)
}
