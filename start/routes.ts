/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

const API_PREFIX = '/api/'

import Route from '@ioc:Adonis/Core/Route'

Route.get('/ping', 'AppController.ping')
Route.get('/healthcheck', 'AppController.ping')
Route.get('/health-check', 'AppController.ping')

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.post('login', 'Api/UsersController.login').prefix(API_PREFIX)

Route.group(() => {
  //Manage Tokens
  Route.resource('tokens', 'Api/TokensController').apiOnly()

  //User Related Routes
  Route.group(() => {
    Route.get('me', 'Api/UsersController.show')
    Route.put('/', 'Api/UsersController.update')
    Route.post('logout', 'Api/UsersController.logout')
  }).prefix('users/')

  //Sample Route
  Route.resource('samples', 'Api/SamplesController').apiOnly()
})
  .prefix(API_PREFIX)
  .middleware(['auth:api'])
// .middleware('auth:pat') for Personal Access Token

Route.group(() => {
  Route.post('/webhooks/app', 'Webhooks/WebhooksController.app').middleware([
    'allowed:3.111.249.224',
  ])
}).prefix(API_PREFIX)
