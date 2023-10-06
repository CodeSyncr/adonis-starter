import BaseController from './BaseController'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiToken from 'App/Models/Token'
import TokenValidator from 'App/Validators/Api/TokenValidator'
import { can } from 'RBAC/RolePermission'

export default class TokensController extends BaseController {
  @can('tokens.index')
  public async index(ctx: HttpContextContract) {
    const tokens = await ApiToken.query()
      .where('user_id', ctx.auth.user!.id)
      .andWhere('type', 'pat')
      .paginate(ctx.request.input('page', 1))
    return ctx.response.json(tokens.serialize())
  }

  @can('tokens.store')
  public async store(ctx: HttpContextContract) {
    ctx.request.updateBody(await ctx.request.validate(TokenValidator.Store))
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, expires_at } = ctx.request.only(['name', 'expires_at'])
    const user: any = ctx.auth.user!
    const option: any = {
      type: 'pat',
      name: name,
    }
    if (expires_at) {
      option.expires_at = expires_at
    }
    const token = await ctx.auth.use('pat').generate(user, option)

    return token
  }

  @can('boardTasks.show')
  public async show(ctx: HttpContextContract) {}

  @can('boardTasks.destroy')
  public async destroy(ctx: HttpContextContract) {}
}
