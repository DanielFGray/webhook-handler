/* eslint-disable no-console */
require('dotenv/config')
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-body')
const koaHelmet = require('koa-helmet')

const {
  PORT: port,
  HOST: host,
} = process.env

const app = new Koa()
  .use(koaHelmet())
  .use(bodyParser({
    jsonLimit: '4mb',
  }))

  .use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      console.error(e)
      ctx.status = 500
      ctx.body = e.message
    }
  })

  .use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
  })

const router = new Router()
  .all('/:service/:entry', async ctx => {
    const { service, entry } = ctx.params
    const { body } = ctx.request
    if (! body) {
      throw new Error('ACK')
    }
    await fs.promises.appendFile(path.join('./logs', `${service}.${entry}`), `${JSON.stringify(body)}\n`)
    ctx.body = 'OK\n'
  })
  .all('/*', async ctx => {
    ctx.body = 'ACK\n'
  })

app
  .use(router.allowedMethods())
  .use(router.routes());
(async function main() {
  try {
    await fs.promises.mkdir('./logs')
  } catch (e) { /* fallthrough */ }
  await new Promise(res => { app.listen(port, host, res) })
  console.info(`server now running on http://${host}:${port}`)
}())

function die(e) {
  console.error(e)
  process.exit(1)
}

process.on('exit', () => die('exiting!'))
process.on('SIGINT', () => die('interrupted!'))
process.on('uncaughtException', die)
