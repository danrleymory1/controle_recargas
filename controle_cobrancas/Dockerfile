FROM node:18

WORKDIR /controle_cobrancas

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8085

CMD ["node", "cobrancas-service.js"]
