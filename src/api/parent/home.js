import request from '@/utils/request'
import { getUserId } from '@/utils/util'

const formatTime = (value) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')

  return `${y}-${m}-${d} ${h}:${min}`
}

const normalizeHours = (hours = {}) => {
  const used = Number(hours.usedHours ?? 0)
  const remaining = Number(hours.remainingHours ?? 0)
  const total = Number(hours.sumHours ?? used + remaining)

  const safeUsed = Number.isNaN(used) ? 0 : used
  const safeRemaining = Number.isNaN(remaining) ? 0 : remaining
  const safeTotal = Number.isNaN(total) ? safeUsed + safeRemaining : total

  return {
    used: safeUsed,
    remaining: safeRemaining,
    total: safeTotal,
  }
}

const adaptParentHomeOverview = (response) => {
  if (!response || !response.data) {
    return response
  }

  const notices = (response.data.noticeList || []).map((item, index) => ({
    id: item.id ?? `notice-${index}`,
    title: item.title ?? '通知',
    content: item.content ?? '',
    userName: item.userName ?? '',
    status: item.status ?? 0,
    createTime: item.createTime ?? '',
    time: formatTime(item.createTime),
  }))

  const students = (response.data.list || []).map((item, index) => {
    const hours = normalizeHours(item.hours)
    const homework = item.homework || {}

    return {
      id: item.id ?? `student-${index}`,
      name: item.studentName ?? '未命名学生',
      hours,
      homework: {
        total: Number(homework.sumCount ?? 0),
        finished: Number(homework.finishCount ?? 0),
        pending: Number(homework.noFinishCount ?? 0),
      },
    }
  })

  return {
    code: response.code,
    message: response.message,
    data: {
      notices,
      students,
    },
  }
}

/**
 * 获取家长首页概览数据
 */
export const getParentHomeOverview = async (parentId) => {
  const response = await request({
    url: '/parent/home/getCountData',
    method: 'GET',
    params: {
      parentId: parentId ?? getUserId(),
    },
  })

  return adaptParentHomeOverview(response)
}

export { adaptParentHomeOverview }
