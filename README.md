# proplet

REST API for tenant data: conditions, locations and files.
Stack: Hono, Drizzle ORM, PostgreSQL, Zod.

## Setup

1. Install Node 26 (see `.nvmrc`).
2. Run `npm ci`.
3. Set `DATABASE_URL`.
4. Apply `drizzle/*/migration.sql` to the database.
5. Run `npm run dev`.

## Scripts

| Script           | Function                                      |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Builds, starts the server, restarts on change |
| `npm run build`  | Writes `dist/node.js` and `dist/lambda.js`    |
| `npm test`       | Runs `src/**/*.spec.ts`                       |
| `npm run lint`   | Runs oxlint with the tsrs type check          |
| `npm run format` | Runs oxfmt                                    |

`dist/node.js` is a Node server. `dist/lambda.js` exports an AWS Lambda `handler`.

## Environment

`src/infrastructure/env.ts` validates these variables at startup. The server stops if a value is invalid.

| Variable            | Default     | Function                           |
| ------------------- | ----------- | ---------------------------------- |
| `DATABASE_URL`      | none        | PostgreSQL URL. Mandatory.         |
| `PORT`              | `3000`      | Port of the Node server            |
| `STORAGE_TYPE`      | `disk`      | `disk` or `s3`                     |
| `STORAGE_BASE_PATH` | `./uploads` | Directory for `disk` storage       |
| `S3_BUCKET`         | none        | Bucket. Mandatory for `s3` storage |
| `AWS_REGION`        | `us-east-1` | Region for `s3` storage            |

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

| Directory            | Content                                   |
| -------------------- | ----------------------------------------- |
| `src/rest-api`       | Hono routes                               |
| `src/application`    | Queries and commands                      |
| `src/infrastructure` | Database, schema, environment and storage |
| `drizzle`            | SQL migrations                            |

Import from `src` with the `#` prefix, for example `#infrastructure/env`.

## CodeQL

`.github/workflows/codeql.yml` scans `src` on each push and pull request to `main`, and one time each week.
The configuration is in `.github/codeql/codeql-config.yml`.
`.github/codeql/queries/no-console.ql` is a custom query that finds `console` calls.
