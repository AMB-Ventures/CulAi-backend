FROM node:20

WORKDIR /build

COPY ["package.json","yarn.lock", "./"]

# RUN yarn install && mv node_modules ../
RUN yarn install --production

COPY . .

EXPOSE 6996

# RUN yarn add nodemon

CMD yarn start
