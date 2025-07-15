# Étape 1 : build de l'app Vue
FROM node:20.19.3-alpine3.22 AS build
WORKDIR /app

RUN apk update && apk upgrade --available && rm -rf /var/cache/apk/*

COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm install
RUN npm run build

# Étape 2 : servir avec nginx (version à jour, propre)
FROM nginx:1.26-alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80