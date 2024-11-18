FROM node:18

WORKDIR /cadastro_postos

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["node", "postos-service.js"]
