# Usa una imagen oficial de Node.js
FROM node:18

# Crea el directorio de la app dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expón el puerto 3000
EXPOSE 3000

# Inicia la app en modo desarrollo (con nodemon)
CMD ["npm", "run", "dev"]
