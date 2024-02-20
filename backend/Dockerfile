FROM node:20
WORKDIR /usr/src/backend
COPY . .
RUN npm install -g nodemon
RUN npm install
CMD ["nodemon","server.js"]
EXPOSE 8081