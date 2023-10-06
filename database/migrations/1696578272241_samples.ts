import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Samples extends BaseSchema {
  protected tableName = 'samples'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 20).notNullable()

      table.integer('created_by').nullable().defaultTo(null)
      table.integer('updated_by').nullable().defaultTo(null)
      table.string('created_by_ip', 150).nullable().defaultTo(null)
      table.string('updated_by_ip', 150).nullable().defaultTo(null)
      table.boolean('is_deleted').nullable().defaultTo(false)
      table.boolean('is_published').nullable().defaultTo(true)
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
