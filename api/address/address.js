import request from '@/utils/request'

export function getAddress(options) {
    return request({
        url: '/v1/web/address',
        method: 'get',
        data: options,
        Headers: {
            isToken: true,
        }
    })
}

export function getAddressById(id) {
    return request({
        url: '/v1/address/'+id,
        method: 'get',
        Headers: {
            isToken: true,
        }
    })
}

export function getAddressByUserId(userId) {
    return request({
        url: '/v1/address?uid=' + userId,
        method: 'get',
        Headers: {
            isToken: true,
        }
    })
}