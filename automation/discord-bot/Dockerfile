FROM node:20-alpine

# better-sqlite3はネイティブモジュールなのでビルドツールが必要
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "start"]
