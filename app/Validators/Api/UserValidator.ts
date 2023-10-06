import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'

class CommonRules {
  public static commonSchema() {
    return {
      email: schema.string([rules.email()]),
      password: schema.string(),
    }
  }

  public static schemaLogin() {
    return {
      ...this.commonSchema(),
    }
  }

  public static schemaUpdate(id) {
    return {
      ...this.commonSchema(),
      first_name: schema.string.optional(),
      mobile_number: schema.string.optional(),

      organization: schema.object.optional().anyMembers(),
      meta: schema.object.optional().anyMembers(),
      settings: schema.object.optional().anyMembers(),
      is_root: schema.boolean.optional(),
      last_name: schema.string.optional(),
    }
  }

  public static commonMessages() {
    return {}
  }

  public static messagesStore() {
    return {
      ...this.commonMessages(),
    }
  }

  public static messagesUpdate() {
    return {
      ...this.commonMessages(),
    }
  }
}

class Login {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ...CommonRules.schemaLogin(),
  })

  public reporter = validator.reporters.api

  public messages = CommonRules.messagesStore()
}

class Update {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.id,
  })

  public schema = schema.create({
    ...CommonRules.schemaUpdate(this.refs.id),
  })

  public reporter = validator.reporters.api

  public messages = CommonRules.messagesUpdate()
}

export default { CommonRules, Login, Update }
