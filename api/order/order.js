import request from '@/utils/request'

export function orders(options) {
    return request({
        url: '/v1/web/orders',
        method: 'get',
        data: options,
        Headers: {
            isToken: true,
        }
    })
}

export function updateOrderStatus(id, data) {
    return request({
        url: '/v1/web/orders/' + id + '/status',
        method: 'put',
        data: data,
        Headers: {
            isToken: true,
        }
    })
}