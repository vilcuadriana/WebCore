## Instrucțiuni de rulare – Backend WebCore

1. Instalați Node.js și PostgreSQL.

2. Creați baza de date în PostgreSQL:
```sql
CREATE DATABASE webcore_db;

3. În folderul backend, creați fișierul .env cu următorul conținut:
PORT=4000
DB_NAME=webcore_db
DB_USER=postgres
DB_PASSWORD=parola_ta_postgres
DB_HOST=localhost
JWT_SECRET=super_secret_jwt_key

4. Din folderul backend, instalați dependențele: npm install

5. Porniți serverul: npm run dev sau npm start

Serverul rulează la adresa:
http://localhost:4000