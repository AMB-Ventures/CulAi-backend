FROM node:14

WORKDIR /kitchin

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --production --silent && mv node_modules ../

COPY . .

EXPOSE 3332

RUN npm install -g nodemon

CMD npm start
