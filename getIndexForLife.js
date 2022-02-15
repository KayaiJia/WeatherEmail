import requestPromiseAny from 'request-promise-any'
export default async function (cityNumber,key,type) {
    let bodyReturn
    let headers = {
        'User-Agent': 'Apipost client Runtime/+https://www.apipost.cn/'
    };

    let options = {
        url: `https://devapi.qweather.com/v7/indices/1d?location=${cityNumber}&key=${key}&type=${type}`,
        headers: headers,
        gzip:true
    };

    async function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            bodyReturn=body
        }
        else{
            return error
        }
    }

    await requestPromiseAny(options, callback);
    return bodyReturn

}