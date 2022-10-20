# FROM nikolaik/python-nodejs:python3.10-nodejs16-alpine
FROM node:16.18-buster-slim
COPY . /usr/local/bananaztech
WORKDIR /usr/local/bananaztech
RUN npm i
CMD ["npm", "run", "start"]