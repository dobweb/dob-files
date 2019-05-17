const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const auth = require('./routes/auth')
const upload = require('./routes/upload')

// error handler
onerror(app)

app.use(cors({
    origin: function (ctx) {
      return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'date', 'dobToken'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST','DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'dobToken']
}))

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFieldsSize: 10*1024*1024,
    multipart: true
  }
}))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/upload'))

// logger
app.use(async (ctx, next) => {
  console.time('start')
  await next()
  console.timeEnd('start')
})

// routes
app.use(auth.routes(), auth.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
