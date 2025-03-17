FROM node:18.20.7

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

CMD ["npm", "dev"]


