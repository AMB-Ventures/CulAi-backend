FROM node:12

WORKDIR /order-engine

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --production --silent && mv node_modules ../

COPY . .

EXPOSE 3010

RUN npm install -g nodemon

CMD npm start