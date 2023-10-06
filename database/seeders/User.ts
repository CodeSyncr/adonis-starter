import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await new User()
      .fill({
        email: 'default@example.com',
        password: 'qwerty',
        firstName: 'Kumar',
        lastName: 'Yash',
        mobileNumber: '700449XXXXX',
        isRoot: true,
        organization: {},
        setting: {},
      })
      .save()
  }
}
