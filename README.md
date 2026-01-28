# Auto Issues

> The issue tracker for your AI coding agent.

Auto Issues is a small Fastify server backed by SQLite. It stores issues in a local
database and exposes a simple JSON API that agents (or you) can call from tools like
`curl`. A companion agent skill is included under `.codex/skills/issue-tracker` to
explain the API to AI agents.

## Features

- SQLite-backed issue storage (single-file `issues.db` in the project root)
- Simple CRUD API for issues
- Lightweight dev workflow with `tsx`

## Quickstart

1) Install dependencies

```
npm install
```

2) Run in dev mode (auto-reload)

```
npm run dev
```

3) Or build and run

```
npm run build
npm start
```

The server listens on `http://127.0.0.1:3000` by default.

## Data model

Each issue has:

- `id` (number)
- `name` (string)
- `description` (string)
- `status` (string; one of `backlog`, `in_progress`, or `done`)

## API

Base URL: `http://127.0.0.1:3000`

### List all issues

```
curl "http://127.0.0.1:3000/issues"
```

### Get issue by id

```
curl "http://127.0.0.1:3000/issues/1"
```

### Create an issue

```
curl -X POST "http://127.0.0.1:3000/issues" \
  -H "Content-Type: application/json" \
  -d '{"name":"New issue","description":"Add auth","status":"backlog"}'
```

### Update issue status

```
curl -X PATCH "http://127.0.0.1:3000/issues/2?status=done"
```

### Delete an issue

```
curl -X DELETE "http://127.0.0.1:3000/issues/2"
```

For the agent-facing reference, see `.codex/skills/issue-tracker/references/api.md`.

## Credits

Inspired by [Hyaxia/local_places](https://github.com/Hyaxia/local_places/).
