# Node 14 es estable para LoopBack 3
FROM node:14

WORKDIR /usr/src/app

# Instalar dependencias primero (cache eficiente)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps || npm install

# Copiar el resto
COPY . .

# Exponer y correr
EXPOSE 3000

# Usar exec para manejar señales correctamente
CMD ["node", "server/server.js"]
