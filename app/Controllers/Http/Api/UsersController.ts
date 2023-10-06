import UserValidator from 'App/Validators/Api/UserValidator'
import BaseController from './BaseController'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { can } from 'RBAC/RolePermission'
import User from 'App/Models/User'

import { Limiter } from '@adonisjs/limiter/build/services'
import Database from '@ioc:Adonis/Lucid/Database'

export default class WalletsController extends BaseController {
  @can('users.index')
  public async index(ctx: HttpContextContract) {
    const users = await User.query()
      .select('id', 'email', 'name')
      .paginate(ctx.request.input('page', 1))
    return ctx.response.json(users.serialize())
  }

  public async login(ctx: HttpContextContract) {
    ctx.request.updateBody(await ctx.request.validate(UserValidator.Login))
    const { email, password } = ctx.request.only(['email', 'password'])
    const throttleKey = `apiLogin_${email}_${ctx.request.ip()}`

    const limiter = Limiter.use({
      requests: 5,
      duration: '15 mins',
      blockDuration: '30 mins',
    })

    if (await limiter.isBlocked(throttleKey)) {
      return ctx.response.tooManyRequests({
        message: 'Login attempts exhausted. Please try after some time',
      })
    }

    try {
      const token = await ctx.auth.use('api').attempt(email, password, { expiresIn: '2 hours' })
      if (!ctx.auth.use('api').user) {
        await limiter.increment(throttleKey)
        return ctx.response.status(400).json({ message: 'Invalid credential', token })
      }
      await limiter.delete(throttleKey)
      const user = ctx.auth.use('api').user!
      await Database.from('api_tokens')
        .delete()
        .where('user_id', user.id)
        .whereNot('type', 'pat')
        .whereNot('token', token.tokenHash)
      return ctx.response.json({
        ...user.serialize(),
        token,
      })
    } catch (e) {
      await limiter.increment(throttleKey)
      return ctx.response.status(400).json({ message: 'Something went wrong!', errors: [e] })
    }
  }

  public async show(ctx: HttpContextContract) {
    return ctx.response.json(await this._fetchUser(ctx))
  }

  public async logout(ctx: HttpContextContract) {
    await ctx.auth.use('api').logout()
    return ctx.response.json({ message: 'Successfully logged out.' })
  }

  public async findUser(ctx: HttpContextContract, email: string): Promise<User | null> {
    const user = await User.findBy('email', email)
    if (user) return user

    ctx.response.status(400).json({
      message: "user doesn't exist.",
      errors: [{ id: ctx.params.id, code: 'E_NOT_EXIST' }],
    })
    return null
  }

  public async _fetchUser(ctx) {
    const auth = ctx.request.header('authorization')
    const [type, token] = auth?.split(' ')
    const user = await User.query()
      .where('id', ctx.auth.user?.id)
      .first()
    console.log(user?.serialize())
    return {
      ...user?.serialize(),
      token: { type: type.toLowerCase(), token },
    }
  }
}
