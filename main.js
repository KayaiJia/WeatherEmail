import getWarning from "./getWarning.js";
import getIndexForLife from './getIndexForLife.js'
import getWeather from './getWeather.js'
import nodemailer from 'nodemailer'
import getUserData from "./getUserData.js";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import schedule from 'node-schedule'

let userData = {"startDay":undefined,"cityNumber":undefined,"key":undefined,"type":undefined,"title":undefined,"service":undefined,"sender":undefined,"password":undefined,"recipient":undefined,"hour":undefined,"min":undefined,"iconPath":undefined,"interval":undefined}
const __dirname = path.resolve()
let isReset = false
//初始化userData
Object.assign(userData,JSON.parse(await getUserData()))
for (let i in userData){
    if (userData[i] === undefined){
        console.log('缺少配置项，请检查userData文件是否正常')
        process.exit(1)
    }
}

//发送每日邮件主函数
async function forWeather() {
    //检查配置项
    Object.assign(userData,JSON.parse(await getUserData()))
    for (let i in userData){
        if (userData[i] === undefined){
            console.log('缺少配置项，请检查userData文件是否正常')
            return
        }
    }

    let htmlData = {}
    let today = new Date()
    let initDay = new Date(`${userData.startDay}`)
    htmlData.lastDay = Math.floor((today - initDay) / 1000 / 60 / 60 / 24)
    let weatherData = JSON.parse(await getWeather(`${userData.cityNumber}`, `${userData.key}`))
    let indexForLife = JSON.parse(await getIndexForLife(`${userData.cityNumber}`,`${userData.key}`,`${userData.type}`))

    htmlData.weatherTip = indexForLife.daily
    htmlData.daysData = weatherData.daily
    htmlData.iconPath = userData.iconPath


    let html = getTemplate(htmlData, "weather")
    console.log('定时邮件',html)
    sendEmail(html)
}

//检测警报主函数
async function forWarning(){
    let htmlData={
        warning: [{
            text:'无灾害',
            title:'无灾害'
        }]
    }
    Object.assign(userData,JSON.parse(await getUserData()))
    for (let i in userData){
        if (userData[i] === undefined){
            console.log('缺少配置项，请检查userData文件是否正常')
            return
        }
    }

    let warningData = JSON.parse(await getWarning(`${userData.cityNumber}`,`${userData.key}`))
    for (let i=0;i<warningData.warning.length;i++){
        htmlData.warning[i].text = warningData.warning[i].text
        htmlData.warning[i].title = warningData.warning[i].title
    }
    if (htmlData.warning[0].title !== '无灾害'){
        let html = getTemplate(htmlData, "warning")
        console.log('预警',html)
        sendEmail(html,'气象预警')
    }
}

//获取邮件模板
function getTemplate(htmlData, name) {
    const template = ejs.compile(
        fs.readFileSync(path.resolve(__dirname, `${name}.ejs`), "utf8")
    );
    return template(htmlData);
}

//发送邮件
function sendEmail(html,title='') {
    if (title === ''){
        title = `${userData.title}`
    }

    let transporter = nodemailer.createTransport({
        service:  `${userData.service}`,
        secure: true,
        auth: {
            user: `${userData.sender}`,
            pass: `${userData.password}`
        }
    })

    let mailOptions = {
        from: `${userData.sender}`,
        to:`${userData.recipient}`,
        subject: `${userData.title}`,
        html: html,
    }

    transporter.sendMail(mailOptions,(err,data) => {
        if(err){
            console.log(err);
            err.json({status:400,msg:"send fail....."})
        }else{
            console.log(data);
            data.json({status:200,msg:"邮件发送成功....."})
        }
    })
    userData = {"startDay":undefined,"cityNumber":undefined,"key":undefined,"type":undefined,"title":undefined,"service":undefined,"sender":undefined,"password":undefined,"recipient":undefined,"hour":undefined,"min":undefined,"iconPath":undefined,"interval":undefined}
}

//固定时间段检查自然灾害
const warning = new schedule.scheduleJob(`*/${userData.interval} * * * *`,async ()=>{
    if (isReset) {
        isReset = false
        await forWarning()
    }
})

//固定时间点查询天气发送邮件
let weatherRule = new schedule.RecurrenceRule()
weatherRule.hour= `${userData.hour}`
weatherRule.minute= `${userData.min}`
const weather = schedule.scheduleJob(weatherRule,async ()=>{
    isReset = true
    await forWeather()
})

console.log('程序启动')