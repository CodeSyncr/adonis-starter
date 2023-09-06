import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ServerResponse, IncomingMessage } from 'http'
import { LoggerContract } from '@ioc:Adonis/Core/Logger'

export default class HttpReqResLogger {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      await next()
    } finally {
      HTTPReqResTrace.log(ctx)
    }
  }
}

const prettyMs = require('pretty-ms')
const onFinished = require('on-finished')

class HTTPReqResTrace {
  private request: RequestContract
  private res: ServerResponse<IncomingMessage>
  private Logger: LoggerContract

  constructor(private ctx: HttpContextContract) {
    this.request = ctx.request
    this.res = ctx.request.response
    this.Logger = ctx.logger
  }

  /**
   * Whether config is set to use JSON
   *
   * @method isJson
   *
   * @return {Boolean}
   */
  public get isJson() {
    return false
  }

  /**
   * Returns the diff in milliseconds using process.hrtime. Started
   * at time is required
   *
   * @method _diffHrTime
   *
   * @param  {Array}    startedAt
   *
   * @return {Number}
   *
   * @private
   */
  public _diffHrTime(startedAt: [number, number] | undefined) {
    const diff = process.hrtime(startedAt)
    return (diff[0] * 1e9 + diff[1]) / 1e6
  }

  /**
   * Returns the log level based on the status code
   *
   * @method _getLogLevel
   *
   * @param  {Number}     statusCode
   *
   * @return {String}
   *
   * @private
   */
  public _getLogLevel(statusCode: number) {
    if (statusCode >= 400 && statusCode < 500) {
      return 'error'
    }

    return 'debug'
  }

  /**
   * Logs http request using the Adonis inbuilt logger
   *
   * @method log
   *
   * @param  {String} url
   * @param  {String} method
   * @param  {Number} statusCode
   * @param  {Array} startedAt
   * @param  {String} code
   *
   * @return {void}
   */
  public log(url: any, method: any, statusCode: any, startedAt: [number, number], code: any) {
    const ms = prettyMs(this._diffHrTime(startedAt))
    const logLevel = this._getLogLevel(statusCode)

    /**
     * Log normally when json is not set to true
     */

    if (!this.isJson) {
      console.log(this.ctx.request.all())
      this.Logger[logLevel]('%s %s %s %s', method, statusCode, url, ms)
      console.log(method, statusCode, url, ms)
      return
    }

    const payload: any = { method, statusCode, url, ms }
    if (code) {
      payload.code = code
    }
    this.Logger[logLevel]('http request', payload)
  }

  /**
   * Binds the hook to listen for finish event
   *
   * @method hook
   *
   * @return {void}
   */
  public hook() {
    const start = process.hrtime()
    const url = this.request.url()
    const method = this.request.method()

    onFinished(this.res, (error: { code: any }, res: { statusCode: any }) => {
      this.log(url, method, res.statusCode, start, error ? error.code : null)
    })
  }

  public static log(ctx: HttpContextContract) {
    const l = new HTTPReqResTrace(ctx)
    l.hook()
  }
}
