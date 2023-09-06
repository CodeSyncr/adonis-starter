/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('doUpCase', (value, _, { mutate }) => {
  if (!value) return
  if (typeof value !== 'string') {
    return
  }
  mutate(value.toUpperCase())
})

validator.rule('doLowerCase', (value, _, { mutate }) => {
  if (!value) return
  if (typeof value !== 'string') {
    return
  }
  mutate(value.toLowerCase())
})

validator.rule('doNameCase', (value, _, { mutate }) => {
  if (!value) return
  if (typeof value !== 'string') {
    return
  }
  mutate(value.toNameCase())
})

validator.rule('removeInvalidNumber', (value, _, { mutate }) => {
  if (!value) return
  if (typeof value !== 'string') {
    return
  }
  const regex = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
  if (!regex.test(value)) {
    value = null
  }
  mutate(value)
})

declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    doUpCase(): Rule
    doNameCase(): Rule
    doLowerCase(): Rule
    removeInvalidNumber(): Rule
  }
}
