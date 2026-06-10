# CampingManager

Soluzione composta da:

- `CampingManager`: API ASP.NET Core 8 con EF Core e SQLite.
- `CampingManager.Admin`: frontend Angular per area amministrativa.
- `CampingManager.Tests`: test xUnit sui servizi applicativi critici.

## Avvio sviluppo

API:

```bash
dotnet run --project CampingManager/CampingManager.csproj
```

Frontend:

```bash
cd CampingManager.Admin
npm install
npm start
```

In sviluppo il frontend usa `http://localhost:5117/api`.

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

```bash
dotnet test CampingManager.sln
cd CampingManager.Admin
npm test -- --watch=false
npm run build
```
