FROM node:alpine AS builder
RUN apk update

WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN ls
RUN turbo prune --scope=auth --docker

FROM node:alpine AS installer
RUN apk update
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
COPY turbo.json turbo.json

RUN yarn install
RUN yarn --only=prod turbo run dev --filter=auth... 

