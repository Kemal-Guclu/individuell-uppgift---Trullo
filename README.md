# Trullo Backend API

# Komplett Dokumentation och Teori

## Innehåll

- [Trullo Backend API](#trullo-backend-api)
- [Komplett Dokumentation och Teori](#komplett-dokumentation-och-teori)
  - [Innehåll](#innehåll)
  - [Om projektet](#om-projektet)
  - [Kom igång](#kom-igång)
  - [Miljövariabler (.env)](#miljövariabler-env)
  - [Seed-script](#seed-script)
  - [API-endpoints](#api-endpoints)
    - [Auth](#auth)
    - [Users](#users)
    - [Tasks](#tasks)
  - [Rollhantering](#rollhantering)
  - [Lösenordsåterställning](#lösenordsåterställning)
  - [Testning](#testning)
- [Teori \& Arkitektur](#teori--arkitektur)
  - [Syfte och översikt](#syfte-och-översikt)
  - [Teknisk arkitektur](#teknisk-arkitektur)
  - [Datamodellering](#datamodellering)
  - [Autentisering \& Rollhantering](#autentisering--rollhantering)
  - [Validering \& Felhantering](#validering--felhantering)
  - [Lösenordsåterställning](#lösenordsåterställning-1)
  - [Seed-script \& Testdata](#seed-script--testdata)
  - [Testning](#testning-1)
  - [Säkerhet](#säkerhet)
  - [Utvecklingsprocess](#utvecklingsprocess)
  - [Några exempel på Thunder Client requests](#några-exempel-på-thunder-client-requests)
    - [1. Skapa användare](#1-skapa-användare)
    - [2. Logga in](#2-logga-in)
    - [3. Skapa task (med JWT-token)](#3-skapa-task-med-jwt-token)
    - [4. Hämta tasks med filter](#4-hämta-tasks-med-filter)
    - [5. Markera task som klar](#5-markera-task-som-klar)
    - [6. Glömt lösenord](#6-glömt-lösenord)
    - [7. Reset lösenord](#7-reset-lösenord)

---

## Om projektet

Detta är en Node.js/Express/Mongoose-backend med TypeScript, JWT-auth, rollhantering, robust validering, lösenordsåterställning och full testtäckning.

---

## Kom igång

1. **Kloning & installation**

   ```sh
   git clone <repo-url>
   cd Trullo
   npm install
   ```

2. **Miljövariabler**
   - Skapa en `.env`-fil enligt [exemplet nedan env exempel filen i root ](#miljövariabler-env).

3. **Bygg & starta**

   ```sh
   npm run build
   npm run dev
   ```

4. **Seed-databasen**
   ```sh
   npm run build
   node dist/seed.js
   ```

---

## Miljövariabler (.env)

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ew6h9qj.mongodb.net/TrulloDB?retryWrites=true&w=majority&appName=Cluster0 || mongodb://localhost:27017/trullo
JWT_SECRET=<yourJWTsecret>
BCRYPT_COST=12
```

---

## Seed-script

- Kör `node dist/seed.js` för att skapa testanvändare och test-tasks.
- Skapar en admin (`admin@example.com` / `passw0rd!`) och en vanlig användare (`test@example.com` / `Secret123`).

---

## API-endpoints

### Auth

- `POST /login` – Logga in, få JWT-token
- `POST /forgot-password` – Begär återställning av lösenord
- `POST /reset-password` – Återställ lösenord med token

### Users

- `POST /users` – Skapa användare
- `GET /users/:id` – Hämta användare (auth krävs)
- `PATCH /users/:id/role` – Ändra roll (admin krävs)
- `DELETE /users/:id` – Ta bort användare (admin krävs)

### Tasks

- `POST /tasks` – Skapa task
- `GET /tasks/:id` – Hämta task (visar finishedBy om satt)
- `GET /tasks` – Hämta alla tasks (med filter/sortering)
- `PATCH /tasks/:id/complete` – Markera task som klar (auth krävs)
- `PATCH /tasks/:id` – Uppdatera task
- `DELETE /tasks/:id` – Ta bort task
- `GET /users/:userId/tasks` – Hämta tasks för en användare

---

## Rollhantering

- Endast admin kan ta bort användare och ändra roller.
- Roll sätts i seed-scriptet och kan ändras via endpoint.

---

## Lösenordsåterställning

- Begär återställning via `/forgot-password` (token loggas i konsolen under utveckling).
- Återställ lösenord via `/reset-password` med token och nytt lösenord.

---

## Testning

- Kör tester med:
  ```sh
  npm test
  ```
- Tester täcker modeller, controllers och integration.

---

# Teori & Arkitektur

## Syfte och översikt

Detta projekt är en backend-API-lösning för hantering av användare och tasks, byggd med Node.js, Express, TypeScript och MongoDB/Mongoose. Fokus ligger på robusthet, säkerhet, testbarhet och tydlig kodstruktur.

---

## Teknisk arkitektur

- **Node.js/Express**: Server och routing.
- **TypeScript**: Typning och robust kod.
- **Mongoose**: ODM för MongoDB, datamodellering.
- **JWT**: Autentisering och sessionshantering.
- **Bcrypt**: Hashning av lösenord.
- **Jest/Supertest**: Testning.

---

## Datamodellering

- **User**: namn, e-post (unik), lösenord (hashat), roll (user/admin), resetPasswordToken, resetPasswordExpires.
- **Task**: title, description, status (to-do, in-progress, blocked, done), assignedTo, finishedAt, finishedBy.

---

## Autentisering & Rollhantering

- JWT används för att identifiera användare.
- Middleware skyddar endpoints och kontrollerar roll (admin/user).
- Endast admin kan ta bort användare och ändra roller.

---

## Validering & Felhantering

- Validering av e-post, lösenord, och task-status både i schema och kod.
- Tydliga felmeddelanden vid felaktig input eller otillåten åtkomst.
- Unika fält och robust hantering av edge-cases.

---

## Lösenordsåterställning

- Användare kan begära återställning via e-post (token genereras och loggas under utveckling).
- Nytt lösenord kan sättas med giltig token.

---

## Seed-script & Testdata

- Seed-script skapar testanvändare (admin och user) samt tasks.
- Körs separat och rensar databasen innan ny data läggs in.

---

## Testning

- Enhetstester för modeller och controllers.
- Integrationstester för endpoints.
- Testning av både lyckade och misslyckade scenarion.

---

## Säkerhet

- Lösenord hashas alltid.
- JWT-tokens har utgångstid.
- Endast autentiserade användare får åtkomst till skyddade endpoints.
- Rollkontroll för admin-funktioner.

---

## Utvecklingsprocess

- Funktionalitet har byggts stegvis med testdriven utveckling.
- Refaktorering och kodgranskning har genomförts löpande.
- Dokumentation och .env-exempel finns för enkel onboarding.

## Några exempel på Thunder Client requests

### 1. Skapa användare

```json
POST /users
{
	"name": "Test User",
	"email": "test@example.com",
	"password": "hemligt123"
}
```

### 2. Logga in

```json
POST /login
{
	"email": "test@example.com",
	"password": "hemligt123"
}
```

### 3. Skapa task (med JWT-token)

```json
POST /tasks

Headers: { "Authorization": "Bearer <token>" }
{
	"title": "Ny uppgift",
	"description": "Beskrivning",
	"assignedTo": "<userId>"
}
```

### 4. Hämta tasks med filter

```json
GET /tasks?status=done&assignedTo=<userId>&sort=createdAt

Headers: { "Authorization": "Bearer <token>" }
```

### 5. Markera task som klar

```json
PATCH /tasks/<taskId>/complete

Headers: { "Authorization": "Bearer <token>" }
```

### 6. Glömt lösenord

```json
POST /forgot-password
{
  "email": "user@example.com"
}
```

### 7. Reset lösenord

```json
POST /reset-password
{
  "token": "reset-token-from-email",
  "password": "newStrongPassword123"
}
```
