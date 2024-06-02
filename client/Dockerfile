FROM node:14

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj pliki aplikacji
COPY . .

# Zainstaluj zależności
RUN npm install

# Uruchom serwer
CMD ["npm", "start"]
