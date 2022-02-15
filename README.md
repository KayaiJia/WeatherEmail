# Weather Email
Weather Email可以在指定的时间点发送包含指定城市的天气邮件，也可以在不同时间段检测制定城市的天气预警并发送邮件。

- [Weather Email](#weather-email)
  - [Background](#background)
  - [Install](#install)
  - [Usage](#usage)
  - [Related Efforts](#related-efforts)
  - [Maintainers](#maintainers)
  - [License](#license)


## Background
大家心里都有在意的人，有一种在意的方式就是每天赶在出门前通知ta今天的天气，为出行做好准备。

这个程序本来是用来每天给女朋友发天气邮件的，女朋友觉得挺棒的，现在改了一下拿出来开源，主要还是面向情侣的（因为模板是按照情侣模板做的），当然大家可以自行更改.ejs文件来创造自己的html模板。

## Install
这个程序依赖于node和npm，安装好node和npm后在package.json所在文件夹执行一下命令即可安装依赖包：
```
$ npm install
```

## Usage
启动前请先编辑userData.json文件，文件说明如下:

| startDay   | 和你对象开始谈恋爱的日子，用于计算在一起的时间                                                              |
|:----------:|:-------------------------------------------------------------------------------------|
| cityNumber | 城市代码，具体请看 https://github.com/qwd/LocationList.git                                    |
| key        | 所用天气API的key，申请方法请看 https://dev.qweather.com/docs/resource/get-key/                   |
| type       | 获取天气生活指数的类别，可指定多个值，用逗号隔开。具体请看 https://dev.qweather.com/docs/resource/indices-info/   |
| title      | 邮件标题                                                                                 |
| service    | 邮件服务商，具体列表 https://nodemailer.com/smtp/well-known/                                   |
| sender     | 发送邮件的账号                                                                              |
| password   | 发送邮件账号的密码                                                                            |
| recipient  | 收件人                                                                                  |
| iconPath   | 天气图标的路径，建议放在执行本程序机器的内网上，图片下载地址：https://github.com/qwd/Icons/tree/v1.1.0 下载后需转换为png格式 |
| hour       | 发送邮件时间 小时                                                                            |
| min        | 发送邮件时间 分钟                                                                            |
| interval   | 检查天气预警的间隔 分钟                                                                         |


本程序采用的是module模式，需要输入对应参数，以forever为例：
```
$ forever -c "node --experimental-modules" -l run.log  start main.js
```

不推荐使用普通node执行，因为本程序常驻后台，可能因为各种奇怪的原因被关闭
```
$ node --experimental-modules main.js
```

## Related Efforts
* [NodeMail](https://github.com/Vincedream/NodeMail) - 也是使用node定时发送邮件

## Maintainers
[@TOKISAKIKRM](https://github.com/TOKISAKIKRM)

## License
Copyright 2022 Kayai Jia

Licensed under the [MIT License](https://github.com/TOKISAKIKRM/WeatherEmail/blob/main/LICENSE).
