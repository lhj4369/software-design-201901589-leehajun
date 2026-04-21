FROM node:20-slim
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install -g npm@11.6.2 && npm ci --omit=dev --no-audit --no-fund

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
