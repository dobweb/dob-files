const fs = require('fs')
const sd = require('silly-datetime')
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)
const config = require('../config/config')
const { randomOnly } = require('../utils/crytp')

exports.upload = async function(ctx) {
  if (!ctx.request.files) {
    ctx.body = {
      status: 4001
    }
  }
  // 鉴权
  let token = ctx.header.authorization  // 获取jwt
  if(!token) {
    ctx.body = {
      status: 401,
      message: '没有上传权限'
    }
    return
  }
  let payload
  token = token.split(' ')[1] // jwt 主体校验格式：Authorization: Bearer eyJhbGciOi......
  payload = await verify(token, config.sign)  // 解密payload，获取用户名和ID
  if (typeof(payload) !== 'object') {
    ctx.body = {
      status: 401,
      message: '没有上传权限'
    }
    return
  }

  // 上传业务
  const file = ctx.request.files.file || ctx.request.files.avatar

  const appPath = `/worker/`
  // 文件路径 以 年月组合 分类存储
  const date = sd.format(new Date(), 'YYMM')
  // 读取扩展名
  const exName = file.name.split('.').pop()
  // 创建可读流
  const reader = fs.createReadStream(file.path)
  const name = randomOnly(12)
  // let filePath = path.join(__dirname, '../../public/uploads/worker/') + name + '.jpg'
  const fileFiled = path.join(__dirname, '../../public/uploads/')
  const path = date + '/'
  // 检查文件夹，没有则创建
  if (!fs.existsSync(fileFiled + appPath)) {
    fs.mkdirSync(fileFiled + appPath)
  }
  if (!fs.existsSync(fileFiled + appPath + path)) {
    fs.mkdirSync(fileFiled + appPath + path)
  }
  const urlPath = `${appPath}${path}${name}.${exName}`
  let filePath = `${fileFiled}${urlPath}`

  // 创建可写流
  const upStream = fs.createWriteStream(filePath)
  // 写入文件
  reader.pipe(upStream)

  ctx.body =  await {
    status: 200,
    path: `http://localhost:3000${urlPath}`
  }
}