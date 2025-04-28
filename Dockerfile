# Imagen oficial de Node.js
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia los package.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia todo el proyecto
COPY . .

# Compila el proyecto (NestJS usa TypeScript)
RUN npm run build

# Expone el puerto de la app (NestJS por defecto 3000)
EXPOSE 3000

# Comando para ejecutar la app
CMD ["npm", "run", "start:prod"]
