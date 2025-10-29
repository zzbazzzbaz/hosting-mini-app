import {request} from './http'

/**
 * 获取作业列表
 * @param {Object} params 查询参数
 */
export const fetchHomeworkList = (params) => {
  return request({
    url: '/homework',
    method: 'GET',
    data: params,
    showLoading: true,
    loadingText: '加载作业...'
  })
}

/**
 * 发布作业
 * @param {Object} payload 作业内容
 */
export const createHomework = (payload) => {
  return request({
    url: '/homework',
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '发布中...'
  })
}
