import request from '@/utils/request'

export function getComments(options) {
    return request({
        url: '/v1/web/comments',
        method: 'get',
        data: options,
        Headers: {
            isToken: true,
        }
    })
}

export function addComments(options) {
    return request({
        url: '/v1/comments',
        method: 'post',
        data: options,
        Headers: {
            isToken: true,
        }
    })
}