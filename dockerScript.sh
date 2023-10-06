#!/bin/sh
echo "APP_TYPE Defined:" $APP_TYPE
if [[ "${APP_TYPE}" == "worker" ]] ;then
  echo "Running worker"
  dumb-init node ace bull:listen
else
  echo "Running server"
  node ace migration:run --force
  dumb-init node server.js
fi