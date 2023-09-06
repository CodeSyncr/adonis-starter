const util = require('util')

export default class Transform {
  public toJson() {
    return JSON.stringify(this)
  }

  public toPrettyJson() {
    return JSON.stringify(this, null, 2)
  }

  public toObject() {
    return JSON.parse(this.toJson())
  }

  public print(logger = console.log) {
    logger(util.inspect(this, false))
  }
}
