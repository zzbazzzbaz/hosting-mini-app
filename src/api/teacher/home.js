import request from '@/utils/request'
import { getUserId, formatTime } from '@/utils/util'

/**
 * 适配教师端首页数据
 */
const adaptTeacherHomeData = (response) => {
  if (!response || !response.data) {
    return response
  }

  const data = response.data

  // 处理通知列表
  const notices = (data.noticeList || []).map((item, index) => ({
    id: item.id ?? `notice-${index}`,
    title: item.title ?? '通知',
    content: item.content ?? '',
    userName: item.userName ?? '',
    status: item.status ?? 0,
    createTime: item.createTime ?? '',
    time: formatTime(item.createTime),
  }))

  return {
    code: response.code,
    message: response.message,
    data: {
      // 学生总数
      studentCount: Number(data.studentCount ?? 0),
      // 签到数据
      signinCount: Number(data.signinCount ?? 0), // 签到总数
      noSigninCount: Number(data.noSigninCount ?? 0), // 未签到总数
      // 作业数据
      sumFinishCount: Number(data.sumFinishCount ?? 0), // 完成总数
      noSumFinishCount: Number(data.noSumFinishCount ?? 0), // 未完成总数
      finishCount: Number(data.finishCount ?? 0), // 今日完成数
      noFinishCount: Number(data.noFinishCount ?? 0), // 今日未完成数
      // 通知列表
      notices,
    },
  }
}

/**
 * 获取教师端首页数据
 */
export const getTeacherHomeData = async (teacherId) => {
  const response = await request({
    url: '/teacher/home/getCountData',
    method: 'GET',
    params: {
      teacherId: teacherId ?? getUserId(),
    },
  })

  return adaptTeacherHomeData(response)
}

export { adaptTeacherHomeData }
