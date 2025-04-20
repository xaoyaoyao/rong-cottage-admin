import request from '@/utils/request'

export function getPet(id) {
    return request({
        url: '/v1/pets/'+id,
        method: 'get',
        Headers: {
            isToken: true,
        }
    })
}

export function getPets(options) {
    return request({
        url: '/v1/web/pets',
        method: 'get',
        data: options,
        Headers: {
            isToken: true,
        }
    })
}