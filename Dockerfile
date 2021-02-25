FROM node:13.7.0-alpine

# GIT SHA is passed as ARG and then copied into ENV VAR (Args are not perssted beyond build)
ARG GIT_SHA 
ENV GIT_SHA_ENV=$GIT_SHA

COPY package.json package.json
RUN yarn install

COPY dist dist

RUN mkdir locales

RUN echo "git sha $GIT_SHA_ENV"

# run with arg to be able to display the SHA in the app
CMD yarn start $GIT_SHA_ENV
