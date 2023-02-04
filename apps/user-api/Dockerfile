FROM node:16-alpine AS development
MAINTAINER mrbontor@gmail.com

RUN apk update; apk add tzdata

# create app directory
WORKDIR /app

COPY apps/user-api/.env ./
COPY apps/user-api/package.json apps/user-api/package-lock.json ./
# COPY package.json ./
# COPY package-lock.json ./

RUN npm install

COPY apps/user-api/ ./

# Environment
ENV NODE_ENV development

# Run the command on container startup
ENTRYPOINT ["npm", "start"]
