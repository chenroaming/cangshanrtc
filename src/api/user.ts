import Util from '../utils/util'

let service = Util.axios

/**
 * [用户登入接口]
 * @param {string} username [用户名]
 * @param {string} password [密码]
 * @param {string} code     [验证码]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function login (username, password, code,loginType) {
  const params = {
    username,
    password,
    code,
    loginType
  }
  return service({
    url: '/main/login.jhtml',
    method: 'post',
    params
  })
}
/**
 * [用户登入接口]
 * @param {string} roleType [角色类型]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function optionRole (roleType) {
  const params = {
    roleType
  }
  return service({
    url: '/main/optionRole.jhtml',
    method: 'post',
    params
  })
}



export function faceResult (base64) {
  const data = {
    base64
  }
  return service({
    url: '/main/faceResult.jhtml',
    method: 'post',
    data
  })
}

/**
 * [用户手机登入接口]
 * @param {string} idCard   [身份证号码]
 * @param {string} password [密码]
 * @param {string} code     [验证码]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function phoneLogin (idCard, password, code,loginType) {
  const data = {
    idCard,
    password,
    code,
    loginType
  }
  return service({
    url: '/main/phoneLogin.jhtml',
    method: 'post',
    data
  })
}

/**
 * [用户登出接口]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function logout () {
  return service({
    url: '/main/loginOut.jhtml',
    method: 'get'
  })
}

/**
 * [获取短信验证码接口]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getCode (phone) {
  const params = {
    phone
  }
  return service({
    url: '/main/phoneCode.jhtml',
    method: 'get',
    params
  })
}

/**
 * [获取用户信息接口]
 */
export function getUserInfo () {
  return service({
    url: '/main/getUserInfo.jhtml',
    method: 'get'
  })
}

/**
 * [获取用户信息接口]
 */
export function userDetail (adminId) {
  const params = {
    adminId
  }

  return service({
    url: 'online/userDetail.jhtml',
    method: 'get',
    params
  })
}
