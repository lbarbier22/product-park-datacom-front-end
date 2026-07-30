FROM node:20-alpine AS build-stage

WORKDIR /app

# Copie des fichiers de configuration des dépendances
COPY package*.json ./

# Installation propre des dépendances
RUN npm ci

# Copie du code source complet
COPY . .

# Build du projet pour la production (génère le dossier /dist)
RUN npm run build

FROM nginx:stable-alpine AS production-stage

# Configuration Nginx personnalisée (gestion du routing SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des assets compilés depuis l'étape de build
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose le port 80
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]