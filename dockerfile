# https://docs.adonisjs.com/cookbooks/dockerizing-adonis
ARG NODE_IMAGE=node:16.13.1-alpine

# Base
FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

# dependencies
FROM base AS build
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN node ace build --production --ignore-ts-errors

# production
FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE $PORT
ENV APP_TYPE=$APP_TYPE
COPY --chown=node:node ./dockerScript.sh ./
RUN chmod +x dockerScript.sh
CMD ["/bin/sh","-c","./dockerScript.sh"]