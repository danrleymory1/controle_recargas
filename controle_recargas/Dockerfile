FROM node:18

WORKDIR /controle_recargas

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8083

CMD ["node", "recargas-service.js"]
