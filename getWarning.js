import requestPromiseAny from 'request-promise-any'
export default async function (cityNumber,key) {
    let bodyReturn

    let headers = {
        'User-Agent': 'Apipost client Runtime/+https://www.apipost.cn/'
    };

    let options = {
        url: `https://devapi.qweather.com/v7/warning/now?location=${cityNumber}&key=${key}`,
        headers: headers,
        gzip: true
    };

    async function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            bodyReturn=body
        }
        else {
            return error
        }
    }
    await requestPromiseAny(options,callback)
    return bodyReturn
}