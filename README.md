# proplet

REST API for tenant data: conditions, locations and files.
Stack: Node, Hono, SQLite, Zod.
The Node server uses `node:sqlite` with a SQLite file. The Cloudflare Worker uses D1.

## Setup

1. Run `mise install`. It installs Node 26 and pnpm 12 from `mise.toml`.
2. Run `pnpm install`.
3. Run `pnpm migrate`.
4. Run `pnpm dev`.

Node runs the TypeScript files directly. There is no build step.

## Scripts

| Script         | Function                                                 |
| -------------- | -------------------------------------------------------- |
| `pnpm dev`     | Starts the server, restarts on change                    |
| `pnpm start`   | Starts the server                                        |
| `pnpm migrate` | Creates `proplet.sqlite` from `migrations/0001_init.sql` |
| `pnpm test`    | Runs `src/**/*.spec.ts` with coverage                    |
| `pnpm format`  | Runs oxfmt                                               |
| `pnpm lint`    | Runs oxlint with the tsrs type check                     |

`pnpm migrate` applies only the first migration to a new file. Apply later migrations with `sqlite3 proplet.sqlite < migrations/<file>`.

## Database

`src/infrastructure/db.ts` has the interface `Db`. There are two drivers:

| Driver                  | Used by               | Database                            |
| ----------------------- | --------------------- | ----------------------------------- |
| `nodeDb` in `nodeDb.ts` | Node server and tests | SQLite file at `DATABASE_PATH`      |
| `d1Db` in `db.ts`       | Cloudflare Worker     | D1 binding `DB` in `wrangler.jsonc` |

`src/node-handler.ts` passes `nodeDb` to the app. In the Worker, `src/main.ts` uses `d1Db` with the `DB` binding.
`nodeDb` is in its own file because the Worker cannot load `node:sqlite`. Queries get the driver from `currentDb()`.
Write SQLite SQL with `?` parameters. Use `batch` for statements that must be in one transaction, because D1 has no interactive transactions.

To use D1:

1. Run `pnpm dlx wrangler d1 create proplet`.
2. Set `database_id` in `wrangler.jsonc`.
3. Run `pnpm dlx wrangler d1 migrations apply proplet --remote`.
4. Run `pnpm dlx wrangler deploy`.

## Environment

`src/infrastructure/env.ts` validates these variables at startup. The server stops if a value is invalid.

| Variable            | Default            | Function                           |
| ------------------- | ------------------ | ---------------------------------- |
| `DATABASE_PATH`     | `./proplet.sqlite` | SQLite file of the Node server     |
| `PORT`              | `3000`             | Port of the Node server            |
| `STORAGE_TYPE`      | `disk`             | `disk` or `s3`                     |
| `STORAGE_BASE_PATH` | `./uploads`        | Directory for `disk` storage       |
| `S3_BUCKET`         | none               | Bucket. Mandatory for `s3` storage |
| `AWS_REGION`        | `us-east-1`        | Region for `s3` storage            |

For `s3` storage, the AWS SDK reads the credentials from its default chain. Use an IAM role in production.

To add a variable, add it to the schema in `env.ts` and read it from `env`.

## API

| Route              | Function                        |
| ------------------ | ------------------------------- |
| `GET /conditions`  | Gets the conditions of a tenant |
| `POST /conditions` | Replaces all conditions (JSON)  |
| `GET /locations`   | Gets the locations of a tenant  |
| `POST /locations`  | Replaces all locations (JSON)   |

The tenant ID is a constant in `src/main.ts`. There is no authentication.

### Files

The files API is in `src/rest-api/files`. It is not connected to the server. To connect it, add this to `src/main.ts`:

```ts
import filesApi from "#rest-api/files/index";

app.route("/files", filesApi);
```

| Route                         | Function                                               |
| ----------------------------- | ------------------------------------------------------ |
| `GET /files`                  | Lists files. Parameters: `search`, `limit`, `offset`   |
| `POST /files`                 | Uploads the `file` field of a multipart form           |
| `GET /files/:fileId`          | Gets the content. `?download=true` sends an attachment |
| `GET /files/:fileId/metadata` | Gets the database record                               |
| `DELETE /files/:fileId`       | Deletes the content and the database record            |

The database keeps the file record. The storage keeps the content at `<tenantId>/<fileId>/<fileName>`.

## Structure

| Directory            | Content                           |
| -------------------- | --------------------------------- |
| `src/rest-api`       | Hono routes                       |
| `src/application`    | Queries and commands              |
| `src/infrastructure` | Database, environment and storage |
| `migrations`         | SQL migrations                    |

Import from `src` with the `#` prefix, for example `#infrastructure/env`.

## CodeQL

`.github/workflows/codeql.yml` scans `src` on each push and pull request to `main`, and one time each week.
The configuration is in `.github/codeql/codeql-config.yml`.
`.github/codeql/queries/no-console.ql` is a custom query that finds `console` calls.
