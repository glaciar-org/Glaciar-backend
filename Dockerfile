# FROM node:alpine
FROM node:10-alpine

# Software base for alpine
RUN apk --no-cache add curl  && \
    apk add vim


# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .


EXPOSE 5000
CMD [ "npm", "start" ]
