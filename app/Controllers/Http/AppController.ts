import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AppController {
  public ping(ctx: HttpContextContract) {
    return ctx.response.json({ pong: `${new Date().getTime()}` })
  }
}
