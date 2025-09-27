# Trullo Backend API

## Innehåll

- [Kom igång](#kom-igång)
- [API-endpoints](#api-endpoints)
- [Valideringsregler](#valideringsregler)
- [Exempel på Thunder Client requests](#exempel-på-thunder-client-requests)

---

## Kom igång

1. Klona repot och installera beroenden:
   ```bash
   git clone <repo-url>
   cd Trullo
   npm install
   ```
2. Skapa en `.env`-fil med din MongoDB-URL och JWT-secret.
3. Starta servern:
   ```bash
   npm run dev
   ```

---

## API-endpoints

### Auth

- **POST** `/api/auth/login` – Logga in och få JWT-token

### Users

- **POST** `/api/users` – Skapa användare
- **GET** `/api/users/:id` – Hämta användare

### Tasks

- **POST** `/api/tasks` – Skapa task
- **GET** `/api/tasks` – Hämta alla tasks (med filter/sortering)
- **GET** `/api/tasks/:id` – Hämta en task
- **PATCH** `/api/tasks/:id/done` – Markera task som klar
- **PUT** `/api/tasks/:id` – Uppdatera task
- **DELETE** `/api/tasks/:id` – Ta bort task
- **GET** `/api/users/:userId/tasks` – Hämta tasks för en användare

#### Exempel på query-parametrar för `/api/tasks`:

- `status=done` – Filtrera på status
- `assignedTo=<userId>` – Filtrera på tilldelad användare
- `sort=status` – Sortera på fält (t.ex. status, createdAt)

---

## Valideringsregler

- **User**: name (required), email (required, unik), password (min 8 tecken)
- **Task**: title (required), status ("to-do", "in-progress", "blocked", "done"), assignedTo (valfri, måste vara giltig user)

---

## Exempel på Thunder Client requests

### 1. Skapa användare

```json
POST /api/users
{
	"name": "Test User",
	"email": "test@example.com",
	"password": "hemligt123"
}
```

### 2. Logga in

```json
POST /api/auth/login
{
	"email": "test@example.com",
	"password": "hemligt123"
}
```

### 3. Skapa task (med JWT-token)

```json
POST /api/tasks
Headers: { "Authorization": "Bearer <token>" }
{
	"title": "Ny uppgift",
	"description": "Beskrivning",
	"assignedTo": "<userId>"
}
```

### 4. Hämta tasks med filter

```
GET /api/tasks?status=done&assignedTo=<userId>&sort=createdAt
Headers: { "Authorization": "Bearer <token>" }
```

### 5. Markera task som klar

```
PATCH /api/tasks/<taskId>/done
Headers: { "Authorization": "Bearer <token>" }
```

---

> Fler exempel, kommentarer och detaljer finns i koden.
