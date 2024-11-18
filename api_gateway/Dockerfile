FROM node:18

WORKDIR /api-gateway

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "api-gateway.js"]
