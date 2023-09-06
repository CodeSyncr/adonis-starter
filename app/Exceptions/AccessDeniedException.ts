import { Exception } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new AccessDeniedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class AccessDeniedException extends Exception {
  public body = {
    status: 403,
    message: this.message,
    errors: [{ rule: 'E_ACCESS_DENIED', message: this.message }],
  }

  public static create(message = "You don't have access to the resource") {
    return new AccessDeniedException(message, 403, 'E_ACCESS_DENIED')
  }
}
