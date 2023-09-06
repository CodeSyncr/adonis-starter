import '@ioc:Adonis/Core/Application'

declare global {
  interface Array<T> {
    forEachPromise(callback): Promise<void>
    mapPromise(callback): Promise<Array<T>>
  }
}

Array.prototype.forEachPromise = async function (callback) {
  const that = <Array<any>>this
  for (let index = 0; index < that.length; index++) {
    await callback(that[index], index, that)
  }
}

Array.prototype.mapPromise = async function (callback): Promise<Array<any>> {
  const that = <Array<any>>this
  for (let index = 0; index < that.length; index++) {
    that[index] = await callback(that[index], index, that)
  }
  return that
}
