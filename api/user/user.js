import request from '@/utils/request'

export function getUser(id) {
    return request({
        url: '/v1/users/'+id,
        method: 'get',
        Headers: {
            isToken: true,
        }
    })
}