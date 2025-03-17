FROM node:18.20.7 AS build

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

FROM nginxinc/nginx-unprivileged

COPY --from=build /app/dist /usr/share/nginx/html

