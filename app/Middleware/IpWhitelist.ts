import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IpWhitelist {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>, allowedIps: string[]) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const clientIp = ctx.request.ip()
    if (!allowedIps.includes(clientIp)) {
      return ctx.response.status(403).json({
        error: 'Access denied',
        message: `Request from ${clientIp} is not allowed! Contact Administrator`,
      })
    }

    await next()
  }
}
