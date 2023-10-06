import { column } from '@ioc:Adonis/Lucid/Orm'
import Base from 'App/Models/Base'

export default class Sample extends Base {
  @column()
  public name: string
}
