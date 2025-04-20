import upload from '@/utils/upload'

export function uploadFile(filePath, formData) {
    return upload({
        url: '/v1/file/upload',
        method: 'post',
        filePath: filePath,
        name: 'file',
        formData: formData,
        Headers: {
            'Content-Type': 'multipart/form-data',
            isToken: true,
        }
    })
}