export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  ROBOT_STATS (data = {}) {
    return request({
      url: '/robot/stats',
      method: 'post',
      data
    })
  },
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  ROBOT_DETAIL (data = {}) {
    return request({
      url: '/robot/detail',
      method: 'post',
      data
    })
  },
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  ROBOT_INFO (data = {}) {
    return request({
      url: '/robot/info',
      method: 'post',
      data
    })
  }
})
