FROM node:18.19-alpine3.19

RUN apk add --no-cache yarn python3 py3-pip make build-base git openssh

WORKDIR /app

COPY . ./
RUN npm install
RUN yarn build 

EXPOSE 3000
CMD ["yarn", "serve"]