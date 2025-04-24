# Usa la imagen oficial de Node.js
FROM node:18

# Instala el cliente de PostgreSQL para que pg_isready esté disponible
RUN apt-get update && apt-get install -y postgresql-client

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instala dependencias
RUN npm install

# Copia todo el código al contenedor
COPY . .

# Compila TypeScript
RUN npm run build

# Copia y da permisos al entrypoint
RUN chmod +x /app/entrypoint.sh

# Ejecuta las migraciones y levanta la app
ENTRYPOINT ["/app/entrypoint.sh"]

# Expone el puerto que usará la app
EXPOSE 3000
