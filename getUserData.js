import fs from 'fs'
const fileName = './userData.json'

export default async function () {
    let jsonData={}
    try {
        jsonData = fs.readFileSync(fileName, 'utf-8');
    } catch (e) {
        console.log('缺少配置文件，请检查路径是否为文件同目录或文件名是为否userData.json')
        process.exit(1)
        return null
    }
    return jsonData
}