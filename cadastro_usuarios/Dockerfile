FROM node:18

WORKDIR /cadastro_usuarios

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8082

CMD ["node", "usuarios-service.js"]
