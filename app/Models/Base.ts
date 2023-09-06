import { DateTime } from 'luxon'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'

export default class Base extends compose(BaseModel, Filterable) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public createdBy: string

  @column()
  public updatedBy: string

  @column()
  public createdByIp: string

  @column()
  public updatedByIp: string

  @column()
  public isDeleted: boolean

  @column()
  public isPublished: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * ORDER:
   * 1. database keys
   * 2. relationships?
   * 3. serialize method?
   * 4. hooks methods?
   * 5. scope?
   * 6. methods?
   */

  public constructorName() {
    return this.constructor.name
  }

  public static defaultMeta(obj = {}) {
    const defaultData = { total: 1, per_page: 0, current_page: 1, last_page: 1, first_page: 1 }
    return { ...defaultData, ...obj }
  }

  public static defaultPaginate(data) {
    return {
      data,
      meta: {
        per_page: data.length,
        total: data.length,
        current_page: 1,
        last_page: 1,
        first_page: 1,
      },
    }
  }

  public clone() {
    //@ts-ignore
    const obj = new this.constructor()
    obj.$attributes = this.$attributes
    obj.$extras = this.$extras
    /**
     * Relationships toObject
     */
    obj.$preloaded = Object.keys(this.$preloaded).reduce((result, key) => {
      const value = this.$preloaded[key] as Base | Base[]
      result[key] = Array.isArray(value) ? value.map((one) => one.clone()) : value.clone()
      return result
    }, {})
    return obj
  }
}
