import upload from '@/utils/upload'
import request from '@/utils/request'

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/v1/system/user/profile/updatePwd',
    method: 'put',
    data: data,
    Headers: {
      isToken: true,
    }
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/v1/system/user/profile',
    method: 'get',
    Headers: {
      isToken: true,
    }
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/v1/system/user/profile',
    method: 'put',
    data: data,
    Headers: {
      isToken: true,
    }
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return upload({
    url: '/v1/system/user/profile/avatar',
    name: data.name,
    filePath: data.filePath,
    Headers: {
      isToken: true,
    }
  })
}
