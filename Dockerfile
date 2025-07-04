FROM node:20

WORKDIR /build

COPY ["package.json", "./"]

# RUN yarn install && mv node_modules ../
RUN yarn install 

COPY . .

EXPOSE 6996

RUN yarn add nodemon

CMD yarn start
