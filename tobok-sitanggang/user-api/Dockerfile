FROM node:16-alpine AS development
MAINTAINER mrbontor@gmail.com

RUN apk update; apk add tzdata

# create app directory
WORKDIR /app

COPY tobok-sitanggang/user-api/.env ./
COPY tobok-sitanggang/user-api/package.json tobok-sitanggang/user-api/package-lock.json ./
# COPY package.json ./
# COPY package-lock.json ./

RUN npm install

COPY tobok-sitanggang/user-api/ ./

# Environment
ENV NODE_ENV development

# Run the command on container startup
ENTRYPOINT ["npm", "start"]
