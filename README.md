# CampingManager

Soluzione composta da:

- `CampingManager`: API ASP.NET Core 8 con EF Core e SQLite.
- `CampingManager.Admin`: frontend Angular per area amministrativa.
- `CampingManager.Web`: frontend Angular pubblico del sito.
- `CampingManager.Tests`: test xUnit sui servizi applicativi critici.

## Prerequisiti

- .NET SDK 8.
- Node.js e npm compatibili con Angular 22.
- EF Core CLI, se devi applicare migration:

```bash
dotnet tool install --global dotnet-ef
```

## Avvio sviluppo completo

Aprire tre terminali separati: uno per il backend, uno per la dashboard admin e uno per il sito pubblico.

### Backend API

Avvio:

```bash
dotnet run --project CampingManager/CampingManager.csproj
```

URL principali:

- API: `http://localhost:5117/api`
- Swagger: `http://localhost:5117/swagger`

Il profilo `http` usa `http://localhost:5117`.
Il profilo `https` espone anche `https://localhost:7125`.

### Frontend admin

Installazione dipendenze:

```bash
cd CampingManager.Admin
npm install
```

Avvio:

```bash
npm start
```

URL:

- Admin: `http://localhost:4200`

In sviluppo la dashboard admin usa `http://localhost:5117/api`, configurato in:

```text
CampingManager.Admin/src/environments/environment.development.ts
```

### Frontend pubblico

Installazione dipendenze:

```bash
cd CampingManager.Web
npm install
```

Avvio consigliato:

```bash
npm start -- --port 4300
```

URL:

- Sito pubblico: `http://localhost:4300`

Nota: Angular usa `4200` come porta predefinita. Se admin e web sono avviati insieme, lascia `4200` all'admin e usa `4300` per il sito pubblico.

## Database

Applicare le migration:

```bash
dotnet ef database update --project CampingManager/CampingManager.csproj
```

I file SQLite locali (`*.db`, `*.db-shm`, `*.db-wal`) sono ignorati da git.

## Bootstrap admin

In sviluppo il bootstrap e' abilitato da `appsettings.Development.json`.
La richiesta deve includere l'header:

```text
X-Setup-Token: dev-only-bootstrap-token-12345
```

Endpoint:

```http
POST /api/Auth/bootstrap-admin
```

In produzione configurare un setup token forte tramite configurazione sicura e abilitare il bootstrap solo per il tempo necessario alla prima creazione admin.

## Produzione

Configurare almeno:

- `Jwt:SecretKey` con un valore non committato e lungo almeno 32 caratteri.
- `Cors:AllowedOrigins` con gli origin reali del frontend.
- `AdminBootstrap:Enabled=false` dopo il setup iniziale.

Il frontend production usa `apiBaseUrl: "/api"` e quindi si aspetta API e SPA dietro lo stesso host o reverse proxy.

## Verifiche

Backend:

```bash
dotnet test CampingManager.sln
```

Admin:

```bash
cd CampingManager.Admin
npm test -- --watch=false
npm run build
```

Web:

```bash
cd CampingManager.Web
npm test -- --watch=false
npm run build
```
