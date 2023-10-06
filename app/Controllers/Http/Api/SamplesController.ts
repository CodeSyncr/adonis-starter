import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BaseController'
import { can } from 'RBAC/RolePermission'
import SampleValidator from 'App/Validators/Api/SampleValidator'
import Sample from 'App/Models/Sample'

export default class SamplesController extends BaseController {
  @can('samples.index')
  public async index(ctx: HttpContextContract) {
    const samples = await Sample.query().paginate(ctx.request.input('page', 1))
    return ctx.response.json(samples.serialize())
  }

  @can('samples.store')
  public async store(ctx: HttpContextContract) {
    ctx.request.updateBody(await ctx.request.validate(SampleValidator.Store))
    const data = ctx.request.only(Object.keys(Sample.$keys.serializedToAttributes.all()))
    const sample = await Sample.create(data)
    return ctx.response.status(201).json(sample.serialize())
  }

  @can('samples.show')
  public async show(ctx: HttpContextContract) {
    const sample = await this.findSample(ctx)
    if (sample) return ctx.response.json(sample.serialize())
  }

  @can('samples.update')
  public async update(ctx: HttpContextContract) {
    ctx.request.updateBody(await ctx.request.validate(SampleValidator.Update))
    const data = ctx.request.only(Object.keys(Sample.$keys.serializedToAttributes.all()))
    const sample = await this.findSample(ctx)
    if (sample) {
      await sample.merge(data).save()
      return ctx.response.json(sample.serialize())
    }
  }

  @can('samples.destroy')
  public async destroy(ctx: HttpContextContract) {
    const sample = await this.findSample(ctx)
    if (sample) {
      await sample.delete()
      return ctx.response.json({ message: 'Sample deleted.' })
    }
  }

  private async findSample(ctx: HttpContextContract): Promise<Sample | null> {
    const sample = await Sample.query().where('id', ctx.params.id).first()
    if (sample) return sample

    ctx.response.status(400).json({
      message: "sample doesn't exist.",
      errors: [{ id: ctx.params.id, code: 'E_NOT_EXIST' }],
    })
    return null
  }
}
