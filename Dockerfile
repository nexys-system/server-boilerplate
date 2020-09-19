FROM node:13.7.0-alpine

# add git in case needed by yarn
RUN apk --no-cache add git

COPY package.json package.json
RUN yarn install

COPY tsconfig.json tsconfig.json

COPY src src
RUN mkdir locales

RUN yarn build

CMD ["yarn", "start"]

