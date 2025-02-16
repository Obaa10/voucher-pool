FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install --production --legacy-peer-deps

COPY . .

RUN npm run build && ls -al /usr/src/app/

EXPOSE 3000

CMD ["npm", "run", "start:prod"]