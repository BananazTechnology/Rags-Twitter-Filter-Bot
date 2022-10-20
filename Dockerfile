FROM node
COPY . /usr/local/bananaztech
WORKDIR /usr/local/bananaztech
RUN npm cache clean --force
RUN npm i
CMD ["npm", "run", "start"]