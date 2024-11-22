FROM node:22.9.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:dev"]
