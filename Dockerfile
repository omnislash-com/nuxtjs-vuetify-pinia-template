FROM node:18.16.0-alpine AS base

RUN apk update && apk upgrade
RUN apk add git

# Install pnpm
RUN npm i -g pnpm

# INSTALL DEPENDENCIES
FROM base AS dependencies
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# BUILD WEBSITE
FROM base AS build
WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

# DEPLOY
FROM base AS deploy
WORKDIR /usr/src/app


COPY --from=build /usr/src/app/.output/ /usr/src/app/.output/
COPY --from=build /usr/src/app/node_modules ./node_modules

RUN ls

EXPOSE 3000
ENTRYPOINT ["node", ".output/server/index.mjs"]