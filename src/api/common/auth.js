import request from '@/utils/request'

/**
 * 标准化登录响应数据
 * @param {Object} response - 后端原始响应
 * @returns {Object} 标准化后的数据
 */
function adaptLoginResponse(response) {
  if (!response || !response.data) {
    return response
  }

  const data = response.data

  // 家长端返回数据
  if (data.parentId) {
    return {
      code: response.code,
      message: response.message,
      data: {
        authToken: data.Authorization,
        userId: data.parentId,
        userName: data.parentName,
        phone: data.phone,
        studentList: data.studentList,
      },
    }
  }

  // 教师端返回数据
  if (data.teacherId) {
    return {
      code: response.code,
      message: response.message,
      data: {
        authToken: data.Authorization,
        userId: data.teacherId,
        userName: data.teacherName,
        phone: data.phone,
      },
    }
  }

  return response
}

/**
 * 标准化 token 验证响应数据
 * @param {Object} response - 后端原始响应
 * @returns {Object} 标准化后的数据
 */
function adaptTokenCheckResponse(response) {
  return {
    code: response.code,
    message: response.message || '',
    data: {
      isValid: response.data === true,
    },
  }
}

/**
 * 用户登录
 * @param {Object} data - 登录数据
 * @param {string} data.phone - 手机号
 * @param {string} data.password - 密码
 * @param {number} data.type - 用户类型 (2=家长, 3=教师)
 * @returns {Promise} 返回登录结果
 */
export const login = async (data) => {
  const response = await request({
    url: '/api/front/user/login',
    method: 'POST',
    params: {
      phone: data.phone,
      password: data.password,
      type: data.type,
    },
  })

  return adaptLoginResponse(response)
}

/**
 * 验证 token 是否过期
 * @param {string} token - 要验证的 token
 * @returns {Promise} 返回验证结果
 */
export const checkToken = async (token) => {
  const response = await request({
    url: '/api/front/user/checkToken',
    method: 'POST',
    params: {
      token: token,
    },
  })

  return adaptTokenCheckResponse(response)
}

/**
 * 退出登录
 * @returns {Promise} 返回退出登录结果
 */
export const logOut = () => {
  return request({
    url: '/api/front/user/logOut',
    method: 'POST',
  })
}
