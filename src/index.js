/* global __non_webpack_require__:false */
/* eslint-disable no-console */
require('dotenv/config')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-body')
const koaHelmet = require('koa-helmet')

const {
  PORT: port,
  HOST: host,
  APP_BASE: appBase,
  PUBLIC_DIR: publicDir,
} = process.env

const app = new Koa()
  .use(koaHelmet())
  .use(bodyParser({
    jsonLimit: '4mb',
  }))

  .use(async function errorHandler(ctx, next) {
    try {
      await next()
    } catch (e) {
      console.error(e)
      ctx.status = 500
      ctx.body = 'Internal Server Error'
    }
  })

  .use(async function timer(ctx, next) {
    await next()
    const rt = ctx.response.get('X-Response-Time')
    console.log(`${ctx.method} ${ctx.url} ${ctx.status} - ${rt}`)
  })

  .use(async function logger(ctx, next) {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
  })

  const router = new Router()
    .all(['/:service/:entry', '/:service'], async function webhookHandler(ctx) {
      console.log(ctx.params, ctx.request.body)
      ctx.body = 'OK'
    })

  app
    .use(router.allowedMethods())
    .use(router.routes())
    .listen(port, host, () => console.info(`server now running on http://${host}:${port}`))

function die(e) {
  console.error(e)
  process.exit(1)
}

process.on('exit', () => die('exiting!'))
process.on('SIGINT', () => die('interrupted!'))
process.on('uncaughtException', die)
