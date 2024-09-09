FROM node:alpine

# Crea una directory per l'app
WORKDIR /app

# Copia i file dell'app
COPY . .

# Installa http-server
RUN npm install -g http-server

# Esponi la porta 8080
EXPOSE 8080

# Avvia http-server
CMD ["http-server", "-p", "8080"]
