FROM node:18

WORKDIR /controle_estacoes

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8084

CMD ["node", "estacoes-service.js"]
