FROM node:20-bookworm-slim AS build
WORKDIR /app

ENV NODE_ENV=development

# 레지스트리 연결 실패 완화: 재시도, IPv4 우선(일부 WSL/Docker 환경)
ENV npm_config_registry=https://registry.npmjs.org/
ENV npm_config_fetch_retries=15
ENV npm_config_fetch_retry_mintimeout=20000
ENV npm_config_fetch_retry_maxtimeout=120000
ENV NODE_OPTIONS=--dns-result-order=ipv4first

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ENV HTTP_PROXY=$HTTP_PROXY
ENV HTTPS_PROXY=$HTTPS_PROXY
ENV NO_PROXY=$NO_PROXY

COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund \
  && node -e "require('fs').accessSync('node_modules/vite/package.json')"

COPY . .
RUN npx vite build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
