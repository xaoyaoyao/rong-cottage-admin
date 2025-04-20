import request from '@/utils/request'
import { generateMD5 } from '@/utils/tool'

// 登录方法
export function login(username, password, code, uuid) {
  // const newPassword = generateMD5("vobase:" + password)
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    'url': '/v1/web/login',
    headers: {
      isToken: false
    },
    'method': 'post',
    'data': data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/v1/web/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    'url': '/v1/web/getUserInfo',
    'method': 'get',
    headers: {
      isToken: true,
    }
  })
}

// 退出方法
export function logout() {
  return request({
    'url': '/v1/web/logout',
    'method': 'post',
    headers: {
      isToken: true,
    }
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    'url': '/v1/web/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
