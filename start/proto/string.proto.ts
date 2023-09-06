import '@ioc:Adonis/Core/Application'

declare global {
  interface String {
    toNameCase(): string
  }
}

String.prototype.toNameCase = function () {
  return this.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase())
}
