# Etapa 1: Construcción
FROM node:18 AS build

# Establece el directorio de trabajo en la imagen
WORKDIR /app

# Copia los archivos de configuración
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente del proyecto
COPY . .

# Construye el proyecto
RUN npm run build

# Etapa 2: Servir la aplicación
FROM nginx:alpine

# Copia los archivos generados en la etapa de construcción al contenedor de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comando por defecto para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
