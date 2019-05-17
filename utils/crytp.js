const crypto = require('crypto')
const uuid = require('node-uuid')
const systemConfig = require('../config/config')

const chars = ['2','3','4','5','6','7','8','9',
'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
]

// HMAC SHA 模式 不可逆
const hmacSha = ( data ) => {
  const hmac = crypto.createHmac('sha256', toString(systemConfig.sign))
  hmac.update(data)
  return (hmac.digest('hex'))
}
// HMAC MD5 模式 不可逆
const hmacMd5 = ( data ) => {
  const hmac = crypto.createHmac('md5', toString(systemConfig.sign))
  hmac.update(data)
  return (hmac.digest('hex'))
}

// aes192 加密
const aesEncrypt = ( data ) => {
    const cipher = crypto.createCipher('aes192', toString(systemConfig.sign))
    let crypted = cipher.update(data, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}
// aes192 解密
const aesDecrypt = ( encrypted ) => {
    const decipher = crypto.createDecipher('aes192', toString(systemConfig.sign))
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

// 随机数生成
const random = (n) => {
  let res = ''
   for(let i = 0; i < n ; i ++) {
       let id = Math.ceil(Math.random() * 59);
       res += chars[id]
   }
    return res
}
// 生成基于时间戳的唯一随机数
const randomOnly = (n) => {
  const id = uuid.v1()
  let d = new Date().getTime();
  let num = n*1 > 4 ? (n - 4) : 0;
  let str = id.replace(/[xy]/g, function(c) {
    let r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c == 'x' ? r : (r&0x3|0x8)).toString(16)
  })
  str = random(num) + str.split('-')[0]
  return str
}

module.exports = {
  aesEncrypt,
  aesDecrypt,
  hmacSha,
  hmacMd5,
  random,
  randomOnly
}