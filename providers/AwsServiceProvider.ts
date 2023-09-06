import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AwsServiceProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('AwsService', () => {
      const config = this.app.config.get('aws')
      const AwsService = require('App/Services/AwsService').default
      return new AwsService(config)
    })
  }
}
